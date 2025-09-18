import { Message } from "@/types/common";
import clsx from "clsx";
import { Check, CheckCheck, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef } from "react";
import { useChat } from "../../../stores";
import { useStickyChat } from "../../../stores/stickyChat";
import ChatHeader from "./ChatHeader";
import EmptyChat from "./EmptyChat";
import StickyChatInput from "./StickyChatInput";
import { markMessagesRead } from "@/lib/utils";
import useDataGetter from "@/hooks/useDataGetter";

const ConversationContainer = () => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const session = useSession();

  const userId = session.data?.user.id;

  const { messages, conversationData, setMessages } = useStickyChat();

  const { socket } = useChat();

  const { fetch: updateMessage } = useDataGetter({
    url: "/chat/conversation/messages/read",
    method: "PUT",
    immediatelyFetch: false,
    params: { conversationId: conversationData?.id },
  });

  const notRegisteredUserId = useMemo(() => {
    const users = conversationData?.participants?.find(
      (item) =>
        item.user.role?.englishTitle !== "manager" &&
        item.user.role?.englishTitle !== "admin"
    );

    return users?.user.id;
  }, [conversationData]);

  const senderId = userId ? userId : notRegisteredUserId;

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleNewMessage = (data: Message) => {
      setMessages((prev) => [...(prev ?? []), data]);
    };

    socket?.on("new-message-to-sticky", handleNewMessage);
    return () => {
      socket?.off("new-message-to-sticky", handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (data: {
      conversationId: string;
      messageId: string;
      userId: string;
    }) => {
      const messageId = data?.messageId;
      setMessages((prev) => {
        const resolvedMessage = markMessagesRead(prev, messageId);
        return resolvedMessage;
      });
    };

    socket?.on("admin-read-message", handleNewMessage);
    return () => {
      socket?.off("admin-read-message", handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    const chatContainer = lastMessageRef.current?.parentElement;
    if (!chatContainer) return;

    const atBottom =
      chatContainer.scrollHeight - chatContainer.scrollTop <=
      chatContainer.clientHeight + 50;

    if (atBottom) {
      requestAnimationFrame(() => {
        lastMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    }
  }, [messages]);

  // پیام‌های unread
  const unreadRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});
  const readMessages = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!messages?.length) return;
    if (!socket) return;

    const observers: IntersectionObserver[] = [];

    messages.forEach((msg: Message) => {
      // اگر قبلاً mark شده، ردش کن
      if (readMessages.current.has(msg.id ?? "")) return;

      const el = unreadRefs.current[msg.id ?? ""];
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            updateMessage?.({ inputBody: { id: msg.id } }).then(() => {
              socket?.emit("admin-message-read", {
                conversationId: conversationData?.id,
                userId,
                messageId: msg.id,
              });

              readMessages.current.add(msg.id ?? "");

              observer.disconnect();
            });
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [socket, conversationData?.id, userId, messages]);

  return (
    <div className="flex flex-col h-full relative">
      <ChatHeader />

      <div className=" h-full z-5 overflow-scroll mb-18 mx-2">
        {messages?.length ? (
          <ul className="mt-2 mb-4">
            {messages?.map((message, index) => {
              const isOwn = message?.senderId === senderId;
              const date = new Date(message?.createdAt ?? "");
              const time = `${date.getHours()}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
              return (
                <li
                  className={clsx("m-2")}
                  key={
                    message.id ||
                    message.tempId ||
                    `${message.content}-${index}`
                  }
                  ref={(el) => {
                    if (message.id) {
                      if (el) {
                        unreadRefs.current[message.id] = el; // اضافه کردن
                      } else {
                        delete unreadRefs.current[message.id]; // پاک کردن هنگام unmount
                      }
                    }
                  }}
                >
                  <div
                    className={clsx(
                      "p-2 rounded-2xl w-fit",
                      isOwn
                        ? " text-left ml-auto bg-indigo-500 text-white"
                        : "text-right mr-auto bg-gray-300"
                    )}
                  >
                    <div>{message.content}</div>
                    <div className="flex justify-end items-center gap-2">
                      {isOwn ? (
                        message.loading ? (
                          <Loader size={15} className="animate-spin" />
                        ) : message.read ? (
                          <CheckCheck size={15} />
                        ) : (
                          <Check size={15} />
                        )
                      ) : null}
                      <div className="text-xs">{time}</div>
                    </div>
                  </div>
                </li>
              );
            })}
            <div ref={lastMessageRef} />
          </ul>
        ) : (
          <EmptyChat />
        )}
      </div>

      <div className="absolute bottom-0 right-0 left-0 z-10 border-t p-2">
        <StickyChatInput />
      </div>
    </div>
  );
};

export default ConversationContainer;
