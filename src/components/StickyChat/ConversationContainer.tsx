import useDataGetter from "@/hooks/useDataGetter";
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
import { emitSocket } from "@/lib/socket";

const ConversationContainer = () => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const observedMessages = useRef(new Set<string>());
  const messagesRefs = useRef<(HTMLLIElement | null)[]>([]);

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
        item?.user?.role?.englishTitle !== "manager" &&
        item.user?.role?.englishTitle !== "admin"
    );

    return users?.user?.id;
  }, [conversationData]);

  const senderId = userId ? userId : notRegisteredUserId;

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleNewMessage = (data: Message) => {
      setMessages((prev) => [...(prev ?? []), data]);
    };

    socket?.on("new-message", handleNewMessage);
    return () => {
      socket?.off("new-message", handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry: any) => {
          const messageId = entry.target?.dataset?.messageId;
          if (
            entry.isIntersecting &&
            !observedMessages.current.has(messageId)
          ) {
            observedMessages.current.add(messageId); // جلوگیری از دوباره خواندن
            updateMessage?.({ inputBody: { id: messageId } }).then((data) => {
              if (data?.ok) {
                emitSocket("message-read", {
                  messageId: data?.updatedMessage?.id,
                  conversationId: conversationData?.id,
                });
              }
            });
          }
        });
      },
      { root: null, threshold: 0.1 }
    );

    messagesRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, [messages]);

  useEffect(() => {
    const setReadMarkHandler = (data: { messageId?: string }) => {
      setMessages((prev) => {
        const resoledMessage = prev.map((item) => {
          if (item.id !== data?.messageId) return item;
          return { ...item, read: true };
        });
        return resoledMessage;
      });
    };
    socket.on("mark-message-read", setReadMarkHandler);

    return () => {
      socket.off("mark-message-read", setReadMarkHandler);
    };
  }, []);

  function getDirection(text: string): "rtl" | "ltr" {
    if (!text) return "ltr";
    return /[\u0600-\u06FF]/.test(text[0]) ? "rtl" : "ltr";
  }

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
              const direction = getDirection(message.content);
              return (
                <li
                  className={clsx("m-2")}
                  key={
                    message.id ||
                    message.tempId ||
                    `${message.content}-${index}`
                  }
                  ref={(el) => {
                    if (!isOwn && !message.read) {
                      messagesRefs.current[index] = el;
                    }
                  }}
                  data-message-id={message.id}
                >
                  <div
                    className={clsx(
                      "p-2 rounded-2xl w-fit",
                      isOwn
                        ? " text-left ml-auto bg-indigo-500 text-white"
                        : "text-right mr-auto bg-gray-300"
                    )}
                  >
                    <div
                      className={clsx(
                        "px-1 py-2 rounded-lg break-words whitespace-pre-wrap",
                        direction === "rtl" ? "text-right" : "text-left"
                      )}
                      style={{ direction }}
                    >
                      {message.content}
                    </div>
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

      <div className="absolute bottom-0 right-0 left-0 z-10 border-t p-2 bg-white">
        <StickyChatInput />
      </div>
    </div>
  );
};

export default ConversationContainer;
