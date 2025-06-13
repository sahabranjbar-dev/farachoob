import Image from "next/image";
import React, { useMemo } from "react";

const Services = () => {
  const items = useMemo(
    () => [
      {
        id: 1,
        title: "تضمین قیمت",
        image: "/price.svg",
        description:
          "ما تضمین می‌کنیم که بهترین قیمت را برای محصولات خود ارائه می‌دهیم.",
      },
      {
        id: 3,
        title: "پشتیبانی 24/7",
        image: "/support.svg",
        description:
          "تیم پشتیبانی ما در تمام ساعات شبانه‌روز آماده پاسخگویی به شماست.",
      },
      {
        id: 4,
        title: "بازگشت وجه",
        image: "/pay.svg",
        description:
          "در صورت نارضایتی، می‌توانید محصول را بازگردانید و وجه خود را دریافت کنید.",
      },
    ],
    []
  );

  return (
    <div
      dir="rtl"
      className="max-w-7xl mx-auto p-6 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-gray-50 dark:bg-gray-900"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="w-24 h-24 mb-4">
            <Image src={item.image} alt={item.title} width={96} height={96} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {item.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Services;
