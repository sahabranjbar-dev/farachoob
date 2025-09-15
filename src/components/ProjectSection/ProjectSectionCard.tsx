"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import "./assets/ProjectSectionCard.css";

export interface Projects {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  createdAt: Date;
  updateAt: Date;
  active: boolean;
  userId: string;
  authorId: string;
}
[];

interface Props {
  projects: Projects[];
}

const ProjectSectionCard = ({ projects }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="project-slider-container">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="project-swiper"
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1.2,
          },
          1024: {
            slidesPerView: 1.5,
          },
        }}
      >
        {projects?.map((item, index) => (
          <SwiperSlide key={item.id || index}>
            <div className="project-card">
              <div className="image-container">
                <Image
                  alt={item.title}
                  src={item.images[0] || "/images/placeholder.png"}
                  fill
                  className="project-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
                <div className="image-overlay"></div>
                <div className="project-number">{index + 1}</div>
              </div>

              <div className="project-content dark:text-white">
                <h3 className="project-title line-clamp-1 ">{item.title}</h3>
                <p className="project-description line-clamp-2">
                  {item.description}
                </p>

                <Link
                  href={`/projects/${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  جزئیات پروژه
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 7L10 12L15 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProjectSectionCard;
