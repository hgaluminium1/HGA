import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/organisms/back-to-top";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { resolvePublicNav } from "@/features/public-site/lib/resolve-public-nav";

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

  const nav = await resolvePublicNav(locale);

  return (
    <>
      <a
        href="#main"
        className="bg-ink text-on-dark focus:top-4 absolute top-[-48px] left-4 z-[100] rounded-[var(--radius-sm)] px-5 py-3 transition-[top]"
      >
        Skip to main content
      </a>
      <SiteHeader
        locale={locale}
        productNav={nav.productNav}
        companyNav={nav.companyNav}
        primaryNavLinks={nav.primaryNavLinks}
      />
      <main id="main">{children}</main>
      <SiteFooter
        locale={locale}
        products={nav.footer.products}
        company={nav.footer.company}
        support={nav.footer.support}
        contact={nav.footer.contact}
      />
      <BackToTop />
    </>
  );
}
