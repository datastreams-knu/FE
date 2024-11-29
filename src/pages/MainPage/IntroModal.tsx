// 서비스의 사용 설명서를 보여주는 모달 컴포넌트
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        w={{ base: "80%", md: "500px" }} // base: 모바일, md 이상: 500px
        maxW="90%" // 최대 너비 제한
        p={4} // 내부 여백
      >
        <ModalHeader fontSize={{ base: "xl", md: "2xl" }}>
          사용 설명서
        </ModalHeader>
        <ModalBody mt={-5}>
          <Text fontSize={{ base: "lg", md: "xl" }} mb={4}>
            이 서비스는 경북대학교 컴퓨터학부 내 학사정보를 챗봇 형식으로
            간편하게 제공하기 위해 개발되었습니다.
          </Text>
          <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} mb={2}>
            Q. 챗봇의 데이터는 얼마나 저장되어 있나요?
          </Text>
          <Text fontSize={{ base: "md", md: "lg" }} mb={4}>
            2024년 1월 1일 이후로 공지사항에 올라온 정보가 들어있습니다.
          </Text>
          <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} mb={2}>
            Q. 어떤 정보들이 들어있나요?
          </Text>
          <Text fontSize={{ base: "md", md: "lg" }}>
            컴퓨터학부의 공지사항, 세미나 및 취업 정보, 교수진 및 직원의 정보가
            들어있습니다.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            bg="#DCD8C8"
            color="black"
            onClick={onClose}
            _hover={{ bg: "#AAA282" }}
          >
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
