"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import styles from "./assets/ProjectSectionCard.module.css";

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

interface Props {
  projects: Projects[];
}

const ProjectSectionCard = ({ projects }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={`${styles.projectSliderContainer} ${styles.swiperWrapper}`}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 1.2 },
          1024: { slidesPerView: 1.5 },
        }}
      >
        {projects?.map((item, index) => (
          <SwiperSlide key={item.id || index}>
            <div className={styles.projectCard}>
              <div className={styles.imageContainer}>
                <Image
                  alt={item.title}
                  src={item.images[0] || "/images/placeholder.png"}
                  fill
                  className={styles.projectImage}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  unoptimized
                />
                <div className={styles.imageOverlay}></div>
                <div className={styles.projectNumber}>{index + 1}</div>
              </div>

              <div className={styles.projectContent}>
                <h3 className={styles.projectTitle}>{item.title}</h3>
                <p className={styles.projectDescription}>{item.description}</p>

                <Link
                  href={`/projects/${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectLink}
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
