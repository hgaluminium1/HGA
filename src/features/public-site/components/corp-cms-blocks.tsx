import Link from "next/link";

import { Container } from "@/components/atoms/container";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Reveal } from "@/components/atoms/reveal";
import { Section } from "@/components/atoms/section";
import { localePath } from "@/config/nav.config";
import { PublicEmptyState } from "@/features/public-site/components/cms-empty-state";
import {
  NumberedRail,
  PillarList,
  SectionIntro,
  TextLinkRow,
} from "@/features/public-site/components/corp-kit";
import { cn } from "@/lib/utils";

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function str(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

function hasIntro(d: Record<string, unknown>) {
  return Boolean(str(d.eyebrow) || str(d.title) || str(d.body));
}

export function PageIntroBlock({
  locale,
  data,
}: {
  locale: string;
  data: unknown;
}) {
  const d = asRecord(data);
  const ctaLabel = str(d.ctaLabel).trim();
  const ctaHref = str(d.ctaHref).trim();

  if (!hasIntro(d)) {
    return (
      <Section>
        <Container>
          <PublicEmptyState
            locale={locale}
            density="section"
            title="Intro not written yet."
            description="Add an eyebrow, title and body for this section in Admin → Pages."
            primary={{ label: "Contact / RFQ", href: "contact" }}
          />
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <SectionIntro
          eyebrow={str(d.eyebrow)}
          title={str(d.title)}
          body={str(d.body) || undefined}
        />
        {ctaLabel && ctaHref ? (
          <Reveal className="mt-6">
            <TextLinkRow locale={locale} href={ctaHref} label={ctaLabel} />
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}

export function PillarListBlock({
  locale,
  data,
}: {
  locale: string;
  data: unknown;
}) {
  const d = asRecord(data);
  const items = asArray(d.items)
    .map((row) => asRecord(row))
    .map((row) => ({ title: str(row.title), body: str(row.body) }))
    .filter((row) => row.title);

  return (
    <Section>
      <Container>
        {hasIntro(d) ? (
          <SectionIntro
            eyebrow={str(d.eyebrow)}
            title={str(d.title)}
            body={str(d.body) || undefined}
          />
        ) : null}
        {items.length ? (
          <PillarList items={items} />
        ) : (
          <PublicEmptyState
            locale={locale}
            density="section"
            className={hasIntro(d) ? "mt-6" : undefined}
            title="No pillars published yet."
            description="Add titled pillars for this section in Admin → Pages."
            primary={{ label: "Contact / RFQ", href: "contact" }}
          />
        )}
      </Container>
    </Section>
  );
}

export function TimelineBlock({
  locale,
  data,
}: {
  locale: string;
  data: unknown;
}) {
  const d = asRecord(data);
  const items = asArray(d.items)
    .map((row) => asRecord(row))
    .map((row) => ({
      year: str(row.year),
      title: str(row.title),
      body: str(row.body),
    }))
    .filter((row) => row.title);

  return (
    <>
      {hasIntro(d) ? (
        <Section>
          <Container>
            <SectionIntro
              eyebrow={str(d.eyebrow)}
              title={str(d.title)}
              body={str(d.body) || undefined}
            />
          </Container>
        </Section>
      ) : null}
      {items.length ? (
        <Section appearance="compact" className={hasIntro(d) ? "pt-0" : undefined}>
          <Container>
            <ol className="space-y-[clamp(2.5rem,6vw,4.5rem)]">
              {items.map((m, i) => (
                <li
                  key={`${m.year}-${m.title}`}
                  className={cn(
                    "max-w-[42rem]",
                    i % 2 === 1 &&
                      "min-[768px]:ml-auto min-[768px]:text-right",
                  )}
                >
                  <Reveal>
                    <Eyebrow>{m.year}</Eyebrow>
                    <h3 className="text-fs-h3 mt-2 text-balance">{m.title}</h3>
                    <p
                      className={cn(
                        "text-muted-foreground mt-3 max-w-[42ch] text-[1.02rem] leading-relaxed",
                        i % 2 === 1 && "min-[768px]:ml-auto",
                      )}
                    >
                      {m.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      ) : (
        <Section appearance="compact" className={hasIntro(d) ? "pt-0" : undefined}>
          <Container>
            <PublicEmptyState
              locale={locale}
              density="section"
              title="No milestones published yet."
              description="Add yeared timeline items for this section in Admin → Pages."
              primary={{ label: "Contact / RFQ", href: "contact" }}
            />
          </Container>
        </Section>
      )}
    </>
  );
}

export function NumberedStepsBlock({
  locale,
  data,
}: {
  locale: string;
  data: unknown;
}) {
  const d = asRecord(data);
  const items = asArray(d.items)
    .map((row) => asRecord(row))
    .map((row) => ({ title: str(row.title), body: str(row.body) }))
    .filter((row) => row.title);

  return (
    <Section className="bg-bg-alt/40">
      <Container>
        {hasIntro(d) ? (
          <SectionIntro
            eyebrow={str(d.eyebrow)}
            title={str(d.title)}
            body={str(d.body) || undefined}
          />
        ) : null}
        {items.length ? (
          <div className={cn("max-w-3xl", hasIntro(d) && "mt-8")}>
            <NumberedRail items={items} />
          </div>
        ) : (
          <PublicEmptyState
            locale={locale}
            density="section"
            className={hasIntro(d) ? "mt-6" : undefined}
            title="No steps published yet."
            description="Add numbered process steps for this section in Admin → Pages."
            primary={{ label: "Contact / RFQ", href: "contact" }}
          />
        )}
      </Container>
    </Section>
  );
}

export function ResourceListBlock({
  locale,
  data,
}: {
  locale: string;
  data: unknown;
}) {
  const d = asRecord(data);
  const items = asArray(d.items)
    .map((row) => asRecord(row))
    .map((row) => ({
      title: str(row.title),
      body: str(row.body),
      tag: str(row.tag),
      requestHref: str(row.requestHref, "contact") || "contact",
    }))
    .filter((row) => row.title);

  return (
    <Section>
      <Container>
        {hasIntro(d) ? (
          <SectionIntro
            eyebrow={str(d.eyebrow)}
            title={str(d.title)}
            body={str(d.body) || undefined}
          />
        ) : null}
        {items.length ? (
          <ul className="mt-10 divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {items.map((r) => (
              <li
                key={r.title}
                className="grid gap-3 py-[clamp(1.15rem,2.5vw,1.6rem)] @container min-[640px]:grid-cols-[1fr_auto] min-[640px]:items-center"
              >
                <div>
                  {r.tag ? (
                    <p className="text-[0.65rem] font-bold tracking-[0.12em] text-brand-blue uppercase">
                      {r.tag}
                    </p>
                  ) : null}
                  <p className="mt-1 font-semibold text-ink">{r.title}</p>
                  <p className="text-muted-foreground mt-1 max-w-[52ch] text-[0.9375rem] leading-relaxed">
                    {r.body}
                  </p>
                </div>
                <Link
                  href={localePath(locale, r.requestHref)}
                  className="text-brand-blue inline-flex min-h-10 items-center justify-self-start text-[0.875rem] font-semibold hover:underline min-[640px]:justify-self-end"
                >
                  Request
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <PublicEmptyState
            locale={locale}
            density="section"
            className={hasIntro(d) ? "mt-6" : undefined}
            title="No resources listed yet."
            description="Add downloadable or requestable packs for this section in Admin → Pages."
            primary={{ label: "Contact / RFQ", href: "contact" }}
          />
        )}
      </Container>
    </Section>
  );
}

export function IndustryListBlock({
  locale,
  data,
}: {
  locale: string;
  data: unknown;
}) {
  const d = asRecord(data);
  const items = asArray(d.items)
    .map((row) => asRecord(row))
    .map((row) => ({
      label: str(row.label),
      description: str(row.description),
      applications: asArray(row.applications).map(String).filter(Boolean),
      productHref: str(row.productHref, "products") || "products",
    }))
    .filter((row) => row.label);

  return (
    <Section>
      <Container>
        {hasIntro(d) ? (
          <div className="mb-8">
            <SectionIntro
              eyebrow={str(d.eyebrow)}
              title={str(d.title)}
              body={str(d.body) || undefined}
            />
          </div>
        ) : null}
        {items.length ? (
          <ul className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {items.map((s) => (
              <li
                key={s.label}
                className="grid gap-3 py-[clamp(1.15rem,2.5vw,1.6rem)] min-[720px]:grid-cols-[1fr_auto] min-[720px]:items-start"
              >
                <div>
                  <h2 className="font-display text-[1.15rem] font-semibold text-ink">
                    {s.label}
                  </h2>
                  <p className="text-muted-foreground mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed">
                    {s.description}
                  </p>
                  {s.applications.length ? (
                    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                      {s.applications.slice(0, 4).map((a) => (
                        <li
                          key={a}
                          className="text-text-faint text-[0.75rem] leading-snug"
                        >
                          {a}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 min-[720px]:flex-col min-[720px]:items-end">
                  <Link
                    href={localePath(locale, s.productHref)}
                    className="text-brand-blue text-sm font-semibold hover:underline"
                  >
                    Related products →
                  </Link>
                  <Link
                    href={localePath(
                      locale,
                      `contact?product=${encodeURIComponent(s.label)}`,
                    )}
                    className="text-muted-foreground text-sm font-semibold hover:text-ink hover:underline"
                  >
                    Enquire
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <PublicEmptyState
            locale={locale}
            density="section"
            title="No industries listed yet."
            description="Add sectors and applications for this section in Admin → Pages."
            primary={{ label: "Browse products", href: "products" }}
          />
        )}
      </Container>
    </Section>
  );
}
