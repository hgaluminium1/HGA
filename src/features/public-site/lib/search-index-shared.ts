export type SearchResultType = "page" | "product" | "category" | "career";

export type SearchIndexItem = {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  /** Locale-relative path (no leading locale). */
  href: string;
  keywords: string[];
};

/** Lightweight client-side match — good enough for catalogue-scale indexes. */
export function filterSearchIndex(
  items: SearchIndexItem[],
  query: string,
  limit = 24,
): SearchIndexItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);
  const scored: { item: SearchIndexItem; score: number }[] = [];

  for (const item of items) {
    const hay = [
      item.title,
      item.description ?? "",
      ...item.keywords,
      item.href,
    ]
      .join(" ")
      .toLowerCase();

    if (!tokens.every((t) => hay.includes(t))) continue;

    let score = 0;
    const title = item.title.toLowerCase();
    if (title === q) score += 100;
    else if (title.startsWith(q)) score += 60;
    else if (title.includes(q)) score += 30;
    for (const t of tokens) {
      if (item.keywords.some((k) => k.includes(t))) score += 8;
      if (item.href.includes(t)) score += 4;
    }
    if (item.type === "product") score += 2;
    if (item.type === "page") score += 1;
    scored.push({ item, score });
  }

  return scored
    .sort(
      (a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title),
    )
    .slice(0, limit)
    .map((s) => s.item);
}
