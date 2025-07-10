"use client";

import {
  Armchair,
  Building2,
  FileUser,
  House,
  Newspaper,
  PhoneOutgoing,
  Sofa,
  Table,
  LampDesk,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import useDataGetter from "@/hooks/useDataGetter";

const Navbar = () => {
  const t = useTranslations("Navbar");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(1);
  const [isHoveringProducts, setIsHoveringProducts] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const productCategories = [
    {
      id: 1,
      name: "مبلمان اداری",
      icon: Sofa,
      url: "/products?category=office",
      content: [
        {
          id: 1,
          title: "مبل مدیریت",
          image: "/images/products/effydesk.jpg",
          description: "مبلمان باکیفیت برای محیط‌های اداری مدیریتی",
        },
        {
          id: 2,
          title: "مبل کارمندی",
          image: "/images/products/effydesk.jpg",
          description: "مبلمان ارگونومیک برای کارمندان",
        },
      ],
    },
    {
      id: 2,
      name: "میز مدیریتی",
      icon: Table,
      url: "/products?category=executive",
      content: [
        {
          id: 1,
          title: "میز بزرگ",
          image: "/images/products/effydesk.jpg",
          description: "میزهای مدیریتی با طراحی مدرن",
        },
        {
          id: 2,
          title: "میز کلاسیک",
          image: "/images/products/effydesk.jpg",
          description: "میزهای چوبی با طراحی کلاسیک",
        },
      ],
    },
    {
      id: 3,
      name: "صندلی کارمندی",
      icon: Armchair,
      url: "/products?category=chairs",
      content: [
        {
          id: 1,
          title: "صندلی چرخ‌دار",
          image: "/images/products/effydesk.jpg",
          description: "صندلی‌های اداری با قابلیت تنظیم ارتفاع",
        },
        {
          id: 2,
          title: "صندلی ساده",
          image: "/images/products/effydesk.jpg",
          description: "صندلی‌های ساده و ارزان قیمت",
        },
      ],
    },
    {
      id: 4,
      name: "میز کنفرانس",
      icon: LampDesk,
      url: "/products?category=conference",
      content: [
        {
          id: 1,
          title: "میز بیضی",
          image: "/images/products/effydesk.jpg",
          description: "میزهای کنفرانس با طراحی بیضی شکل",
        },
        {
          id: 2,
          title: "میز گرد",
          image: "/images/products/effydesk.jpg",
          description: "میزهای گرد برای جلسات گروهی",
        },
      ],
    },
  ];

  const { data, error, fetch, loading } = useDataGetter({
    url: "/categories",
    onSuccess(data) {
      const custom = data.map((item: any) => {
        return {
          id: item?.id,
          name: item?.farsiTitle,
          icon: item?.icon ?? <Fragment />,
          url: item?.englishTitle,
        };
      });

      setCategories(custom);
    },
  });

  console.log(data, "dataa");

  const selectedCategory = productCategories.find(
    (cat) => cat.id === activeCategoryId
  );

  const navItems = useMemo(
    () => [
      { id: "home", title: "خانه", url: "/", icon: House },
      {
        id: "representatives",
        title: "نمایندگان",
        url: "/representatives",
        icon: Building2,
      },
      { id: "blogs", title: "بلاگ‌ها", url: "/blogs", icon: Newspaper },
      {
        id: "contact",
        title: "تماس با ما",
        url: "/contact-us",
        icon: PhoneOutgoing,
      },
      { id: "about", title: "درباره ما", url: "/about-us", icon: FileUser },
    ],
    []
  );

  return (
    <nav className="hidden md:flex items-center gap-8 justify-center bg-white/10 backdrop-blur-sm font-medium px-6 py-3 rounded-full shadow-lg border border-white/20">
      {/* سایر صفحات */}
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={item.url}
          className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-300 group"
        >
          <item.icon
            size={18}
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-orange-400 after:transition-all after:duration-300 group-hover:after:w-full">
            {item.title}
          </span>
        </Link>
      ))}

      {/* منوی محصولات */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem
            onMouseEnter={() => setIsHoveringProducts(true)}
            onMouseLeave={() => setIsHoveringProducts(false)}
          >
            <NavigationMenuTrigger className="bg-transparent hover:text-orange-400 transition-colors duration-300 group">
              <div className="flex items-center gap-2">
                <Armchair
                  size={18}
                  className={`transition-transform duration-300 ${
                    isHoveringProducts ? "rotate-12" : ""
                  }`}
                />
                <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-orange-400 after:transition-all after:duration-300 group-hover:after:w-full">
                  محصولات
                </span>
              </div>
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <div className="flex flex-row-reverse min-w-[800px] max-w-screen  text-gray-800 py-2">
                {/* دسته‌بندی‌ها */}
                <ul className="w-[30%] h-full flex flex-col gap-3 items-end px-4 border-l-2 border-dashed border-gray-200">
                  {categories.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li
                        key={item.id}
                        onClick={() => setActiveCategoryId(item.id)}
                        className={cn(
                          "cursor-pointer text-right px-4 py-3 rounded-lg w-full text-sm transition-all flex items-center justify-end gap-3",
                          activeCategoryId === item.id
                            ? "bg-orange-500 text-white font-bold shadow-md"
                            : "bg-gray-100 hover:bg-gray-200 hover:shadow-sm"
                        )}
                      >
                        {item.name}
                        {/* <Icon size={16} /> */}
                      </li>
                    );
                  })}
                  <Link href="/products" className="w-full mt-2">
                    <li className="cursor-pointer text-right px-4 py-3 rounded-lg w-full text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow hover:shadow-md">
                      مشاهده همه محصولات
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </li>
                  </Link>
                </ul>

                {/* نمایش محصولات */}
                <div className="flex-1 px-6 grid grid-cols-2 gap-6">
                  {selectedCategory?.content?.map((product) => (
                    <Link
                      href={`${selectedCategory.url}&product=${product.id}`}
                      key={product.id}
                      className="group"
                    >
                      <div className="border rounded-2xl p-3 bg-white shadow hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
                        <div className="relative overflow-hidden rounded-lg h-40 mb-3">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="text-white text-sm font-medium">
                              {product.description}
                            </span>
                          </div>
                        </div>
                        <div className="text-center font-medium text-gray-800 group-hover:text-orange-500 transition-colors">
                          {product.title}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default Navbar;
