import { useState, useEffect, useRef } from "react";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";
import { Sidebar } from "./sidebar";
import styled from "@emotion/styled";
import { Spinner, Box, Flex, Text, Button } from "@chakra-ui/react";
import tutorial1 from "@/assets/tutorial1.svg";
import tutorial2 from "@/assets/tutorial2.svg";
import tutorial3 from "@/assets/tutorial3.svg";
import tutorial4 from "@/assets/tutorial4.svg";
import tutorial5 from "@/assets/tutorial5.svg";

const MainPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [inputHeight, setInputHeight] = useState(36);
  const [loading, setLoading] = useState(false);
  const [tutorialImage, setTutorialImage] = useState<string>(""); // 랜덤 이미지 상태 추가
  const pageRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const baseURL = import.meta.env.VITE_BASE_URL;

  interface ResponseData {
    response: {
      answer: string;
      references: string;
      disclaimer: string;
      images?: string[]; // optional field
    };
  }

  const handleSendMessage = async (message: string) => {
    if (message.trim() && !loading) {
      setMessages((prev) => [message, ...prev]); // 메시지를 바로 추가
      setInputMessage("");
      setLoading(true);

      try {
        const response = await fetch(`${baseURL}/api/front-ai-response`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: message }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch AI response");
        }

        const data: ResponseData = await response.json();

        const images = data.response.images?.length
          ? `\n\n${data.response.images
              .map((url: string) => `<img src="${url}" width="300" />`)
              .join("\n")}`
          : "";

        const formattedResponse = `${data.response.answer}\n\n${data.response.references}\n\n${data.response.disclaimer}${images}`;

        setMessages((prev) => [formattedResponse, ...prev]);
      } catch (error) {
        console.error("Error while sending message:", error);
        setMessages((prev) => [
          "서버에 문제가 있습니다. 잠시 후 다시 시도해주세요!",
          ...prev,
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  // 페이지 접속 시 랜덤 이미지 선택
  useEffect(() => {
    const tutorialImages = [
      tutorial1,
      tutorial2,
      tutorial3,
      tutorial4,
      tutorial5,
    ];
    const randomImage =
      tutorialImages[Math.floor(Math.random() * tutorialImages.length)];
    setTutorialImage(randomImage);
  }, []);

  // 로딩 중일 때만 0.5초 후 스크롤을 가장 아래로 이동
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
            <Box
              textAlign="center"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <img src={tutorialImage} alt="Tutorial" />
              <Box
                display="flex"
                flexWrap="wrap"
                gap={4}
                justifyContent="center"
                mt="6"
                px={4}
                maxW="800px"
              >
                <Button
                  fontSize={"2xl"}
                  fontWeight={"medium"}
                  backgroundColor="#EAE6DA"
                  _hover={{ backgroundColor: "#DDD8C6" }}
                  onClick={() => handleSendMessage("최근 공지사항 알려줘")}
                >
                  최근 공지사항 알려줘
                </Button>
                <Button
                  fontSize={"2xl"}
                  fontWeight={"medium"}
                  backgroundColor="#EAE6DA"
                  _hover={{ backgroundColor: "#DDD8C6" }}
                  onClick={() =>
                    handleSendMessage("점심 제공하는 세미나 알려줘")
                  }
                >
                  점심 제공하는 세미나 알려줘
                </Button>
                <Button
                  fontSize={"2xl"}
                  fontWeight={"medium"}
                  backgroundColor="#EAE6DA"
                  _hover={{ backgroundColor: "#DDD8C6" }}
                  onClick={() =>
                    handleSendMessage("컴퓨터학부 대회 정보 알려줘")
                  }
                >
                  컴퓨터학부 대회 정보 알려줘
                </Button>
                <Button
                  fontSize={"2xl"}
                  fontWeight={"medium"}
                  backgroundColor="#EAE6DA"
                  _hover={{ backgroundColor: "#DDD8C6" }}
                  onClick={() => handleSendMessage("졸업요건에 대해 알려줘")}
                >
                  졸업요건에 대해 알려줘
                </Button>
                <Button
                  fontSize={"2xl"}
                  fontWeight={"medium"}
                  backgroundColor="#EAE6DA"
                  _hover={{ backgroundColor: "#DDD8C6" }}
                  onClick={() => handleSendMessage("수강신청 언제야")}
                >
                  수강신청 언제야
                </Button>
              </Box>
            </Box>
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
                emptyColor="#E8E5D9"
                color="#fcb9aa"
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
            onSendMessage={() => handleSendMessage(inputMessage)}
            setInputHeight={setInputHeight}
            isLoading={loading}
          />
        </MessageInputWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default MainPage;

// 스타일 코드
const PageWrapper = styled.div`
  background-color: #f3f2ec;
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
  font-size: 20px;
  color: #555;
  margin-left: 12px;
`;
