import { Link } from "@/i18n/navigation";
import BestSellingProductsCard from "./BestSellingProductsCard";

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
}

export default async function BestSellingProducts() {
  const products = await prisma?.product.findMany({
    take: 3,
  });

  if (!products || products.length === 0) {
    return <p className="text-gray-500 text-sm">محصولی یافت نشد.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {products.map((item) => (
        <Link href={`/products/${item?.id}`} key={item?.id} target="_blank">
          <BestSellingProductsCard key={item.id} product={item} />
        </Link>
      ))}
    </div>
  );
}
