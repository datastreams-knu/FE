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
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom"; // React Router 사용

import welcomeHobanu from "./assets/signupHobanu.svg"; // 이미지 경로를 맞게 설정하세요

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const navigate = useNavigate();

  const handleEmailCheck = () => {
    // 이메일 중복 확인 로직
    if (email === "example@test.com") {
      setEmailCheckMessage("이미 사용 중인 이메일입니다.");
    } else {
      setEmailCheckMessage("가입 가능한 이메일입니다.");
    }
  };

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
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
                fontSize={"xl"}
                focusBorderColor="#DCD8C8"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                bg="#AAA282"
                color="white"
                fontSize={"xl"}
                fontWeight={"light"}
                _hover={{ bg: "#8B8469" }}
                onClick={handleEmailCheck}
              >
                중복 확인
              </Button>
            </Stack>
            {/* 이메일 중복 확인 메시지 */}
            {emailCheckMessage && (
              <Text fontSize={"xl"} color="#8B8469" mt={2} textAlign={"center"}>
                {emailCheckMessage}
              </Text>
            )}
          </Box>
          {/* 비밀번호 입력 */}
          <Input
            placeholder="비밀번호"
            type="password"
            bg="white"
            fontSize={"xl"}
            focusBorderColor="#DCD8C8"
          />
          {/* 닉네임 입력 */}
          <Input
            placeholder="닉네임"
            bg="white"
            fontSize={"xl"}
            focusBorderColor="#DCD8C8"
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
          >
            가입하기
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};

export default SignupPage;
