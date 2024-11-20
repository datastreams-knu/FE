import { useEffect, useRef } from "react";
import { Box, Text } from "@chakra-ui/react";

interface MessageListProps {
  messages: string[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messageListRef = useRef<HTMLDivElement>(null);

  // 새로운 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      ref={messageListRef}
      w="90%"
      maxW="800px"
      display="flex"
      flexDirection="column"
      minH="60vh"
      overflow="auto"
      p="10px"
      m="0 auto 60px"
    >
      {messages
        .slice() // 원본 배열을 복사하여 수정
        .map((message, index) => {
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
              fontSize={{ base: "xl", md: "2xl" }}
            >
              <Text>{message}</Text>
            </Box>
          );
        })}
    </Box>
  );
};
