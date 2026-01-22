// src/api/authHeader.js
import { getCookie } from "../util/cookieUtil";

export const authHeaders = (extra = {}) => {
  const memberStr = getCookie("member");
  let member = null;

  try {
    member = memberStr ? JSON.parse(memberStr) : null;
  } catch (e) {
    member = null;
  }

  const accessToken = member?.accessToken;

  return {
    ...extra,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
};