import { Box, IconButton, Flex } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import styled from '@emotion/styled';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <Flex justify="flex-end" p={4}>
        <IconButton
          aria-label="Close sidebar"
          icon={<CloseIcon />}  // 닫기 아이콘
          onClick={toggleSidebar}  // 사이드바 닫기
          color="white"
          variant="ghost"
          size="lg"
        />
      </Flex>
      <Box p={4}>
        <p>Menu Item 1</p>
        <p>Menu Item 2</p>
      </Box>
    </SidebarContainer>
  );
};

const SidebarContainer = styled(Box)<{ isOpen: boolean }>`
  width: 250px;
  height: 100vh;
  background-color: #2d3748;
  color: white;
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? '0' : '-250px')}; // 열림/닫힘에 따른 위치 변화
  transition: left 0.3s ease-in-out; // 부드러운 전환 효과
  z-index: 1000;
`;
