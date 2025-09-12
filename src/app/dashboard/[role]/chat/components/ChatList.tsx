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

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
    });

    if (!users || users.length === 0) {
      return (
        <p className="text-gray-500 p-4">
          هیچ کاربری برای شروع گفتگو پیدا نشد.
        </p>
      );
    }

    return (
      <div className="h-full overflow-y-auto">
        {users.map((user) => (
          <UserItem key={user.id} user={user} />
        ))}
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
