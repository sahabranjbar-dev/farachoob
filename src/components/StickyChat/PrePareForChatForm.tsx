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

const schema = z.object({
  fullName: z.string().min(2, "نام حداقل ۲ حرف باشد"),
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

  const { setConversationData, setMessages } = useStickyChat();
  const { socket } = useChat();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
    },
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
    });
  };

  const onCreateChat = async (inputBody?: {
    fullName: string;
    phone: string;
  }): Promise<any> => {
    return await fetch?.(
      inputBody
        ? {
            inputBody,
          }
        : {}
    )
      .then((data) => {
        if (data?.conversation?.id) {
          setConversationData(data.conversation);
          const newMessage = data?.conversation?.messages;
          setMessages(newMessage);
          socket.emit("join-conversation", {
            conversationId: data?.conversation?.id,
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
        <div className="text-center">
          <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-50">
            👋 سلام، {session.data?.user.firstName || "کاربر عزیز"}!
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            خوش آمدید! برای شروع گفتگو، روی دکمه زیر کلیک کنید.
          </p>
        </div>

        <div className="mt-6 z-0">
          <Button
            onClick={() => {
              onCreateChat();
            }}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-colors duration-200 z-0"
          >
            شروع گفتگو 💬
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام و نام خانوادگی</FormLabel>
                <FormControl>
                  <Input
                    placeholder="نام و نام خانوادگی را وارد کنید..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
                  <Input placeholder="مثلاً 09123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-start items-center z-0">
            <Button
              className="bg-blue-500 hover:bg-blue-600 focus:z-0"
              disabled={loading}
            >
              شروع گفتگو 💬
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PrePareForChatForm;
