import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";

const NewestProducts = () => {
  return (
    <div className="container mx-auto my-8 p-6 bg-orange-400 rounded-2xl text-background">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 m-4">
        جدیدترین محصولات
      </h2>

      <Swiper
        slidesPerView={4}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 0,
          
          },
          320: {
            slidesPerView: 1,
            spaceBetween: 5

          },
          640: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 15
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 25
          },
        }}
        style={{ width: "100%", height: "auto" }}
      >
        <SwiperSlide style={{display: "flex", justifyContent: "center"}}>
          <ProductCard
            imageSrc="/desk.jpg"
            imageAlt="Product 1"
            title="محصول 1"
            description="توضیحات محصول 1"
            price="100000000"
            onAddToCart={() => alert("محصول 1 به سبد خرید اضافه شد!")}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ width: "100%", height: "auto" }}
          />
        </SwiperSlide>
        <SwiperSlide style={{display: "flex", justifyContent: "center"}}>
          <ProductCard
            imageSrc="/desk.jpg"
            imageAlt="Product 2"
            title="محصول 2"
            description="توضیحات محصول 2"
            price="150000000"
            onAddToCart={() => alert("محصول 2 به سبد خرید اضافه شد!")}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ width: "100%", height: "auto" }}
          />
        </SwiperSlide>
        <SwiperSlide style={{display: "flex", justifyContent: "center"}}>
          <ProductCard
            imageSrc="/desk.jpg"
            imageAlt="Product 1"
            title="محصول 1"
            description="توضیحات محصول 1"
            price="100000000"
            onAddToCart={() => alert("محصول 1 به سبد خرید اضافه شد!")}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ width: "100%", height: "auto" }}
          />
        </SwiperSlide>
        <SwiperSlide style={{display: "flex", justifyContent: "center"}}>
          <ProductCard
            imageSrc="/desk.jpg"
            imageAlt="Product 1"
            title="محصول 1"
            description="توضیحات محصول 1"
            price="100000000"
            onAddToCart={() => alert("محصول 1 به سبد خرید اضافه شد!")}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ width: "100%", height: "auto" }}
          />
        </SwiperSlide>
        <SwiperSlide style={{display: "flex", justifyContent: "center"}}>
          <ProductCard
            imageSrc="/desk.jpg"
            imageAlt="Product 1"
            title="محصول 1"
            description="توضیحات محصول 1"
            price="100000000"
            onAddToCart={() => alert("محصول 1 به سبد خرید اضافه شد!")}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ width: "100%", height: "auto" }}
          />
        </SwiperSlide>
        <SwiperSlide style={{display: "flex", justifyContent: "center"}}>
          <ProductCard
            imageSrc="/desk.jpg"
            imageAlt="Product 1"
            title="محصول 1"
            description="توضیحات محصول 1"
            price="100000000"
            onAddToCart={() => alert("محصول 1 به سبد خرید اضافه شد!")}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ width: "100%", height: "auto" }}
          />
        </SwiperSlide>
        <SwiperSlide style={{display: "flex", justifyContent: "center"}}>
          <ProductCard
            imageSrc="/desk.jpg"
            imageAlt="Product 1"
            title="محصول 1"
            description="توضیحات محصول 1"
            price="100000000"
            onAddToCart={() => alert("محصول 1 به سبد خرید اضافه شد!")}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ width: "100%", height: "auto" }}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default NewestProducts;
