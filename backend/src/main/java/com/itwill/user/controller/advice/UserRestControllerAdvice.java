package com.itwill.user.controller.advice;

import java.nio.charset.Charset;
import java.util.NoSuchElementException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.itwill.user.controller.Response;
import com.itwill.user.controller.ResponseMessage;
import com.itwill.user.controller.ResponseStatusCode;
import com.itwill.user.exception.ExistedUserException;
import com.itwill.user.exception.PasswordMismatchException;
import com.itwill.user.util.CustomJWTException;

@RestControllerAdvice
public class UserRestControllerAdvice {

	@ExceptionHandler(ExistedUserException.class)
	public ResponseEntity<Response> existedUserExceptionHandler(ExistedUserException e) {
		Response response = new Response();
		response.setStatus(ResponseStatusCode.CREATE_FAIL_EXISTED_USER);
		response.setMessage(ResponseMessage.CREATE_FAIL_EXISTED_USER);
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
	}

	@ExceptionHandler(PasswordMismatchException.class)
	public ResponseEntity<Response> passwordMismatchExceptionHandler(PasswordMismatchException e) {
		Response response = new Response();
		response.setStatus(ResponseStatusCode.UPDATE_FAIL_PASSWORD_MISMATCH_USER);
		response.setMessage(ResponseMessage.UPDATE_FAIL_PASSWORD_MISMATCH_USER);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
		return new ResponseEntity<Response>(response, headers, HttpStatus.ACCEPTED);
	}

	@ExceptionHandler(NoSuchElementException.class)
	protected ResponseEntity<?> notExist(NoSuchElementException e) {
		String msg = e.getMessage();
		Response response = new Response();
		response.setStatus(ResponseStatusCode.SPRING_SECURITY_NO_SEARCH_ELEMENT);
		response.setMessage(msg);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected ResponseEntity<?> handleIllegalArgumentException(MethodArgumentNotValidException e) {
		String msg = e.getMessage();
		Response response = new Response();
		response.setStatus(ResponseStatusCode.SPRING_METHOD_ARGUMENT_NOT_VALID);
		response.setMessage(msg);
		return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(response);
	}

	@ExceptionHandler(CustomJWTException.class)
	protected ResponseEntity<?> handleJWTException(CustomJWTException e) {
		String msg = e.getMessage();
		Response response = new Response();
		response.setStatus(ResponseStatusCode.CUSTOM_JWT_ERROR);
		response.setMessage(msg);
		return ResponseEntity.ok().body(response);
	}
}
