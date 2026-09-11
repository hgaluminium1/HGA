import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/organisms/back-to-top";
import { SiteFooter } from "@/components/organisms/site-footer";
import {
  PwaHeaderInstallButton,
  PwaInstallPrompt,
} from "@/features/public-site/components/pwa-install-prompt";
import { PwaInstallProvider } from "@/features/public-site/components/pwa-install-provider";
import { OrganizationJsonLd } from "@/features/public-site/components/organization-json-ld";
import { SiteHeaderWithSearch } from "@/features/public-site/components/site-header-with-search";
import { SiteSearchProvider } from "@/features/public-site/components/site-search";
import { resolvePublicNav } from "@/features/public-site/lib/resolve-public-nav";
import { localePath } from "@/config/nav.config";

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
    <PwaInstallProvider>
      <SiteSearchProvider locale={locale}>
        <OrganizationJsonLd
          name={nav.organizationName}
          url={localePath(locale)}
          socialLinks={nav.socialLinks}
        />
        <a
          href="#main"
          className="bg-ink text-on-dark focus:top-4 absolute top-[-48px] left-4 z-[100] rounded-[var(--radius-sm)] px-5 py-3 transition-[top]"
        >
          Skip to main content
        </a>
        <SiteHeaderWithSearch
          locale={locale}
          productNav={nav.productNav}
          companyNav={nav.companyNav}
          primaryNavLinks={nav.primaryNavLinks}
          brandLogoSrc={nav.brand.logoSrc}
          brandLogoHeightPx={nav.brand.logoHeightPx}
          socialLinks={nav.socialLinks}
          toolbarExtra={<PwaHeaderInstallButton />}
          drawerExtra={<PwaHeaderInstallButton className="inline-flex" />}
        />
        <main id="main">{children}</main>
        <SiteFooter
          locale={locale}
          products={nav.footer.products}
          company={nav.footer.company}
          support={nav.footer.support}
          contact={nav.footer.contact}
          socialLinks={nav.socialLinks}
          brandLogoSrc={nav.brand.logoSrc}
          brandLogoHeightPx={nav.brand.logoHeightPx}
        />
        <BackToTop />
        <PwaInstallPrompt />
      </SiteSearchProvider>
    </PwaInstallProvider>
  );
}
