import React from "react";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface Props {
  nameSpace: string;
}
const LoginAndRegister = ({ nameSpace }: Props) => {
  const t = useTranslations(nameSpace);
  return (
    <div>
      <Link
        href="/auth/login"
        className="flex justify-center items-center flex-row-reverse border cursor-pointer p-2 rounded-lg hover:bg-gray-300 transition-colors duration-300"
      >
        <LogIn className="rotate-180" />
        <span>{t("Login") + " / " + t("Register")}</span>
      </Link>
    </div>
  );
};

export default LoginAndRegister;
