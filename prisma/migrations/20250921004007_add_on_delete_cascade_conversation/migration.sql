-- DropForeignKey
ALTER TABLE "public"."ConversationParticipant" DROP CONSTRAINT "ConversationParticipant_conversationId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
