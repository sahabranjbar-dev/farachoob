"use client";

import { Button } from "@/components/ui/button";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ChatContext } from "../container/ChatContainer";
import { useSocket } from "../container/SocketContainer";
import { useSession } from "next-auth/react";
import useDataGetter from "@/hooks/useDataGetter";
import { Message } from "./ChatMessages";

type FormValues = {
  message: string;
};

const ChatInput = () => {
  const { register, handleSubmit, reset, watch, setValue } =
    useForm<FormValues>();
  const { conversationId, setMessages } = useContext(ChatContext);
  const socket = useSocket();
  const session = useSession();

  const senderId = session.data?.user.id;

  const { fetch: postMessage } = useDataGetter<Message>({
    url: `/dashboard/conversations/${conversationId}/messages`,
    immediatelyFetch: false,
    method: "POST",
  });

  const onSubmit = (data: FormValues) => {
    if (!data.message.trim() || !conversationId) return;

    setMessages((prev) => [
      ...prev,
      {
        content: data?.message,
        loading: true,
        senderId,
        id: "temp-" + Date.now(),
      },
    ]);

    postMessage?.({
      inputBody: {
        content: data.message,
      },
    }).then((data) => {
      if (data.id)
        socket?.emit("send-message", {
          senderId,
          content: data.content,
          conversationId,
          createdAt: data?.createdAt,
        });
    });

    reset();
  };

  // Handle Enter key (Enter = send, Shift+Enter = newline)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }
    };

    const textarea = document.querySelector<HTMLTextAreaElement>(
      "textarea[name='message']"
    );
    textarea?.addEventListener("keydown", handleKeyDown);

    return () => {
      textarea?.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit, onSubmit]);

  return (
    <div className="absolute bottom-0 left-0 right-0 max-w-full bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center justify-between gap-2 border-t p-4"
      >
        <textarea
          placeholder="پیام خود را اینجا بنویسید..."
          className="w-full resize-none rounded border p-2 break-words whitespace-pre-wrap"
          {...register("message", { required: true })}
          wrap="soft"
        />
        <Button
          disabled={!watch("message")}
          type="submit"
          className="rounded-2xl bg-indigo-500 text-white hover:bg-indigo-600 disabled:cursor-not-allowed"
        >
          ارسال
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
