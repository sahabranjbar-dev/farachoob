import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Props {
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  price?: string;
  onAddToCart?: () => void;
  className?: string;
  style?: React.CSSProperties;
  imageWidth?: number;
  imageHeight?: number;
}
const ProductCard = ({
  imageSrc = "/default-product.jpg",
  imageAlt = "Product Image",
  title = "Product Title",
  description = "Product description goes here.",
  price = "$99.99",
  onAddToCart = () => alert("Added to cart!"),
  className,
  style,
  imageWidth = 300,
  imageHeight = 300,
}: Props) => {
  return (
    <div
      className={cn("max-w-64 min-w-fit min-h-fit max-h-96", className)}
      style={style}
    >
      <div>
        <Image
          alt={imageAlt}
          src={imageSrc}
          width={imageWidth}
          height={imageHeight}
        />
      </div>
      <div>
        <h4 className="text-neutral-700 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          {title}
        </h4>
        <p className="text-neutral-500 pt-2">{description}</p>
        <p className="text-neutral-600 text-lg font-bold pt-2">{price}</p>
        <button
          onClick={onAddToCart}
          className="text-neutral-200 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-nowrap"
        >
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
