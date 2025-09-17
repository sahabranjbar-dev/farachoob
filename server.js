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

  const io = new Server(httpServer, {
    cors: {
      origin: "*", // یا آدرس فرانت
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔗 User connected:", socket.id);

    // وقتی کاربر آنلاین شد
    socket.on("user-online", (userId) => {
      onlineUsers.set(userId, {
        socketId: socket.id,
        userId,
        lastSeen: new Date(),
      });

      // join به room اختصاصی خودش برای نوتیفیکیشن
      socket.join(`user_${userId}`);

      // اطلاع به بقیه کاربران
      socket.broadcast.emit("user-online", userId);
      console.log(`👤 User ${userId} is now online`);
    });

    // join به کانورسیشن
    socket.on("join-conversation", ({ conversationId }) => {
      // leave همه room ها به جز socket.id
      for (let room of socket.rooms) {
        if (room !== socket.id) socket.leave(room);
      }
      socket.join(conversationId);
    });

    // ارسال پیام
    socket.on(
      "send-message",
      ({ conversationId, senderId, content, recipients = [], ...res }) => {
        const createdAt = new Date();
        console.log({ recipients });

        // emit به کل conversation به جز sender
        socket.to(conversationId).emit("new-message", {
          conversationId,
          senderId,
          content,
          createdAt,
          read: false,
          ...res,
        });

        // emit به sender خودش
        socket.emit("has-new-message", {
          conversationId,
          senderId,
          content,
          createdAt,
          read: false,
          ...res,
        });

        // نوتیفیکیشن به گیرنده‌ها (user room)
        recipients.forEach((userId) => {
          if (userId !== senderId) {
            io.to(`user_${userId}`).emit("notification", {
              conversationId,
              senderId,
              content,
              createdAt,
              ...res,
            });
          }
        });
      }
    );

    // پیام read شد
    socket.on("mark-read", ({ conversationId, userId, messageId }) => {
      io.to(conversationId).emit("message-read", {
        conversationId,
        userId,
        messageId,
      });
    });

    // پیام ویرایش
    socket.on("edit-message", ({ messageId, newContent, conversationId }) => {
      io.to(conversationId).emit("message-edited", {
        messageId,
        newContent,
      });
    });

    // پیام حذف
    socket.on("delete-message", ({ messageId, conversationId }) => {
      io.to(conversationId).emit("message-deleted", {
        messageId,
      });
    });

    // لیست کاربران آنلاین
    socket.on("get-online-users", () => {
      const users = Array.from(onlineUsers.values()).map((u) => u.userId);
      socket.emit("online-users-list", users);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);

      for (let [userId, userInfo] of onlineUsers.entries()) {
        if (userInfo.socketId === socket.id) {
          onlineUsers.delete(userId);
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
