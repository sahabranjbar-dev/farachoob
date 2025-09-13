import ChatList from "./components/ChatList";
import ChatScreen from "./components/ChatScreen";
import ChatSideBar from "./components/ChatSideBar";
import ChatContainer from "./container/ChatContainer";
import SocketContainer from "./container/SocketContainer";

const ChatPage = () => {
  return (
    <div className="p-2 mb-20">
      <section className="border mt-4">
        <div className="flex min-h-96 h-[70vh]">
          <SocketContainer>
            <ChatContainer>
              <ChatSideBar>
                <ChatList />
              </ChatSideBar>

              <ChatScreen />
            </ChatContainer>
          </SocketContainer>
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
