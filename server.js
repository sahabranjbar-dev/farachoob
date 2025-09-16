// server.js

import next from "next";
import { createServer } from "http";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const url = process.env.NEXT_PUBLIC_BASE_URL;
const app = next({ dev });
const handle = app.getRequestHandler();

// ذخیره کاربران آنلاین
const onlineUsers = new Map();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer);

  // وقتی یک کلاینت وصل شد
  io.on("connection", (socket) => {
    console.log("🔗 User connected:", socket?.id);

    socket.on("user-online", (userId) => {
      // ذخیره اطلاعات کاربر آنلاین
      onlineUsers.set(userId, {
        socketId: socket.id,
        userId: userId,
        lastSeen: new Date(),
      });

      // اطلاع به همه کاربران درباره آنلاین بودن این کاربر
      socket.broadcast.emit("user-online", userId);
      console.log(`👤 User ${userId} is now online`);
    });

    socket.on("join-conversation", ({ conversationId }) => {
      const rooms = Object.keys(socket.rooms);
      rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });
      socket.join(conversationId);
    });

    // ارسال پیام
    socket.on(
      "send-message",
      ({ conversationId, senderId, content, createdAt, ...res }) => {
        io.to(conversationId).emit("new-message", {
          conversationId,
          senderId,
          content,
          createdAt,
          read: false,
          ...res,
        });
      }
    );

    // پیام read شد
    // پیام read شد
    socket.on("mark-read", ({ conversationId, userId, messageId }) => {
      console.log({ conversationId, userId, messageId });

      // به همه کاربران در این مکالمه اطلاع دهید که پیام خوانده شده
      io.to(conversationId).emit("message-read", {
        conversationId,
        userId,
        messageId,
      });
    });

    // پیام ویرایش
    socket.on("edit-message", ({ messageId, newContent }) => {
      io.to(updated.conversationId).emit("message-edited", {
        messageId,
        newContent,
        updated,
      });
    });

    // پیام حذف
    socket.on("delete-message", ({ messageId }) => {
      io.to(updated.conversationId).emit("message-deleted", {
        messageId,
        updated: updated.id,
      });
    });

    // درخواست لیست کاربران آنلاین
    socket.on("get-online-users", () => {
      const users = Array.from(onlineUsers.values()).map((user) => user.userId);
      socket.emit("online-users-list", users);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);

      // پیدا کردن کاربر مربوط به این socket و حذف آن
      for (let [userId, userInfo] of onlineUsers.entries()) {
        if (userInfo.socketId === socket.id) {
          onlineUsers.delete(userId);
          // اطلاع به همه کاربران درباره آفلاین شدن این کاربر
          socket.broadcast.emit("user-offline", userId);
          console.log(`👤 User ${userId} is now offline`);
          break;
        }
      }
    });
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`🚀 Server ready on http://localhost:${port}`);
  });
});
