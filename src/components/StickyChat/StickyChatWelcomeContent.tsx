"use clinet";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Send,
  Smartphone,
} from "lucide-react";
import { useStickyChat } from "../../../stores/stickyChat";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PrePareForChatForm from "./PrePareForChatForm";
import { PHONE_NUMBER } from "./meta/constants";

const StickyChatWelcomeContent = () => {
  const setShowChatForm = useStickyChat((state) => state.setShowChatForm);
  const showChatForm = useStickyChat((state) => state.showChatForm);
  return (
    <div className="h-full w-full rounded-t-2xl shadow-lg relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#273F4F] to-[#335C67]  sticky top-0 left-0 right-0 z-20">
        <div className="flex items-center relative h-16 px-3">
          {showChatForm && (
            <button
              className="absolute right-3 p-2 rounded-full hover:bg-white/10 transition"
              onClick={() => setShowChatForm(false)}
            >
              <ArrowRight color="white" />
            </button>
          )}

          <div className="flex-1 flex justify-center items-center gap-3">
            <div className="flex -space-x-2">
              <Avatar className="ring-2 ring-white">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="ring-2 ring-white">
                <AvatarImage
                  src="https://github.com/leerob.png"
                  alt="@leerob"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar className="ring-2 ring-white">
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </div>

            <div className="ml-4 text-white">
              <span className="font-medium">پشتیبانی مشتریان</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-300 text-xs">آنلاین</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full h-full container bg-white">
        <div className="p-4">
          {showChatForm ? (
            <PrePareForChatForm />
          ) : (
            <>
              <p className="text-gray-700 font-semibold mt-5 mb-8 text-xl">
                شما میتوانید با راه‌های زیر با ما در ارتباط باشید:
              </p>

              <div className="grid gap-3">
                <button
                  onClick={() => {
                    window.open(`https://t.me/+${PHONE_NUMBER}`, "_blank");
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl border hover:bg-gray-50 transition cursor-pointer"
                >
                  <Send className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">تلگرام</span>
                </button>

                <button
                  onClick={() =>
                    window.open(`https://wa.me/+${PHONE_NUMBER}`, "_blank")
                  }
                  className="flex items-center gap-3 p-3 rounded-xl border hover:bg-gray-50 transition cursor-pointer"
                >
                  <Smartphone className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">واتساپ</span>
                </button>

                <button>
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    target="_blank"
                    className="flex items-center gap-3 p-3 rounded-xl border hover:bg-gray-50 transition"
                  >
                    <Phone className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">تماس تلفنی</span>
                  </a>
                </button>

                <button
                  onClick={() => setShowChatForm(true)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#273F4F] hover:bg-[#335C67] text-white font-medium transition shadow-md"
                >
                  <MessageCircle className="w-5 h-5" />
                  شروع چت آنلاین
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyChatWelcomeContent;
