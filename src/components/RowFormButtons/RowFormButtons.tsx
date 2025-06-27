import React from "react";
import { Button } from "../ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import { IRowFormButtons } from "./meta/types";
import useParams from "@/hooks/useParams";
import { useRouter } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useDataGetter from "@/hooks/useDataGetter";
import { toast } from "sonner";
import { usetabular } from "@/hooks/useTabular";

const RowFormButtons = ({ id, formPath }: IRowFormButtons) => {
  const { closeCurrentTab } = usetabular();
  const { setActiveParam } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const pathType = pathname.split("/")[pathname.split("/").length - 1];
  const { data, fetch: deleteMenu } = useDataGetter({
    url: `/dashboard/menus/${id}`,
    immediatelyFetch: false,
  });
  const deleteMenuHandler = () => {
    deleteMenu?.({});
  };
  return (
    <div className="flex justify-center items-center gap-4">
      <PencilLine
        className="text-blue-500 cursor-pointer hover:bg-blue-100 transition-colors duration-300 rounded-full h-6 w-6 p-2 box-content"
        onClick={() => {
          router.push(`${pathname}/${pathType}Form?id=${id}&pageType=EDIT`);
        }}
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Trash2 className="text-red-500 cursor-pointer hover:bg-red-100 transition-colors duration-300 rounded-full h-6 w-6 p-2 box-content" />
        </AlertDialogTrigger>
        <AlertDialogContent dir="rtl" className="text-right">
          <AlertDialogHeader>
            <AlertDialogTitle>آیا از حذف مطمئن هستید؟</AlertDialogTitle>
            <AlertDialogDescription>
              این عملیات قابل بازگشت نیست. با انجام آن، منو به صورت دائمی حذف
              خواهد شد و داده‌های مربوط به آن از سیستم پاک می‌شوند.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeCurrentTab}>
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction
              className="variant-primary"
              onClick={deleteMenuHandler}
            >
              تایید و حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RowFormButtons;
