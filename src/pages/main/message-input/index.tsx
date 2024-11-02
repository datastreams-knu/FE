// message-input.tsx

import { Box, Textarea, IconButton } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";
import { useRef, useEffect } from "react";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value); // 입력된 텍스트 상태 업데이트
    autoResize(); // 글자 수가 많아질 때 입력창 자동 조정
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(); // 엔터 키로 메시지 전송
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 높이 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 내용에 맞춰 높이 조정
    }
  };

  useEffect(() => {
    autoResize(); // 초기 렌더링 시 높이 조정
  }, [inputMessage]);

  return (
    <MessageInputContainer>
      <TextareaWrapper>
        <StyledTextarea
          ref={textareaRef}
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1} // 기본 높이 설정
        />
        <FixedIconButton
          aria-label="Send message"
          icon={<ArrowUpIcon />}
          colorScheme="gray"
          variant="ghost"
          size="md"
          isRound
          onClick={onSendMessage} // 전송 버튼 클릭 시 메시지 전송 함수 호출
        />
      </TextareaWrapper>
    </MessageInputContainer>
  );
};

// 메시지 입력창 스타일
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
  align-items: center;
`;

const StyledTextarea = styled(Textarea)`
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-size: 16px;
  padding-right: 40px; // 아이콘과의 간격을 확보
  resize: none;
  overflow: hidden;
  max-height: 200px;
  min-height: 36px;
  line-height: 1.5;
  ::placeholder {
    color: #ccc;
  }
  &:focus {
    outline: none;
    box-shadow: none; // 포커스 시 파란색 테두리 제거
  }
`;

// 아이콘 버튼을 입력창 오른쪽 아래에 고정
const FixedIconButton = styled(IconButton)`
  position: absolute;
  right: -10px;
  bottom: -5px;
  background-color: #d7d7d7;
  z-index: 10; // 아이콘이 입력창 위에 위치하도록 설정
`;
