import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import {
  Box,
  Button,
  Flex,
  VStack,
  Text,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface History {
  id: string;
  name: string;
  date: string;
}

const UserPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [histories, setHistories] = useState<History[]>([]); // 타입 지정
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchHistories = async () => {
      setIsLoading(true);
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
          console.error("Failed to fetch histories");
        }
      } catch (error) {
        console.error("Error fetching histories:", error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          fontSize={{ base: "lg", md: "xl" }}
          bg="#FCF6DC"
          _hover={{ bg: "#CBC096", transform: "scale(1.01)" }}
          mb="30px"
          w="95%"
          minH="40px"
        >
          새로운 채팅 시작하기 🚀
        </Button>
        {histories.length > 0 && (
          <>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="#555"
              mb="10px"
              alignSelf="flex-start"
            >
              이전 채팅 이어하기
            </Text>
            <Divider borderColor="#ddd" mb="10px" />
          </>
        )}
        <VStack
          spacing="10px"
          w="100%"
          maxH="300px"
          minH={histories.length > 0 ? "100px" : "40px"}
          overflow={"auto"}
          css={{
            /* 스크롤바 스타일 */
            "&::-webkit-scrollbar": {
              width: "8px", // 스크롤바 너비
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#C8D2C9", // 스크롤바 색상
              borderRadius: "4px", // 스크롤바 모서리
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transpaent", // 스크롤바 트랙 색상
            },
          }}
        >
          {isLoading ? (
            <Spinner
              size="lg"
              color="#DEE5DF" // 버튼과 동일한 색상
              speed="0.8s"
            />
          ) : histories.length > 0 ? (
            histories.map((history) => (
              <Button
                key={history.id}
                onClick={() => navigate(`/chat/${history.id}`)}
                bg="#DEE5DF"
                fontSize={{ base: "lg", md: "xl" }}
                color="#333"
                _hover={{ bg: "#C8D2C9", transform: "scale(1.01)" }}
                w="95%"
                minH="40px"
              >
                {history.name || "Untitled History"}
              </Button>
            ))
          ) : (
            <Text color="#777" fontSize={{ base: "xl", md: "2xl" }}>
              이전 히스토리가 없습니다.
            </Text>
          )}
        </VStack>
      </Flex>
    </Box>
  );
};

export default UserPage;
