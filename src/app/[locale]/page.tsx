"use client";

import Navbar from "@/components/Navbar";
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
      <Slider intems={items} />
    </div>
  );
}
