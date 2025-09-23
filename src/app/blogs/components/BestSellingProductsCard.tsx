import Image from "next/image";
import { Product } from "./BestSellingProducts";

interface Props {
  product: Product;
}

export default function BestSellingProductsCard({ product }: Props) {
  return (
    <div className="flex flex-row-reverse items-start gap-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-4">
      {/* تصویر محصول */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
        <Image
          src={product.image || "/images/placeholder.png"}
          alt={product.farsiTitle}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* متن */}
      <div className="flex flex-col justify-between flex-1 text-right">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-1">
            {product.farsiTitle}
          </h3>
          {product.englishTitle && (
            <p className="text-sm text-gray-500">{product.englishTitle}</p>
          )}
          {product.description && (
            <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
