import { Box, IconButton, Flex, Link, Button } from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  ArrowBackIcon,
  InfoOutlineIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import styled from "@emotion/styled";
import knuLogo from "@/assets/knuLogo.svg";
import React, { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 tooltip이 닫혔는지 확인
    const tooltipDismissed = localStorage.getItem("tooltipDismissed");
    let timer: NodeJS.Timeout;

    if (tooltipDismissed !== "true" && !isOpen) {
      // 사이드바가 닫히면 1.5초 후에 말풍선을 보이게 함
      timer = setTimeout(() => {
        setShowTooltip(true);
      }, 500);
    } else {
      // 로컬 스토리지에 값이 있거나 사이드바가 열리면 말풍선을 숨김
      setShowTooltip(false);
    }

    // 컴포넌트 언마운트 시 타이머 클리어
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen]);

  const handleKakaoLogin = () => {
    window.location.href = "http://127.0.0.1:8080";
  };

  // 닫기 버튼 클릭 시 로컬 스토리지에 값 저장하고 말풍선 숨기기
  const handleTooltipClose = () => {
    localStorage.setItem("tooltipDismissed", "true");
    setShowTooltip(false);
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
      {/* 사이드바가 닫힌 후 1.5초 뒤에 말풍선이 표시되도록 함 */}
      {!isOpen && showTooltip && (
        <TooltipContainer>
          <InfoOutlineIcon boxSize={5} color="transparent" />
          <TooltipBox>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <p>사이드바를 열어 로그인하거나</p>
                <p>히스토리를 볼 수 있어요!</p>
              </Box>
              <CloseButton
                aria-label="Close tooltip" // 필수 aria-label 추가
                onClick={handleTooltipClose}
              >
                <CloseIcon />
              </CloseButton>
            </Box>
          </TooltipBox>
        </TooltipContainer>
      )}
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

const ToggleButton = styled(IconButton)`
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #fcb9aa;
  color: white;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  transition: background-color 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    top: -10px;
    bottom: -10px;
    left: -10px;
    right: -10px;
    background: transparent;
  }

  & > svg {
    width: 40px;
    height: 40px;
    margin-left: 50px;
  }

  &:hover {
    background-color: #fcb9aa;
    transform: translateY(-50%) scale(1.1);
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
  bottom: 30px;
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

const TooltipContainer = styled(Box)`
  position: fixed;
  top: 45%;
  left: 20px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  z-index: 9999;

  animation: bounce 2s ease-in-out infinite; // 애니메이션 적용

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-50%);
    }
    50% {
      transform: translateY(-70%); // 위로 더 크게 이동
    }
  }
`;

const TooltipBox = styled(Box)`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  width: 250px;
  margin-left: -150px; // 아이콘과 말풍선 간격
  margin-top: -50px; // 아이콘과 말풍선 중앙 정렬
  padding: 16px; // 말풍선 내부 여백 (위아래 여백을 더 추가)
  background-color: #fcb9aa;
  color: white; // 텍스트 색상
  border-radius: 8px; // 말풍선 모서리 둥글기
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2); // 그림자 효과
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -7px; // 말풍선의 아래쪽 끝에 위치
    left: 5px; // 말풍선 왼쪽 모서리에 가깝게 위치하도록 설정
    transform: translateY(50%);
    border-width: 8px;
    border-style: solid;
    border-color: #fcb9aa transparent transparent transparent; // 꼬리의 색상 지정 (위쪽 방향으로)
  }
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 5px; // 박스 상단에서 8px 떨어지게 설정
  right: 0px; // 박스 오른쪽에서 8px 떨어지게 설정
  background: none;
  color: white;
  border: none;
  width: 20px; // 버튼 너비 설정 (작게 조정)
  height: 20px; // 버튼 높이 설정 (작게 조정)
  padding: 0; // 내부 여백 최소화

  & > svg {
    width: 14px; // 아이콘 크기 설정 (작게 조정)
    height: 14px; // 아이콘 크기 설정 (작게 조정)
  }

  &:hover {
    background: none;
  }
`;
