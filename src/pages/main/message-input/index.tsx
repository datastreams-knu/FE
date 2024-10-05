/** @jsxImportSource @emotion/react */
import { Textarea, Button, Flex } from '@chakra-ui/react';

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
}) => {
  return (
    <Flex>
      <Textarea
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Enter your message..."
        resize="none"
        rows={inputMessage.length > 40 ? 3 : 1}
        flex="1"
        mr={2}
        bg="white"
        w="80%"  // 텍스트박스 너비를 80%로 설정
      />
      <Button onClick={onSendMessage} colorScheme="blue">
        Send
      </Button>
    </Flex>
  );
};

export default MessageInput;
