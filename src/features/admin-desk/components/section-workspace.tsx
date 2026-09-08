"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ContentBlockForm } from "@/features/admin-desk/components/content-block-form";
import { CapabilitySectionForm } from "@/features/admin-desk/components/capability-section-form";
import { DeskBackLink } from "@/features/admin-desk/components/desk-back-link";
import { DeskSaveBar } from "@/features/admin-desk/components/desk-save-bar";
import { EntityHydratedPanel } from "@/features/admin-desk/components/entity-hydrated-panel";
import {
  HeroSectionForm,
  heroCanPublish,
} from "@/features/admin-desk/components/hero-section-form";
import {
  ProductsSectionForm,
  UpcomingProductsSectionForm,
} from "@/features/admin-desk/components/products-section-form";
import {
  CareersTeaserSectionForm,
  CtaBannerSectionForm,
  CustomersSectionForm,
  FaqSectionForm,
  JointVenturesSectionForm,
  MissionSectionForm,
  TestimonialsSectionForm,
} from "@/features/admin-desk/components/home-block-forms";
import {
  ApiClientError,
  ensurePageBySlug,
  previewPathForTemplate,
  publishPageApi,
  updatePageApi,
} from "@/features/admin-desk/lib/api";
import { normalizeHeroBlock } from "@/features/admin-desk/lib/hero-draft";
import { isEntityHydratedBlock } from "@/features/admin-desk/lib/section-kinds";
import {
  getPageTemplate,
  syncBlocksToTemplate,
  type BlockType,
} from "@/modules/cms/browser";

/** Plain-language blurbs for editors (overrides terse template help). */
const EDITOR_BLURBS: Record<string, string> = {
  hero: "The first thing visitors see. Add slides with a photo, headline, and optional video.",
  capability: "Your company pitch and the big numbers under it.",
  products: "Section headline for the products strip. Cards come from published catalogue products.",
  "upcoming-products":
    "Section headline for upcoming lines. Cards come from catalogue products marked coming soon.",
  markets: "Industry markets grid — filled from site data automatically.",
  mission: "A strong statement over a large photo, with an optional video.",
  "cta-banner": "A simple call-to-action band mid-page.",
  testimonials: "Quotes from partners or customers.",
  customers: "Customer names or logos shown in a strip.",
  "joint-ventures": "Partnership highlights with a supporting photo.",
  "careers-teaser": "A short careers invite with photos and a button.",
  faq: "Common questions and answers visitors ask.",
};

export function SectionWorkspace({
  slug,
  sectionId,
}: {
  slug: string;
  sectionId: string;
}) {
  const template = getPageTemplate(slug);
  const sectionMeta = template?.sections.find((s) => s.id === sectionId);

  const [pageId, setPageId] = useState<string | null>(null);
  const [version, setVersion] = useState(1);
  const [status, setStatus] = useState("draft");
  const [blocks, setBlocks] = useState<
    Array<{
      id: string;
      type: string;
      order: number;
      appearance: string;
      data: unknown;
    }>
  >([]);
  const [draft, setDraft] = useState<unknown>(null);
  const [baseline, setBaseline] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await ensurePageBySlug(slug);
      const synced = syncBlocksToTemplate(slug, page.blocks);
      setPageId(page.id);
      setVersion(page.version);
      setStatus(page.status);
      setBlocks(synced);
      const block = synced.find((b) => b.id === sectionId);
      const data = block?.data ?? {};
      setDraft(data);
      setBaseline(JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [slug, sectionId]);

  useEffect(() => {
    void load();
  }, [load]);

  const blockType = (sectionMeta?.type ??
    blocks.find((b) => b.id === sectionId)?.type) as BlockType | undefined;

  const dirty = useMemo(
    () => JSON.stringify(draft) !== baseline,
    [draft, baseline],
  );

  const entityMode =
    !template ||
    template.mode === "entity" ||
    sectionId === "overview" ||
    (blockType ? isEntityHydratedBlock(blockType) : true);

  const canPublish = useMemo(() => {
    if (!blockType || entityMode) return true;
    if (blockType === "hero") {
      return heroCanPublish(normalizeHeroBlock(draft).slides);
    }
    return true;
  }, [blockType, draft, entityMode]);

  async function persist(nextDraft: unknown = draft) {
    if (!pageId || !blockType) return null;
    const nextBlocks = syncBlocksToTemplate(slug, blocks).map((b) =>
      b.id === sectionId ? { ...b, type: blockType, data: nextDraft } : b,
    );
    const page = await updatePageApi(pageId, {
      blocks: nextBlocks,
      version,
    });
    setVersion(page.version);
    setStatus(page.status);
    setBlocks(page.blocks);
    setBaseline(JSON.stringify(nextDraft));
    setDraft(nextDraft);
    return page;
  }

  async function onSave() {
    if (!pageId || entityMode) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await persist();
      setMessage("Draft saved.");
    } catch (err) {
      if (err instanceof ApiClientError && err.code === "CONFLICT") {
        setError("Someone else saved first. Reload and try again.");
      } else {
        setError(err instanceof Error ? err.message : "Save failed");
      }
    } finally {
      setSaving(false);
    }
  }

  async function onPublish() {
    if (!pageId || !canPublish) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      let pageVersion = version;
      if (!entityMode && dirty) {
        const saved = await persist();
        if (!saved) throw new Error("Save failed");
        pageVersion = saved.version;
      }
      const published = await publishPageApi(pageId, "publish", pageVersion);
      setVersion(published.version);
      setStatus(published.status);
      setMessage("Published — live on the website.");
    } catch (err) {
      if (err instanceof ApiClientError && err.code === "CONFLICT") {
        setError("Someone else saved first. Reload and try again.");
      } else {
        setError(err instanceof Error ? err.message : "Publish failed");
      }
    } finally {
      setSaving(false);
    }
  }

  if (!template) {
    return (
      <p className="text-sm text-destructive">Unknown page template: {slug}</p>
    );
  }

  const isEntityPage = template.mode === "entity";
  const isOverview = sectionId === "overview";

  if (!sectionMeta && template.mode === "sections" && !isOverview) {
    return (
      <div className="max-w-3xl">
        <p className="text-sm text-destructive">Unknown section: {sectionId}</p>
        <Link
          href={`/admin/pages/${slug}`}
          className="mt-3 inline-block text-sm font-semibold underline"
        >
          Back to sections
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p className="text-muted-foreground text-sm">Loading section…</p>;
  }

  const title =
    sectionMeta?.title ??
    (isEntityPage || isOverview ? template.label : sectionId);
  const help =
    (sectionMeta && EDITOR_BLURBS[sectionMeta.id]) ||
    sectionMeta?.help ||
    template.description;
  const previewHref = previewPathForTemplate(template.publicPath);
  const showEntityPanel =
    isEntityPage ||
    isOverview ||
    !blockType ||
    isEntityHydratedBlock(blockType);

  return (
    <div className="mx-auto flex w-full max-w-[52rem] flex-col pb-2">
      <header className="mb-4 flex flex-col gap-2">
        <DeskBackLink href={`/admin/pages/${slug}`} label="Back to sections" />
        <p className="text-muted-foreground text-[0.6875rem] font-semibold tracking-wide uppercase">
          <Link href="/admin/pages" className="hover:underline">
            Pages
          </Link>
          {" · "}
          <Link href={`/admin/pages/${slug}`} className="hover:underline">
            {template.label}
          </Link>
        </p>
        <h1 className="font-display text-xl font-semibold tracking-tight min-[640px]:text-[1.35rem]">
          {title}
        </h1>
        <p className="text-muted-foreground max-w-prose text-[0.8125rem] leading-snug">
          {help}
        </p>
      </header>

      {showEntityPanel ? (
        <EntityHydratedPanel title={title} help={help} />
      ) : blockType === "hero" ? (
        <HeroSectionForm value={draft} onChange={setDraft} />
      ) : blockType === "capability" ? (
        <CapabilitySectionForm value={draft} onChange={setDraft} />
      ) : blockType === "products" ? (
        <ProductsSectionForm value={draft} onChange={setDraft} />
      ) : blockType === "upcoming-products" ? (
        <UpcomingProductsSectionForm value={draft} onChange={setDraft} />
      ) : blockType === "mission" ? (
        <MissionSectionForm value={draft} onChange={setDraft} />
      ) : blockType === "cta-banner" ? (
        <CtaBannerSectionForm value={draft} onChange={setDraft} />
      ) : blockType === "testimonials" ? (
        <TestimonialsSectionForm value={draft} onChange={setDraft} />
      ) : blockType === "customers" ? (
        <CustomersSectionForm value={draft} onChange={setDraft} />
      ) : blockType === "joint-ventures" ? (
        <JointVenturesSectionForm value={draft} onChange={setDraft} />
      ) : blockType === "careers-teaser" ? (
        <CareersTeaserSectionForm value={draft} onChange={setDraft} />
      ) : blockType === "faq" ? (
        <FaqSectionForm value={draft} onChange={setDraft} />
      ) : (
        <ContentBlockForm type={blockType} value={draft} onChange={setDraft} />
      )}

      <DeskSaveBar
        saving={saving}
        dirty={entityMode ? false : dirty}
        canPublish={canPublish}
        publishBlockedReason={
          !canPublish
            ? "Every slide needs a photo and headline before publish."
            : undefined
        }
        statusLabel={status}
        previewHref={previewHref}
        onSave={() => void onSave()}
        onPublish={() => void onPublish()}
        message={message}
        error={error}
      />
    </div>
  );
}
