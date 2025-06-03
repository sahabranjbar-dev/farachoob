import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../../app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Vazirmatn } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";

const vazirMatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
    <html lang={locale} suppressHydrationWarning dir="rtl">
      <body className={`${vazirMatn.className}`} style={vazirMatn.style}>
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            <SidebarProvider>
              <div className="container mx-auto">
                <Header />
                {children}
                <Footer />
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
