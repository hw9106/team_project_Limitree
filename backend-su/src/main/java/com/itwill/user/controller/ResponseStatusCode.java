package com.itwill.user.controller;

public class ResponseStatusCode {

	public static final int LOGIN_SUCCESS = 2100;
	public static final int READ_USER = 2200;
	public static final int READ_USERS = 2210;

	public static final int CREATED_USER = 2300;
	public static final int UPDATE_USER = 2400;
	public static final int DELETE_USER = 2500;
	public static final int LOGOUT_USER = 2600;

	public static final int LOGIN_CHECK_SUCCESS_USER = 2700;
	public static final int LOGIN_CHECK_FAIL_USER = 2800;

	public static final int LOGIN_FAIL_NOT_FOUND_USER = 5000;
	public static final int LOGIN_FAIL_PASSWORD_MISMATCH_USER = 5100;
	public static final int UPDATE_FAIL_PASSWORD_MISMATCH_USER = 5110;

	public static final int CREATE_FAIL_EXISTED_USER = 5200;
	public static final int UNAUTHORIZED_USER = 5400;
	public static final int ERROR_ACCESSDENIED = 5500;
	public static final int ERROR_ACCESS_TOKEN = 5600;
	public static final int CUSTOM_JWT_ERROR = 5700;
	public static final int ERROR_NOT_FOUND_ACCESS_TOKEN = 5800;
	public static final int ERROR_EXPIRED_TOKEN = 5900;

	public static final int SPRING_SECURITY_NO_SEARCH_ELEMENT = 9000;
	public static final int SPRING_METHOD_ARGUMENT_NOT_VALID = 9001;
	public static final int UNKNOWN_EXCEPTION = 9999;

}