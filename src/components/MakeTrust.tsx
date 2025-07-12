"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
const MakeTrust = () => {
  const data = useMemo(
    () => [
      {
        id: 1,
        title: "چرا فراچوب؟",
        description: `طراحی ارگونومیک برای سلامت بدن\nمتریال باکیفیت و بادوام\nارسال سریع و پشتیبانی تخصصی\nتنوع در مدل‌ها و رنگ‌بندی‌ها`,
        color: "from-orange-500 to-yellow-400",
      },
      {
        id: 2,
        title: "فضای کاری حرفه‌ای بساز",
        description: `طراحی زیبا = تمرکز و انگیزه بیشتر\nصندلی‌ها و میزهای استاندارد\nتغییر واقعی با محصولات فراچوب`,
        color: "from-indigo-600 to-blue-500",
      },
      {
        id: 3,
        title: "بهره‌وری بیشتر، خستگی کمتر",
        description: `هر ساعت از روز در دفتر مهمه!\nمحیطی راحت و شیک بساز\nکاهش فشارهای بدنی در طول کار`,
        color: "from-pink-500 to-rose-400",
      },
      {
        id: 4,
        title: "شروع یک تحول",
        description: `فرصتی برای ارتقاء فضای کاری‌ات\nبا انتخابی حرفه‌ای از فراچوب\nزیبایی، راحتی و دوام در یک‌جا`,
        color: "from-teal-500 to-emerald-400",
      },
    ],
    []
  );

  return (
    <section
      className="w-full px-6 md:px-12 py-36 dark:bg-slate-900 text-center relative object-fill"
      style={{
        backgroundImage: "url('/images/bg-wave.png')",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
          hidden: {},
        }}
      >
        {data.map((item) => (
          <motion.div
            key={item.id}
            className="items bg-white dark:bg-slate-800 shadow-xl rounded-3xl p-6 flex flex-col justify-between min-h-[260px] border border-gray-100 dark:border-slate-700"
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.03 }}
          >
            {/* Decorative top bar */}
            <div
              className={`w-full h-2 rounded-full mb-4 bg-gradient-to-r ${item.color}`}
            ></div>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {item.title}
            </h3>
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
      <div className="w-[100px] h-[100px] bg-orange-500 blur-[90px] absolute bottom-[80px] right-[80px]" />
    </section>
  );
};

export default MakeTrust;
