import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Text,
  IconButton,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Link,
  Divider,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  ArrowBackIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface History {
  id: string;
  name: string;
  date: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const transitionDuration = useBreakpointValue({ base: "0.3s", md: "0.5s" });
  const [histories, setHistories] = useState<History[]>([]); // 타입 지정
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"history" | "myInfo" | null>(
    null
  );
  const [userInfo, setUserInfo] = useState<{
    nickname: string;
    joinedAt: string;
    num_of_question: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setHasAccessToken(!!token);

    // 로그인 상태일 때 기본 탭을 "히스토리"로 설정
    if (token) {
      setSelectedTab("history");
    }
  }, []);

  // fetchHistories 함수 메모이제이션
  const fetchHistories = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/api/history/show-all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data: History[] = await response.json();
        setHistories(data);
      } else {
        console.error("히스토리 불러오기에 실패했습니다.");
      }
    } catch (error) {
      console.error("히스토리 불러오기 중 오류 발생:", error);
    }
  }, [baseURL]);

  // 히스토리 이름 변경
  const handleRename = async (historyId: string, newName: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${baseURL}/api/history/rename/${historyId}/${encodeURIComponent(
          newName
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        toast({
          title: "히스토리 이름이 성공적으로 변경되었습니다.",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        fetchHistories(); // 히스토리 목록 새로고침
      } else {
        toast({
          title: "히스토리 이름 변경에 실패했습니다.",
          status: "error",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("히스토리 이름 변경 중 오류 발생:", error);
      toast({
        title: "히스토리 이름 변경 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }
  };

  // 히스토리 삭제
  const handleDelete = async (historyId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${baseURL}/api/history/delete/${historyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        toast({
          title: "히스토리가 성공적으로 삭제되었습니다.",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        fetchHistories(); // 히스토리 목록 새로고침
      } else {
        toast({
          title: "히스토리 삭제에 실패했습니다.",
          status: "error",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("히스토리 삭제 중 오류 발생:", error);
      toast({
        title: "히스토리 삭제 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }
  };

  const handleUserDelete = async () => {
    const confirmation = window.confirm(
      "정말로 회원탈퇴를 하시겠습니까? 모든 데이터가 삭제됩니다."
    );
    if (!confirmation) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/api/member/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          title: "회원탈퇴가 완료되었습니다.",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        localStorage.removeItem("accessToken");
        navigate("/");
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast({
          title: `회원탈퇴 실패: ${errorData.error || "알 수 없는 오류"}`,
          status: "error",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("회원탈퇴 중 오류 발생:", error);
      toast({
        title: "회원탈퇴 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }
  };

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
    navigate("/"); // 메인 페이지로 강제 이동
    window.location.reload(); // 페이지 새로고침
  };

  // 컴포넌트 로드 시 히스토리 데이터 불러오기
  useEffect(() => {
    fetchHistories();
  }, [fetchHistories]);

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
          <Box width={"100%"} mt={-50} pt={50} bg="#fcb9aa" zIndex={30000}>
            <Box
              textAlign="center"
              mb={4}
              fontSize={{ base: "30px", md: "46px" }}
              mt={-3}
              fontWeight={"md"}
              color="#C73732"
              onClick={() => navigate("/")} // 메인 페이지로 이동
              cursor={"pointer"} // 커서를 손가락 모양으로 변경
            >
              <Box>경북대 컴퓨터학부</Box>
              <Box mt="-10px">학사 정보 챗봇</Box>
            </Box>
            <Box
              as="hr"
              width="90%"
              borderTop="3px solid #FFD0C6"
              ml={"auto"}
              mr={"auto"}
              mb={5}
              borderRadius={"md"}
            />
          </Box>
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
                    내정보
                  </Button>
                </Flex>
              </Flex>
            )}
            {/* 선택된 탭 내용 표시 */}
            {selectedTab === "history" && (
              <VStack
                mt={5}
                ml={"auto"}
                mr={"auto"}
                spacing="10px"
                w={{ base: "200px", md: "250px" }}
                minH="250px"
              >
                {histories.length > 0 ? (
                  histories.map((history) => (
                    <Flex
                      key={history.id}
                      justifyContent="space-between"
                      alignItems="center"
                      bg="#FFCDC2"
                      padding="10px"
                      borderRadius="8px"
                      width="100%"
                    >
                      <Button
                        variant="unstyled"
                        onClick={() => {
                          navigate(`/chat/${history.id}`);
                          toggleSidebar(); // 클릭 시 사이드바 닫기
                        }}
                        textAlign="left"
                        color="#333"
                        pl={2}
                        fontSize={{ base: "lg", md: "lg" }}
                        _hover={{ textDecoration: "underline" }}
                        flex="1"
                        overflow="hidden" // 텍스트가 버튼의 크기를 넘지 않도록 설정
                        textOverflow="ellipsis" // 텍스트가 넘칠 경우 ...으로 표시
                        whiteSpace="nowrap" // 텍스트를 한 줄로 고정
                      >
                        {history.name || "Untitled History"}
                      </Button>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<HamburgerIcon />}
                          variant="ghost"
                          aria-label="Options"
                          _hover={{ bg: "transparent" }}
                          _active={{ bg: "transparent" }}
                        />
                        <MenuList
                          color={"black"}
                          fontSize={{ base: "md", md: "lg" }}
                          width="15 0px" // 내부 글자 길이에 맞게 너비 설정
                          minWidth="unset" // 기본 최소 너비 설정 제거
                        >
                          <MenuItem
                            onClick={() => {
                              const newName =
                                prompt("새로운 이름을 입력하세요:");
                              if (newName) {
                                handleRename(history.id, newName);
                              }
                            }}
                          >
                            이름 바꾸기
                          </MenuItem>
                          <Divider />
                          <MenuItem
                            onClick={() => {
                              if (
                                window.confirm(
                                  `"${history.name}" 히스토리를 삭제하시겠습니까?`
                                )
                              ) {
                                handleDelete(history.id);
                              }
                            }}
                          >
                            삭제하기
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  ))
                ) : (
                  <Text color="#777" fontSize={{ base: "xl", md: "2xl" }}>
                    이전 히스토리가 없습니다.
                  </Text>
                )}
              </VStack>
            )}
            {selectedTab === "myInfo" && (
              <Box
                width={{ base: "200px", md: "250px" }}
                display={"flex"}
                flexDirection={"column"}
                mt={5}
                ml={"auto"}
                mr={"auto"}
                mb={3}
                p={5}
                borderRadius={"md"}
                textAlign={"left"}
                color={"black"}
                background={"#FFCDC2"}
                boxShadow={
                  "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)"
                } // 사용자 정의 그림자
              >
                {userInfo ? (
                  <Box fontSize={{ base: "lg", md: "xl" }}>
                    <Text>닉네임 : {userInfo.nickname}</Text>
                    <Text>가입일 : {userInfo.joinedAt.split("T")[0]}</Text>
                    <Text>지금까지 한 질문: {userInfo.num_of_question}개</Text>
                  </Box>
                ) : error ? (
                  <Text color="red.500" fontSize={"md"}>
                    잠시 오류가 있어요😭
                    <br />
                    페이지를 새로고침 해주세요!
                  </Text>
                ) : (
                  <Text>정보를 불러오는 중...</Text>
                )}
                <Button
                  mt={4}
                  fontSize={{ base: "lg", md: "lg" }}
                  fontWeight="medium"
                  bg="#EFA9A4"
                  color="black"
                  _hover={{ bg: "#D17C74" }}
                  onClick={handleLogout} // 로그아웃 버튼
                  boxShadow={
                    "0px 2px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)"
                  } // 사용자 정의 그림자
                >
                  로그아웃
                </Button>
                <Button
                  mt={4}
                  fontSize={{ base: "lg", md: "lg" }}
                  fontWeight="medium"
                  bg="#EFA9A4"
                  color="black"
                  _hover={{ bg: "#D17C74" }}
                  onClick={handleUserDelete} // 회원탈퇴 버튼
                  boxShadow={
                    "0px 2px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)"
                  } // 사용자 정의 그림자
                >
                  회원탈퇴
                </Button>
              </Box>
            )}
            {/* 학부 정보 */}
            <Box
              fontFamily="'Nanum Gothic'"
              fontSize={{ base: "10px", md: "12px" }}
              pl={{ base: "18px", md: "35px" }}
              pr={0}
              pt={10}
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
              <Box>Copyright(c) 2024, 최기영(FE), 유승종(BE)</Box>
              <Box> 고상희(AI), 이석현(AI), 조현준(AI, PM)</Box>
            </Box>
          </Box>
        </Flex>
      )}
    </Box>
  );
};
