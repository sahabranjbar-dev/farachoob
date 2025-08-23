import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Props {
  id: string;
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
  imageWidth?: number;
  imageHeight?: number;
}
const ProductCard = ({
  imageSrc = "/images/placeholder.png",
  imageAlt = "Product Image",
  title = "Product Title",
  description = "Product description goes here.",
  className,
  style,
  imageWidth = 300,
  imageHeight = 300,
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
          {description + description + description + description}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
