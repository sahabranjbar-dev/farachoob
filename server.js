// server.js

import next from "next";
import { createServer } from "http";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const url = process.env.NEXT_PUBLIC_BASE_URL;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer);

  // وقتی یک کلاینت وصل شد
  io.on("connection", (socket) => {
    console.log("🔗 User connected:", socket?.id);

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
    socket.on("send-message", ({ conversationId, senderId, content }) => {
      io.to(conversationId).emit("new-message", {
        conversationId,
        senderId,
        content,
      });
    });

    // پیام read شد
    socket.on("mark-read", ({ conversationId, userId }) => {
      io.to(conversationId).emit("message-read", { conversationId, userId });
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

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`🚀 Server ready on http://localhost:${port}`);
  });
});
