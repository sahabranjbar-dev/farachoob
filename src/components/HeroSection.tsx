"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import SVGComponent from "@/assets/HeroPattern";
import gsap from "gsap";

const HeroSection = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image || window.innerWidth < 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 20;
      const y = (e.clientY - top - height / 2) / 20;

      gsap.to(image, {
        x,
        y,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative bg-orange-400 p-4 text-neutral-100 overflow-hidden">
      <div
        ref={containerRef}
        className="flex flex-col md:flex-row items-start justify-between gap-8 p-4 md:p-8"
      >
        {/* متن و عنوان */}
        <div className="flex flex-col items-start text-center md:text-right z-10 max-w-xl translate-y-10">
          <h1 className="relative text-2xl md:text-4xl font-extrabold tracking-tight p-2 leading-snug text-neutral-100">
            <span className="relative z-10">
              بزرگترین تولید کننده‌ی میز و صندلی اداری در شمال کشور
            </span>
          </h1>

          <section className="m-2">
            <p className="text-base md:text-lg font-light leading-relaxed">
              با بیش از ۲۰ سال سابقه در تولید و عرضه انواع میز و صندلی اداری،
              پیشرو در شمال کشور
            </p>
          </section>
        </div>

        {/* تصویر با انیمیشن GSAP */}
        <div
          ref={imageRef}
          className="w-full max-w-sm md:max-w-md lg:max-w-lg rounded-lg z-10 mx-auto"
        >
          <Image
            src="/effydesk.jpg"
            alt="Effy Desk"
            width={300}
            height={300}
            className="rounded-lg shadow-lg object-cover object-top-[30%] w-full h-96" // مثلا h-48 یا هر عدد دلخواه
            priority
          />
        </div>
      </div>

      {/* SVG Background */}
      <div className="absolute left-0 top-0 z-0 hidden md:block">
        <SVGComponent />
      </div>
      <div className="absolute right-0 top-0 rotate-90 z-0">
        <SVGComponent />
      </div>
    </div>
  );
};

export default HeroSection;
