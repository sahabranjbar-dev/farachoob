import Image from "next/image";
import { ImgHTMLAttributes } from "react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-creative";
import "swiper/css/effect-cube";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface Props {
  intems: ImgHTMLAttributes<HTMLImageElement>[];
}

const Slider = ({ intems }: Props) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      centeredSlides={true}
      autoplay={{
        delay: 3000,
      }}
      className="mySwiper"
      cssMode={true}
      mousewheel={true}
      keyboard={true}
    >
      {intems?.map((item, index) => (
        <SwiperSlide key={index}>
          <Image
            src={typeof item.src === "string" ? item.src : ""}
            alt={item.alt || `Slide ${index + 1}`}
            width={typeof item.width === "number" ? item.width : 500}
            height={typeof item.height === "number" ? item.height : 300}
            style={{ width: "100%", height: "auto" }}
            loading="lazy"
            className="swiper-lazy"
          />
          <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
