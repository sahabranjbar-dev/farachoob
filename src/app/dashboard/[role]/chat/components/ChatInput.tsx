"use client";

import { Button } from "@/components/ui/button";
import { Message } from "@/types/common";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useChat } from "../../../../../../stores";
import useDataGetter from "@/hooks/useDataGetter";
import { memo } from "react";
import { v4 as uuid } from "uuid";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

type FormValues = {
  message: string;
};

const ChatInput = memo(() => {
  const { register, handleSubmit, reset, watch } = useForm<FormValues>();
  const session = useSession();
  const senderId = session.data?.user.id;
  const { conversation, setDashboardChatMessage, socket, messages } = useChat();
  const conversationId = conversation?.id;

  const { fetch: postMessage } = useDataGetter({
    url: `/dashboard/conversations/messages`,
    params: { conversationId },
    method: "POST",
    immediatelyFetch: false,
  });

  const onSubmit = (data: FormValues) => {
    if (!data.message.trim() || !conversationId) return;

    const randomId = uuid();
    const tempId = "temp-" + randomId;
    const tempMessage: Message = {
      content: data.message,
      senderId,
      tempId,
    };

    setDashboardChatMessage([...messages, { ...tempMessage, loading: true }]);
    reset();

    postMessage?.({
      inputBody: { content: data.message },
    })
      .then((savedMessage) => {
        if (!savedMessage?.id) return;

        socket?.emit("send-message-to-sticky", {
          ...savedMessage,
          senderId,
          content: savedMessage.content,
          conversationId,
          createdAt: savedMessage.createdAt ?? new Date().toISOString(),
          read: false,
          recipients: savedMessage.recipients,
          loading: false,
        });
        setDashboardChatMessage((prev) => {
          const resolvedMessage = prev.filter((item) => item.tempId !== tempId);

          return [...resolvedMessage, savedMessage];
        });
      })
      .catch((err) => {
        console.error("Failed to send message:", err);

        setDashboardChatMessage((prev) =>
          prev.map(
            (item) =>
              item.tempId === tempId
                ? { ...item, failed: true } // پیام failed میشه
                : item // بقیه پیام‌ها همونطور بمونن
          )
        );
      });
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 max-w-full bg-white border-t">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 p-3"
      >
        <Textarea
          placeholder="پیام خود را بنویسید..."
          className="flex-1 resize-none rounded-xl border px-3 py-2 shadow-inner focus:ring-2 focus:ring-indigo-400 transition"
          {...register("message", { required: true })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
        />

        <Button
          disabled={!watch("message")?.trim()}
          type="submit"
          className="rounded-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 disabled:opacity-50"
          left={<Send />}
        >
          ارسال
        </Button>
      </form>
    </div>
  );
});

export default ChatInput;
