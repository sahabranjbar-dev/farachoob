"use client";
import React, { forwardRef } from "react";
import { useStickyChat } from "../../../stores/stickyChat";
import clsx from "clsx";
import { X } from "lucide-react";
import StickyChatContent from "./StickyChatContent";
import ConversationContainer from "./ConversationContainer";

const StickyChatContainer = forwardRef<HTMLDivElement>(({}, ref) => {
  const { showChat, setShowChat, conversationData } = useStickyChat();
  return (
    <div
      ref={ref}
      className={clsx(
        "overflow-scroll absolute md:bottom-10 md:right-24 bottom-5 right-4 w-[90vw] max-w-md h-[70vh] bg-white border rounded-2xl shadow-lg transition-all duration-300 ease-in-out ",
        showChat
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-4 pointer-events-none"
      )}
    >
      <div className="relative md:hidden">
        <span
          className=" absolute top-4 right-2"
          onClick={() => {
            setShowChat(false);
          }}
        >
          <X color="white" />
        </span>
      </div>
      {conversationData?.id ? (
        <>
          <ConversationContainer />
        </>
      ) : (
        <StickyChatContent />
      )}
    </div>
  );
});

export default StickyChatContainer;
