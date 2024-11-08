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
  const [inputHeight, setInputHeight] = useState(36); // 메시지 입력창 높이 상태 추가
  const pageRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prev) => [inputMessage, ...prev]);
      setInputMessage(""); // 상태가 업데이트된 후에 입력창 초기화
    }
  };

  // 메시지가 추가될 때 페이지를 가장 아래로 스크롤
  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.scrollTo({
        top: pageRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, inputHeight]); // inputHeight 추가하여 메시지 입력창 높이 변경에 따른 스크롤 업데이트

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <PageWrapper ref={pageRef}>
      <SidebarWrapper isOpen={isSidebarOpen}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </SidebarWrapper>

      <ContentWrapper inputHeight={inputHeight}>
        {messages.length === 0 ? (
          <TutorialImageWrapper>
            <img src={tutorial} alt="튜토리얼 이미지" />
          </TutorialImageWrapper>
        ) : (
          <MessageListWrapper>
            <MessageList messages={messages} />
          </MessageListWrapper>
        )}
        <MessageInputWrapper>
          <MessageInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
            setInputHeight={setInputHeight} // 입력창 높이 업데이트 함수 전달
          />
        </MessageInputWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default MainPage;

// 전체 페이지 래퍼 (스크롤 가능한 요소)
const PageWrapper = styled.div`
  position: relative;
  height: 100vh;
  overflow-y: auto; // 전체 페이지에 스크롤이 생긴도록 설정
  display: flex;
  flex-direction: column;
`;

// SidebarWrapper 스타일 컨텐츠
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

// ContentWrapper 스타일 컨텐츠
const ContentWrapper = styled.div<{ inputHeight: number }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${({ inputHeight }) =>
    Math.min(
      inputHeight - 40,
      120
    )}px; // 메시지 입력창 높이에 따른 여백 동적 조정
  transition: margin-left 0.3s ease-in-out;
`;

// MessageListWrapper 스타일 컨텐츠 (메시지 리스트를 포함)
const MessageListWrapper = styled.div`
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px; // 메시지 입력창과 메시지 리스트 간 여백 추가
`;

// TutorialImageWrapper 스타일 컨텐츠
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

// MessageInputWrapper 스타일 컨텐츠
const MessageInputWrapper = styled.div`
  width: 90%;
  max-width: 800px;
  margin-top: 20px;
  position: relative;
  margin-bottom: 20px; // 메시지 입력창 아래 여백 추가
`;
