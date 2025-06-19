"use client";

import SVGComponent from "@/assets/HeroPattern";
import { Link, usePathname } from "@/i18n/navigation";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import React from "react";

const Footer = () => {
  const pathname = usePathname();

  const isAuthPage =
    pathname?.startsWith("/auth") || pathname?.startsWith("/dashboard");
  if (isAuthPage) return;
  return (
    <footer
      className="bg-black text-white pt-16 pb-24 relative overflow-hidden"
      dir="rtl"
    >
      {/* بک‌گراند SVG با z-index مناسب */}
      <div className="pointer-events-none absolute top-0 w-full h-full z-0">
        <SVGComponent className="absolute top-0 left-0" />
        <SVGComponent className="absolute bottom-0 right-0 rotate-180" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* بخش اصلی فوتر */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* لینک‌های مفید */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">لینک‌های مفید</h4>
            <ul className="space-y-3">
              {[
                { label: "درباره ما", href: "/about" },
                { label: "تماس با ما", href: "/contact" },
                { label: "سوالات متداول", href: "/faq" },
                { label: "حریم خصوصی", href: "/privacy" },
                { label: "شرایط و قوانین", href: "/terms" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* خدمات */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">خدمات</h4>
            <ul className="space-y-3">
              {[
                { label: "حساب کاربری من", href: "/profile" },
                { label: "فروشگاه", href: "/shop" },
                { label: "آرشیو مقالات", href: "/articles" },
                { label: "سبد خرید", href: "/cart" },
                { label: "نمایندگان", href: "/agents" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* درباره فراچوب */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-lg font-bold text-white">فراچوب</h4>
            <p className="text-gray-300 text-sm leading-6 text-justify">
              صنایع تولیدی تجهیزات اداری فراچوب با اراده، همت و صرف فعل خواستن
              جناب آقای علی شعبانی در سال ۱۳۶۷ و با سرمایه‌گذاری ۲۰۰ هزار تومان
              و یک کارگر ساده، کار خود را آغاز نمود. امروز، فراچوب بزرگترین
              تولیدکننده تجهیزات اداری در شمال کشور است و با بهره‌گیری از
              مدرن‌ترین ماشین‌آلات و تیم طراحی متخصص، محصولات متنوع و با کیفیتی
              را متناسب با سبک زندگی ایرانیان ارائه می‌دهد.
            </p>
          </div>

          {/* آدرس و تماس */}
          <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">نشانی ما</h4>
              <address className="text-gray-300 text-sm not-italic space-y-2">
                <p>مازندران، بابل، شهرک صنعتی منصور کنده،</p>
                <p>مجتمع صنعتی فراچوب</p>
                <p>کدپستی: 3847283457</p>
                <p>تلفن تماس: 011-xxxxxxx</p>
                <p>ایمیل: info@frachob.ir</p>
              </address>
            </div>

            {/* شبکه‌های اجتماعی - حالا تمام عرض را می‌گیرد */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">ما را دنبال کنید</h4>
              <div className="flex justify-start md:justify-end gap-4">
                <Link
                  href="https://www.instagram.com/farachoob/"
                  target="_blank"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="اینستاگرام فراچوب"
                >
                  <Instagram className="w-6 h-6 hover:scale-110 transition-transform duration-200" />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/farachoob/"
                  target="_blank"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="لینکدین فراچوب"
                >
                  <Linkedin className="w-6 h-6 hover:scale-110 transition-transform duration-200" />
                </Link>
                <Link
                  href="https://twitter.com/farachoob"
                  target="_blank"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="توییتر فراچوب"
                >
                  <Twitter className="w-6 h-6 hover:scale-110 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* کپی رایت */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
            © {new Date().getFullYear()} فراچوب | تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors duration-200"
            >
              حریم خصوصی
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors duration-200"
            >
              شرایط استفاده
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
