import { useState, useEffect, useRef } from "react";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";
import { Sidebar } from "./sidebar";
import styled from "@emotion/styled";
import tutorial from "@/assets/tutorial.svg";

const MainPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prev) => [inputMessage, ...prev]);
      setInputMessage("");
    }
  };

  // 메시지가 추가될 때 메시지 리스트를 아래로 스크롤
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
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
        <ContentWrapper ref={messageListRef}>
          {messages.length === 0 ? (
            <TutorialImageWrapper>
              <img src={tutorial} alt="튜토리얼 이미지" />
            </TutorialImageWrapper>
          ) : (
            <MessageList messages={messages} />
          )}
        </ContentWrapper>
        <MessageInputWrapper>
          <MessageInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
          />
        </MessageInputWrapper>
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
  position: relative;
  height: 100vh; // 전체 화면 높이 차지
  display: flex;
  flex-direction: column;
`;

// ContentWrapper 스타일 컴포넌트 (메시지 리스트를 포함)
const ContentWrapper = styled.div`
  flex: 1; // 남은 공간을 모두 차지하여 MessageInput 위에 위치
  overflow-y: auto; // 메시지 리스트가 길어지면 스크롤 가능하도록 설정
  padding-bottom: 80px; // 메시지 입력창 공간 확보
`;

// TutorialImageWrapper 스타일 컴포넌트
const TutorialImageWrapper = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  img {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;

    @media (max-width: 768px) {
      max-width: 90vw;
      object-fit: contain;
    }

    @media (max-width: 480px) {
      max-width: 80vw;
      object-fit: contain;
    }
  }
`;

// MessageInputWrapper 스타일 컴포넌트
const MessageInputWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  z-index: 100;
`;
