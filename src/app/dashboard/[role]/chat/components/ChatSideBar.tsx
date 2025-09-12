"use client";
import React, { PropsWithChildren, useState } from "react";
import ChatList from "./ChatList";
import { UsersRound } from "lucide-react";
import { clsx } from "clsx";

interface Props {}

const ChatSideBar = ({ children }: PropsWithChildren<Props>) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <div className={clsx("w-2/4 h-full", { "w-10": !open })}>
      <UsersRound onClick={() => setOpen(!open)} className="m-2 " />
      {open && <div className="h-full border">{children}</div>}
    </div>
  );
};

export default ChatSideBar;
