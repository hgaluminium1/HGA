import { resolvePreviewToken } from "@/modules/cms";
import { CmsPageBlocks } from "@/features/public-home/lib/block-registry";

type Props = {
  params: Promise<{ locale: string; token: string }>;
};

export default async function PreviewPage({ params }: Props) {
  const { locale, token } = await params;
  const page = await resolvePreviewToken(token);

  if (!page) {
    return (
      <div className="mx-auto max-w-lg p-10 text-center">
        <h1 className="font-display text-2xl font-semibold">Preview unavailable</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          This preview link is invalid, expired, or revoked.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        role="status"
        className="sticky top-0 z-[100] bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-ink"
      >
        Preview — not public
      </div>
      <CmsPageBlocks blocks={page.blocks} locale={locale} />
    </>
  );
}
