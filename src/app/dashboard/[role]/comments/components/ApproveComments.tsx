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
  Heart,
  Reply,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface UserInfo {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
}

interface ReplyInfo {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  userId: string;
  user?: UserInfo;
}

interface CommentInfo {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  user: UserInfo;
  parent?: {
    id: string;
    content: string;
    user: UserInfo;
    likes: Array<{ id: string }>;
    replies: ReplyInfo[];
    createdAt: string;
  };
  likes: Array<{ id: string }>;
  rowNumber?: number;
}

interface ApproveCommentsProps {
  comment: CommentInfo;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  className?: string;
}

const ApproveComments: React.FC<ApproveCommentsProps> = ({
  comment,
  onApprove,
  onReject,
  className,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllReplies, setShowAllReplies] = useState(false);

  const handleAction = async (actionType: "approve" | "reject") => {
    if (!onApprove || !onReject) return;

    try {
      setIsLoading(true);
      setError(null);

      await (actionType === "approve"
        ? onApprove(comment.id)
        : onReject(comment.id));
      setIsDialogOpen(false);
    } catch (err) {
      setError("خطا در انجام عملیات. لطفاً دوباره تلاش کنید.");
      console.error("Operation failed:", err);
    } finally {
      setIsLoading(false);
    }
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

  // فیلتر کردن پاسخ‌های غیر از کامنت جاری
  const otherReplies =
    comment.parent?.replies?.filter((reply) => reply.id !== comment.id) || [];

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
        className={className}
        size="sm"
      >
        <MessageSquare className="w-4 h-4 ml-2" />
        مدیریت کامنت
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              مدیریت نظر کاربر
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* اطلاعات کامنت اصلی */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="w-4 h-4" />
                  اطلاعات نظر
                </h3>
                <Badge variant="secondary">#{comment.rowNumber || "N/A"}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">نام کاربر:</span>
                    <span>
                      {comment.user.firstName} {comment.user.lastName || ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">تاریخ ارسال:</span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {comment.likes.length} لایک
                  </Badge>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border">
                <p className="text-foreground leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </section>

            {/* کامنت والد */}
            {comment.parent && (
              <>
                <Separator />
                <section className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2 text-muted-foreground">
                    <Reply className="w-4 h-4" />
                    پاسخ‌های کامنت والد
                  </h4>

                  {/* کامنت والد */}
                  <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {comment.parent.user.firstName}{" "}
                        {comment.parent.user.lastName || ""}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.parent.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm mb-3">{comment.parent.content}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {comment.parent.likes.length} لایک
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {comment.parent.replies.length} پاسخ
                      </span>
                    </div>
                  </div>

                  {/* سایر پاسخ‌ها به کامنت والد */}
                  {otherReplies.length > 0 && (
                    <Collapsible
                      open={showAllReplies}
                      onOpenChange={setShowAllReplies}
                      className="space-y-3"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 px-0"
                        >
                          {showAllReplies ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                          <span className="text-sm">
                            نمایش سایر پاسخ‌ها ({otherReplies.length})
                          </span>
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="space-y-3">
                        {otherReplies.map((reply, index) => (
                          <div
                            key={reply.id}
                            className={`p-3 rounded-lg border ${
                              reply.id === comment.id
                                ? "bg-primary/10 border-primary"
                                : "bg-muted/20"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-xs">
                                {reply.user?.firstName || "کاربر"}{" "}
                                {reply.user?.lastName || ""}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm">{reply.content}</p>
                            {reply.id === comment.id && (
                              <Badge
                                variant="secondary"
                                className="mt-2 text-xs"
                              >
                                کامنت جاری
                              </Badge>
                            )}
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </section>
              </>
            )}

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
              disabled={isLoading}
              className="sm:order-3"
            >
              انصراف
            </Button>

            <div className="flex gap-2 sm:order-2">
              <Button
                variant="destructive"
                onClick={() => handleAction("reject")}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4 ml-2" />
                ) : null}
                رد نظر
              </Button>

              <Button
                variant="default"
                onClick={() => handleAction("approve")}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4 ml-2" />
                ) : null}
                تایید نظر
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApproveComments;
