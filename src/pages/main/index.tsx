import { useState, useEffect } from "react";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";
import { Sidebar } from "./sidebar";
import styled from "@emotion/styled";

const MainPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prev) => [inputMessage, ...prev]);
      setInputMessage("");
    }
  };

  // 새로운 메시지가 추가될 때 페이지를 가장 아래로 스크롤
  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <SidebarWrapper isOpen={isSidebarOpen}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </SidebarWrapper>

      <Wrapper>
        <MessageList messages={messages} />
        <MessageInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendMessage}
        />
      </Wrapper>
    </>
  );
};

export default MainPage;

// SidebarWrapper 스타일 컴포넌트
const SidebarWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${({ isOpen }) => (isOpen ? "250px" : "0")};
  overflow: hidden;
  transition: width 0.3s ease-in-out;
  background-color: #f0f0f0;
  z-index: 1000;
`;

// Wrapper 컴포넌트 스타일
const Wrapper = styled.div`
  padding: 20px;
  margin-left: 0;
  transition: margin-left 0.3s ease-in-out;
`;
