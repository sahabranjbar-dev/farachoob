// server.js

import next from "next";
import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "@/lib/prisma";
// import prisma from "@/lib/prisma";

const dev = process.env.NODE_ENV !== "production";
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

    socket.on("join-conversations", (conversationIds) => {
      conversationIds.forEach((id) => socket.join(id));
    });

    // ارسال پیام
    socket.on("send-message", async ({ conversationId, senderId, content }) => {
      const message = await prisma.message.create({
        data: { conversationId, senderId, content },
        include: { sender: true },
      });
      io.to(conversationId).emit("new-message", message);
    });

    // پیام read شد
    socket.on("mark-read", async ({ conversationId, userId }) => {
      await prisma.conversationParticipant.updateMany({
        where: { conversationId, userId },
        data: { lastReadAt: new Date() },
      });

      io.to(conversationId).emit("message-read", { conversationId, userId });
    });

    // پیام ویرایش
    socket.on("edit-message", async ({ messageId, newContent }) => {
      const oldMessage = await prisma.message.findUnique({
        where: { id: messageId },
      });
      if (!oldMessage) return;

      await prisma.messageHistory.create({
        data: { messageId, oldContent: oldMessage.content },
      });

      const updated = await prisma.message.update({
        where: { id: messageId },
        data: { content: newContent },
      });

      io.to(updated.conversationId).emit("message-edited", updated);
    });

    // پیام حذف
    socket.on("delete-message", async ({ messageId }) => {
      const updated = await prisma.message.update({
        where: { id: messageId },
        data: { deleted: true },
      });

      io.to(updated.conversationId).emit("message-deleted", updated.id);
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
