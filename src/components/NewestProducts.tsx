"use client";

import { Key, useEffect, useState } from "react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation as nav,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";
import useDataGetter from "@/hooks/useDataGetter";
import { Skeleton } from "./ui/skeleton";
import { IProduct } from "@/app/products/meta/types";

const NewestProducts = () => {
  const {
    data: products,
    error,
    fetch,
    loading,
  } = useDataGetter({
    url: "/products",
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!products?.resultList?.length) return;

  return (
    <div className="relative py-16 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 rounded-3xl overflow-hidden m-4 shadow-2xl">
      {/* افکت پس‌زمینه */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat"></div>
      </div>

      {/* عنوان */}
      <div className="relative text-center mb-12 px-6">
        <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
          جدیدترین محصولات
        </h2>
        <div className="w-28 h-1 bg-white/80 mx-auto rounded-full"></div>
      </div>

      {/* اسلایدر */}
      <div className="relative max-w-7xl mx-auto px-4">
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides={!loading} // 👈 اینجا تغییر دادم
          slidesPerView="auto"
          loop={!loading ? products?.resultList?.length > 2 : false} // 👈 لودینگ رو لوپ نکن
          coverflowEffect={{
            rotate: 8,
            stretch: 0,
            depth: 150,
            modifier: 2,
            slideShadows: true,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation
          autoplay={
            !loading
              ? {
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false // 👈 لودینگ نیازی به autoplay نداره
          }
          modules={[EffectCoverflow, Pagination, nav, Autoplay]}
          className="mySwiper pb-14"
        >
          {loading ? ( // 👈 شرط رو برعکس کردم
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <SwiperSlide key={i} className="!w-80 !h-auto">
                  <div className="flex justify-center items-center">
                    <Skeleton className="w-90 h-90" />
                  </div>
                </SwiperSlide>
              ))}
            </>
          ) : (
            products?.resultList?.map((product: IProduct) => (
              <SwiperSlide key={product.id} className="!w-80 !h-auto">
                <ProductCard
                  id={product.id}
                  imageSrc={product.image}
                  imageAlt={product.englishTitle}
                  title={product.farsiTitle}
                  description={product.description}
                  className="cursor-pointer bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
                />
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default NewestProducts;
