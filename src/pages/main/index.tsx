import { useState, useEffect } from "react";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";
import { Sidebar } from "./sidebar";
import styled from "@emotion/styled";
import tutorial from "@/assets/tutorial.svg";

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
        {messages.length === 0 ? (
          <TutorialImageWrapper>
            <img src={tutorial} alt="튜토리얼 이미지" />
          </TutorialImageWrapper>
        ) : (
          <MessageList messages={messages} />
        )}
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
  position: relative; // 자식 요소인 TutorialImageWrapper의 absolute 위치 조정을 위해 부모 요소를 relative로 설정
  height: 100vh; // 전체 화면 높이 차지
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
  width: 100%; // 부모의 너비를 모두 사용

  img {
    max-width: 100%;
    max-height: 400px; // 기본적으로 화면에 잘 맞게 조정
    object-fit: contain;

    @media (max-width: 768px) {
      max-width: 90vw; // 모바일에서 이미지가 부모 요소에 거의 꽉 차게
      object-fit: contain; // 이미지가 잘리지 않고 꽉 차게 보이도록 설정
    }

    @media (max-width: 480px) {
      max-width: 80vw; // 화면의 대부분을 차지하도록 설정
      object-fit: contain; // 이미지가 잘리지 않고 꽉 차게 보이도록 설정
    }
  }
`;
