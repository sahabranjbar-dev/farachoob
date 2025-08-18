"use client";
import Image from "next/image";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PremiumServices = () => {
  const servicesRef = useRef<HTMLDivElement>(null);
  const serviceCardsRef = useRef<HTMLDivElement[]>([]);

  const services = [
    {
      id: 1,
      title: "تضمین قیمت",
      image: "/price.svg",
      description: "بهترین قیمت بازار با ضمانت بازگشت وجه",
    },
    {
      id: 2,
      title: "پشتیبانی VIP",
      image: "/support.svg",
      description: "پشتیبانی اختصاصی با پاسخگویی 24/7",
    },
    {
      id: 3,
      title: "ضمانت طلایی",
      image: "/pay.svg",
      description: "بازگشت وجه تا 45 روز با کمترین فرآیند اداری",
    },
  ];

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !serviceCardsRef.current.includes(el)) {
      serviceCardsRef.current.push(el);
    }
  };

  useEffect(() => {
    // حتما قبلش همه تریگرها و تایم‌لاین‌های قبلی رو پاک کن
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf("*");

    // کارت‌ها
    serviceCardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
          delay: index * 0.2,
        }
      );
    });

    // عنوان
    gsap.fromTo(
      ".section-title",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
          once: true,
        },
      }
    );

    // خط تزئینی
    gsap.fromTo(
      ".decoration-line",
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
        },
      }
    );

    // وقتی کامپوننت unmount شد همه چیز رو پاک کن
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf("*");
    };
  }, []);

  return (
    <section
      ref={servicesRef}
      className="relative py-28 bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <h2 className="section-title text-4xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="text-orange-500">خدمات اختصاصی</span> ما
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            تجربه‌ای متفاوت با راهکارهای هوشمند
          </p>
          <div className="decoration-line mt-8 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent w-1/2 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              ref={addToRefs}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-16 h-16 mb-4 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumServices;
