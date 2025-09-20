import React, {
  KeyboardEvent,
  memo,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { useStickyChat } from "../../../stores/stickyChat";
import useDataGetter from "@/hooks/useDataGetter";
import { useChat } from "../../../stores";
import { Send } from "lucide-react";
import { Message } from "@/types/common";
import { v4 as uuid } from "uuid";
import { emitSocket } from "@/lib/socket";
import clsx from "clsx";

const StickyChatInput = memo(() => {
  const [direction, setDirection] = useState<"rtl" | "ltr">("rtl");
  const { messages, conversationData, setMessages } = useStickyChat();
  const [value, setValue] = useState<string>("");

  const conversationId = useMemo(
    () => conversationData?.id,
    [conversationData]
  );

  const session = useSession();
  const userId = session.data?.user.id;

  const { socket } = useChat();

  const { fetch: postMessage } = useDataGetter({
    url: "/chat",
    method: "POST",
    immediatelyFetch: false,
  });

  const notRegisteredUserId = useMemo(() => {
    const users = conversationData?.participants?.find(
      (item) =>
        item?.user?.role?.englishTitle !== "manager" &&
        item?.user?.role?.englishTitle !== "admin"
    );

    return users?.user?.id;
  }, [conversationData]);

  const senderId = userId ? userId : notRegisteredUserId;

  const sendMessageHandler = useCallback(() => {
    if (!value || !conversationId) return;

    const randomId = uuid();

    const tempId = "temp-" + randomId;

    setMessages([
      ...(messages ?? []),
      {
        content: value,
        loading: true,
        senderId,
        tempId,
        createdAt: new Date().toISOString(),
      },
    ]);

    setValue("");

    postMessage?.({
      inputBody: {
        content: value,
        conversationId,
        senderId,
        tempId,
      },
    })
      .then((data) => {
        if (!socket || !conversationId) return;
        emitSocket("send-message", {
          ...data,
          conversationId,
          senderId,
          content: data.content,
          recipients: data?.recipients,
        });

        setMessages((prev: Message[]) => {
          const resolvedMessage = prev.filter((item) => item.tempId !== tempId);
          return [...resolvedMessage, data];
        });
      })
      .catch((err) => {
        setMessages((prev: any) =>
          prev?.map((item: any) =>
            item.tempId === tempId ? { ...item, failed: true } : item
          )
        );
      });
  }, [value, conversationId, fetch, setMessages, messages, socket]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValue(value);
    if (value.length > 0) {
      if (/[\u0600-\u06FF]/.test(value[0])) {
        setDirection("rtl");
      } else {
        setDirection("ltr");
      }
    } else {
      setDirection("ltr");
    }
  };
  return (
    <div className="relative">
      <Textarea
        value={value}
        placeholder={
          direction === "rtl"
            ? "پیام خود را بنویسید..."
            : "Type your message..."
        }
        onChange={handleChange}
        name="message"
        className={clsx(
          "bg-white resize-none pl-24 overflow-y-scroll max-h-20"
        )}
        style={{ direction, textAlign: direction === "rtl" ? "right" : "left" }}
        onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
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
          disabled={!value.trim()}
        >
          ارسال
        </Button>
      </div>
    </div>
  );
});

export default StickyChatInput;
