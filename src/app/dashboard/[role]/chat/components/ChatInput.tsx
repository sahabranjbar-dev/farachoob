"use client";

import { Button } from "@/components/ui/button";
import useDataGetter from "@/hooks/useDataGetter";
import { useSession } from "next-auth/react";
import { KeyboardEventHandler, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useChat } from "../../../../../../stores";
import { Message } from "@/types/common";

type FormValues = {
  message: string;
};

const ChatInput = () => {
  const { register, handleSubmit, reset, watch } = useForm<FormValues>();
  const session = useSession();

  const senderId = session.data?.user.id;
  const { conversation, setMessages, socket, messages, postMessage } =
    useChat();
  const conversationId = conversation?.id;

  // Merge saved message into current messages
  const mergeMessages = (savedMessage: Message) => {
    console.log({ savedMessage });

    if (!messages.length) return [savedMessage];
    console.log({ messages });

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.loading && lastMessage.content === savedMessage.content) {
      return [...messages.slice(0, -1), { ...savedMessage, loading: false }];
    }
    return [...messages, savedMessage];
  };

  const onSubmit = (data: FormValues) => {
    const tempMessage: Message = {
      id: "temp-" + Date.now(),
      content: data.message,
      senderId,
    };

    if (!data.message.trim() || !conversationId) return;

    setMessages([...messages, { ...tempMessage, loading: true }]);
    reset();

    postMessage?.({ content: data.message })
      .then((savedMessage) => {
        console.log({ savedMessage }, "postmessage on submit");
        if (!savedMessage?.id) return;

        // Send to socket
        socket?.emit("send-message", {
          ...savedMessage,
          senderId,
          content: savedMessage.content,
          conversationId,
          createdAt: savedMessage.createdAt ?? new Date().toISOString(),
          read: false,
          recipients: savedMessage.recipients,
          loading: false,
        });
        console.log(mergeMessages(savedMessage), "mergeMessages(savedMessage)");

        setMessages(mergeMessages(savedMessage));
      })
      .catch((err) => {
        console.error("Failed to send message:", err);
        setMessages([...messages, { ...tempMessage, failed: true }]);
      });
  };

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
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
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
