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
} from "@chakra-ui/react";
import loginHobanu from "./assets/loginHobanu.svg"; // 이미지 경로를 맞게 설정하세요

const LoginPage: React.FC = () => {
  return (
    <Box alignContent={"center"} bg="#f3f2ec" height={"100vh"}>
      <Center p={8} pb={100} maxW="400px" mx="auto">
        <Stack spacing={4} align="center" w="full">
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
            variant="filled"
            focusBorderColor="#DCD8C8"
          />
          {/* 비밀번호 입력 */}
          <Input
            placeholder="비밀번호"
            type="password"
            bg="white"
            variant="filled"
            focusBorderColor="#DCD8C8"
          />
          {/* 로그인 버튼 */}
          <Button
            w="full"
            bg="#DCD8C8"
            color="black"
            fontSize={"lg"}
            _hover={{ bg: "#AAA282" }}
          >
            로그인하기
          </Button>
          {/* 회원가입 링크 */}
          <Text fontSize="lg" color="gray.600">
            아직 회원이 아니신가요?{" "}
            <Link color="#8B8469" href="/signup">
              회원가입
            </Link>
          </Text>
        </Stack>
      </Center>
    </Box>
  );
};

export default LoginPage;
