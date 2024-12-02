import React, { useState } from "react";
import {
  Button,
  Center,
  Input,
  Stack,
  Text,
  Image,
  Link,
  Box,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom"; // React Router 사용

import loginHobanu from "./assets/loginHobanu.svg"; // 이미지 경로를 맞게 설정하세요

const baseURL = import.meta.env.VITE_BASE_URL; // 환경 변수에서 baseURL 가져오기

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast(); // Toast 사용
  const navigate = useNavigate();

  // 이전 페이지로 이동
  const handleBack = () => {
    navigate(-1);
  };

  // 회원가입 페이지로 이동
  const handleSignup = () => {
    navigate("/signup");
  };

  // 로그인 API 요청
  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "이메일과 비밀번호를 입력해주세요.",
        status: "warning",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const response = await fetch(`${baseURL}/api/member/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken); // access token 저장
        toast({
          title: "로그인 성공!",
          status: "success",
          duration: 1500,
          isClosable: true,
          position: "top",
        });
        navigate("/"); // 로그인 성공 후 대시보드로 이동
      } else if (response.status === 400) {
        toast({
          title: "이메일과 비밀번호를 모두 입력해주세요.",
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "top",
        });
      } else if (response.status === 401) {
        toast({
          title: "잘못된 이메일 또는 비밀번호입니다.",
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "오류가 발생했습니다. 다시 시도해주세요.",
          status: "error",
          duration: 1500,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "서버와 연결할 수 없습니다. 나중에 다시 시도해주세요.",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box alignContent={"center"} bg="#f3f2ec" minHeight="100vh">
      {/* 상단 왼쪽에 이전 페이지 버튼 */}
      <Box position="absolute" top="20px" left="20px">
        <IconButton
          aria-label="Go Back"
          icon={<ArrowBackIcon />}
          onClick={handleBack}
          bg="#DCD8C8"
          color="black"
          _hover={{ bg: "#AAA282" }}
        />
      </Box>

      <Center p={8} pb={120} maxW="500px" mx="auto">
        <Stack spacing={7} align="center" w="full">
          {/* 상단 캐릭터 이미지 */}
          <Image
            src={loginHobanu} // 로컬 이미지 사용
            alt="Character"
            boxSize="170px"
            mb={3}
          />
          {/* 이메일 입력 */}
          <Input
            placeholder="이메일"
            bg="white"
            fontSize={"sm"}
            fontFamily={"mono"}
            focusBorderColor="#DCD8C8"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 이메일 상태 업데이트
          />
          {/* 비밀번호 입력 */}
          <Input
            placeholder="비밀번호"
            type="password"
            bg="white"
            fontSize={"sm"}
            fontFamily={"mono"}
            focusBorderColor="#DCD8C8"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 비밀번호 상태 업데이트
          />
          {/* 로그인 버튼 */}
          <Button
            w="full"
            bg="#DCD8C8"
            color="black"
            fontSize={"2xl"}
            fontWeight={"light"}
            letterSpacing={"0.1em"}
            _hover={{ bg: "#AAA282" }}
            onClick={handleLogin} // 로그인 API 호출
          >
            로그인하기
          </Button>
          {/* 회원가입 링크 */}
          <Text fontSize="2xl" color="gray.600">
            아직 회원이 아니신가요?{" "}
            <Link color="#8B8469" onClick={handleSignup}>
              회원가입
            </Link>
          </Text>
        </Stack>
      </Center>
    </Box>
  );
};

export default LoginPage;
