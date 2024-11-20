import { useState, useEffect, useRef } from "react";
import { MessageInput } from "./MessageInput/MessageInput";
import { MessageList } from "./messageList/MessageList";
import { Sidebar } from "./Sidebar/Sidebar";
import { Box, Flex, Spinner, Text, Button, Image } from "@chakra-ui/react";
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
  const prevHeightRef = useRef<number>(0); // 이전 높이를 저장할 ref
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
      setMessages((prev) => {
        const updatedMessages = [...prev, message]; // 메시지를 뒤에 추가
        console.log("현재 메시지 목록:", updatedMessages);
        return updatedMessages;
      });

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

        setMessages((prev) => {
          const updatedMessages = [...prev, formattedResponse]; // 응답 메시지도 뒤에 추가
          console.log("현재 메시지 목록:", updatedMessages);
          return updatedMessages;
        });
      } catch (error) {
        console.error("Error while sending message:", error);
        setMessages((prev) => {
          const updatedMessages = [
            ...prev,
            "서버에 문제가 있습니다. 잠시 후 다시 시도해주세요!",
          ];
          console.log("현재 메시지 목록:", updatedMessages);
          return updatedMessages;
        });
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
              <Image
                src={tutorialImage}
                alt="Tutorial"
                maxW="90%"
                maxH="400px"
                objectFit="contain"
              />
              <Flex
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
                  onClick={() => handleSendMessage("최근 공지사항 알려줘")}
                >
                  최근 공지사항 알려줘
                </Button>
                <Button
                  fontSize="2xl"
                  fontWeight="medium"
                  bg="#EAE6DA"
                  _hover={{ bg: "#DDD8C6", transform: "scale(1.05)" }}
                  onClick={() =>
                    handleSendMessage("점심 제공하는 세미나 알려줘")
                  }
                >
                  점심 제공하는 세미나 알려줘
                </Button>
                <Button
                  fontSize="2xl"
                  fontWeight="medium"
                  bg="#EAE6DA"
                  _hover={{ bg: "#DDD8C6", transform: "scale(1.05)" }}
                  onClick={() =>
                    handleSendMessage("컴퓨터학부 대회 정보 알려줘")
                  }
                >
                  참여가능한 대회 알려줘
                </Button>
                <Button
                  fontSize="2xl"
                  fontWeight="medium"
                  bg="#EAE6DA"
                  _hover={{ bg: "#DDD8C6", transform: "scale(1.05)" }}
                  onClick={() => handleSendMessage("졸업요건에 대해 알려줘")}
                >
                  졸업요건에 대해 알려줘
                </Button>
                <Button
                  fontSize="2xl"
                  fontWeight="medium"
                  bg="#EAE6DA"
                  _hover={{ bg: "#DDD8C6", transform: "scale(1.05)" }}
                  onClick={() => handleSendMessage("수강신청 언제야")}
                >
                  수강신청 언제야
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
      </Flex>
    </Box>
  );
};

export default MainPage;
