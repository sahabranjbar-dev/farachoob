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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50 dark:bg-gray-900">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 p-4 border-b">
          <Image src={item.image} alt={item.title} width={100} height={100} />
          <div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Services;
