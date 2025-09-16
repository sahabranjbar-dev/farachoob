import { ArrowRight } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { useStickyChat } from "../../../stores/stickyChat";

const ChatHeader = () => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const { setConversationData, conversationData } = useStickyChat();
  const admin = useMemo(() => {
    return conversationData?.participants?.filter(
      (item) =>
        item.user.role?.englishTitle === "manager" ||
        item.user.role?.englishTitle === "admin"
    );
  }, [conversationData]);
  return (
    <div className="w-full bg-[#273F4F] p-2 flex justify-start items-center">
      <div
        className="p-2"
        onClick={() => {
          setShowConfirm(true);
        }}
      >
        <span className="cursor-pointer">
          <ArrowRight
            color="white"
            size={22}
            className="hover:translate-x-1.5 transition-transform duration-300"
          />
        </span>
      </div>

      <div className="flex flex-col justify-start items-center flex-1">
        <span className="text-white">
          پشتیبان سایت ، {admin?.[0]?.user?.firstName}
        </span>
        <div className="flex justify-center items-center gap-2">
          <span className="text-gray-400">آنلاین</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] backdrop-blur-md">
          <div className="bg-white rounded-xl p-6 shadow-lg w-[300px] text-center">
            <p className="mb-6 text-gray-800 font-medium">
              آیا مطمئن به بازگشت هستید؟
            </p>
            <div className="flex justify-center gap-4">
              <Button
                type="button"
                onClick={() => {
                  setConversationData(null);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                بله
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                خیر
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
