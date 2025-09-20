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

    socket.on("user-online", (userId) => {
      if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
      onlineUsers.get(userId)?.add(socket.id);

      // broadcast لیست آنلاین
      socket.join(`user_${userId}`);
      io.emit("online-users-list", Array.from(onlineUsers.keys()));
    });

    socket.on(
      "admin-should-join-conversation",
      ({ conversationId, userId }) => {
        io.to(`user_${userId}`).emit("admin-join-conversation", {
          conversationId,
        });
      }
    );

    // join به کانورسیشن
    socket.on("join-conversation", ({ conversationId }) => {
      socket.join(conversationId);
    });

    // ارسال پیام
    socket.on(
      "send-message",
      ({ conversationId, senderId, content, recipients = [], ...res }) => {
        const createdAt = new Date();
        socket.to(conversationId).emit("new-message", {
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
            io.to(`user_${userId}`).emit("get-new-message-notification", {
              ...res,
              conversationId,
              senderId,
              content,
              createdAt,
            });
          }
        });
      }
    );

    socket.on("message-read", ({ messageId, conversationId }) => {
      socket.to(conversationId).emit("mark-message-read", { messageId });
    });

    // لیست کاربران آنلاین
    socket.on("get-online-users", () => {
      const users = Array.from(onlineUsers.values()).map((u) => u.userId);
      socket.emit("online-users-list", users);
    });

    socket.on("disconnect", () => {
      for (const [userId, sockets] of onlineUsers.entries()) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }
      io.emit("online-users-list", Array.from(onlineUsers.keys()));
    });
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`🚀 Server ready on http://localhost:${port}`);
  });
});
