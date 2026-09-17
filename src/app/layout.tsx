import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { siteConfig } from "@/config/site.config";
import {
  FALLBACK_BRAND_ICON,
  resolveBrandLogoSrc,
} from "@/features/public-site/lib/brand-logo";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const APP_DESCRIPTION =
  "HG Aluminium Smelters Ltd. — extrusion profiles, homogenised billets and remelt alloys from Kadi, Gujarat.";

export async function generateMetadata(): Promise<Metadata> {
  const logoSrc = (await resolveBrandLogoSrc()) || FALLBACK_BRAND_ICON;
  const isSvg = /\.svg(\?|$)/i.test(logoSrc);

  return {
    applicationName: siteConfig.shortName,
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: APP_DESCRIPTION,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteConfig.shortName,
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/icon", type: isSvg ? "image/svg+xml" : undefined },
        { url: logoSrc, type: isSvg ? "image/svg+xml" : "image/png" },
      ],
      shortcut: [{ url: "/icon" }],
      apple: [{ url: "/apple-icon", sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
      },
      description: APP_DESCRIPTION,
      ...(logoSrc.startsWith("http")
        ? { images: [{ url: logoSrc, alt: siteConfig.name }] }
        : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0342ab" },
    { media: "(prefers-color-scheme: dark)", color: "#00122f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
