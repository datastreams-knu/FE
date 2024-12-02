import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  IconButton,
  Flex,
  Button,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const transitionDuration = useBreakpointValue({ base: "0.3s", md: "0.5s" });

  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"history" | "myInfo" | null>(
    null
  );
  const [userInfo, setUserInfo] = useState<{
    nickname: string;
    joinedAt: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setHasAccessToken(!!token);

    // 로그인 상태일 때 기본 탭을 "히스토리"로 설정
    if (token) {
      setSelectedTab("history");
    }
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const baseURL = import.meta.env.VITE_BASE_URL; // 환경변수에서 baseURL 가져오기
      const token = localStorage.getItem("accessToken"); // 로컬스토리지에서 토큰 가져오기

      if (!token) {
        setError("토큰이 없습니다.");
        return;
      }

      try {
        const response = await fetch(`${baseURL}/api/member/info`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data); // API 응답 데이터를 상태에 저장
        } else if (response.status === 400) {
          console.log("토큰 오류: 400");
          setError("토큰 오류: 400");
        } else if (response.status === 404) {
          console.log("잘못된 사용자: 404");
          setError("잘못된 사용자: 404");
        } else {
          console.log("알 수 없는 오류:", response.status);
          setError(`알 수 없는 오류: ${response.status}`);
        }
      } catch (err) {
        console.log("API 호출 에러:", err);
        setError("API 호출 중 오류가 발생했습니다.");
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogin = () => navigate("/login");

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // accessToken 제거
    window.location.reload(); // 페이지 새로고침으로 GuestPage 렌더링
  };

  return (
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
      {/* 사이드바 열림/닫힘 버튼 */}
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
            {/* 버튼 렌더링 */}
            {!hasAccessToken ? (
              <Button
                variant="unstyled"
                background={"#DD938D"}
                width={{ base: "200px", md: "250px" }}
                height="45px"
                fontSize={{ base: "22px", md: "27px" }}
                fontWeight={100}
                letterSpacing={"0.2em"}
                onClick={handleLogin}
                zIndex={30000}
                boxShadow={"0 2px 4px rgba(0, 0, 0, 0.1)"} // 기본 그림자
                _hover={{
                  bg: "#B86D66", // 호버 시 진한 색상
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", // 호버 시 그림자 추가
                }}
              >
                <Text mr={-2}>로그인</Text>
              </Button>
            ) : (
              <Flex
                justifyContent="center" // Flex를 가로 방향으로 중앙 정렬
                alignItems="center" // Flex를 세로 방향으로 중앙 정렬
                mt={4}
              >
                <Flex
                  justifyContent="space-between" // 버튼 간격 균등 분배
                  alignItems="center"
                  width={{ base: "200px", md: "250px" }}
                  height="50px"
                  fontSize={{ base: "22px", md: "27px" }}
                  fontWeight={100}
                  letterSpacing={"0.2em"}
                  background="#DD938D"
                  borderRadius="10px"
                  boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                  overflow="hidden" // 버튼이 박스 바깥으로 나오지 않도록 설정
                >
                  <Button
                    variant="unstyled"
                    background={
                      selectedTab === "history" ? "#B86D66" : "#DD938D"
                    } // 로그인 버튼 색상
                    color="white"
                    flex="1" // 두 버튼이 동일한 크기를 가지도록 설정
                    height="100%"
                    fontSize={{ base: "18px", md: "22px" }}
                    fontWeight="light"
                    letterSpacing={"0.1em"}
                    onClick={() => setSelectedTab("history")}
                    _active={{
                      background: "#B86D66", // 클릭 시 진한 색상
                    }}
                  >
                    히스토리
                  </Button>
                  <Box
                    width="2px"
                    background="white"
                    height="70%"
                    borderRadius={"md"}
                  />{" "}
                  {/* 버튼 간 구분선 */}
                  <Button
                    variant="unstyled"
                    background={
                      selectedTab === "myInfo" ? "#B86D66" : "#DD938D"
                    } // 로그인 버튼 색상
                    color="white"
                    flex="1" // 두 버튼이 동일한 크기를 가지도록 설정
                    height="100%"
                    fontSize={{ base: "18px", md: "22px" }}
                    fontWeight="light"
                    letterSpacing={"0.1em"}
                    onClick={() => setSelectedTab("myInfo")}
                    _active={{
                      background: "#B86D66", // 클릭 시 진한 색상
                    }}
                  >
                    내 정보
                  </Button>
                </Flex>
              </Flex>
            )}
            {/* 선택된 탭 내용 표시 */}
            {selectedTab === "history" && (
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
                히스토리 내용이 표시됩니다.
              </Box>
            )}
            {selectedTab === "myInfo" && (
              <Box
                width={{ base: "200px", md: "250px" }}
                display={"flex"}
                flexDirection={"column"}
                mt={10}
                ml={"auto"}
                mr={"auto"}
                p={5}
                borderRadius={"md"}
                textAlign={"left"}
                color={"black"}
                fontSize={{ base: "20px", md: "26px" }}
                background={"#F2B8AB"}
                opacity={0.8}
                boxShadow={
                  "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)"
                } // 사용자 정의 그림자
              >
                {userInfo ? (
                  <Box>
                    <Text>닉네임: {userInfo.nickname}</Text>
                    <Text>가입일: {userInfo.joinedAt.split("T")[0]}</Text>
                  </Box>
                ) : error ? (
                  <Text color="red.500">{error}</Text>
                ) : (
                  <Text>정보를 불러오는 중...</Text>
                )}
                <Button
                  mt={4}
                  fontSize={{ base: "20px", md: "22px" }}
                  fontWeight="medium"
                  bg="#E7A8A3"
                  color="black"
                  _hover={{ bg: "#D17C74" }}
                  onClick={handleLogout} // 로그아웃 버튼
                >
                  로그아웃
                </Button>
                <Button
                  mt={4}
                  fontSize={{ base: "20px", md: "22px" }}
                  fontWeight="medium"
                  bg="#E7A8A3"
                  color="black"
                  _hover={{ bg: "#D17C74" }}
                >
                  회원탈퇴
                </Button>
              </Box>
            )}
            {/* 학부 정보 */}
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
              <Box>
                github :&nbsp;
                <Link
                  href="https://github.com/datastreams-knu"
                  textDecoration="underline"
                >
                  링크 연결
                </Link>
              </Box>
              <Box>
                학부공지 페이지:&nbsp;
                <Link
                  href="https://computer.knu.ac.kr/bbs/board.php?bo_table=sub5_1"
                  textDecoration="underline"
                >
                  링크 연결
                </Link>
              </Box>
              <Box>Copyright(c) 2024, 조현준(PM, AI), 최기영(FE),</Box>
              <Box>유승종(BE), 고상희(AI), 이석현(AI)</Box>
            </Box>
          </Box>
        </Flex>
      )}
    </Box>
  );
};
