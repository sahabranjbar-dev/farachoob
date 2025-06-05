import Image from "next/image";
import React from "react";
import arrow from "@/assets/arrow.svg";
import Arrow from "@/assets/Arrow";
import { cn } from "@/lib/utils";

interface Props {
  item?: { id: number; title: string; description: string; icon: string };
  length: number;
}
const TrustCard = ({
  item = { id: 0, title: "", description: "", icon: "" },
  length,
}: Props) => {
  const { id, title, description, icon } = item;
  return (
    <div className="select-none md:flex md:flex-row relative max-w-[736px] flex flex-col items-center gap-5 mx-8 p-5 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="md:w-[70%] flex justify-center items-center gap-3 mb-5">
        <Image
          src={icon}
          alt={title}
          width={350}
          height={350}
          className="md:w-[350px] w-[100px] h-[100px] object-contain"
        />
      </div>

      <div>
        <h4 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          {title}
        </h4>
        <p className="text-neutral-500 pt-2 ">{description}</p>
      </div>

      <div
        className={cn("absolute -bottom-25 hidden md:block", {
          "-left-25": id % 2 === 0 && id !== 0,
          "-right-25": id % 2 !== 0 || id === 0,
          "md:hidden": id === length,
        })}
      >
        <div className={id % 2 === 0 && id !== 0 ? "scale-x-[-1]" : ""}>
          <Arrow />
        </div>
      </div>
    </div>
  );
};

export default TrustCard;
