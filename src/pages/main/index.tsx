import { useState } from 'react';
import MessageInput from './message-input';
import MessageList from './message-list';
import { Sidebar } from './sidebar';
import { IconButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import styled from '@emotion/styled';

const MainPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState(''); // 메시지 입력 상태 관리
  const [isSidebarOpen, setSidebarOpen] = useState(true); // 사이드바가 기본적으로 열려있도록 초기 상태를 true로 설정

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prev) => [inputMessage, ...prev]); // 메시지를 배열에 추가
      setInputMessage(''); // 메시지 입력창 초기화
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev); // 사이드바 열기/닫기 토글
  };

  return (
    <>
      {/* 사이드바 컴포넌트 */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* 사이드바가 닫혔을 때 열기 버튼을 메인 페이지에 표시 */}
      {!isSidebarOpen && (
        <OpenButtonContainer>
          <IconButton
            aria-label="Open sidebar"
            icon={<HamburgerIcon />}
            onClick={toggleSidebar}
            size="lg"
          />
        </OpenButtonContainer>
      )}

      <Wrapper isSidebarOpen={isSidebarOpen}>
        <MessageList messages={messages} />
        <MessageInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendMessage}
        />
      </Wrapper>
    </>
  );
};

export default MainPage;

// Wrapper 컴포넌트의 스타일
const Wrapper = styled.div<{ isSidebarOpen: boolean }>`
  padding: 20px;
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '250px' : '0')}; // 사이드바가 열리면 250px 마진
  transition: margin-left 0.3s ease-in-out; // 부드러운 전환 효과
`;

// 사이드바 열기 버튼이 위치할 컨테이너
const OpenButtonContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1001;  // 사이드바보다 상위에 표시되도록 설정
`;
