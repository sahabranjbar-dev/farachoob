"use client";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const PremiumServices = () => {
  const servicesRef = useRef<HTMLDivElement>(null);
  const serviceCardsRef = useRef<HTMLDivElement[]>([]);
  const [activeService, setActiveService] = useState<number | null>(null);

  const services = [
    {
      id: 1,
      title: "تضمین قیمت",
      image: "/price.svg",
      description: "بهترین قیمت بازار با ضمانت بازگشت وجه",
      accentColor: "from-blue-500 to-indigo-600",
      features: ["مقایسه خودکار قیمت", "گزارش روزانه بازار", "هشدار کاهش قیمت"],
    },
    {
      id: 2,
      title: "پشتیبانی VIP",
      image: "/support.svg",
      description: "پشتیبانی اختصاصی با پاسخگویی 24/7",
      accentColor: "from-emerald-500 to-teal-600",
      features: ["چت زنده با متخصص", "دسترسی سریع به مدیر", "پشتیبانی تصویری"],
    },
    {
      id: 3,
      title: "ضمانت طلایی",
      image: "/pay.svg",
      description: "بازگشت وجه تا 45 روز با کمترین فرآیند اداری و پرداخت فوری",
      accentColor: "from-amber-500 to-orange-600",
      features: ["پرداخت یک کلیکی", "ضمانت نامحدود", "پیگیری لحظه‌ای"],
    },
  ];

  const floatingShapes = [
    {
      shape: "circle",
      size: "w-16 h-16",
      color: "bg-indigo-500/10",
      position: "top-10 left-20",
    },
    {
      shape: "triangle",
      size: "w-12 h-12",
      color: "bg-emerald-500/10",
      position: "bottom-20 right-32",
    },
    {
      shape: "square",
      size: "w-10 h-10",
      color: "bg-amber-500/10",
      position: "top-1/3 right-10",
    },
  ];

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !serviceCardsRef.current.includes(el)) {
      serviceCardsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Animate floating shapes
    floatingShapes.forEach((shape, i) => {
      const duration = 15 + i * 3;
      const delay = i * 2;

      gsap.to(`.floating-shape-${i}`, {
        y: 20,
        x: i % 2 === 0 ? 15 : -15,
        rotation: i % 2 === 0 ? 10 : -10,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: delay,
      });
    });

    // Card animations
    serviceCardsRef.current.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 80,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
        delay: index * 0.2,
      });

      // Hover effect
      gsap.to(card, {
        y: -10,
        duration: 0.3,
        paused: true,
        ease: "power2.out",
        onStart: () => setActiveService(index + 1),
        onReverseComplete: () => setActiveService(null),
      });

      card.addEventListener("mouseenter", () =>
        gsap.to(card, { y: -10, duration: 0.3 }).play()
      );
      card.addEventListener("mouseleave", () =>
        gsap.to(card, { y: 0, duration: 0.3 }).play()
      );
    });

    // Section title animation
    gsap.from(".section-title", {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: servicesRef.current,
        start: "top 75%",
        toggleActions: "play none none none",
        once: true,
      },
    });

    // Decoration line animation
    gsap.from(".decoration-line", {
      scaleX: 0,
      duration: 1.5,
      ease: "expo.out",
      scrollTrigger: {
        trigger: servicesRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
        once: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={servicesRef}
      className="relative py-28 bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 overflow-hidden"
    >
      {/* Floating background shapes */}
      {floatingShapes.map((shape, i) => (
        <div
          key={i}
          className={`absolute ${shape.size} ${shape.color} ${shape.position} rounded-full floating-shape-${i} filter blur-lg`}
        />
      ))}

      {/* Particle background */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/particle-bg.svg')] bg-repeat opacity-60"></div>
      </div>

      <div className="max-w-8xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <h2 className="section-title text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              خدمات اختصاصی
            </span>{" "}
            ما
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            تجربه‌ای متفاوت با راهکارهای هوشمند و خدمات پریمیوم
          </p>
          <div className="decoration-line mt-8 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent w-1/2 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={addToRefs}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-16 h-16 mb-4 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={32}
                  height={32}
                  className="text-orange-500"
                />
              </div>

              <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-3">
                {service.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-center">
                {service.description}
              </p>

              <div className="mt-6 text-center">
                <button className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium text-sm flex items-center justify-center mx-auto">
                  بیشتر بدانید
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Animated CTA */}
        <div className="mt-24 text-center">
          <div className="inline-block relative group">
            <button className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-1">
              درخواست مشاوره رایگان
            </button>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-400 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10"></div>
          </div>
          <p className="mt-6 text-gray-500 dark:text-gray-400 animate-pulse">
            همین امروز به جمع مشتریان VIP ما بپیوندید
          </p>
        </div>
      </div>
    </section>
  );
};

export default PremiumServices;
