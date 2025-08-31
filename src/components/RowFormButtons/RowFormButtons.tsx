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
import { usePathname } from "@/i18n/navigation";
import { PencilLine, Trash2 } from "lucide-react";
import { IRowFormButtons } from "./meta/types";
import useTabular from "@/hooks/useTabular";
import { useList } from "@/container/ListContainer/ListContainer";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import FullScreenLoading from "../FullScreenLoading";

const RowFormButtons = ({
  id,
  formPath,
  deleterUrl,
  title,
}: IRowFormButtons) => {
  const { open } = useTabular();

  const pathname = usePathname();

  const { fetch: refresh } = useList();

  const pathType = pathname.split("/")[pathname.split("/").length - 1];

  const { fetch: deleteMenu, loading } = useDataGetter({
    url: deleterUrl,
    method: "DELETE",
    immediatelyFetch: false,
    showError: true,
    showSuccessMessage: true,
  });
  const deleteMenuHandler = () => {
    deleteMenu?.({}).then(() => {
      refresh?.({});
    });
  };
  return (
    <div className="flex justify-center items-center gap-4">
      {loading && <FullScreenLoading />}
      <Tooltip>
        <TooltipTrigger>
          <PencilLine
            className="text-blue-500 cursor-pointer hover:bg-blue-100 transition-colors duration-300 rounded-full h-6 w-6 p-2 box-content"
            onClick={() => {
              const path = formPath
                ? `/${pathType}/${formPath}`
                : `/${pathType}/${pathType}Form`;
              open(path, `فرم ویرایش ${title ?? ""}`, {
                pageType: "EDIT",
                id,
              });
            }}
          />
        </TooltipTrigger>
        <TooltipContent>ویرایش</TooltipContent>
      </Tooltip>

      <AlertDialog>
        <Tooltip disableHoverableContent={loading}>
          <TooltipTrigger>
            <AlertDialogTrigger>
              <Trash2 className="text-red-500 cursor-pointer hover:bg-red-100 transition-colors duration-300 rounded-full h-6 w-6 p-2 box-content" />
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>حذف</TooltipContent>
        </Tooltip>
        <AlertDialogContent dir="rtl" className="text-right">
          <AlertDialogHeader>
            <AlertDialogTitle>آیا از حذف مطمئن هستید؟</AlertDialogTitle>
            <AlertDialogDescription>
              این عملیات قابل بازگشت نیست. با انجام آن، آیتم به صورت دائمی حذف
              خواهد شد و داده‌های مربوط به آن از سیستم پاک می‌شوند.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>بستن</AlertDialogCancel>
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
