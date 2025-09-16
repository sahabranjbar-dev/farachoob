import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Textarea } from "../ui/textarea";
import clsx from "clsx";
import { ArrowRight, Check, CheckCheck, Loader, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useStickyChat } from "../../../stores/stickyChat";
import { Button } from "../ui/button";
import useDataGetter from "@/hooks/useDataGetter";
import EmptyMessage from "@/assets/EmptyMessage";
import EmptyChat from "./EmptyChat";
import ChatHeader from "./ChatHeader";

const ConversationContainer = () => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const session = useSession();

  const userId = session.data?.user.id;

  const { messages, conversationData, setMessages } = useStickyChat();

  const [value, setValue] = useState<string>("");

  const { fetch } = useDataGetter({
    url: "/chat",
    method: "POST",
    immediatelyFetch: false,
  });

  const conversationId = useMemo(
    () => conversationData?.id,
    [conversationData]
  );

  const notRegisteredUserId = useMemo(() => {
    const users = conversationData?.participants?.find(
      (item) =>
        item.user.role?.englishTitle !== "manager" &&
        item.user.role?.englishTitle !== "admin"
    );

    return users?.user.id;
  }, [conversationData]);

  const senderId = userId ? userId : notRegisteredUserId;

  const sendMessageHandler = useCallback(() => {
    if (!value || !conversationId) return;
    setMessages([
      ...(messages ?? []),
      {
        content: value,
        loading: true,
        senderId,
        id: "temp-" + Date.now(),
        createdAt: new Date().toISOString(),
      },
    ]);

    setValue("");

    fetch?.({
      inputBody: {
        content: value,
        conversationId,
        senderId,
      },
    })
      .then((data) => {
        if (data?.id) {
          const newMessage = messages?.map((item) => ({
            ...item,
            loading: false,
          }));
          setMessages([...(newMessage ?? []), data]);
        }
      })
      .catch((err) => {
        const newMessage = messages?.filter((item) => !item.loading);

        setMessages(newMessage);
      });
  }, [value, conversationId, fetch, setMessages, messages]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative">
      <ChatHeader />

      <div className=" h-full z-5 overflow-scroll mb-18 mx-2">
        {messages?.length ? (
          <ul className="mt-2 mb-4">
            {messages?.map((message) => {
              const isOwn = message?.senderId === senderId;
              const date = new Date(message?.createdAt ?? "");
              const time = `${date.getHours()}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
              return (
                <li className={clsx("m-2")} key={message.id}>
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
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            name="message"
            className="bg-white resize-none pl-24"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessageHandler();
              }
            }}
          />

          <div className="absolute bottom-[50%] left-2 translate-y-[50%]">
            <Button
              className="bg-blue-500 hover:bg-blue-600 h-full"
              left={<Send />}
              type="button"
              onClick={sendMessageHandler}
            >
              ارسال
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationContainer;
