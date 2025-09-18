import axios from "axios";
import { useChat } from "../../../../../../stores";

export const fetchConvs = async () => {
  const response = await axios("/api/dashboard/conversations");
  if (response.status === 200) {
    useChat.getState().setConversations(response.data?.conversations);
  }
  return response;
};
