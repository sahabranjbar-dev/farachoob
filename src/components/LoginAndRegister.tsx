import React from "react";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  nameSpace: string;
}
const LoginAndRegister = ({ nameSpace }: Props) => {
  const t = useTranslations(nameSpace);
  return (
    <div>
      <Button
        variant="ghost"
        className="flex justify-center items-center flex-row-reverse border cursor-pointer"
      >
        <LogIn className="rotate-180" />
        <span>{t("Login") + " / " + t("Register")}</span>
      </Button>
    </div>
  );
};

export default LoginAndRegister;
