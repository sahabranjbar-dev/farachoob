"use client";

import { Button } from "@/components/ui/button";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import { ChatContext } from "../container/ChatContainer";

const socket = io();

type FormValues = {
  message: string;
};

const ChatInput = () => {
  const { register, handleSubmit, reset, watch } = useForm<FormValues>();
  const { userInfo } = useContext(ChatContext);
  const onSubmit = (data: FormValues) => {
    console.log("Message:", data.message);
    if (!data.message) return;
    socket.emit("send-message", { text: data.message, userId: userInfo?.id });
    reset(); // بعد از ارسال، ورودی خالی میشه
  };

  return (
    <div className="absolute bottom-0 w-full bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="justify-between p-4 border-t items-center flex gap-2"
      >
        <input
          type="text"
          placeholder="پیام خود را اینجا بنویسید..."
          className="w-full border p-2 rounded"
          {...register("message", { required: true })}
        />
        <Button
          disabled={!watch("message")}
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white disabled:cursor-not-allowed"
        >
          ارسال
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
