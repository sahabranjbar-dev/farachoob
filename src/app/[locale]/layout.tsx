import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import StickyNav from "@/components/StickyNav";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { getServerSession } from "next-auth";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import LocalFont from "next/font/local";
import { notFound } from "next/navigation";
import "../../app/globals.css";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { readFileSync } from "fs";
import path from "path";

const myFont = LocalFont({
  src: [
    {
      path: "../../../public/fonts/Samim-FD.woff2",
      weight: "500",
      style: "normal",
    },
  ],
});

export const metadata = {
  title: "فراچوب | بزرگترین تولیدکننده میز و صندلی اداری در شمال کشور",
  description:
    "تولیدکننده تخصصی میز اداری، صندلی مدیرتی، مبلمان اداری و تجهیزات چوبی با کیفیت ممتاز و قیمت مناسب | تحویل سریع در سراسر ایران",
  keywords: [
    "میز اداری",
    "صندلی اداری",
    "مبلمان اداری",
    "تجهیزات چوبی اداری",
    "فراچوب",
    "farachoob",
    "تولیدکننده میز اداری",
    "میز کار چوبی",
    "صندلی مدیرتی",
    "میز کنفرانس",
  ],
  authors: [
    {
      name: "Sahab Ranjbar",
      url: "https://sahabranjbar.dev",
    },
  ],
  openGraph: {
    title: "فراچوب | تولیدکننده ممتاز میز و صندلی اداری | Farachoob",
    description:
      "صنایع چوب فراچوب - تولیدکننده تخصصی میز اداری، صندلی مدیرتی و مبلمان اداری با ۳ دهه تجربه | کیفیت درجه یک با قیمت رقابتی",
    url: "https://farachoob.ir",
    siteName: "فراچوب | Farachoob",
    images: [
      {
        url: "https://farachoob.ir/images/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "نمونه محصولات فراچوب - میز اداری مدرن و صندلی مدیرتی لوکس",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "فراچوب | تولیدکننده ممتاز میز و صندلی اداری",
    description:
      "تولیدات چوبی اداری با کیفیت عالی و طراحی مدرن - مناسب برای دفاتر کار، شرکتها و سازمانها",
    images: ["https://farachoob.ir/images/twitter-card.jpg"],
  },
  alternates: {
    canonical: "https://farachoob.ir",
  },
  metadataBase: new URL("https://farachoob.ir"),
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "farachoob-logo",
      url: "/logo.png",
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = JSON.parse(
    readFileSync(path.resolve(`./messages/${locale}.json`), "utf-8")
  );
  const session = await getServerSession(authOptions);
  return (
    <html lang={locale} suppressHydrationWarning dir="rtl">
      <body className={`${myFont.className}`} style={myFont.style}>
        <SessionProviderWrapper session={session}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="system">
              <>
                <Header />
                {children}
                <StickyNav />
                <Footer />
              </>
            </ThemeProvider>
          </NextIntlClientProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
