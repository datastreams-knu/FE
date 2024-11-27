import {
  Box,
  Text,
  IconButton,
  Flex,
  Link,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import React from "react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const transitionDuration = useBreakpointValue({ base: "0.3s", md: "0.5s" });

  const handleLogin = () => {
    navigate("/login"); // 페이지를 이동
  };

  return (
    <>
      <Box
        width={{ base: "260px", md: "340px" }}
        height="100vh"
        bg="#fcb9aa"
        color="white"
        position="fixed"
        top="0"
        left={isOpen ? "0" : { base: "-260px", md: "-340px" }}
        transition={`left ${transitionDuration} ease-in-out`}
        zIndex={10000}
        textAlign="center"
        paddingTop="16px"
      >
        {/* 사이드바 버튼 */}
        <IconButton
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
          position="absolute"
          right="-40px"
          top="50%"
          transform="translateY(-50%)"
          bg="#fcb9aa"
          color="white"
          borderRadius="50%"
          w="100px"
          h="100px"
          zIndex={-1}
          opacity="0.6"
          _hover={{
            bg: "#fcb9aa",
            transform: "translateY(-50%) scale(1.1)",
          }}
          sx={{
            "& > svg": {
              width: "40px",
              height: "40px",
              marginLeft: "50px",
            },
          }}
        />

        {isOpen && (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            mt={8}
            width="100%"
            height="calc(100vh - 16px)"
          >
            <Box
              textAlign="center"
              mb={4}
              fontSize={{ base: "36px", md: "50px" }}
              color="#C73732"
              fontFamily={"Nanum Pen Script"}
            >
              <Box>경북대 컴퓨터학부</Box>
              <Box mt="-10px">학사 정보 챗봇</Box>
            </Box>
            <Box
              as="hr"
              width="90%"
              borderTop="3px solid #FFD0C6"
              my={5}
              borderRadius={"md"}
            />
            <Box
              flex="1"
              overflowY="auto"
              width="100%"
              padding="10px"
              css={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#fcb9aa",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#fcb9aa",
                },
              }}
            >
              <Button
                variant="unstyled"
                background={"#B8433A"}
                width={{ base: "200px", md: "250px" }}
                height="45px"
                fontSize={{ base: "22px", md: "27px" }}
                fontWeight={100}
                letterSpacing={"0.2em"}
                onClick={handleLogin}
                zIndex={30000}
                _hover={{ bg: "#7E2B24" }}
              >
                <Text mr={-2}>로그인</Text>
              </Button>
              <Box
                width={{ base: "200px", md: "250px" }}
                height={"280px"}
                mt={10}
                ml={"auto"}
                mr={"auto"}
                borderRadius={"md"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                color={"black"}
                fontSize={{ base: "20px", md: "24px" }}
                background={"transparent"}
                border={"2px solid #7E2B24"}
              >
                채팅 히스토리가 들어갈 부분
              </Box>
              <Box
                fontFamily="'Nanum Gothic', sans-serif"
                fontSize={{ base: "10px", md: "12px" }}
                mt={5}
                pl={{ base: "15px", md: "30px" }}
                pr={0}
                pt={5}
                pb={50}
                ml={"auto"}
                mr={"auto"}
                lineHeight={1.5}
                textAlign="left"
                color="black"
                width="100%"
              >
                <Box>경북대학교 IT대학 컴퓨터학부</Box>
                <Box>우)41566 대구광역시 북구 대학로 80</Box>
                <Box>IT대학 융복합관 317호(건물번호 : 415)</Box>
                <Box>TEL. 학부 : 950-5550 , 대학원 : 950-6420 </Box>
                <Box>FAX. 053-957-4846</Box>
                <Box>E-mail. scse@knu.ac.kr</Box>
                <Box>
                  담당자 현황:&nbsp;
                  <Link
                    href="https://computer.knu.ac.kr/bbs/board.php?bo_table=sub2_5"
                    textDecoration="underline"
                  >
                    링크 연결
                  </Link>
                </Box>
                <Box>Copyright(c) 2024, KNU CSE All rights reserved</Box>
              </Box>
            </Box>
          </Flex>
        )}
      </Box>
    </>
  );
};
