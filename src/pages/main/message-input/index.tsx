import { Box, Textarea, IconButton } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";
import { useRef, useEffect } from "react";

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

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setInputHeight(textareaRef.current.scrollHeight);
    }
  };

  useEffect(() => {
    autoResize();
  }, [inputMessage]);

  return (
    <MessageInputContainer>
      <TextareaWrapper>
        <StyledTextarea
          ref={textareaRef}
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a question..."
          rows={1}
        />
        <FixedIconButton
          aria-label="Send message"
          icon={<ArrowUpIcon />}
          colorScheme="gray"
          variant="ghost"
          size="md"
          isRound
          onClick={onSendMessage}
          isDisabled={isLoading} // 로딩 중일 때 버튼 비활성화
        />
      </TextareaWrapper>
    </MessageInputContainer>
  );
};

// 스타일 코드 그대로 유지
const MessageInputContainer = styled(Box)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  background-color: #f6f6f6;
  border-radius: 20px;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const TextareaWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
`;

const StyledTextarea = styled(Textarea)`
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-size: 22px;
  padding-right: 45px;
  resize: none;
  overflow-y: auto;
  max-height: 180px;
  min-height: 36px;
  line-height: 1.5;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
  }
  ::placeholder {
    color: #ccc;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const FixedIconButton = styled(IconButton)`
  position: absolute;
  right: 15px;
  background-color: #d7d7d7;
  z-index: 10;
`;
