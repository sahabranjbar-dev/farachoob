"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

const HeroSection = () => {
  useGSAP(() => {
    gsap.from("#right-content", {
      x: 1000,
      duration: 1.3,
    });
    gsap.from("#left-content", {
      x: -1000,
      duration: 1.3,
    });
  }, []);
  return (
    <div
      className="w-full bg-white dark:bg-slate-900 rounded-md relative"
      dir="rtl"
    >
      {/* Header */}
      <header className="flex lg:flex-row flex-col-reverse items-center gap-12 lg:gap-0 justify-between px-8 mt-10">
        <div
          id={"right-content"}
          className="w-full lg:w-[45%] dark:text-[#abc2d3] text-right"
        >
          <p className="text-gray-500 dark:text-slate-400">
            به وب‌سایت رسمی فراچوب خوش آمدید
          </p>
          <h1 className="text-[32px] sm:text-[48px] font-bold leading-[45px] sm:leading-[70px] mt-2">
            <span className="text-orange-500">فراچوب</span>، همراه شما در طراحی
            و تولید مبلمان اداری مدرن
          </h1>
          <p className="mt-4 text-[1rem] text-gray-600 dark:text-slate-400">
            ما در فراچوب با تیمی متخصص، آماده‌ایم تا فضای کاری شما را با بهترین
            طراحی و کیفیت، متحول کنیم.
          </p>
        </div>

        <div id={"left-content"} className="w-full lg:w-[55%]">
          <Image
            src="/images/hero.png"
            alt="مبلمان اداری"
            width={700}
            height={700}
            className="mx-auto"
          />
        </div>
      </header>
    </div>
  );
};

export default HeroSection;
