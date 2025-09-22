"use client";
import SupportSvg from "@/assets/Support";
import clsx from "clsx";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useStickyChat } from "../../../stores/stickyChat";
import ConversationContainer from "./ConversationContainer";
import StickyChatContainer from "./StickyChatContainer";
import StickyChatWelcomeContent from "./StickyChatWelcomeContent";

const StickyChat = () => {
  const pathname = usePathname();

  const chatRef = useRef<HTMLDivElement | null>(null);

  const stickyChatContainerRef = useRef<HTMLDivElement | null>(null);

  const { setShowChat, showChat, showCTA, setShowCTA } = useStickyChat();

  const conversationData = useStickyChat((state) => state.conversationData);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (showChat) return;

      setShowCTA(true);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [showChat]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!showChat) return;

      // اگر کلیک داخل دکمه یا داخل محتوای چت بود، نادیده بگیر
      if (
        chatRef.current?.contains(e.target as Node) ||
        stickyChatContainerRef.current?.contains(e.target as Node)
      ) {
        return;
      }

      // کلیک بیرون → بستن چت
      setShowChat(false);
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showChat, setShowChat]);

  if (pathname.includes("dashboard") || pathname.includes("auth")) return;

  return (
    <div
      ref={chatRef}
      className="fixed z-[50] bottom-24 right-2 md:bottom-5 md:right-5 bg-blue-400 w-20 h-20 rounded-full flex justify-center items-center "
    >
      <div
        onClick={() => setShowChat(!showChat)}
        className="relative h-full w-full cursor-pointer hover:scale-110 transition-transform duration-150"
      >
        <X
          size={50}
          className={clsx(
            "absolute text-white top-[50%] left-[50%] -translate-x-[50%]  -translate-y-[50%] transition-transform duration-500",
            showChat ? "rotate-180 opacity-100" : "rotate-0 opacity-0"
          )}
        />

        <SupportSvg
          className={clsx(
            "w-14 h-14 absolute top-[50%] left-[50%] -translate-x-[50%]  -translate-y-[50%] transition-opacity duration-300",
            showChat ? "opacity-0" : "opacity-100"
          )}
        />
      </div>
      <StickyChatContainer ref={stickyChatContainerRef}>
        {conversationData?.id ? (
          <ConversationContainer />
        ) : (
          <StickyChatWelcomeContent />
        )}
      </StickyChatContainer>
      <div
        className={clsx(
          "text-xs p-4 w-50 h-24 bg-white border rounded-2xl shadow-lg transition-all duration-300 ease-in-out absolute bottom-24 right-10",
          showCTA
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-0 translate-y-4 pointer-events-none"
        )}
      >
        <div className="relative">
          به فراچوب خوش آمدید
          <br />
          {/* من، دستیار مجازی شما هستم. 🤖
        <br /> */}
          برای ارتباط آنلاین با پشتیبانی و تیم فروش روی دکمه پشتیبانی کلیک کنید.
          <X
            className="absolute -left-5 -top-5 hover:border rounded-full transition-all duration-200 cursor-pointer opacity-30 hover:bg-white hover:scale-150 hover:opacity-100"
            size={18}
            onClick={() => {
              setShowCTA(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StickyChat;
