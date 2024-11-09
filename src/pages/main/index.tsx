import { useState, useEffect, useRef } from "react";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";
import { Sidebar } from "./sidebar";
import styled from "@emotion/styled";
import { Spinner, Box, Flex, Text } from "@chakra-ui/react";
import tutorial from "@/assets/tutorial.svg";

const MainPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [inputHeight, setInputHeight] = useState(36);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null); // 스크롤 위치를 위한 ref 추가
  const baseURL = import.meta.env.VITE_BASE_URL;

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !loading) {
      const userMessage = inputMessage;
      setMessages((prev) => [userMessage, ...prev]);
      setInputMessage("");

      setLoading(true);

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
        setLoading(false);
      }
    }
  };

  // 로딩 중일 때만 5초 후 스크롤을 가장 아래로 이동
  useEffect(() => {
    let timeoutId: number;

    if (loading && bottomRef.current) {
      timeoutId = window.setTimeout(() => {
        if (bottomRef.current) {
          bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 500); // 0.5초 후에 스크롤 이동
    }

    return () => clearTimeout(timeoutId); // 로딩이 끝나거나 컴포넌트가 언마운트되면 타이머를 정리
  }, [loading]);

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
            <div ref={bottomRef} /> {/* 스크롤이 이동할 위치를 표시 */}
          </MessageListWrapper>
        )}

        <LoadingContainer loading={loading}>
          {loading && (
            <Flex align="center" justify="center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="lg"
              />
              <LoadingText>응답을 기다리는 중...</LoadingText>
            </Flex>
          )}
        </LoadingContainer>

        <MessageInputWrapper>
          <MessageInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
            setInputHeight={setInputHeight}
            isLoading={loading}
          />
        </MessageInputWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default MainPage;

// 스타일 코드 업데이트
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
  position: relative;
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

const LoadingContainer = styled(Box)<{ loading: boolean }>`
  width: 100%;
  height: ${({ loading }) => (loading ? "60px" : "0")};
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: ${({ loading }) => (loading ? "110px" : "0")};
  transition: height 0.3s ease-in-out, padding-bottom 0.3s ease-in-out;
`;

const MessageInputWrapper = styled.div`
  width: 90%;
  max-width: 800px;
  margin-top: 20px;
  position: relative;
  margin-bottom: 20px;
`;

const LoadingText = styled(Text)`
  font-size: 16px;
  color: #555;
  margin-left: 12px;
`;
