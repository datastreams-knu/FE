// sidebar.tsx

import { Box, IconButton, Flex, Link, Button } from "@chakra-ui/react";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";
import knuLogo from "@/assets/knuLogo.svg";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const handleKakaoLogin = () => {
    window.location.href = "http://127.0.0.1:8080";
  };

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <ToggleButton
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          icon={
            isOpen ? (
              <ArrowBackIcon boxSize={6} />
            ) : (
              <ArrowForwardIcon boxSize={6} />
            )
          }
          onClick={toggleSidebar}
          variant="ghost"
          size="lg"
        />
        {isOpen && (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            mt={8}
            width="100%"
          >
            <Box textAlign="center" mb={4}>
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                경북대 컴퓨터학부
              </p>
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                학사 정보 AI
              </p>
            </Box>
            <img
              src={knuLogo}
              alt="KNU Logo"
              style={{ width: "100px", height: "100px" }}
            />
            <Divider />
            <KakaoLoginButton onClick={handleKakaoLogin}>
              <KakaoLoginImage
                src="https://developers.kakao.com/tool/resource/static/img/button/login/full/ko/kakao_login_large_wide.png"
                alt="카카오 로그인"
              />
            </KakaoLoginButton>
          </Flex>
        )}
        {isOpen && (
          <Footer>
            <p>경북대학교 IT대학 컴퓨터학부</p>
            <p>
              우)41566 대구광역시 북구 대학로 80 / IT대학 융복합관
              317호(건물번호 : 415)
            </p>
            <p>TEL. 학부 : 950-5550 , 대학원 : 950-6420 </p>
            <p>FAX. 053-957-4846</p>
            <p>E-mail. scse@knu.ac.kr</p>
            <p>
              담당자 현황:
              <Link
                href="https://computer.knu.ac.kr/bbs/board.php?bo_table=sub2_5"
                color="white"
                fontWeight="bold"
                textDecoration="Highlight"
              >
                링크 연결
              </Link>
            </p>
            <p>Copyright(c) 2024, KNU CSE All rights reserved</p>
          </Footer>
        )}
      </SidebarContainer>
    </>
  );
};

// isOpen 속성을 DOM에 전달하지 않도록 처리
const SidebarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOpen",
})<{ isOpen: boolean }>`
  width: 340px;
  height: 100vh;
  background-color: #fcb9aa;
  color: white;
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? "0" : "-340px")};
  transition: left 0.5s ease-in-out;
  z-index: 10000;
  text-align: center;
  padding-top: 16px;
`;

// 열기/닫기 버튼, 사이드바 오른쪽 중앙에 위치
const ToggleButton = styled(IconButton)`
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #fcb9aa;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  transition: background-color 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  & > svg {
    margin-left: 20px; // 아이콘을 오른쪽으로 살짝 이동
  }

  &:hover {
    background-color: #fcb9aa;
    transform: translateY(-50%) scale(1.2);
  }
`;

const Divider = styled.hr`
  width: 90%;
  border: 0;
  border-top: 1px solid white;
  margin: 20px 0;
`;

const Footer = styled(Box)`
  position: absolute;
  bottom: 0;
  padding: 20px;
  font-size: 12px;
  line-height: 1.5;
  text-align: left;
  color: white;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;

const KakaoLoginButton = styled(Button)`
  margin-top: 20px;
  background-color: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: transparent;
  }
`;

const KakaoLoginImage = styled.img`
  width: 300px;
  height: 45px;
  filter: brightness(1.2);
`;
