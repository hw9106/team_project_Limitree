import { getCookie, removeCookie } from "../util/cookieUtil";
import * as ResponseStatusCode from "./ResponseStatusCode";
import * as ResponseMessage from "../api/ResponseMessage";
import { getAccessToken } from "../util/auth";

export const BACKEND_SERVER =
  process.env.REACT_APP_API_BASE || "http://localhost:8080";

/**
 * ✅ 쿠키(member) 안전 파싱
 * - 쿠키가 없거나 JSON이 깨졌으면 null
 * - 깨진 쿠키는 삭제
 */
const safeGetMember = () => {
  try {
    const memberStr = getCookie("member");
    if (!memberStr) return null;
    return JSON.parse(memberStr);
  } catch (e) {
    removeCookie("member");
    return null;
  }
};

export const userWriteAction = async (sendJsonObject) => {
  const response = await fetch(`${BACKEND_SERVER}/user`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(sendJsonObject),
  });
  const responseJsonObject = await response.json();
  console.log(">>> userApi.userWriteAction()-->response:", responseJsonObject);
  return responseJsonObject;
};

export const userLoginAction = async (sendJsonObject) => {
  const params = new URLSearchParams(sendJsonObject).toString();
  const response = await fetch(`${BACKEND_SERVER}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const responseJsonObject = await response.json();
  console.log(">>> userApi.userLoginAction()-->response:", responseJsonObject);
  return responseJsonObject;
};

export const userDeleteAction = async (userId) => {
  /******login check[cookie check]******/
  const member = safeGetMember();
  if (!member) {
    console.log("Member NOT FOUND");
    alert("로그인 해야만 합니다.");
    window.location.hash = "#user_login_form";
    return;
  }
  /**********************************/

  // ✅ accessToken은 쿠키 or localStorage에서 통합 조회
  const accessToken = getAccessToken();
  if (!accessToken) {
    console.log("AccessToken NOT FOUND");
    alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
    return;
  }

  const response = await fetch(`${BACKEND_SERVER}/user/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`, // ✅ 변경
      "Content-type": "application/json",
    },
  });

  return await response.json();
};

export const userView = async (userId) => {
  /******login check[cookie check]******/
  const member = safeGetMember();
  if (!member) {
    console.log("Member NOT FOUND");
    return {
      data: {},
      status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
      message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
    };
  }
  /**********************************/

  // ✅ accessToken은 쿠키 or localStorage에서 통합 조회
  const accessToken = getAccessToken();
  if (!accessToken) {
    return {
      data: {},
      status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
      message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
    };
  }

  const response = await fetch(`${BACKEND_SERVER}/user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`, // ✅ 변경
      "Content-type": "application/json",
    },
  });

  const responseJsonObject = await response.json();
  console.log(">>> userApi.userView()-->response:", responseJsonObject);
  return responseJsonObject;
};

export const userViewEmail = async (email) => {
  /******login check[cookie check]******/
  const member = safeGetMember();
  if (!member) {
    console.log("Member NOT FOUND");
    return {
      data: {},
      status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
      message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
    };
  }
  /**********************************/

  const accessToken = getAccessToken();
  if (!accessToken) {
    return {
      data: {},
      status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
      message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
    };
  }

  const response = await fetch(`${BACKEND_SERVER}/user/social/${email}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`, // ✅ 변경
      "Content-type": "application/json",
    },
  });

  const responseJsonObject = await response.json();
  console.log(">>> userApi.userViewEmail()-->response:", responseJsonObject);
  return responseJsonObject;
};

export const userModifyAction = async (sendJsonObject) => {
  /******login check[cookie check]******/
  const member = safeGetMember();
  if (!member) {
    console.log("Member NOT FOUND");
    return {
      data: {},
      status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
      message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
    };
  }
  /**********************************/

  const accessToken = getAccessToken();
  if (!accessToken) {
    return {
      data: {},
      status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
      message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
    };
  }

  const response = await fetch(`${BACKEND_SERVER}/user/${sendJsonObject.userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`, // ✅ 변경
      "Content-type": "application/json",
    },
    body: JSON.stringify(sendJsonObject),
  });

  const responseJsonObject = await response.json();
  console.log(">>> userApi.userModifyAction()-->response:", responseJsonObject);
  return responseJsonObject;
};

export const userModifyActionSocial = async (sendJsonObject) => {
  /******login check[cookie check]******/
  const member = safeGetMember();
  if (!member) {
    console.log("Member NOT FOUND");
    return {
      data: {},
      status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
      message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
    };
  }
  /**********************************/

  const accessToken = getAccessToken();
  if (!accessToken) {
    return {
      data: {},
      status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
      message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
    };
  }

  const response = await fetch(
    `${BACKEND_SERVER}/api/member/modify/${sendJsonObject.email}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`, // ✅ 변경
        "Content-type": "application/json",
      },
      body: JSON.stringify(sendJsonObject),
    }
  );

  const responseJsonObject = await response.json();
  console.log(">>> userApi.userModifyActionSocial()-->response:", responseJsonObject);
  return responseJsonObject;
};

export const userLogoutAction = async () => {
  /******login check[cookie check]******/
  const member = safeGetMember();
  if (!member) {
    console.log("Member NOT FOUND");
    return {
      data: {},
      status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
      message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
    };
  }
  /**********************************/

  const accessToken = getAccessToken();
  if (!accessToken) {
    return {
      data: {},
      status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
      message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
    };
  }

  const response = await fetch(`${BACKEND_SERVER}/user/logout`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`, // ✅ 변경
    },
  });

  const responseJsonObject = await response.json();
  console.log(">>> userApi.userLogoutAction()-->response:", responseJsonObject);
  return responseJsonObject;
};

export const userRefreshToken = async () => {
  // ✅ refresh는 쿠키 member에 있을 가능성이 커서 member는 유지
  const member = safeGetMember();
  if (!member) {
    console.log("Member NOT FOUND");
    return {
      data: {},
      status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
      message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
    };
  }

  const accessToken = getAccessToken(); // ✅ accessToken은 통합 조회
  const refreshToken = member?.refreshToken;

  if (!accessToken || !refreshToken) {
    console.log("Token NOT FOUND");
    return {
      data: {},
      status: ResponseStatusCode.ERROR_NOT_FOUND_ACCESS_TOKEN,
      message: ResponseMessage.ERROR_NOT_FOUND_ACCESS_TOKEN,
    };
  }

  const response = await fetch(
    `${BACKEND_SERVER}/api/member/refresh?refreshToken=${encodeURIComponent(refreshToken)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`, // ✅ 변경
        "Content-Type": "application/json",
      },
    }
  );

  const responseJsonObject = await response.json();
  console.log(">>> userApi.userRefreshToken()-->response:", responseJsonObject);
  return responseJsonObject;
};
