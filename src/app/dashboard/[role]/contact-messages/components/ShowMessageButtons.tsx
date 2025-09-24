"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2,
  MessageSquare,
  User,
  Calendar,
  Mail,
  Phone,
  Check,
  X,
  Reply,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { useList } from "@/container/ListContainer/ListContainer";
import { toast } from "sonner";

interface MessageInfo {
  rowNumber: number;
  id: string;
  name: string;
  email: string;
  mobile: string;
  createdAt: string;
  message: string;
}

interface ShowMessageButtonsProps {
  message: MessageInfo;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  onReply?: (id: string, reply: string) => Promise<void>;
  className?: string;
}

const ShowMessageButtons: React.FC<ShowMessageButtonsProps> = ({
  message,
  onApprove,
  onReject,
  onReply,
  className,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReplySection, setShowReplySection] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const { fetch: refreshList } = useList();

  const handleReply = async () => {
    if (!onReply || !replyText.trim()) return;

    try {
      setIsReplying(true);
      setError(null);

      await onReply(message.id, replyText.trim());

      // ریست کردن فرم پاسخ
      setReplyText("");
      setShowReplySection(false);
      toast.success("پاسخ با موفقیت ارسال شد");

      // رفرش لیست در صورت نیاز
      refreshList?.({});
    } catch (err) {
      setError("خطا در ارسال پاسخ. لطفاً دوباره تلاش کنید.");
      console.error("Reply failed:", err);
    } finally {
      setIsReplying(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} کپی شد`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsDialogOpen(true)}
        className={clsx(
          className,
          "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
        )}
        size="sm"
      >
        <MessageSquare className="w-4 h-4 ml-2" />
        مشاهده و مدیریت
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 h-full mx-auto">
              <MessageSquare className="w-5 h-5" />
              <div className="text-2xl font-bold text-gray-900">
                مشاهده و مدیریت پیام
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* اطلاعات اصلی پیام */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="w-4 h-4" />
                  اطلاعات پیام
                </h3>
                <Badge variant="secondary" dir="ltr">
                  #{message.id.slice(12)}
                </Badge>
              </div>

              {/* اطلاعات کاربر */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 p-2 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">نام فرستنده:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{message.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(message.name, "نام")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">ایمیل:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{message.email}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(message.email, "ایمیل")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 p-2 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">شماره تماس:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${message.mobile}`}>{message.mobile}</a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          copyToClipboard(message.mobile, "شماره تماس")
                        }
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">تاریخ ارسال:</span>
                    </div>
                    <span className="text-xs">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* متن پیام */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  متن پیام:
                </h4>
                <div className="bg-muted/50 p-4 rounded-lg border max-h-60 overflow-y-auto">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {message.message}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* بخش پاسخ‌دهی */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Reply className="w-4 h-4" />
                  پاسخ به {message.email}
                </h3>
                <Button
                  variant={showReplySection ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setShowReplySection(!showReplySection)}
                >
                  {showReplySection ? "بستن" : "پاسخ دادن"}
                </Button>
              </div>

              {showReplySection && (
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                  <Textarea
                    placeholder="متن پاسخ خود را وارد کنید..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {replyText.length} کاراکتر
                    </span>
                    <Button
                      onClick={handleReply}
                      disabled={!replyText.trim() || isReplying}
                      className="flex items-center gap-2"
                    >
                      {isReplying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Reply className="w-4 h-4" />
                      )}
                      ارسال پاسخ
                    </Button>
                  </div>
                </div>
              )}
            </section>

            {/* نمایش خطا */}
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isReplying}
              className="sm:order-3"
              left={<X />}
            >
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShowMessageButtons;
