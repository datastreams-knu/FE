import { useState, useEffect } from 'react';
import { MessageInput } from './message-input';
import { MessageList } from './message-list';
import { Sidebar } from './sidebar';
import { IconButton, Button } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import styled from '@emotion/styled';
import axios from 'axios';

const KAKAO_AUTH_URL = `http://127.0.0.1:8080`;

const MainPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
  const [userInfo, setUserInfo] = useState({ name: '', email: '' }); // 사용자 정보 상태 추가

  useEffect(() => {
    // 로컬 스토리지에서 kakaoToken 확인 후 로그인 상태 설정
    const kakaoToken = localStorage.getItem('kakaoToken');
    if (kakaoToken) {
      setIsLoggedIn(true);
      fetchUserInfo(kakaoToken); // 토큰이 있으면 사용자 정보 가져오기
    }
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prev) => [inputMessage, ...prev]);
      setInputMessage('');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL; // 카카오 로그인 페이지로 이동
  };

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/api/member/info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error('사용자 정보를 불러오는 중 오류 발생:', error);
    }
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

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
        <Header>
          {!isLoggedIn ? (
            <KakaoLoginButton onClick={handleKakaoLogin}>카카오 로그인</KakaoLoginButton>
          ) : (
            <UserInfo>
              <p>{userInfo.name}님 환영합니다!</p>
              <Button onClick={() => {
                localStorage.removeItem('kakaoToken');
                setIsLoggedIn(false);
              }}>로그아웃</Button>
            </UserInfo>
          )}
        </Header>
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

// Wrapper 컴포넌트 스타일
const Wrapper = styled.div<{ isSidebarOpen: boolean }>`
  padding: 20px;
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '250px' : '0')};
  transition: margin-left 0.3s ease-in-out;
`;

// 사이드바 열기 버튼 컨테이너 스타일
const OpenButtonContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1001;
`;

// 헤더 스타일 (카카오 로그인 버튼을 위한 상단 영역)
const Header = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  align-items: center;
`;

// 카카오 로그인 버튼 스타일
const KakaoLoginButton = styled(Button)`
  background-color: #fee500;
  color: #000;
  &:hover {
    background-color: #ffd700;
  }
`;

// 사용자 정보 스타일
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  p {
    margin: 0;
  }
`;
