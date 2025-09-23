import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  id: string;
  imageSrc?: string;
  imageAlt: string;
  title?: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
  imageWidth?: number;
  imageHeight?: number;
}
const ProductCard = ({
  imageSrc = "/images/placeholder.png",
  imageAlt,
  title,
  description,
  className,
  style,
  imageWidth = 350,
  imageHeight = 500,
  id,
}: Props) => {
  return (
    <Link
      href={`/products/${id}`}
      className={cn("max-w-64 min-w-fit min-h-fit max-h-96", className)}
      style={style}
    >
      <div>
        {imageSrc ? (
          <Image
            alt={imageAlt}
            src={imageSrc}
            width={imageWidth}
            height={imageHeight}
            unoptimized
          />
        ) : (
          <Image
            alt="Default Product Image"
            src="/images/placeholder.png"
            width={imageWidth}
            height={imageHeight}
          />
        )}
      </div>
      <div>
        <h4 className="text-neutral-700 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          {title}
        </h4>
        <p className="text-neutral-500 pt-2 line-clamp-3 text-ellipsis">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
