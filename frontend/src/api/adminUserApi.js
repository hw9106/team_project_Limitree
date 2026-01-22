// userApi.js
import { getCookie } from "../util/cookieUtil";
import * as ResponseStatusCode from "./ResponseStatusCode";
import * as ResponseMessage from "../api/ResponseMessage";

export const BACKEND_SERVER = "http://localhost:8080";

function getAuthOrError() {
  const memberStr = getCookie("member");
  const member = memberStr ? JSON.parse(memberStr) : null;

  if (!member?.accessToken) {
    return {
      ok: false,
      error: {
        data: {},
        status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
        message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
      },
    };
  }
  return { ok: true, accessToken: member.accessToken };
}

/** ✅ 어드민: 회원 목록 */
export const userListAction = async () => {
  const auth = getAuthOrError();
  if (!auth.ok) return auth.error;

  const res = await fetch(`${BACKEND_SERVER}/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
    },
  });
  return await res.json();
};

/** ✅ 어드민: 회원 1명 상세 */
export const adminUserViewAction = async (userId) => {
  const auth = getAuthOrError();
  if (!auth.ok) return auth.error;

  const res = await fetch(`${BACKEND_SERVER}/admin/users/${encodeURIComponent(userId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      "Content-type": "application/json",
    },
  });
  return await res.json();
};

/** ✅ 어드민: 회원 삭제 */
export const adminUserDeleteAction = async (userId) => {
  const auth = getAuthOrError();
  if (!auth.ok) return auth.error;

  const res = await fetch(`${BACKEND_SERVER}/user/${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      "Content-type": "application/json",
    },
  });
  return await res.json();
};

// =======================================================
// ✅ 여기부터가 “페이지에서 import 하던 이름” 맞춰주는 래퍼들
// =======================================================

/**
 * UserListPage가 import 하는 fetchUsers
 * - 백엔드가 페이징을 안 하면, 프론트에서 필터 + slice로 페이징 흉내냄
 */
export async function fetchUsers({ page, size, keyword }) {
  const res = await userListAction(); // {status,message,data:[...]} 형태 기대
  const all = Array.isArray(res?.data) ? res.data : [];

  const k = (keyword || "").trim().toLowerCase();
  const filtered = !k
    ? all
    : all.filter((u) => {
        const name = String(u?.name || "").toLowerCase();
        const email = String(u?.email || "").toLowerCase();
        const userId = String(u?.userId || "").toLowerCase();
        return name.includes(k) || email.includes(k) || userId.includes(k);
      });

  const start = page * size;
  const content = filtered.slice(start, start + size);

  return {
    data: {
      content: content.map((u, idx) => ({
        id: start + idx + 1,
        userId: u.userId,
        name: u.name,
        email: u.email,
        // u.role / u.roleNames / u.roles 어떤 형태로 오든 표시 가능
        role: Array.isArray(u?.roleNames)
          ? u.roleNames.join(", ")
          : Array.isArray(u?.roles)
          ? u.roles.join(", ")
          : u?.role ?? "-",
      })),
      totalElements: filtered.length,
    },
  };
}

/**
 * UserDetailPage가 import 하는 fetchUserDetail
 */
export async function fetchUserDetail(userId) {
  return await adminUserViewAction(userId);
}

/**
 * UserDetailPage가 import 하는 deleteUser
 */
export async function deleteUser(userId) {
  return await adminUserDeleteAction(userId);
}
