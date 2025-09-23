"use client";
import clsx from "clsx";
import { X } from "lucide-react";
import { forwardRef, PropsWithChildren } from "react";
import { useStickyChat } from "../../../stores/stickyChat";

const StickyChatContainer = forwardRef<HTMLDivElement, PropsWithChildren>(
  ({ children }, ref) => {
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
        {children}
      </div>
    );
  }
);

StickyChatContainer.displayName = "StickyChatContainer";
export default StickyChatContainer;
