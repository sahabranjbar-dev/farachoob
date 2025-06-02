import { LogIn, ShoppingCart } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

const Header = () => {
  const t = useTranslations("Header");
  return (
    <header className="mt-4">
      <div className="p-4 border flex justify-between items-center flex-row-reverse rounded-lg shadow-lg">
        <div className="flex justify-end items-center gap-4">
          <ModeToggle />

          <LanguageSwitcher />
        </div>
        <div className="flex justify-between items-center flex-row-reverse gap-4 ">
          <Button
            variant="ghost"
            className="flex justify-center items-center flex-row-reverse border cursor-pointer"
          >
            <LogIn className="rotate-180" />
            <span>{t("login") + " | " + t("register")}</span>
          </Button>

          <Button variant="ghost" className="cursor-pointer">
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
