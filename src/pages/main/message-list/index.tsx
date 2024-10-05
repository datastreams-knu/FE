/** @jsxImportSource @emotion/react */
import { Box } from '@chakra-ui/react';

interface MessageListProps {
  messages: string[];  // messages는 문자열 배열
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <Box overflowY="auto" maxH="70vh" mb={4}>
      {messages.map((message, index) => (
        <Box
          key={index}
          bg="blue.500"
          color="white"
          p={3}
          my={2}
          borderRadius="md"
          width="fit-content"
          alignSelf="flex-start"
        >
          {message}
        </Box>
      ))}
    </Box>
  );
};

export default MessageList;
