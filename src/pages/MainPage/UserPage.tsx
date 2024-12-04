import { useState } from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import { Box, Button, Flex, Text, Divider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AnimatedText from "./AnimatedText";

const UserPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const createNewHistory = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/api/history/new-history`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const { new_history_id } = await response.json();
        navigate(`/chat/${new_history_id}`);
      } else {
        console.error("Failed to create new history");
      }
    } catch (error) {
      console.error("Error creating new history:", error);
    }
  };

  return (
    <Box
      bg="#f3f2ec"
      position="relative"
      h="100vh"
      overflowY="auto"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        position="fixed"
        left="0"
        top="0"
        bottom="0"
        w={isSidebarOpen ? "250px" : "0"}
        overflow="hidden"
        transition="width 0.3s ease-in-out"
        bg="#f0f0f0"
        zIndex="1000"
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </Box>

      <Flex
        flexDirection="column"
        align="center"
        justify="center"
        bg="white"
        boxShadow="lg"
        borderRadius="12px"
        p="20px"
        maxW="500px"
        w="90%"
      >
        <Text
          fontFamily={"Nanum Gothic"}
          fontSize={{ base: "lg", md: "3xl" }}
          fontWeight={"bold"}
          mb="20px"
          color="#555"
        >
          버튼을 눌러 챗봇을 시작해보세요!
        </Text>
        <Button
          onClick={createNewHistory}
          fontSize={{ base: "lg", md: "2xl" }}
          bg="#FCF6DC"
          _hover={{ bg: "#CBC096", transform: "scale(1.01)" }}
          mb="30px"
          w="95%"
          minH="40px"
        >
          새로운 채팅 시작하기 🚀
        </Button>
        <AnimatedText>
          사이드바를 열어 예전 질문 기록을 확인할 수 있습니다!
        </AnimatedText>
        <Divider />
      </Flex>
    </Box>
  );
};

export default UserPage;
