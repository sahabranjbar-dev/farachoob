import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/[locale]/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Vazirmatn } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const vazirMatn = Vazirmatn({
  subsets: ["arabic"],
  weight: "500",
});
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${vazirMatn.className} `}>
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            <div className="container mx-auto">
              <Header />
              {children}
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
