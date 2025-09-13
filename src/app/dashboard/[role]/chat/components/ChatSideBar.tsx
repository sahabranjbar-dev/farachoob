"use client";

import React, { PropsWithChildren, useState } from "react";
import ChatList from "./ChatList";
import { UsersRound } from "lucide-react";
import clsx from "clsx";

interface Props {}

const ChatSideBar = ({ children }: PropsWithChildren<Props>) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <div
      className={clsx(
        "h-full border-l transition-all duration-300 flex flex-col",
        open ? "w-1/4" : "w-12"
      )}
    >
      <UsersRound
        onClick={() => setOpen(!open)}
        className="m-2 cursor-pointer"
      />
      {open && (
        <div className="flex-1 h-[calc(100%-40px)] overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default ChatSideBar;
