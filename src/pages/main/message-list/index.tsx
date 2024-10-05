import { useEffect, useRef } from 'react';
import { Box, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';

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
    <MessageListContainer ref={messageListRef}>
      {messages.map((message, index) => (
        <MessageBox key={index}>
          <Text>{message}</Text>
        </MessageBox>
      ))}
    </MessageListContainer>
  );
};

// 메시지 리스트 컨테이너 스타일 (테두리 제거)
const MessageListContainer = styled(Box)`
  width: 80%;  // 화면의 80% 너비
  display: flex;
  flex-direction: column-reverse;  // 아래에서부터 메시지가 쌓임
  max-height: 400px;  // 메시지 리스트의 최대 높이 설정
  overflow-y: auto;   // 스크롤 가능
  padding: 10px;
  margin-bottom: 60px; // 메시지 입력창과 간격을 둠
`;

// 메시지 박스 스타일 (동적 길이, 우측 정렬)
const MessageBox = styled(Box)`
  margin: 5px 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  max-width: 80%;  // 메시지 박스의 최대 너비 설정 (화면의 80%)
  align-self: flex-end;  // 우측 정렬
  word-wrap: break-word;  // 긴 텍스트가 박스를 넘지 않도록 자동 줄바꿈
`;
