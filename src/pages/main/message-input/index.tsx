import { Box, Textarea, IconButton } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";
import { useRef, useEffect } from "react";
import axios from "axios";

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
  const baseURL = import.meta.env.VITE_BASE_URL; // baseURL 가져오기
  console.log("baseURL:", baseURL);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    autoResize();
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      // 메시지를 리스트에 추가하는 작업은 기존과 같이 수행
      onSendMessage();

      // 메시지를 백엔드 서버로 전송하는 API 호출
      try {
        const response = await axios.post(`${baseURL}/api/front-ai-response`, {
          question: inputMessage,
        });

        // 서버 응답을 콘솔에 출력
        console.log("AI Response:", response.data.response);
      } catch (error) {
        console.error("Error while sending message:", error);
      }

      // 메시지 입력창 초기화
      setInputMessage("");
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
          placeholder="Type a message..."
          rows={1}
        />
        <FixedIconButton
          aria-label="Send message"
          icon={<ArrowUpIcon />}
          colorScheme="gray"
          variant="ghost"
          size="md"
          isRound
          onClick={handleSendMessage}
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
  padding-right: 40px;
  resize: none;
  overflow-y: auto; // 스크롤바 추가
  max-height: 200px; // 최대 높이 설정
  min-height: 36px;
  line-height: 1.5;
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
  right: -10px;
  bottom: -5px;
  background-color: #d7d7d7;
  z-index: 10;
`;
