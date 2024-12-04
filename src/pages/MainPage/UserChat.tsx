import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageInput } from "./MessageInput/MessageInput";
import { MessageList } from "./messageList/MessageList";
import { Sidebar } from "./Sidebar/Sidebar";
import { IntroModal } from "./IntroModal";
import {
  Box,
  Flex,
  Spinner,
  Text,
  Button,
  Image,
  useToast,
} from "@chakra-ui/react";
import tutorial1 from "@/assets/tutorial1.svg";
import tutorial2 from "@/assets/tutorial2.svg";
import tutorial3 from "@/assets/tutorial3.svg";
import tutorial4 from "@/assets/tutorial4.svg";
import tutorial5 from "@/assets/tutorial5.svg";

interface Message {
  Question: string;
  Answer: {
    answer: string;
    images?: string[];
    disclaimer?: string;
    references?: string;
  };
  QDate: string; // 필요에 따라 타입 추가
  _id: string;
  __v: number;
}

const UserChat = () => {
  const { history_id } = useParams<{ history_id: string }>();
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [inputHeight, setInputHeight] = useState(36);
  const [loading, setLoading] = useState(false);
  const [isFetchingHistory, setFetchingHistory] = useState(false); // 히스토리 로딩 상태
  const [tutorialImage, setTutorialImage] = useState<string>(""); // 랜덤 이미지 상태 추가
  const [isModalOpen, setModalOpen] = useState(false); // 모달 상태 추가
  const bottomRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const prevHeightRef = useRef<number>(0); // 이전 높이를 저장할 ref
  const baseURL = import.meta.env.VITE_BASE_URL;
  const toast = useToast();
  const navigate = useNavigate();

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

        // URL에서 historyID 가져오기
        const token = localStorage.getItem("accessToken"); // 로컬 스토리지에서 토큰 가져오기

        // API 요청
        const response = await fetch(
          `${baseURL}/api/chat/user-question/${history_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
            },
            body: JSON.stringify({ question: message }), // historyId 추가
          }
        );

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

        const formattedResponse = `${data.answer ? cleanText(data.answer) : ""}
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
        // Toast로 에러 메시지 표시
        toast({
          title: (
            <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              에러 발생
            </span>
          ),
          description: (
            <span style={{ fontSize: "1.2rem" }}>
              5초 뒤 메인페이지로 이동합니다.
            </span>
          ),
          status: "error",
          position: "top",
          duration: 4500,
          isClosable: true,
        });
        setMessages((prev) => [
          ...prev,
          "서버에 문제가 있습니다. 잠시 후 다시 시도해주세요!",
        ]);

        // 5초 후 메인 페이지로 이동
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchHistoryMessages = async () => {
      setFetchingHistory(true); // 히스토리 로딩 시작
      const startTime = Date.now(); // 시작 시간 기록

      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${baseURL}/api/history/show-questions/${history_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("히스토리를 불러오는데 실패했습니다.");
        }

        const data: Message[] = await response.json();

        const makeLinksClickable = (text: string): string => {
          const urlRegex = /(https?:\/\/[^\s]+)/g; // URL 패턴
          return text.replace(
            urlRegex,
            (url: string) =>
              `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">${url}</a>`
          );
        };

        const cleanText = (text: string): string =>
          text.replace(/^\s+|\s+$/g, ""); // 공백 및 줄바꿈 제거

        const formattedMessages = data
          .map((item: Message) => {
            const { Question, Answer } = item;
            const formattedAnswer = `${
              Answer.answer ? cleanText(Answer.answer) : ""
            }
            ${
              Answer.images?.length && Answer.images[0] !== "No content"
                ? Answer.images
                    .map(
                      (url: string) =>
                        `<img src="${url}" alt="이미지" style="max-width: 100%; height: auto; margin-top: 10px;" />`
                    )
                    .join("\n")
                : ""
            }
            ${Answer.disclaimer || ""}
            ${makeLinksClickable(Answer.references || "")}`.trim();

            return [Question, formattedAnswer];
          })
          .flat();

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching history messages:", error);
      } finally {
        const elapsedTime = Date.now() - startTime; // 경과 시간 계산
        const remainingTime = Math.max(2000 - elapsedTime, 0); // 최소 2초를 보장

        setTimeout(() => {
          setFetchingHistory(false); // 로딩 종료
        }, remainingTime);
      }
    };

    if (history_id) fetchHistoryMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history_id]);

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

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

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
      {/* 히스토리 로딩 중 처리 */}
      {isFetchingHistory && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.4)" // 반투명 배경
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex="2000" // 다른 요소 위로 오도록 설정
        >
          <Spinner size="xl" color="white" />
          <Text color="white" fontSize={{ base: "xl", md: "3xl" }} ml="4">
            챗봇의 전원을 키고 있습니다🤖
          </Text>
        </Box>
      )}
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
                  onClick={() =>
                    handleSendMessage("정설영 교수님 이메일 알려줘")
                  }
                >
                  정설영 교수님 이메일 알려줘
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
          <Box w="100%" flex="1" overflowY="auto" mb="20px">
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
        <Box w="90%" maxW="800px" mt="20px">
          <MessageInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={() => handleSendMessage(inputMessage)}
            setInputHeight={setInputHeight}
            isLoading={loading}
          />
        </Box>
        <IntroModal isOpen={isModalOpen} onClose={closeModal} />
      </Flex>
    </Box>
  );
};

export default UserChat;
