import ChatList from "./components/ChatList";
import ChatScreen from "./components/ChatScreen";
import ChatSideBar from "./components/ChatSideBar";
import ChatContainer from "./container/ChatContainer";

const ChatPage = () => {
  return (
    <div className="p-2 mb-20">
      <section className="border mt-4">
        <div className="flex min-h-96 h-[70vh]">
          <ChatContainer>
            <ChatSideBar>
              <ChatList />
            </ChatSideBar>

            <ChatScreen />
          </ChatContainer>
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
