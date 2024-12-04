import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Input,
  Stack,
  Text,
  Image,
  IconButton,
  useToast,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { ArrowBackIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

import welcomeHobanu from "./assets/signupHobanu.svg"; // 이미지 경로를 맞게 설정하세요

const baseURL = import.meta.env.VITE_BASE_URL; // 환경 변수에서 baseURL 가져오기

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보이기/숨기기 상태
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [emailCheckDone, setEmailCheckDone] = useState(false); // 이메일 중복 검사 완료 여부
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const toast = useToast(); // Toast 인스턴스
  const navigate = useNavigate();

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    try {
      setIsLoading(true); // 로딩 시작
      const response = await fetch(
        `${baseURL}/api/member/check-email?email=${email}`,
        {
          method: "GET",
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        if (data.email_check) {
          setEmailCheckDone(false);
          setEmailCheckMessage("이미 사용 중인 이메일입니다.");
        } else {
          setEmailCheckDone(true); // 이메일 중복 검사 성공
          setEmailCheckMessage("가입 가능한 이메일입니다.");
        }
      } else if (response.status === 401) {
        setEmailCheckDone(false);
        setEmailCheckMessage("올바르지 않은 이메일 형식입니다.");
      } else {
        setEmailCheckDone(false);
        setEmailCheckMessage("오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setEmailCheckDone(false);
      setEmailCheckMessage(
        "서버와 연결할 수 없습니다. 나중에 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 회원가입 요청
  const handleSignup = async () => {
    if (!emailCheckDone) {
      toast({
        title: "이메일 중복 검사를 먼저 해주세요.",
        status: "warning",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true); // 로딩 시작
      const response = await fetch(`${baseURL}/api/member/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          nickname,
        }),
      });

      if (response.status === 201) {
        toast({
          title: "회원가입에 성공했습니다.",
          status: "success",
          position: "top",
          duration: 1500,
          isClosable: true,
        });
        navigate("/login"); // 회원가입 성공 후 로그인 페이지로 이동
      } else if (response.status === 500) {
        toast({
          title: "내부 서버 오류가 발생했습니다.",
          status: "error",
          position: "top",
          duration: 1500,
          isClosable: true,
        });
      } else {
        toast({
          title: "회원가입에 실패했습니다. 다시 시도해주세요.",
          status: "error",
          position: "top",
          duration: 1500,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        title: "서버와 연결할 수 없습니다. 나중에 다시 시도해주세요.",
        status: "error",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 이전 페이지로 이동
  const handleBack = () => {
    if (!isLoading) {
      navigate(-1); // 로딩 중에는 작동하지 않도록 설정
    }
  };

  return (
    <Box alignContent={"center"} bg="#f3f2ec" minHeight="100vh">
      {/* 로딩 중일 때 화면 전체를 덮는 로딩 레이어 */}
      {isLoading && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.4)" // 반투명 배경
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex="1000" // 다른 요소 위로 오도록 설정
        >
          <Spinner size="xl" color="white" />
          <Text color="white" fontSize="2xl" ml="4">
            요청 처리 중...
          </Text>
        </Box>
      )}

      {/* 상단 왼쪽에 이전 페이지 버튼 */}
      <Box position="absolute" top="20px" left="20px">
        <IconButton
          aria-label="Go Back"
          icon={<ArrowBackIcon />}
          onClick={handleBack}
          bg="#DCD8C8"
          color="black"
          _hover={{ bg: "#AAA282" }}
          isDisabled={isLoading} // 로딩 중 비활성화
        />
      </Box>

      <Center p={8} pb={120} maxW="500px" mx={"auto"}>
        <Stack spacing={7} align="center" w="full">
          {/* 상단 캐릭터 이미지 */}
          <Image src={welcomeHobanu} alt="Character" boxSize="220px" mb={3} />
          {/* 이메일 입력 및 중복 확인 */}
          <Box w="full">
            <Stack direction="row" spacing={2}>
              <Input
                placeholder="이메일"
                bg="white"
                fontSize={"sm"}
                fontFamily={"Nanum Gothic"}
                focusBorderColor="#DCD8C8"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailCheckDone(false); // 이메일 변경 시 중복 검사 초기화
                  setEmailCheckMessage(
                    "이메일이 변경되었습니다. 중복 검사를 다시 수행해주세요."
                  );
                }}
                isDisabled={isLoading} // 로딩 중 비활성화
              />
              <Button
                bg="#AAA282"
                color="white"
                fontSize={"xl"}
                fontWeight={"light"}
                _hover={{ bg: "#8B8469" }}
                onClick={handleEmailCheck}
                isDisabled={isLoading} // 로딩 중 비활성화
              >
                중복 확인
              </Button>
            </Stack>
            {/* 이메일 중복 확인 메시지 */}
            {emailCheckMessage && (
              <Text fontSize={"lg"} color="#8B8469" mt={2} textAlign={"center"}>
                {emailCheckMessage}
              </Text>
            )}
          </Box>

          {/* 비밀번호 입력 */}
          <InputGroup size="md">
            <Input
              placeholder="비밀번호"
              type={showPassword ? "text" : "password"} // 비밀번호 보이기/숨기기
              bg="white"
              color="black"
              fontSize={"sm"}
              fontFamily={"Nanum Gothic"}
              focusBorderColor="#DCD8C8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isDisabled={isLoading} // 로딩 중 비활성화
            />
            <InputRightElement>
              <IconButton
                aria-label={
                  showPassword ? "비밀번호 숨기기" : "비밀번호 보이기"
                }
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)} // 상태 토글
                bg="transparent"
                _hover={{ bg: "transparent" }}
                isDisabled={isLoading} // 로딩 중 비활성화
              />
            </InputRightElement>
          </InputGroup>

          {/* 닉네임 입력 */}
          <Input
            placeholder="닉네임 (7글자 이하로 입력해주세요)"
            bg="white"
            fontSize={"sm"}
            fontFamily={"Nanum Gothic"}
            focusBorderColor="#DCD8C8"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            isDisabled={isLoading} // 로딩 중 비활성화
          />
          {/* 회원가입 버튼 */}
          <Button
            w="full"
            bg="#DCD8C8"
            color="black"
            fontSize="2xl"
            fontWeight={"light"}
            letterSpacing={"0.1em"}
            _hover={{ bg: "#AAA282" }}
            onClick={handleSignup}
            isDisabled={isLoading} // 로딩 중 비활성화
          >
            가입하기
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};

export default SignupPage;
