"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";

const MakeTrust = () => {
  const data = useMemo(
    () => [
      {
        id: 1,
        title: "چرا ما را انتخاب کنید؟",
        description: `با طراحی‌های ارگونومیک، راحتی و سلامت ستون فقرات شما تضمین می‌شود.
تنوع مدل‌ها و رنگ‌بندی‌ها، دست شما را برای انتخاب کاملاً باز می‌گذارد.
تمام محصولات از متریال باکیفیت و بادوام ساخته شده‌اند تا سال‌ها همراه‌تان باشند.
پشتیبانی تخصصی و ارسال سریع به سراسر کشور، تجربه‌ای مطمئن برای شما فراهم می‌کند.`,
        icon: "/chair.png",
      },
      {
        id: 2,
        title: "فضای کاری‌ات رو حرفه‌ای بچین!",
        description: `یک فضای کاری خوب فقط یک محیط ساده نیست؛ جاییه که الهام‌بخش، منظم و در عین حال راحت باشه.
با انتخاب میز و صندلی‌های ارگونومیک و مدرن ما، نه‌تنها به سلامت و بهره‌وری خودت کمک می‌کنی، بلکه زیبایی و نظم رو به محل کارت میاری.
اگه دنبال یه تغییر جدی تو حال و هوای دفترت هستی، همین حالا نگاهی به محصولات ما بنداز و قدم اول رو برای ساختن یه محیط کاری حرفه‌ای بردار.`,
        icon: "/brainstorm.png",
      },
      {
        id: 3,
        title: "محیط کارت رو متحول کن!",
        description: `فضای کاری تأثیر مستقیمی روی تمرکز، انگیزه و بازدهی داره. با محصولات ما، می‌تونی محیطی بسازی که هم از نظر زیبایی چشم‌نواز باشه، هم از نظر ارگونومی، راحت و استاندارد.
چه برای دفتر شرکت، چه برای فضای کاری خونگی، مجموعه‌ی ما طراحی شده تا به نیازهای حرفه‌ای تو پاسخ بده.
حالا وقتشه فضای کارت رو حرفه‌ای‌تر و کارآمدتر از همیشه بچینی — از همین‌جا شروع کن!`,
        icon: "/alarm.png",
      },
      {
        id: 4,
        title: "وقتشه به کارت احترام بذاری!",
        description: `ساعت‌های زیادی از روزتو پشت میز کار می‌گذرونی؛ پس چرا توی یه محیط خسته‌کننده باشی؟
با میز و صندلی‌های استاندارد و خوش‌طراحی ما، می‌تونی یه فضای کاری بسازی که هم راحت باشه، هم با کلاس.
از طراحی مدرن تا راحتی واقعی، همه‌چی آماده‌ست تا یه تغییر جدی رو شروع کنی.`,
        icon: "/employee.png",
      },
    ],
    []
  );

  return (
    <div className="container mx-auto my-16 flex flex-col items-center gap-10">
      <motion.h2
        className="text-4xl font-bold tracking-tight text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        فراچوب
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
          hidden: {},
        }}
      >
        {data.map((item, index) => (
          <motion.div
            key={item.id}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-gradient-to-br from-[#f4f4f4] to-[#e0e0e0] hover:shadow-xl transition-all duration-300 rounded-2xl p-6 flex flex-col items-center text-center">
              <motion.img
                src={item.icon}
                alt={item.title}
                className="w-20 h-20 mb-4"
                whileHover={{ rotate: 10 }}
              />
              <div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MakeTrust;
