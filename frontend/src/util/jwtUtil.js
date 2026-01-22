import axios from "axios";
import { BACKEND_SERVER } from "../api/userApi";
import { getCookie, setCookie } from "./cookieUtil";

// JWT 디코딩 함수 (만료 시간 확인용)
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// 토큰 만료 확인 (초 단위로 남은 시간 반환)
export const getTokenRemainingTime = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return 0; // exp : 만료시간이 초 단위로 저장. 

  const now = Math.floor(Date.now() / 1000); // Math.floor() 소수점 이하 버림. 
  return decoded.exp - now;
};

// 토큰이 곧 만료되는지 확인 (기본 30초 이내)
export const isTokenExpiringSoon = (token, thresholdSeconds = 30) => {
  const remaining = getTokenRemainingTime(token);
  // 남은 시간이 30초 미만이거나 이미 만료된 경우(음수) 모두 갱신
  return remaining < thresholdSeconds;
};

// Refresh 요청
export const refreshJWT = async (accessToken, refreshToken) => {
  const host = BACKEND_SERVER;
  const header = {
    headers: { Authorization: `Bearer ${accessToken}` },
    skipAuthRefresh: true  // 인터셉터 스킵 플래그
  };
  const res = await axios.get(
    `${host}/api/member/refresh?refreshToken=${refreshToken}`,
    header
  );
  console.log("----------------------");
  console.log(res.data);
  return res.data;
};

// 토큰 자동 갱신 함수
export const autoRefreshToken = async () => {
  const memberStr = getCookie("member");
  if (!memberStr) {
    console.log("🔍 토큰 체크: 로그인 안 됨 (쿠키 없음)");
    return null;
  }

  let member;
  try {
    member = JSON.parse(memberStr);
  } catch (error) {
    console.error("Failed to parse member cookie:", error);
    return null;
  }

  if (!member || !member.accessToken || !member.refreshToken) {
    console.log("🔍 토큰 체크: 토큰 정보 없음");
    return null;
  }

  // 남은 시간 계산 및 출력
  const remaining = getTokenRemainingTime(member.accessToken);
  console.log(`🔍 토큰 체크: 남은 시간 ${remaining}초`);

  // accessToken이 30초 이내 만료 예정이면 갱신
  if (isTokenExpiringSoon(member.accessToken, 30)) {
    try {
      console.log("⏰ Token expiring soon, refreshing...");
      const newTokens = await refreshJWT(member.accessToken, member.refreshToken);

      // 쿠키 업데이트
      const updatedMember = { ...member, ...newTokens };
      setCookie("member", JSON.stringify(updatedMember), 1);

      // localStorage도 업데이트
      if (newTokens.accessToken) {
        localStorage.setItem('accessToken', newTokens.accessToken);
      }

      console.log("✅ Token refreshed successfully");
      return newTokens.accessToken;
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      return null;
    }
  }

  console.log("✅ 토큰 정상, 갱신 불필요");
  return member.accessToken;
};
