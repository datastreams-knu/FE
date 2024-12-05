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
  Spinner,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

import loginHobanu from "./assets/loginHobanu.svg";

const baseURL = import.meta.env.VITE_BASE_URL;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const toast = useToast();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSignup = () => {
    navigate("/signup");
  };

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

    setIsLoading(true); // 로딩 상태 활성화

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
        localStorage.setItem("accessToken", data.token);
        navigate("/");
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
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isLoading) {
      handleLogin();
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
            로그인 시도 중...
          </Text>
        </Box>
      )}

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

      <Center p={8} pb={120} maxW="500px" mx="auto">
        <Stack spacing={7} align="center" w="full">
          <Image src={loginHobanu} alt="Character" boxSize="170px" mb={3} />
          <Input
            placeholder="이메일"
            bg="white"
            fontSize={"sm"}
            fontFamily={"Nanum Gothic"}
            focusBorderColor="#DCD8C8"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={isLoading} // 로딩 중 비활성화
          />
          <Input
            placeholder="비밀번호"
            type="password"
            bg="white"
            fontSize={"sm"}
            fontFamily={"Nanum Gothic"}
            focusBorderColor="#DCD8C8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            isDisabled={isLoading} // 로딩 중 비활성화
          />
          <Button
            w="full"
            bg="#DCD8C8"
            color="black"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight={"light"}
            letterSpacing={"0.1em"}
            _hover={{ bg: "#AAA282" }}
            onClick={handleLogin}
          >
            로그인하기
          </Button>
          <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600">
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
