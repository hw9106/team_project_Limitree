import { authHeaders } from "./authHeader";

const BACKEND_SERVER = "http://localhost:8080";

/**
 * ✅ 카트 저장 (로그인 필요)
 */
export const cartWriteAction = async (sendJsonObject) => {
  const response = await fetch(`${BACKEND_SERVER}/cart`, {
    method: "POST",
    headers: authHeaders({
      "Content-type": "application/json",
    }),
    body: JSON.stringify(sendJsonObject),
  });

  return await response.json();
};

/**
 * ✅ 카트 목록 조회 (로그인 필요)
 */
export const cartList = async (userId) => {
  const response = await fetch(`${BACKEND_SERVER}/carts/${userId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  return await response.json();
};

/**
 * ✅ 카트 아이템 삭제 (로그인 필요)
 */
export const cartDeleteCartItemId = async (cartItemId) => {
  const response = await fetch(`${BACKEND_SERVER}/cart/${cartItemId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return await response.json();
};

/**
 * ✅ 유저 카트 전체 삭제 (로그인 필요)
 */
export const cartDeleteUserId = async (userId) => {
  const response = await fetch(`${BACKEND_SERVER}/carts/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return await response.json();
};

/**
 * ✅ 카트 수량 수정 (로그인 필요)
 */
export const cartModifyCartItem = async (cartItem) => {
  const response = await fetch(`${BACKEND_SERVER}/cart`, {
    method: "PUT",
    headers: authHeaders({
      "Content-type": "application/json",
    }),
    body: JSON.stringify(cartItem),
  });

  return await response.json();
};