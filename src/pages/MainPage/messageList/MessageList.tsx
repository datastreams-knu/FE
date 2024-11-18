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
      flexDirection="column-reverse"
      minH="60vh"
      overflow="visible"
      p="10px"
      m="0 auto 60px"
    >
      {messages.map((message, index) => {
        // 뒤에서부터 번호를 매긴 index 계산
        const reversedIndex = messages.length - index;
        const isEven = reversedIndex % 2 === 0;

        return (
          <Box
            key={index}
            m="5px 0"
            p="10px"
            bg={isEven ? "#FFDFB8" : "#DDD8C6"}
            borderRadius="8px"
            maxW="80%"
            alignSelf={isEven ? "flex-start" : "flex-end"}
            wordBreak="break-word"
            fontSize="xl"
          >
            <Text>{message}</Text>
          </Box>
        );
      })}
    </Box>
  );
};
