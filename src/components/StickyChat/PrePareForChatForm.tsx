"use client";
import useDataGetter from "@/hooks/useDataGetter";
import { normalizePhoneNumber } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useChat } from "../../../stores";
import { useStickyChat } from "../../../stores/stickyChat";
import Spinner from "../Spinner";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Headset, MessageCircle } from "lucide-react";
import { Conversation, Participant } from "@/types/common";
import { Socket } from "socket.io-client";
import { emitSocket } from "@/lib/socket";

export interface Root {
  id: string;
  title: any;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
}

const schema = z.object({
  fullName: z.string().trim().min(2, "نام حداقل ۲ حرف باشد"),
  phone: z.string().superRefine((val, ctx) => {
    const normalized = normalizePhoneNumber(val);
    if (!/^09\d{9}$/.test(normalized)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "شماره موبایل معتبر نیست (باید با 09 شروع شود)",
      });
    }
  }),
});

type FormValues = z.infer<typeof schema>;

const PrePareForChatForm = () => {
  const session = useSession();
  const userId = session.data?.user.id;
  const setConversationData = useStickyChat((s) => s.setConversationData);
  const setMessages = useStickyChat((s) => s.setMessages);

  const socket = useChat((s) => s.socket);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", phone: "" },
  });

  const { fetch, loading } = useDataGetter({
    url: "/chat/conversation",
    method: "POST",
    immediatelyFetch: false,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

  const onSubmit = (values: FormValues) => {
    onCreateChat({
      fullName: values?.fullName,
      phone: values.phone,
      isFromSticky: true,
    });
  };

  const onCreateChat = async (inputBody?: {
    fullName: string;
    phone: string;
    isFromSticky: boolean;
  }): Promise<any> => {
    return await fetch?.(inputBody ? { inputBody } : {})
      .then((data) => {
        if (data?.conversation?.id) {
          setConversationData(data?.conversation);
          emitSocket("join-conversation", {
            conversationId: data?.conversation?.id,
            userId,
          });
          emitSocket("admin-should-join-conversation", {
            conversationId: data?.conversation?.id,
            userId: data?.conversation?.adminId,
          });
        }
      })
      .catch((err: AxiosError<{ reason: string; message: string }>) => {
        if (err?.response?.data?.reason === "mobile") {
          form.setError("phone", {
            message: err?.response?.data?.message,
          });
        }
      });
  };

  if (loading)
    return (
      <div className="z-50">
        <Spinner className="backdrop-blur-xs" />
      </div>
    );

  if (userId) {
    return (
      <div className="h-full mt-10 flex flex-col items-center px-4">
        <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 p-6 rounded-2xl shadow-lg text-center w-full max-w-md border border-white/20">
          <p className="text-xl font-bold text-gray-800 dark:text-gray-50">
            👋 سلام، {session.data?.user.firstName || "کاربر عزیز"}!
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            خوش آمدید! برای شروع گفتگو، روی دکمه زیر کلیک کنید.
          </p>

          <Button
            onClick={() => onCreateChat()}
            disabled={loading}
            className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 animate-pulse transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            شروع گفتگو
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center px-4">
      <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 p-6 rounded-2xl shadow-lg w-full max-w-md border border-white/20">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-50 text-center mb-4">
          <span className="flex justify-center items-center gap-2">
            شروع گفتگو با پشتیبانی <Headset />
          </span>
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام و نام‌خانوادگی</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="نام و نام‌خانوادگی"
                      className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره موبایل</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="09123456789"
                      className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            <Button
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              شروع گفتگو
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PrePareForChatForm;
