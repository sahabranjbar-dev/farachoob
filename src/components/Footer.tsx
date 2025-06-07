import SVGComponent from "@/assets/HeroPattern";
import { Link } from "@/i18n/navigation";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 mt-12 relative" dir="rtl">
      <div className="absolute top-0 left-0">
        <SVGComponent />
      </div>
      <div className="absolute bottom-0 right-0 rotate-180">
        <SVGComponent />
      </div>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
        {/* بخش لینک‌های مفید */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <h4 className="text-xl font-semibold mb-4">لینک‌های مفید</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors duration-150"
              >
                درباره ما
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors duration-150"
              >
                تماس با ما
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-white transition-colors duration-150"
              >
                سوالات متداول
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors duration-150"
              >
                حریم خصوصی
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-white transition-colors duration-150"
              >
                شرایط و قوانین
              </Link>
            </li>
          </ul>
        </div>

        {/* بخش خدمات */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <h4 className="text-xl font-semibold mb-4">خدمات</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link
                href="/profile"
                className="hover:text-white transition-colors duration-150"
              >
                حساب کاربری من
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="hover:text-white transition-colors duration-150"
              >
                فروشگاه
              </Link>
            </li>
            <li>
              <Link
                href="/articles"
                className="hover:text-white transition-colors duration-150"
              >
                آرشیو مقالات
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="hover:text-white transition-colors duration-150"
              >
                سبد خرید
              </Link>
            </li>
            <li>
              <Link
                href="/agents"
                className="hover:text-white transition-colors duration-150"
              >
                نمایندگان
              </Link>
            </li>
          </ul>
        </div>

        {/* بخش درباره شرکت */}
        <div className="col-span-2">
          <h4 className="text-xl font-semibold mb-4">فراچوب</h4>
          <p className="text-sm text-gray-400 leading-7 text-justify">
            صنایع تولیدی تجهیزات اداری فراچوب با اراده، همت و صرف فعل خواستن
            جناب آقای علی شعبانی در سال ۱۳۶۷ و با سرمایه‌گذاری ۲۰۰ هزار تومان و
            یک کارگر ساده، کار خود را آغاز نمود. امروز، فراچوب بزرگترین
            تولیدکننده تجهیزات اداری در شمال کشور است و با بهره‌گیری از
            مدرن‌ترین ماشین‌آلات و تیم طراحی متخصص، محصولات متنوع و با کیفیتی را
            متناسب با سبک زندگی ایرانیان ارائه می‌دهد.
          </p>
        </div>

        {/* بخش آدرس */}
        <div className="col-span-1">
          <h4 className="text-xl font-semibold mb-4">نشانی ما</h4>
          <p className="text-sm text-gray-400 leading-7">
            مازندران، قائم‌شهر، خیابان ساری، مجتمع صنعتی فراچوب، کد پستی:
            476599XXXX
          </p>
          <p className="mt-4 text-sm text-gray-400">تلفن تماس: 011-xxxxxxx</p>
          <p className="text-sm text-gray-400">ایمیل: info@frachob.ir</p>
        </div>

        <div className="col-span-3">
          <h4 className="text-xl font-semibold mb-4">دنبال کنید</h4>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="https://www.instagram.com/frachob/"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors duration-150"
              >
                اینستاگرام
              </Link>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/company/frachob/"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors duration-150"
              >
                لینکدین
              </Link>
            </li>
            <li>
              <Link
                href="https://twitter.com/frachob"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors duration-150"
              >
                توییتر
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
