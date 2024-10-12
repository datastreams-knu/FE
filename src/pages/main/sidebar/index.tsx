import { Box, IconButton, Flex } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";
import knuLogo from "@/assets/knuLogo.svg"; // 경북대 로고 이미지 가져오기

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <IconButton
        aria-label="Close sidebar"
        icon={<CloseIcon />} // 닫기 아이콘
        onClick={toggleSidebar} // 사이드바 닫기
        color="white"
        variant="ghost"
        size="lg"
        style={{ position: "absolute", right: "16px", top: "16px" }} // 닫기 버튼을 오른쪽 위에 고정
      />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        mt={8}
        width="100%"
      >
        {" "}
        {/* 가로로 가운데 정렬 */}
        <Box textAlign="center" mb={4}>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            경북대 컴퓨터학부
          </p>{" "}
          {/* 폰트 크기와 굵기 조정 */}
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            학사 정보 AI
          </p>{" "}
          {/* 폰트 크기와 굵기 조정 */}
        </Box>
        <img
          src={knuLogo}
          alt="KNU Logo"
          style={{ width: "100px", height: "100px" }}
        />
        <Divider /> {/* 구분선 추가 */}
      </Flex>
    </SidebarContainer>
  );
};

const SidebarContainer = styled(Box)<{ isOpen: boolean }>`
  width: 340px; // 전체 화면의 4분의 1 너비
  height: 100vh;
  background-color: #fcb9aa; // 배경 색상 헥스 코드
  color: white;
  position: fixed;
  top: 0;
  left: ${({ isOpen }) =>
    isOpen ? "0" : "-340px"}; // 열림/닫힘 상태에 따라 사이드바 위치 변경
  transition: left 0.5s ease-in-out; // 부드러운 애니메이션 효과
  z-index: 1000;
  text-align: center; // 모든 텍스트 가운데 정렬
  padding-top: 16px;
`;

const Divider = styled.hr`
  width: 80%;
  border: 0;
  border-top: 1px solid white;
  margin: 16px 0;
`;
