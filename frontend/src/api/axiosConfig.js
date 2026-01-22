import axios from "axios";
import { autoRefreshToken } from "../util/jwtUtil";

// Request Interceptor - 모든 요청 전에 토큰 자동 갱신
axios.interceptors.request.use( // axios.interceptors.request.use ==> 모든 HTTP 응답을 가로채서 전처리하는 인터셉터
  async (config) => {
    // refresh 요청은 인터셉터 스킵 (무한 루프 방지)
    if (config.skipAuthRefresh) {
      return config;
    }

    // Authorization 헤더가 있는 요청인 경우에만 토큰 갱신 체크
    if (config.headers.Authorization) {
      const newToken = await autoRefreshToken();
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - 401 에러 시 토큰 갱신 재시도
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 요청이면 토큰 갱신 후 재시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await autoRefreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest); // 재갱신하고 원래 요청을 다시 전송한다. 
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리 등
        console.error("Token refresh failed, redirecting to login");
        // 필요시 로그아웃 처리 추가
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
