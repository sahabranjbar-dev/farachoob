"use client";
import { UserRoundSearch, Loader2, AlertTriangle } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { motion } from "framer-motion";
import useDataGetter from "@/hooks/useDataGetter";
import { debounce } from "lodash";
import { Conversation, User } from "@/types/common";
import { useChat } from "../../../../../../stores";
import { toast } from "sonner";

const SearchUserChat = () => {
  const [searchValue, setSearchValue] = useState<string>("");

  const [open, setOpen] = useState(false);
  const setConversation = useChat((state) => state.setConversation);
  const setUserInfo = useChat((state) => state.setUserInfo);
  const setConversatioMessageLoading = useChat(
    (state) => state.setConversatioMessageLoading
  );
  const setDashboardChatMessage = useChat(
    (state) => state.setDashboardChatMessage
  );
  const socket = useChat((state) => state.socket);

  const { fetch: conversationFetch, loading: fetchConversationLoading } =
    useDataGetter<Conversation>({
      url: "/dashboard/conversations",
      method: "POST",
      immediatelyFetch: false,
    });

  const {
    data: users,
    error,
    fetch,
    loading,
  } = useDataGetter({
    url: "/dashboard/users",
    immediatelyFetch: false,
  });

  // ✅ ساختن نسخه ثابت از debounce
  const debouncedFetch = useMemo(
    () =>
      debounce((value: string) => {
        const abordController = new AbortController();

        fetch?.({
          inputParams: { name: value },
          signal: abordController.signal,
        });
      }, 500),
    [fetch]
  );

  useEffect(() => {
    if (searchValue.length > 2) {
      debouncedFetch(searchValue);
    }
    // cleanup برای جلوگیری از memory leak
    return () => {
      debouncedFetch.cancel();
    };
  }, [searchValue, debouncedFetch]);

  const searchResultUserClickHanlder = (user: User) => {
    setConversatioMessageLoading(true);
    setUserInfo(null);

    conversationFetch?.({
      inputBody: { participantId: user.id, isSecure: true },
    })
      .then((data) => {
        setDashboardChatMessage(data?.messages ?? []);

        setUserInfo(user);

        setConversatioMessageLoading(false);

        setConversation(data);

        socket.emit("join-conversation", {
          conversationId: data?.id,
        });

        setOpen(false);
      })
      .catch(() => {
        toast.error("ایجاد گپ با مشکل مواجه شد ، دوباره تلاش کنید");
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <UserRoundSearch className="cursor-pointer hover:scale-110 transition-transform" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            جست‌وجوی کاربران
          </DialogTitle>
          <DialogDescription asChild>
            <div>
              {/* سرچ باکس */}
              <div className="flex justify-center items-center p-3">
                <Input
                  type="search"
                  className="bg-gray-100 max-w-sm rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="نام کاربر را وارد کنید..."
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                  value={searchValue}
                />
              </div>

              {/* لیست نتایج */}
              <div className="max-h-64 overflow-y-auto mt-2 space-y-2 p-4">
                {(loading || fetchConversationLoading) && (
                  <div className="flex justify-center items-center p-6 z-10">
                    <Loader2 className="animate-spin w-6 h-6 text-orange-500" />
                  </div>
                )}

                {error && !loading && !fetchConversationLoading && (
                  <div className="flex items-center justify-center gap-2 p-4 text-red-500">
                    <AlertTriangle className="w-5 h-5" />
                    <span>خطا در دریافت اطلاعات کاربران</span>
                  </div>
                )}

                {!loading &&
                  !fetchConversationLoading &&
                  !error &&
                  users?.resultList?.length === 0 &&
                  searchValue.length > 2 && (
                    <div className="text-center text-gray-500 p-4">
                      هیچ کاربری پیدا نشد
                    </div>
                  )}

                {!loading &&
                  !fetchConversationLoading &&
                  !error &&
                  users?.resultList?.map((user: User, index: number) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        searchResultUserClickHanlder(user);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl border bg-white shadow-sm hover:bg-gray-50 transition cursor-pointer "
                    >
                      <Image
                        src={user?.image || "/images/placeholder.png"}
                        alt={user?.firstName || "user alt image"}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border w-12 h-12"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{`${
                          user?.firstName ?? ""
                        } ${user?.lastName ?? ""}`}</span>
                        <span className="text-sm text-gray-500">
                          {user.roleFarsiTitle}
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SearchUserChat;
