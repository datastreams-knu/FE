// message-input.tsx

import { Box, Textarea, IconButton, Flex } from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';
import styled from '@emotion/styled';

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ inputMessage, setInputMessage, onSendMessage }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);  // 입력된 텍스트 상태 업데이트
  };

  return (
    <MessageInputContainer>
      <Flex align="center" width="100%">
        <TextareaWrapper>
          <StyledTextarea
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            rows={1}
          />
        </TextareaWrapper>
        <FixedIconButton
          aria-label="Send message"
          icon={<ArrowUpIcon />}
          colorScheme="gray"
          variant="ghost"
          size="lg"
          isRound
          onClick={onSendMessage}  // 전송 버튼 클릭 시 메시지 전송 함수 호출
        />
      </Flex>
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
  border-radius: 30px;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const TextareaWrapper = styled.div`
  flex: 1;
  margin-right: 10px;
`;

const StyledTextarea = styled(Textarea)`
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-size: 16px;
  padding: 0;
  resize: none;
  overflow: hidden;
  max-height: 200px;
  min-height: 36px;
  line-height: 1.5;
  ::placeholder {
    color: #ccc;
  }
`;

const FixedIconButton = styled(IconButton)`
  flex-shrink: 0;
  position: relative;
`;
