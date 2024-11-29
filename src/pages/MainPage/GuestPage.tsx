// 로그인 하지 않은 사용자의 메인 페이지 컴포넌트
import { useState, useEffect, useRef } from "react";
import { MessageInput } from "./MessageInput/MessageInput";
import { MessageList } from "./messageList/MessageList";
import { Sidebar } from "./Sidebar/Sidebar";
import { IntroModal } from "./IntroModal";
import { Box, Flex, Spinner, Text, Button, Image } from "@chakra-ui/react";
import tutorial1 from "@/assets/tutorial1.svg";
import tutorial2 from "@/assets/tutorial2.svg";
import tutorial3 from "@/assets/tutorial3.svg";
import tutorial4 from "@/assets/tutorial4.svg";
import tutorial5 from "@/assets/tutorial5.svg";

const GuestPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [inputHeight, setInputHeight] = useState(36);
  const [loading, setLoading] = useState(false);
  const [tutorialImage, setTutorialImage] = useState<string>(""); // 랜덤 이미지 상태 추가
  const [isModalOpen, setModalOpen] = useState(false); // 모달 상태 추가
  const pageRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevHeightRef = useRef<number>(0); // 이전 높이를 저장할 ref
  const baseURL = import.meta.env.VITE_BASE_URL;

  interface ResponseData {
    answer: string;
    references: string;
    disclaimer: string;
    images: string[];
  }

  const handleSendMessage = async (message: string) => {
    if (message.trim() && !loading) {
      setMessages((prev) => [...prev, message]);
      setInputMessage("");
      setLoading(true);

      try {
        console.log("API 요청 시작");
        const response = await fetch(`${baseURL}/api/front-ai-response`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: message }),
        });

        console.log("응답 상태 코드:", response.status);
        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        const data: ResponseData = await response.json();
        console.log("응답 데이터:", data);

        // URL을 링크로 변환하는 함수
        const makeLinksClickable = (text: string) => {
          const urlRegex = /(https?:\/\/[^\s]+)/g; // URL 패턴
          return text.replace(
            urlRegex,
            (url) =>
              `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">${url}</a>`
          );
        };

        const cleanText = (text: string) => text.replace(/^\s+|\s+$/g, ""); // 공백 및 줄바꿈 제거

        const formattedResponse = `${cleanText(data.answer)}
        ${
          data.images?.length && data.images[0] !== "No content"
            ? data.images
                .map(
                  (url) =>
                    `<img src="${url}" alt="이미지" style="max-width: 100%; height: auto; margin-top: 10px;" />`
                )
                .join("\n")
            : ""
        }
        ${data.disclaimer}
        ${makeLinksClickable(data.references)}`.trim();

        setMessages((prev) => [...prev, formattedResponse]);
      } catch (error) {
        console.error("에러 발생:", error);
        setMessages((prev) => [
          ...prev,
          "서버에 문제가 있습니다. 잠시 후 다시 시도해주세요!",
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

  // 화면 높이가 길어질 때만 스크롤을 가장 아래로 이동
  useEffect(() => {
    let timeoutId: number;

    if (bottomRef.current) {
      const currentHeight = bottomRef.current.getBoundingClientRect().top;

      // 현재 높이가 이전 높이보다 길어졌을 경우에만 스크롤 이동
      if (currentHeight > prevHeightRef.current) {
        timeoutId = window.setTimeout(() => {
          if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 500); // 0.5초 후에 스크롤 이동
      }

      // 현재 높이를 저장
      prevHeightRef.current = currentHeight;
    }

    return () => clearTimeout(timeoutId); // 타이머 정리
  }, [messages]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const openModal = () => setModalOpen(true); // 모달 열기
  const closeModal = () => setModalOpen(false); // 모달 닫기

  return (
    <Box
      ref={pageRef}
      bg="#f3f2ec"
      position="relative"
      h="100vh"
      overflowY="auto"
      display="flex"
      flexDirection="column"
    >
      <Box
        position="fixed"
        left="0"
        top="0"
        bottom="0"
        w={isSidebarOpen ? "250px" : "0"}
        overflow="hidden"
        transition="width 0.3s ease-in-out"
        bg="#f0f0f0"
        zIndex="1000"
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </Box>

      <Flex
        flex="1"
        direction="column"
        align="center"
        justify="flex-end"
        mb={`${Math.min(inputHeight - 40, 120)}px`}
        transition="margin-left 0.3s ease-in-out"
      >
        {messages.length === 0 ? (
          <Flex
            position="absolute"
            top="40%"
            left="50%"
            transform="translate(-50%, -50%)"
            justify="center"
            align="center"
            w="100%"
          >
            <Flex direction="column" align="center">
              <Box
                alignSelf="flex-start"
                p={10}
                sx={{
                  "@keyframes textAnimation": {
                    "0%, 10%, 20%, 100%": { opacity: 1 },
                    "5%, 15%": { opacity: 0 },
                  },
                  animation: "textAnimation 6s ease-in-out infinite", // keyframes 적용
                }}
                onClick={openModal} // 모달 열기 버튼
                cursor={"pointer"} // 커서 모양 변경
              >
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="bold"
                  color="#555"
                  textAlign="center"
                  position="relative" // ::after를 사용하려면 position 필요
                  _after={{
                    content: '""', // 빈 내용
                    position: "absolute",
                    left: "0",
                    bottom: "3px", // 텍스트 아래 간격
                    width: "100%", // 텍스트 길이에 맞춤
                    height: "1px",
                    borderBottom: "2px dashed #555",
                  }}
                  _hover={{
                    color: "#7E2B24", // 텍스트 색상 변경
                    _after: {
                      borderBottomColor: "#7E2B24", // 밑줄 색상 변경
                    },
                  }}
                >
                  챗봇 더 알아보기
                </Text>
              </Box>
              <Image
                src={tutorialImage}
                alt="Tutorial"
                maxW="90%"
                maxH="400px"
                objectFit="contain"
              />
              <Flex
                direction={{ base: "column", md: "row" }} // base: 세로, md 이상: 가로
                wrap="wrap"
                gap={4}
                justify="center"
                mt="6"
                px={4}
                maxW="800px"
              >
                <Button
                  fontSize="2xl"
                  fontWeight="medium"
                  bg="#EAE6DA"
                  _hover={{ bg: "#DDD8C6", transform: "scale(1.05)" }}
                  onClick={() => handleSendMessage("해외 인턴십 정보 알려줘")}
                >
                  해외 인턴십 정보 알려줘
                </Button>
                <Button
                  fontSize="2xl"
                  fontWeight="medium"
                  bg="#EAE6DA"
                  _hover={{ bg: "#DDD8C6", transform: "scale(1.05)" }}
                  onClick={() => handleSendMessage("지도교수 상담 일정 알려줘")}
                >
                  지도교수 상담 일정 알려줘
                </Button>
                <Button
                  fontSize="2xl"
                  fontWeight="medium"
                  bg="#EAE6DA"
                  _hover={{ bg: "#DDD8C6", transform: "scale(1.05)" }}
                  onClick={() => handleSendMessage("참여가능한 대회 알려줘")}
                >
                  참여가능한 대회 알려줘
                </Button>
                <Button
                  fontSize="2xl"
                  fontWeight="medium"
                  bg="#EAE6DA"
                  _hover={{ bg: "#DDD8C6", transform: "scale(1.05)" }}
                  onClick={() => handleSendMessage("심컴 졸업요건 알려줘")}
                >
                  심컴 졸업요건 알려줘
                </Button>
                <Button
                  fontSize="2xl"
                  fontWeight="medium"
                  bg="#EAE6DA"
                  _hover={{ bg: "#DDD8C6", transform: "scale(1.05)" }}
                  onClick={() =>
                    handleSendMessage("동계 계절학기 수강신청 언제야")
                  }
                >
                  동계 계절학기 수강신청 언제야
                </Button>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Box w="100%" flex="1" overflowY="auto" mb="20px" position="relative">
            <MessageList messages={messages} />
            <div ref={bottomRef} />
          </Box>
        )}
        <Box
          w="100%"
          h={loading ? "60px" : "0"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          pb={loading ? "110px" : "0"}
          transition="height 0.3s ease-in-out, padding-bottom 0.3s ease-in-out"
        >
          {loading && (
            <Flex align="center" justify="center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="#E8E5D9"
                color="#fcb9aa"
                size="lg"
              />
              <Text fontSize="20px" color="#555" ml="12px">
                응답을 기다리는 중...
              </Text>
            </Flex>
          )}
        </Box>
        <Box w="90%" maxW="800px" mt="20px" position="relative" mb="20px">
          <MessageInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={() => handleSendMessage(inputMessage)}
            setInputHeight={setInputHeight}
            isLoading={loading}
          />
        </Box>
        <IntroModal isOpen={isModalOpen} onClose={closeModal} />{" "}
        {/* 모달 컴포넌트 */}
      </Flex>
    </Box>
  );
};

export default GuestPage;
