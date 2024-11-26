import {
  Box,
  Text,
  IconButton,
  Flex,
  Link,
  Button,
  Image,
} from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  ArrowBackIcon,
  InfoOutlineIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import knuLogo from "@/assets/knuLogo.svg";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 하루를 밀리초로 계산

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tooltipDismissedTime = localStorage.getItem("tooltipDismissedTime");
    const now = Date.now();
    let timer: ReturnType<typeof setTimeout>;

    const isTooltipExpired =
      !tooltipDismissedTime || now - Number(tooltipDismissedTime) > ONE_DAY_MS;

    if (isTooltipExpired && !isOpen) {
      timer = setTimeout(() => {
        setShowTooltip(true);
      }, 500);
    } else {
      setShowTooltip(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen]);

  const handleLogin = () => {
    navigate("/login"); // 페이지를 이동
  };

  const handleTooltipClose = () => {
    localStorage.setItem("tooltipDismissedTime", String(Date.now())); // 현재 시간 저장
    setShowTooltip(false);
  };

  return (
    <>
      <Box
        width="340px"
        height="100vh"
        bg="#fcb9aa"
        color="white"
        position="fixed"
        top="0"
        left={isOpen ? "0" : "-340px"}
        transition="left 0.5s ease-in-out"
        zIndex={10000}
        textAlign="center"
        paddingTop="16px"
      >
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
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-10px",
              bottom: "-10px",
              left: "-10px",
              right: "-10px",
              background: "transparent",
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
          >
            <Box
              textAlign="center"
              mb={4}
              color="#C73732"
              fontFamily={"Nanum Pen Script"}
            >
              <Box fontSize="50px">경북대 컴퓨터학부</Box>
              <Box fontSize="50px" mt="-10px">
                학사 정보 챗봇
              </Box>
            </Box>
            <Image src={knuLogo} alt="KNU Logo" w="120px" h="120px" mt={-3} />
            <Box as="hr" width="90%" borderTop="1px solid white" my={5} />
            <Button
              variant="unstyled"
              background={"#B8433A"}
              width="250px"
              height="45px"
              display={"flex"}
              fontSize={27}
              fontWeight={100}
              letterSpacing={"0.3em"}
              onClick={handleLogin}
              _hover={{ bg: "#7E2B24" }}
            >
              <Text mr={-2}>로그인</Text>
            </Button>
          </Flex>
        )}

        {isOpen && (
          <Box
            fontFamily="'Nanum Gothic', sans-serif"
            fontSize="12px"
            mt={10}
            bottom="60px"
            padding="20px"
            lineHeight={1.5}
            textAlign="left"
            color="black"
            width="100%"
            mx="auto"
          >
            <Box>경북대학교 IT대학 컴퓨터학부</Box>
            <Box>우)41566 대구광역시 북구 대학로 80</Box>
            <Box>IT대학 융복합관 317호(건물번호 : 415)</Box>
            <Box>TEL. 학부 : 950-5550 , 대학원 : 950-6420 </Box>
            <Box>FAX. 053-957-4846</Box>
            <Box>E-mail. scse@knu.ac.kr</Box>
            <Box>
              담당자 현황:&nbsp;
              <Link
                href="https://computer.knu.ac.kr/bbs/board.php?bo_table=sub2_5"
                textDecoration="underline"
              >
                링크 연결
              </Link>
            </Box>
            <Box>Copyright(c) 2024, KNU CSE All rights reserved</Box>
          </Box>
        )}
      </Box>

      {!isOpen && showTooltip && (
        <Box
          position="fixed"
          top="45%"
          transform="translateY(-50%)"
          display="flex"
          alignItems="center"
          zIndex={9999}
          animation="bounce 2s ease-in-out infinite"
          sx={{
            "@keyframes bounce": {
              "0%, 100%": {
                transform: "translateY(-60%)",
              },
              "50%": {
                transform: "translateY(-80%)",
              },
            },
          }}
        >
          <InfoOutlineIcon boxSize={5} color="transparent" />
          <Box
            position="relative"
            width="240px"
            mt={-110}
            p={4}
            bg="#fcb9aa"
            color="white"
            fontFamily={"'Nanum Gothic', sans-serif"}
            fontSize={14}
            borderRadius="8px"
            boxShadow="0 0 8px rgba(0, 0, 0, 0.2)"
            _after={{
              content: '""',
              position: "absolute",
              bottom: "-7px",
              left: "5px",
              transform: "translateY(50%)",
              borderWidth: "8px",
              borderStyle: "solid",
              borderColor: "#fcb9aa transparent transparent transparent",
            }}
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Box>사이드바를 열어 로그인하거나</Box>
                <Box>히스토리를 볼 수 있어요!</Box>
              </Box>
              <IconButton
                aria-label="Close tooltip"
                icon={<CloseIcon />}
                onClick={handleTooltipClose}
                variant="ghost"
                size="xs"
                color="white"
                _hover={{ bg: "none" }}
                position="absolute"
                top="0px"
                right="0px"
              />
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
};
