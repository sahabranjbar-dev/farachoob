"use client";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";

const NewestProducts = () => {
  const products = [
    {
      id: 1,
      title: "محصول ویژه",
      description: "جدیدترین مدل با بهترین امکانات",
      price: "۱۵۰,۰۰۰,۰۰۰ تومان",
      image: "/desk.jpg",
    },
    {
      id: 2,
      title: "محصول پرطرفدار",
      description: "پرفروش‌ترین محصول ماه",
      price: "۱۲۰,۰۰۰,۰۰۰ تومان",
      image: "/desk.jpg",
    },
    {
      id: 3,
      title: "محصول اقتصادی",
      description: "بهترین قیمت با کیفیت عالی",
      price: "۹۵,۰۰۰,۰۰۰ تومان",
      image: "/desk.jpg",
    },
    {
      id: 4,
      title: "محصول جدید",
      description: "تازه‌وارد بازار شده",
      price: "۱۳۰,۰۰۰,۰۰۰ تومان",
      image: "/desk.jpg",
    },
    {
      id: 5,
      title: "پیشنهاد ویژه",
      description: "فقط برای مشتریان خاص",
      price: "۱۸۰,۰۰۰,۰۰۰ تومان",
      image: "/desk.jpg",
    },
  ];

  return (
    <div className="relative py-12 bg-gradient-to-b from-orange-400 to-orange-500 rounded-3xl overflow-hidden m-4">
      {/* افکت پس‌زمینه */}
      {/* <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat"></div>
      </div> */}

      {/* عنوان */}
      <div className="relative text-center mb-10 px-6">
        <h2 className="text-4xl font-bold text-white mb-3">جدیدترین محصولات</h2>
        <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
      </div>

      {/* اسلایدر */}
      <div className="relative max-w-7xl mx-auto px-4">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 10,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          breakpoints={{
            0: {
              coverflowEffect: {
                rotate: 15,
                stretch: 0,
                depth: 50,
                modifier: 1,
              },
            },
            768: {
              coverflowEffect: {
                rotate: 10,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
              },
            },
          }}
          className="mySwiper pb-12"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="!w-80 !h-auto">
              <ProductCard
                imageSrc={product.image}
                imageAlt={product.title}
                title={product.title}
                description={product.description}
                price={product.price}
                onAddToCart={() =>
                  alert(`${product.title} به سبد خرید اضافه شد!`)
                }
                className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
                style={{
                  transform: "translate3d(0,0,0)",
                  backfaceVisibility: "hidden",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* دکمه CTA */}
      <div className="text-center mt-6">
        <button className="px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
          مشاهده همه محصولات
        </button>
      </div>
    </div>
  );
};

export default NewestProducts;
