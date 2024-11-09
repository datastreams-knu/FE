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
  const [inputHeight, setInputHeight] = useState(36);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const pageRef = useRef<HTMLDivElement>(null);
  const baseURL = import.meta.env.VITE_BASE_URL;

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !loading) {
      // 로딩 중일 때는 전송을 방지
      const userMessage = inputMessage;
      setMessages((prev) => [userMessage, ...prev]);
      setInputMessage("");

      setLoading(true); // 로딩 상태 활성화

      try {
        const response = await fetch(`${baseURL}/api/front-ai-response`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: userMessage }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch AI response");
        }

        const data = await response.json();
        const aiResponse = data.response;
        setMessages((prev) => [aiResponse, ...prev]);
      } catch (error) {
        console.error("Error while sending message:", error);
      } finally {
        setLoading(false); // 로딩 상태 비활성화
      }
    }
  };

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.scrollTo({
        top: pageRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, inputHeight]);

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
            {loading && (
              <LoadingMessage>응답을 기다리는 중...</LoadingMessage>
            )}{" "}
            {/* 로딩 메시지 표시 */}
          </MessageListWrapper>
        )}
        <MessageInputWrapper>
          <MessageInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
            setInputHeight={setInputHeight}
            isLoading={loading} // 로딩 상태 전달
          />
        </MessageInputWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default MainPage;

// 스타일은 그대로 유지
const PageWrapper = styled.div`
  position: relative;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

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

const ContentWrapper = styled.div<{ inputHeight: number }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${({ inputHeight }) => Math.min(inputHeight - 40, 120)}px;
  transition: margin-left 0.3s ease-in-out;
`;

const MessageListWrapper = styled.div`
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
`;

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

const MessageInputWrapper = styled.div`
  width: 90%;
  max-width: 800px;
  margin-top: 20px;
  position: relative;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 10px;
  text-align: center;
`;
