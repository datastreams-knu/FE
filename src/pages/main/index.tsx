import { useState } from 'react';
import { MessageInput } from './message-input';
import { MessageList } from './message-list';
import { Sidebar } from './sidebar';
import { IconButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import styled from '@emotion/styled';

const MainPage = () => {
  const [messages, setMessages] = useState<string[]>([]); // 메시지 리스트 상태
  const [inputMessage, setInputMessage] = useState('');   // 메시지 입력 상태
  const [isSidebarOpen, setSidebarOpen] = useState(true); // 사이드바 상태

  // 메시지 전송 함수
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prev) => [inputMessage, ...prev]); // 새 메시지를 메시지 리스트에 추가
      setInputMessage(''); // 메시지 입력창 초기화
    }
  };

  // 사이드바 열기/닫기 함수
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {/* 사이드바 컴포넌트 */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* 사이드바가 닫혔을 때, 열기 버튼 표시 */}
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
        {/* 메시지 리스트 출력 */}
        <MessageList messages={messages} />

        {/* 메시지 입력창 */}
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

// Wrapper 컴포넌트 스타일
const Wrapper = styled.div<{ isSidebarOpen: boolean }>`
  padding: 20px;
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '250px' : '0')}; // 사이드바가 열리면 250px 마진
  transition: margin-left 0.3s ease-in-out; // 부드러운 전환 효과
`;

// 사이드바 열기 버튼 컨테이너 스타일
const OpenButtonContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1001;  // 사이드바보다 상위에 표시되도록 설정
`;
