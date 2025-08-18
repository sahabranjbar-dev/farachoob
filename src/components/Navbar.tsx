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
      { id: "products", title: "محصولات", url: "/products", icon: Sofa },
      { id: "services", title: "خدمات", url: "/services", icon: LampDesk },
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
    </nav>
  );
};

export default Navbar;
