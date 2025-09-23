import { Article } from "@/types/common";
import BestSellingProducts from "../../components/BestSellingProducts";
import MainArticleContent from "./MainArticleContent";

interface Props {
  data: any;
}

const ArticlePage = ({ data: article }: Props) => {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* بخش اصلی مقاله */}
        <MainArticleContent article={article} />

        {/* سایدبار */}
        <aside className="lg:col-span-2">
          <div className="border rounded-2xl shadow-lg p-4 sticky top-28">
            <h3 className="font-bold text-gray-700 dark:text-gray-100 mb-4">
              محصولات پرفروش
            </h3>
            <BestSellingProducts />
          </div>
        </aside>
      </div>
    </main>
  );
};

export default ArticlePage;
