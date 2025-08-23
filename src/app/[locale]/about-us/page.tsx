"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    id: 1,
    title: "از کجا شروع کردیم",
    text: "شرکت فراچوب فعالیت خود را با هدف طراحی و تولید مبلمان اداری مدرن آغاز کرد...",
    image: "/images/about/future.png",
    reverse: false,
  },
  {
    id: 2,
    title: "مسیر رشد",
    text: "با گذشت زمان و تکیه بر کیفیت و نوآوری، فراچوب توانست جایگاه ویژه‌ای در صنعت مبلمان اداری به دست آورد...",
    image: "/images/about/future.png",
    reverse: true,
  },
  {
    id: 3,
    title: "پروژه‌های موفق",
    text: "افتخار ما همکاری با ده‌ها سازمان و کسب‌وکار بزرگ در سراسر کشور است...",
    image: "/images/about/future.png",
    reverse: false,
  },
  {
    id: 4,
    title: "چشم‌انداز آینده",
    text: "ما در فراچوب به آینده‌ای سبز، مدرن و هوشمند باور داریم...",
    image: "/images/about/future.png",
    reverse: true,
  },
];

const AboutUs = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>(
      containerRef.current.querySelectorAll(".about-section")
    );

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { autoAlpha: 0, y: 100 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top center+=100",
            once: true, // ✅ فقط یکبار انیمیشن
          },
        }
      );
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative max-w-7xl mx-auto px-4 py-16 space-y-24"
    >
      {sections.map((section) => (
        <div
          key={section.id}
          className={`about-section flex flex-col md:flex-row items-center gap-8 opacity-0 relative ${
            section.reverse ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* متن */}
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">{section.text}</p>
          </div>

          {/* تصویر */}
          <div className="w-full md:w-1/2">
            <Image
              src={section.image}
              alt={section.title}
              width={600}
              height={400}
              className="rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutUs;
