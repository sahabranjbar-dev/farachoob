"use client";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../assets/ProjectSlider.css";

import Image from "next/image";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

interface Props {
  images?: string[];
}

const ProjectSlider = ({ images }: Props) => {
  return (
    <>
      {!images?.length ? (
        <Image
          src={"/images/placeholder.png"}
          alt="placeholder"
          width={800}
          height={200}
          className="object-contain"
          unoptimized
        />
      ) : (
        <Swiper
          spaceBetween={30} // فاصله بین اسلایدها
          centeredSlides={true} // اسلاید وسط مرکز میشه
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          loop
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className="flex justify-center items-center px-4" // padding برای اسلاید وسط
            >
              <div className="relative w-full h-80 md:h-[400px] lg:h-[500px]">
                <Image
                  src={image}
                  alt={`project image ${index}`}
                  fill
                  style={{ objectFit: "contain" }} // حفظ نسبت و کامل بودن تصویر
                  className="rounded-lg"
                  unoptimized
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default ProjectSlider;
