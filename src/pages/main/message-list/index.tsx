import { useEffect, useRef } from "react";
import { Box, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";

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
      {messages.map((message, index) => {
        // 뒤에서부터 번호를 매긴 index 계산
        const reversedIndex = messages.length - index;
        const isEven = reversedIndex % 2 === 0;

        return (
          <MessageBox key={index} isEven={isEven} fontSize={"xl"}>
            <Text>{message}</Text>
          </MessageBox>
        );
      })}
    </MessageListContainer>
  );
};

// 메시지 리스트 컨테이너 스타일
const MessageListContainer = styled(Box)`
  width: 90%; // 메시지 입력창과 동일한 너비 설정
  max-width: 800px; // 입력창의 최대 너비와 맞춤
  display: flex;
  flex-direction: column-reverse; // 아래에서부터 메시지가 쌓임
  min-height: 60vh; // 화면의 60% 높이를 최소 높이로 설정하여 스크롤 공간 확보
  overflow: visible; // 메시지 리스트 자체의 스크롤 비활성화
  padding: 10px;
  margin: 0 auto 60px; // 중앙 정렬 및 메시지 입력창과 간격을 둠
`;

// 메시지 박스 스타일 (동적 길이, 정렬 위치 설정)
const MessageBox = styled(Box)<{ isEven: boolean }>`
  margin: 5px 0;
  padding: 10px;
  background-color: ${({ isEven }) =>
    isEven ? "#FFDFB8" : "#DDD8C6"}; // 뒤에서부터 계산한 짝수 색상 설정
  border-radius: 8px;
  max-width: 80%; // 메시지 박스의 최대 너비 설정 (화면의 80%)
  align-self: ${({ isEven }) =>
    isEven
      ? "flex-start"
      : "flex-end"}; // 뒤에서부터 계산한 짝수는 좌측, 홀수는 우측 정렬
  word-wrap: break-word; // 긴 텍스트가 박스를 넘지 않도록 자동 줄바꿈
`;
