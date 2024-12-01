// 로그인 여부에 따라 게스트 페이지 또는 사용자 페이지를 렌더링하는 컴포넌트
import React, { useState, useEffect } from "react";
import GuestPage from "./GuestPage";
import UserPage from "./UserPage";

const MainPage: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setAccessToken(localStorage.getItem("accessToken"));
    };

    // 로컬 스토리지 변경 감지
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return <>{accessToken ? <UserPage /> : <GuestPage />}</>;
};

export default MainPage;
