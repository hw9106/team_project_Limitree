
// src/util/auth.js
import { getCookie ,removeCookie  } from "./cookieUtil";

export const getMemberFromCookie = () => {
  const memberStr = getCookie("member");
  if (!memberStr) return null;
  try {
    return JSON.parse(memberStr);
  } catch {
    return null;
  }
};

export const hasAdminRole = (member) => {
  const roles = member?.roleNames || member?.roles || [];
  // roles가 문자열 배열이든 enum 객체든 대비
  const roleStrings = roles.map((r) => (typeof r === "string" ? r : r?.name ?? String(r)));
  return roleStrings.includes("ADMIN") || roleStrings.includes("ROLE_ADMIN");
};

export const getAccessToken = () => {
  // 1) 쿠키(member)에서 accessToken
  try {
    const memberStr = getCookie("member");
    if (memberStr) {
      const member = JSON.parse(memberStr);
      if (member?.accessToken && typeof member.accessToken === "string") {
        return member.accessToken;
      }
    }
  } catch (e) {
    // 쿠키가 깨졌으면 삭제
    removeCookie("member");
  }

  // 2) localStorage에서 accessToken (소셜 로그인 대비)
  const ls = localStorage.getItem("accessToken");
  if (ls && typeof ls === "string") return ls;

  return null;
};