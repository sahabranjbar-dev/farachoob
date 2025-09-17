import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import UserItem from "./UserItem";

const ChatList = async () => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return <p className="text-gray-500 p-4">لطفا وارد حساب کاربری شوید</p>;
    }

    // گرفتن نقش کاربر فعلی
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!currentUser) {
      return <p className="text-gray-500 p-4">کاربر پیدا نشد.</p>;
    }

    const isAdminOrManager = ["admin", "manager"].includes(
      currentUser.role?.englishTitle ?? "customer"
    );

    // همه کانورسیشن‌هایی که کاربر در آنها شرکت کرده
    let conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId } }, // خود کاربر جزو کانورسیشن باشد
      },
      include: {
        participants: { include: { user: { include: { role: true } } } },
      },
      orderBy: { updatedAt: "desc" }, // مرتب‌سازی بر اساس آخرین پیام
    });

    // اگر کاربر معمولی است، فقط کانورسیشن با ادمین/مدیر نگه داشته شود
    if (!isAdminOrManager) {
      conversations = conversations.filter((conv) =>
        conv.participants.some(
          (p) =>
            p.userId !== userId &&
            ["admin", "manager"].includes(p.user.role?.englishTitle ?? "")
        )
      );
    }

    if (!conversations || conversations.length === 0) {
      return (
        <p className="text-gray-500 p-4">
          هیچ کاربری برای شروع گفتگو پیدا نشد.
        </p>
      );
    }

    return (
      <div className="h-full overflow-y-auto">
        {conversations.map((conv) => {
          // پیدا کردن کاربر مقابل
          const otherUser = conv.participants.find(
            (p) => p.userId !== userId
          )?.user;
          return otherUser ? (
            <UserItem key={otherUser.id} user={otherUser} />
          ) : null;
        })}
      </div>
    );
  } catch (error) {
    console.error("ChatList error:", error);
    return (
      <p className="text-red-500 p-4">خطایی در بارگذاری لیست کاربران رخ داد.</p>
    );
  }
};

export default ChatList;
