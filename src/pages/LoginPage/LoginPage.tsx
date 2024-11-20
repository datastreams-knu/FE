import React from "react";
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
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom"; // React Router 사용

import loginHobanu from "./assets/loginHobanu.svg"; // 이미지 경로를 맞게 설정하세요

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handleSignup = () => {
    navigate("/signup"); // 페이지를 이동
  };

  return (
    <Box alignContent={"center"} bg="#f3f2ec" height={"100vh"}>
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
            fontSize={"xl"}
            focusBorderColor="#DCD8C8"
          />
          {/* 비밀번호 입력 */}
          <Input
            placeholder="비밀번호"
            type="password"
            bg="white"
            fontSize={"xl"}
            focusBorderColor="#DCD8C8"
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
