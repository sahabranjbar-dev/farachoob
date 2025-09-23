import Link from "next/link";
import BestSellingProductsCard from "./BestSellingProductsCard";
import prisma from "@/lib/prisma";

export interface Product {
  id: string;
  farsiTitle: string;
  englishTitle?: string | null;
  price?: number | null;
  image?: string | null;
  stock?: number | null;
  createdAt?: string | Date;
  updateAt?: string | Date | null;
  description?: string | null;
  colors?: any[];
  comments?: any[];
  brandId?: string | null;
  categoryId?: string | null;
  variations?: variations[];
}

export interface variations {
  images: Image[];
}

export interface Image {
  id: string;
  url: string;
  variationId: string;
}

export default async function BestSellingProducts() {
  const products = await prisma?.product.findMany({
    take: 3,
    include: {
      variations: {
        select: {
          images: true,
        },
      },
    },
  });

  if (!products || products.length === 0) {
    return <p className="text-gray-500 text-sm">محصولی یافت نشد.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-2 dark:bg-gray-600 p-3 rounded-md">
      {products.map((item) => (
        <Link href={`/products/${item?.id}`} key={item?.id} target="_blank">
          <BestSellingProductsCard key={item.id} product={item} />
        </Link>
      ))}
    </div>
  );
}
