"use client";

import HeroSection from "@/components/HeroSection";
import MakeTrust from "@/components/MakeTrust";
import NewestProducts from "@/components/NewestProducts";
import Services from "@/components/Services";
import Slider from "@/components/Slider";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function HomePage() {
  const t = useTranslations("HomePage");

  const items = useMemo(
    () => [
      {
        src: "/1-18.jpg",
        alt: "Slide 1",
        width: 500,
        height: 300,
      },
      {
        src: "/3-12.jpg",
        alt: "Slide 2",
        width: 500,
        height: 300,
      },
      {
        src: "/1-18.jpg",
        alt: "Slide 3",
        width: 500,
        height: 300,
      },
    ],
    []
  );

  return (
    <div className="">
      <div className="container mx-auto border m-4 mt-0 rounded-b-2xl overflow-hidden">
        {/* <Slider intems={items} /> */}

        <HeroSection />
      </div>
      <MakeTrust />
      <Services />

      <NewestProducts />
    </div>
  );
}
