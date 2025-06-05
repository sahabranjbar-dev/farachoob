import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const NewestProducts = () => {
  return (
    <div>
      <h2>جدیدترین محصولات</h2>

      <Swiper>
        {/* Example Swiper slides */}
        <SwiperSlide>
          <img src="/product1.jpg" alt="Product 1" />
          <p>محصول ۱</p>
        </SwiperSlide>
        <SwiperSlide>
          <img src="/product2.jpg" alt="Product 2" />
          <p>محصول ۲</p>
        </SwiperSlide>
        <SwiperSlide>
          <img src="/product3.jpg" alt="Product 3" />
          <p>محصول ۳</p>
        </SwiperSlide>
        {/* Add more slides as needed */}
      </Swiper>
    </div>
  );
};

export default NewestProducts;
