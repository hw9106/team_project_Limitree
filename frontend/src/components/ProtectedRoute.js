import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

/**
 * 관리자 전용 라우트 보호 컴포넌트
 * - 로그인하지 않은 사용자 → 로그인 페이지로 리다이렉트
 * - ADMIN 역할이 아닌 사용자 → 홈으로 리다이렉트
 */
export const AdminRoute = ({ children }) => {
  const { loginUser,loading } = useUserContext();
  
   // 👇 세션 체크 중이면 대기!
  if (loading) {
    return null;  // 또는 <div>Loading...</div>
  }
  
  // 로그인하지 않은 경우
  if (!loginUser) {
    console.log("AdminRoute: 로그인 필요");
    return <Navigate to="/login-register" replace />;
  }
  
  // ADMIN 역할이 아닌 경우
  if (!loginUser.roleNames.includes("ADMIN")) {
    console.log("AdminRoute: 관리자 권한 없음, role=", loginUser.roleNames);
    return <Navigate to="/" replace />;
  }

  console.log("AdminRoute: 관리자 접근 허용");
  return children;
};