import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

interface MessageListProps {
  messages: string[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messageListRef = useRef<HTMLDivElement>(null);

  // 초기 화면 중앙으로 스크롤 설정
  useEffect(() => {
    if (messageListRef.current) {
      const container = messageListRef.current;
      container.scrollTop =
        container.scrollHeight / 2 - container.clientHeight / 2;
    }
  }, []);

  // 새로운 메시지가 추가될 때 애니메이션과 함께 스크롤
  useEffect(() => {
    if (messageListRef.current) {
      const container = messageListRef.current;

      // 자연스러운 스크롤 효과
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <Box
      ref={messageListRef}
      w="90%"
      maxW="800px"
      display="flex"
      flexDirection="column"
      justifyContent="center" // 중앙에서부터 시작
      minH="60vh"
      overflow="auto"
      p="10px"
      m="0 auto 60px"
    >
      {messages.map((message, index) => {
        const isEven = index % 2 === 1;

        return (
          <Box
            key={index}
            m="5px 0"
            p="10px"
            bg={isEven ? "#DDD8C6" : "#FFDFB8"}
            borderRadius="8px"
            maxW="80%"
            alignSelf={isEven ? "flex-start" : "flex-end"}
            wordBreak="break-word"
            fontSize={{ base: "xl", md: "xl" }}
            animation="fadeIn 0.5s ease" // CSS 애니메이션
            style={{
              opacity: 0,
              animation: "fadeIn 0.5s ease forwards",
              whiteSpace: "pre-line", // 줄 띄움 처리
              lineHeight: "1", // 줄 간격 설정
            }}
            dangerouslySetInnerHTML={{
              __html: message, // HTML 콘텐츠로 처리
            }}
          />
        );
      })}
    </Box>
  );
};

// CSS 애니메이션 추가
const style = document.createElement("style");
style.innerHTML = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
