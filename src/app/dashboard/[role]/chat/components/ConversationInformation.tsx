"use client";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import useDataGetter from "@/hooks/useDataGetter";
import clsx from "clsx";
import {
  AlertCircle,
  Loader2,
  MessageSquare,
  MoreVertical,
  Phone,
  Shield,
  ShieldOff,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { PropsWithChildren, useState } from "react";
import { useChat } from "../../../../../../stores";

const ConversationInformation = ({ children }: PropsWithChildren) => {
  const session = useSession();
  const conversation = useChat((state) => state.conversation);
  const setUserInfo = useChat((state) => state.setUserInfo);
  const setConversations = useChat((state) => state.setConversations);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); // حالت بلاک شده

  const participant = conversation?.participants?.find(
    (item) => item.userId !== session.data?.user.id
  );

  if (!participant) return null;

  const handleDeleteChat = async () => {};

  const handleBlockUser = async () => {
    setIsBlocking(true);
    try {
    } finally {
      setIsBlocking(false);
    }
  };

  const handleReportUser = async () => {
    setIsReporting(true);
    try {
      // شبیه‌سازی درخواست API
    } finally {
      setIsReporting(false);
    }
  };

  const getInitials = (firstName = "", lastName = "") => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  };

  const { fetch: deleteConversation, loading: isDeleting } = useDataGetter({
    showError: true,
    immediatelyFetch: false,
    method: "DELETE",
    showSuccessMessage: true,
  });

  const { loading: getConversatioLoading, fetch: getConverSations } =
    useDataGetter({
      url: "/dashboard/conversations",
      onSuccess(data: any) {
        setConversations(data?.conversations);
      },
      params: {
        isSecure: true,
      },
    });
  const deleteConversationHandler = () => {
    deleteConversation?.({
      inputUrl: "/dashboard/conversations",
      inputBody: {
        id: conversation?.id,
      },
    }).then((data) => {
      if (!data?.success) return;

      setOpenDeleteDialog(false);
      setUserInfo(null);
      getConverSations?.({
        inputParams: {
          isSecure: true,
        },
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <MoreVertical size={18} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-3/5 md:max-h-fit p-0 overflow-scroll bg-white rounded-2xl shadow-xl">
        <DialogHeader className="p-6 pb-4 text-center space-y-4">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 border-4 border-slate-100">
              <AvatarImage
                src={participant.user?.image || "/images/placeholder.png"}
                alt={participant.user?.firstName || "User"}
                className="object-contain"
              />
              <AvatarFallback className="text-lg bg-gradient-to-r from-blue-100 to-purple-100">
                {getInitials(
                  participant.user?.firstName ?? "کاربر",
                  participant.user?.lastName ?? ""
                )}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-1 text-center">
            <DialogTitle className="text-xl font-bold">
              {participant.user?.firstName || "کاربر"}{" "}
              {participant.user?.lastName || ""}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {participant.user?.email || "ایمیل ثبت نشده"}
            </DialogDescription>
          </div>

          <div className="flex justify-center gap-2 pt-2">
            <div className="px-3 py-1 select-none cursor-default rounded-2xl border">
              {participant?.user?.role?.farsiTitle || "کاربر"}
            </div>
            <div
              className={clsx(
                "px-3 py-1 cursor-default select-none rounded-2xl border",
                isBlocked ? "bg-red-500" : "bg-green-500"
              )}
            >
              {isBlocked ? "بلاک شده" : "فعال"}
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="flex flex-col h-auto py-3 gap-2 hover:bg-blue-400 hover:text-white"
            >
              <MessageSquare size={18} />
              <span className="text-xs">چت</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-auto py-3 gap-2 hover:bg-indigo-400 hover:text-white"
            >
              <Phone size={18} />
              <span className="text-xs">تماس</span>
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium text-sm">اطلاعات تماس</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>موبایل: {participant.user?.mobile || "ثبت نشده"}</p>
              <p>ایمیل: {participant.user?.email || "ثبت نشده"}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 pb-4 ">
            <h4 className="font-medium text-sm">مدیریت مکالمه</h4>
            <div className="space-y-2 flex justify-evenly items-center flex-wrap gap-2">
              <AlertDialog
                onOpenChange={setOpenDeleteDialog}
                open={openDeleteDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 "
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                    حذف چت
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      آیا از انجام این کار مطمئن هستید؟
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      این عملیات قابل بازگشت نیست. این کار چت را به‌صورت دائمی
                      حذف کرده و داده‌های شما را از سرورهای ما پاک می‌کند.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>لغو</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteConversationHandler}>
                      ادامه
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger>
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2"
                    onClick={handleBlockUser}
                    disabled={isBlocking}
                  >
                    {isBlocking ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : isBlocked ? (
                      <ShieldOff size={18} />
                    ) : (
                      <Shield size={18} />
                    )}
                    {isBlocked ? "آنبلاک کاربر" : "بلاک کاربر"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger>
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    onClick={handleReportUser}
                    disabled={isReporting}
                  >
                    {isReporting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    گزارش کاربر
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationInformation;
