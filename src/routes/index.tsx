import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "@/pages/MainPage/MainPage";
import LoginPage from "@/pages/LoginPage/LoginPage";
import SignupPage from "@/pages/SignupPage/SignupPage";
import { RouterPath } from "./path"; // 경로 상수 가져오기

// 라우터 정의
const router = createBrowserRouter([
  {
    path: RouterPath.root,
    element: <MainPage />, // 메인 페이지를 직접 렌더링
  },
  {
    path: RouterPath.login,
    element: <LoginPage />, // 로그인 페이지를 직접 렌더링
  },
  {
    path: RouterPath.signup,
    element: <SignupPage />, // 회원가입 페이지를 직접 렌더링
  },
]);

// 라우터를 렌더링하는 컴포넌트
export const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
