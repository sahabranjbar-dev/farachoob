import ChatList from "./components/ChatList";
import ChatScreen from "./components/ChatScreen";
import ChatSideBar from "./components/ChatSideBar";

const ChatPage = () => {
  return (
    <div className="p-4">
      <section className="border rounded-2xl shadow-md bg-white">
        <div className="flex h-[80vh]">
          <ChatSideBar>
            <ChatList />
          </ChatSideBar>
          <ChatScreen />
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
