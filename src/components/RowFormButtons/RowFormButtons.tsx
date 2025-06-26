import React from "react";
import { Button } from "../ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import { IRowFormButtons } from "./meta/types";
import useParams from "@/hooks/useParams";
import { useRouter } from "next/navigation";
import { usePathname } from "@/i18n/navigation";

const RowFormButtons = ({ id, formPath }: IRowFormButtons) => {
  const { setActiveParam } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const pathType = pathname.split("/")[pathname.split("/").length - 1];

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          router.push(`${pathname}/${pathType}Form?id=${id}&pageType=EDIT`);
        }}
        // disabled={isSaving}
      >
        <PencilLine className="text-blue-500" />
      </Button>
      <Button
        variant="ghost"
        // onClick={() => toast.info("امکان حذف به زودی اضافه می‌شود.")}
        // disabled={isSaving}
      >
        <Trash2 className="text-red-500" />
      </Button>
    </>
  );
};

export default RowFormButtons;
