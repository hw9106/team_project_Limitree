// ========================================
// 백엔드 서버 URL 설정
// ========================================
import { authHeaders } from "./authHeader";
const BACKEND_SERVER = "http://localhost:8080";



// ========================================
// 공통 fetch 헬퍼 (✅ 토큰 자동 포함)
// ========================================
async function request(path, options = {}) {
  const res = await fetch(`${BACKEND_SERVER}${path}`, {
    ...options,
    headers: authHeaders({
      // 기본 JSON
      "Content-Type": "application/json",
      ...(options.headers || {}),
    }),
  });

  // 응답이 JSON이 아닐 수도 있어서 안전 처리
  const text = await res.text().catch(() => "");
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = { status: res.status, message: text };
  }

  return data;
}

// ========================================
// 주문 생성 API
// ========================================
export const orderCreate = async (sendJsonObject) => {
  console.log("===== orderCreate 들어온 원본 데이터 =====");
  console.log("sendJsonObject =", sendJsonObject);
  console.log("sendJsonObject.billingInfo =", sendJsonObject?.billingInfo);
  console.log("sendJsonObject.cartItems =", sendJsonObject?.cartItems);

  // 1) cartItems -> orderItems 변환
  const orderItems = (sendJsonObject.cartItems || []).map((ci) => {
    const productId = ci.id;

    const quantity =
      ci.quantity ?? ci.qty ?? ci.cartQuantity ?? ci.c_qty ?? 1;

    return {
      productId,
      quantity,
      selectedProductColor:
        ci.selectedProductColor ?? ci.color ?? ci.selectedColor ?? null,
      selectedProductSize:
        ci.selectedProductSize ?? ci.size ?? ci.selectedSize ?? null,
    };
  });

  const invalid = orderItems.findIndex((it) => !it.productId);
  if (invalid !== -1) {
    console.error("productId 매핑 실패. cartItem=", sendJsonObject.cartItems?.[invalid]);
    throw new Error("productId 매핑 실패: cartItems 구조를 확인하세요.");
  }

  // 2) 백엔드 OrderDto 구조로 payload 구성
  const payload = {
    customerName: (
      `${sendJsonObject.billingInfo?.firstName ?? sendJsonObject.billingInfo?.fName ?? ""} ` +
      `${sendJsonObject.billingInfo?.lastName ?? sendJsonObject.billingInfo?.lName ?? ""}`
    ).trim(),

    postalCode:
      sendJsonObject.postalCode ??
      sendJsonObject.billingInfo?.zip ??
      sendJsonObject.billingInfo?.postalCode ??
      "",

    shippingAddress:
      sendJsonObject.shippingAddress ??
      sendJsonObject.billingInfo?.streetAddress ??
      "",

    phoneNumber:
      sendJsonObject.phoneNumber ??
      sendJsonObject.billingInfo?.phone ??
      sendJsonObject.billingInfo?.tel ??
      "",

    orderMemo:
      sendJsonObject.orderMemo ??
      sendJsonObject.billingInfo?.orderNotes ??
      sendJsonObject.billingInfo?.memo ??
      "",

    orderItems,
  };

  if (!payload.customerName) throw new Error("customerName이 비어있습니다.");
  if (!payload.shippingAddress) throw new Error("shippingAddress가 비어있습니다.");
  if (!payload.phoneNumber) throw new Error("phoneNumber가 비어있습니다.");

  console.log("POST /order payload:", payload);

  return await request("/order", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ========================================
// 주문 목록 조회 API
// ========================================
export const orderList = async () => {
  return await request("/orders", { method: "GET" });
};

// ========================================
// 주문 상세 조회 API
// ========================================
export const orderDetail = async (orderId) => {
  return await request(`/order/${orderId}`, { method: "GET" });
};

// ========================================
// 주문 취소(삭제) API
// ========================================
export const orderCancel = async (orderId) => {
  return await request(`/order/${orderId}`, { method: "DELETE" });
};

// ========================================
// 모든 주문 삭제 API 
// ========================================
export const orderDeleteAll = async () => {
  return await request(`/admin/orders`, { method: "DELETE" });
};

export const orderMyList = async () => {
  return await request("/orders/my", { method: "GET" });
};
