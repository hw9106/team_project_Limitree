package com.itwill.user.exception;

public class UnauthorizedUserException extends Exception {
	private Object data;

	public UnauthorizedUserException(String msg) {
		super(msg);
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

}
