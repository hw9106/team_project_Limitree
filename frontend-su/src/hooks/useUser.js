import { useEffect, useState } from 'react';
import * as userApi from '../api/userApi';
import cogoToast from 'cogo-toast';
import * as responseStatusCode from '../api/ResponseStatusCode';
import { getCookie, setCookie, removeCookie } from '../util/cookieUtil';


export const useUser = () => {
  const [loginUser, setLoginUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 새로고침 시 쿠키로 로그인 상태 복구
  useEffect(() => {
    const memberStr = getCookie('member');
    if (memberStr) {
      try {
        const member = JSON.parse(memberStr);
        setLoginUser(member);
        setIsLogin(true);
      } catch (e) {
        removeCookie('member');
      }
    }
    setLoading(false);
  }, []);
  const applyLogin = (memberData) => {
  setLoginUser(memberData);
  setIsLogin(true);
};
  /**
   * 로그인
   */
  const login = async ({ userId, password }) => {
    try {
      setLoading(true);
      const res = await userApi.userLoginAction({ userId, password });

      if (res.status === responseStatusCode.LOGIN_SUCCESS) {
        // ✅ 토큰(member) 쿠키 저장 (다음 요청들이 Authorization 붙일 수 있게)
        setCookie('member', JSON.stringify(res.data), 1);

        // ✅ accessToken을 localStorage에도 저장 (추가!)
      if (res.data?.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
      }

        setIsLogin(true);
        setLoginUser(res.data);
        cogoToast.success('로그인 성공');
        return true;
      } else {
        cogoToast.warn(res.message || '로그인 실패');
        return false;
      }
    } catch (err) {
      setError(err);
      cogoToast.error('로그인 중 오류 발생');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const userModifyAtion = async ({ userId, password, password2 }) => {
    if (password === '') return cogoToast.error('비번을 입력하십시요.');
    if (password2 === '') return cogoToast.error('비번확인을 입력하십시요.');
    if (password !== password2) return cogoToast.error('비밀번호와 비밀번호 확인은 일치하여야합니다.');

    const requestBody = { userId, password };
    const res = await userApi.userModifyAction(requestBody);

    if (res.status === 401 || res.status === 403) {
      removeCookie('member');
      setIsLogin(false);
      setLoginUser(null);
      cogoToast.info('로그인이 만료되었습니다. 다시 로그인 해주세요.');
      return false;
    }

    try {
      setLoading(true);
      const res = await userApi.userModifyAction(requestBody);

      if (res.status === responseStatusCode.UPDATE_USER) {
        // (선택) 서버가 갱신된 member를 준다면 쿠키도 갱신
        if (res.data?.accessToken) {
          setCookie('member', JSON.stringify(res.data), 1);
        }
        setIsLogin(true);
        setLoginUser(res.data);
        cogoToast.success('비밀번호 변경 성공');
        return true;
      } else {
        cogoToast.warn(res.message || '비밀번호 변경 실패');
        return false;
      }
    } catch (err) {
      setError(err);
      // ✅ 토큰 만료/권한 문제면 로그아웃 처리
      if (err?.status === 401 || err?.status === 403) {
        removeCookie('member');
        setIsLogin(false);
        setLoginUser(null);
      }
      cogoToast.error('비밀번호 변경 중 오류 발생');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const userWriteAtion = async ({ userId, password, password2, name, email }) => {
    if (userId === '') return cogoToast.error('아이디를 입력하십시요.');
    if (password === '') return cogoToast.error('비번을 입력하십시요.');
    if (password2 === '') return cogoToast.error('비번확인을 입력하십시요.');
    if (name === '') return cogoToast.error('이름을 입력하십시요.');
    if (email === '') return cogoToast.error('메일을 입력하십시요.');
    if (password !== password2) return cogoToast.error('비밀번호와 비밀번호 확인은 일치하여야합니다.');

    const requestBody = { userId, password, name, email };

    try {
      setLoading(true);
      const res = await userApi.userWriteAction(requestBody);

      if (res.status === responseStatusCode.CREATED_USER) {
        cogoToast.success('회원가입 성공');
        return true;
      } else {
        cogoToast.warn(res.message || '회원가입 실패');
        return false;
      }
    } catch (err) {
      setError(err);
      cogoToast.error('회원가입 중 오류 발생');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 로그아웃
   */
  const logout = async () => {
    try {
      setLoading(true);
      await userApi.userLogoutAction(); // 서버 실패해도 상관없게 처리해도 됨
    } catch (e) {
      // ignore
    } finally {
      // ✅ 프론트에서 쿠키 삭제가 로그아웃 핵심
      removeCookie('member');
       // ✅ localStorage에서도 accessToken 삭제 (추가!)
    localStorage.removeItem('accessToken');
      setIsLogin(false);
      setLoginUser(null);
      setLoading(false);
      cogoToast.info('로그아웃 되었습니다');
    }
  };

  return {
    isLogin,
    loginUser,
    loading,
    error,
    login,
    logout,
    userWriteAtion,
    userModifyAtion,
    applyLogin,
  };
};
