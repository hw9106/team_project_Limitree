import { authHeaders } from "./authHeader";

const BACKEND_SERVER = "http://localhost:8080";

export const reviewListByProductAction = async (productId) => {
  const response = await fetch(`${BACKEND_SERVER}/products/${productId}/reviews`, {
    method: "GET",
  });

  // ✅ 리뷰 없음 케이스를 정상으로 처리
  if (response.status === 204) return []; // No Content
  if (response.status === 404) return []; // Not Found (백엔드가 이렇게 주는 경우)

  if (!response.ok) {
    throw new Error("리뷰 목록 조회 실패");
  }

  const data = await response.json();

  // 백엔드가 [] 또는 {data:[...]} 등 어떤 형태든 안전하게
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};
export const reviewList = async () => {
  const productId = 1;
  const response = await fetch(
    `${BACKEND_SERVER}/products/${productId}/reviews/admin`,
    {
      method: "GET",
      headers: authHeaders(), // 토큰 추가
    }
  );

  if (!response.ok) {
    throw new Error("리뷰 목록 조회 실패");
  }

  return await response.json();
};
/*
  ⭐ 리뷰 작성
  POST /products/{productId}/reviews/write
*/
export const createReviewAction = async (productId, sendJsonObject) => {
  // ✅ 변경 1: 함수 파라미터 순서 명확히 (productId 먼저)
  console.log("####################", sendJsonObject);

  const response = await fetch(
    `${BACKEND_SERVER}/products/${productId}/reviews/write`, // ✅ 변경 2: URL에 productId 직접 사용
    {
      method: "POST",
      headers: authHeaders({
        "Content-Type": "application/json", // ✅ 소문자 content-type → 표준 Content-Type
      }),
      body: JSON.stringify(sendJsonObject),
    }
  );

  if (!response.ok) {
    throw new Error("리뷰 등록 실패"); // ✅ 변경 3: 에러 처리 추가
  }

  const resultJsonObject = await response.json();
  console.log("resultJsonObject :::::", resultJsonObject);

  // ✅ 변경 4: 백엔드가 내려준 reviewId(Long)만 리턴
  return resultJsonObject.data;
};

export const adminRemoveAction = async (reviewId) => {
  const response = await fetch(`${BACKEND_SERVER}/products/1/reviews/admin/${reviewId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("리뷰 삭제 실패");
  return await response.json();
};
