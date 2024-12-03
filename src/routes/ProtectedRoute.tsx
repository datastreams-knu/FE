import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // accessToken이 없으면 로그인 페이지로 리다이렉트
    return <Navigate to="/" replace />;
  }

  // accessToken이 있으면 요청한 페이지 렌더링
  return children;
};

export default ProtectedRoute;
