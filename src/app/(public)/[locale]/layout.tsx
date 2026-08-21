import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/organisms/back-to-top";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";

type PublicLocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PublicLocaleLayout({
  children,
  params,
}: PublicLocaleLayoutProps) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  return (
    <>
      <a
        href="#main"
        className="bg-ink text-on-dark focus:top-4 absolute top-[-48px] left-4 z-[100] rounded-[var(--radius-sm)] px-5 py-3 transition-[top]"
      >
        Skip to main content
      </a>
      <SiteHeader locale={locale} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} />
      <BackToTop />
    </>
  );
}
