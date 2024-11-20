import { Box, Textarea, IconButton, Flex } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useRef, useEffect, useCallback } from "react";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  setInputHeight: (height: number) => void;
  isLoading: boolean; // 로딩 상태 속성 추가
}

export const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  setInputHeight,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    autoResize();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(); // MainPage에서 정의된 handleSendMessage 함수 호출
    }
  };

  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setInputHeight(textareaRef.current.scrollHeight);
    }
  }, [setInputHeight]);

  useEffect(() => {
    autoResize();
  }, [inputMessage, autoResize]);

  return (
    <Box
      position="fixed"
      bottom="20px"
      left="50%"
      transform="translateX(-50%)"
      width="90%"
      maxW="800px"
      bg="#f6f6f6"
      borderRadius="20px"
      p="10px 10px"
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
      zIndex="100"
    >
      <Flex position="relative" align="flex-end">
        <Textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a question..."
          rows={1}
          bg="transparent"
          border="none"
          outline="none"
          width="100%"
          fontFamily={`'Noto Sans KR', sans-serif`}
          fontSize={"16px"}
          pr="45px"
          resize="none"
          overflowY="auto"
          maxH="180px"
          minH="36px"
          lineHeight="1.5"
          _placeholder={{ color: "#ccc" }}
          _focus={{ boxShadow: "none", outline: "none" }}
          sx={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: "10px",
            },
          }}
        />
        <IconButton
          aria-label="Send message"
          icon={<ArrowUpIcon />}
          colorScheme="gray"
          variant="ghost"
          size="md"
          isRound
          position="absolute"
          right="7px"
          bg="#d7d7d7"
          zIndex="10"
          onClick={onSendMessage}
          isDisabled={isLoading}
        />
      </Flex>
    </Box>
  );
};
