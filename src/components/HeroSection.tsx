"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import SubscribeButton from "./SubscribeButton";

const HeroSection = () => {
  const refs = {
    text: useRef<HTMLDivElement>(null),
    image: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registered"))
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(refs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      Object.values(refs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [refs.image, refs.text]);

  return (
    <div
      dir="rtl"
      className="flex flex-col lg:flex-row items-center gap-8 p-8 mt-8"
    >
      <SubscribeButton />
      {/* متن */}
      <div
        ref={refs.text}
        className="w-full lg:w-1/2 text-right opacity-0 transition-all duration-700 -translate-y-10"
      >
        <h1 className="text-3xl sm:text-5xl font-bold mt-2 text-[#273F4F]">
          <span className="text-orange-500">فراچوب</span>، همراه شما در طراحی و
          تولید مبلمان اداری مدرن
        </h1>
        <p className="mt-4 text-gray-600">
          ما در فراچوب با تیمی متخصص، آماده‌ایم تا فضای کاری شما را با بهترین
          طراحی و کیفیت، متحول کنیم.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/products"
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            مشاهده محصولات
          </Link>
          <Link href="/contact-us" className="px-4 py-2 border rounded">
            تماس با ما
          </Link>
        </div>
      </div>

      {/* تصویر */}
      <div
        ref={refs.image}
        className="w-full lg:w-1/2 opacity-0 transition-all duration-700"
      >
        <Image
          src="/images/hero.png"
          alt="مبلمان اداری"
          width={700}
          height={700}
          className="mx-auto"
          priority
        />
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(var(--start-x));
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 1s forwards ease-out;
        }

        .animate-slide-in:nth-child(1) {
          --start-x: 5rem;
        }

        .animate-slide-in:nth-child(2) {
          --start-x: -5rem;
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
