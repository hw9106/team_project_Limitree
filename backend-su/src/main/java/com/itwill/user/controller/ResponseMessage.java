package com.itwill.user.controller;

public class ResponseMessage {
    public static final String LOGIN_SUCCESS = "회원 로그인 성공";
    public static final String READ_USER = "회원 정보 조회 성공";
    public static final String READ_USERS = "회원들 정보 조회 성공";
    public static final String CREATED_USER = "회원 가입 성공";
    public static final String UPDATE_USER = "회원 정보 수정 성공";
    public static final String DELETE_USER = "회원 탈퇴 성공";
    public static final String LOGOUT_USER = "회원 로그 아웃";

    public static final String LOGIN_CHECK_SUCCESS_USER = "회원로그인상태";
    public static final String LOGIN_CHECK_FAIL_USER = "회원로그아웃상태";

    public static final String LOGIN_FAIL_NOT_FOUND_USER = "회원을 찾을 수 없습니다.";
    public static final String LOGIN_FAIL_PASSWORD_MISMATCH_USER = "회원패쓰워드불일치";
    public static final String UPDATE_FAIL_PASSWORD_MISMATCH_USER = "패쓰워드가 일치하지않습니다.";

    public static final String CREATE_FAIL_EXISTED_USER = "회원아이디중복";
    public static final String UNAUTHORIZED_USER = "인증받지않은요청입니다.";
    public static final String ERROR_ACCESSDENIED = "접근권한이 불충분합니다";
    public static final String ERROR_ACCESS_TOKEN = "유효한토큰이 아닙니다.";
    public static final String CUSTOM_JWT_ERROR = "JWT ERROR";
    public static final String ERROR_NOT_FOUND_ACCESS_TOKEN = "로그인 해야 합니다.";
    public static final String ERROR_EXPIRED_TOKEN = "만료된 토큰입니다";

   
    public static final String SPRING_SECURITY_NO_SEARCH_ELEMENT = "NoSuchElementException";
    public static final String SPRING_METHOD_ARGUMENT_NOT_VALID = "MethodArgumentNotValidException";
    public static final String UNKNOWN_EXCEPTION = "고객님 죄송합니다..";
}