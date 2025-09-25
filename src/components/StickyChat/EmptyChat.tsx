import React, { useMemo } from "react";
import { useStickyChat } from "../../../stores/stickyChat";
import EmptyMessage from "@/assets/EmptyMessage";

const EmptyChat = () => {
  const { conversationData } = useStickyChat();
  const userData = useMemo(() => {
    return conversationData?.participants?.filter(
      (item) =>
        item?.user?.role?.englishTitle !== "manager" &&
        item?.user?.role?.englishTitle !== "admin"
    );
  }, [conversationData]);
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <p>{userData?.[0]?.user?.firstName} عزیز ، خوش آمدید</p>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-8">
        پیامی وجود ندارد
      </h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-[60%] text-wrap">
        هنوز گفتگویی شروع نشده است
        <br />
        یک پیام بفرستید یا منتظر پاسخ باشید.
      </p>
      <EmptyMessage className="animate-caret-blink" />
    </div>
  );
};

export default EmptyChat;
