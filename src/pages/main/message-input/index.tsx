import { Box, Textarea, IconButton } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";
import { useRef, useEffect, useState } from "react";
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
  const [_response, setResponse] = useState(null);
  const baseURL = import.meta.env.VITE_BASE_URL; // baseURL 가져오기
  console.log("baseURL:", baseURL);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    autoResize();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/test`);
        setResponse(res.data);
        console.log("Fetched data:", res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [baseURL]);

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
          onClick={onSendMessage}
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
  overflow: hidden;
  max-height: 200px;
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
