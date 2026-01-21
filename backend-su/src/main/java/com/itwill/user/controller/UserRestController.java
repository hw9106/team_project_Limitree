package com.itwill.user.controller;

import java.nio.charset.Charset;
import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itwill.user.UserService;
import com.itwill.user.dto.UserDto;
import com.itwill.user.exception.ExistedUserException;
import com.itwill.user.security.SecurityUser;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpSession;

/*
POST 	/user/login 		- create  user 
GET 	/user/login 		- check  user 
GET   	/user/logout		- logout user 
POST 	/user 				- create user 
PUT 	/user/{id} 			- modify user by {id}
GET 	/user/{id} 			- GETs the details of the user with {id}
GET 	/user/social/{email}- GETs the details of the social user with {email}
GET 	/user 			    - GETs the list of the user
DELETE 	/user/{id} 			- Delete the user with id 
*/

@RestController
@RequestMapping("/user")
public class UserRestController {
	@Autowired
	private UserService userService;

	@Operation(summary = "SecurityContext")
	@SecurityRequirement(name = "BearerAuth")
	@GetMapping("/context")
	public SecurityContext context()
			throws ExistedUserException, Exception {

		return SecurityContextHolder.getContext();
	}

	@Operation(summary = "회원가입")
	@PostMapping
	public ResponseEntity<Response> user_write_action(@RequestBody UserDto userDto)
			throws ExistedUserException, Exception {
		System.out.println(">>>>>>>>" + userDto);
		userService.create(userDto);
		Response response = new Response();
		response.setStatus(ResponseStatusCode.CREATED_USER);
		response.setMessage(ResponseMessage.CREATED_USER);
		response.setData(userDto);

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(new MediaType(MediaType.APPLICATION_JSON, Charset.forName("UTF-8")));

		ResponseEntity<Response> responseEntity = new ResponseEntity<Response>(response, httpHeaders,
				HttpStatus.CREATED);
		return responseEntity;
	}

	@Operation(summary = "회원로그인(스프링폼로그인)")
	@PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public void springformLogin(
			@RequestParam(name = "userId") String userId,
			@RequestParam(name = "password") String password) {
	}

	@Operation(summary = "회원로그아웃")
	@SecurityRequirement(name = "BearerAuth")
	@PreAuthorize("hasAnyRole('ROLE_USER')") // 권한 설정
	@GetMapping("/logout")
	public ResponseEntity<Response> user_logout_action(HttpSession session) throws Exception {
		session.invalidate();
		Response response = new Response();
		response.setStatus(ResponseStatusCode.LOGOUT_USER);
		response.setMessage(ResponseMessage.LOGOUT_USER);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(new MediaType(MediaType.APPLICATION_JSON, Charset.forName("UTF-8")));
		ResponseEntity<Response> responseEntity = new ResponseEntity<Response>(response, httpHeaders, HttpStatus.OK);
		return responseEntity;
	}

	@Operation(summary = "회원정보보기")
	@SecurityRequirement(name = "BearerAuth")

	@GetMapping("/{userId}")
	@PreAuthorize("hasAnyRole('ROLE_USER')")
	public ResponseEntity<Response> user_view(
			@PathVariable("userId") String userId)
			throws Exception {
		if (!userId.equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
			throw new AccessDeniedException("접근 권한 없음");
		}

		UserDto loginUserDto = userService.findUser(userId);

		Response response = new Response();
		response.setStatus(ResponseStatusCode.READ_USER);
		response.setMessage(ResponseMessage.READ_USER);
		response.setData(loginUserDto);

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(new MediaType(MediaType.APPLICATION_JSON, Charset.forName("UTF-8")));
		ResponseEntity<Response> responseEntity = new ResponseEntity<Response>(response, httpHeaders, HttpStatus.OK);
		return responseEntity;
	}

	@Operation(summary = "회원수정")
	@SecurityRequirement(name = "BearerAuth")
	@PreAuthorize("hasAnyRole('ROLE_USER')")
	@PutMapping("/{userId}")
	public ResponseEntity<Response> user_modify_action(@PathVariable("userId") String userId,
			@RequestBody UserDto userDto)
			throws Exception {
		if (!userId.equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
			throw new AccessDeniedException("접근 권한 없음");
		}

		userDto.setUserId(userId);
		userService.update(userDto);
		Response response = new Response();
		response.setStatus(ResponseStatusCode.UPDATE_USER);
		response.setMessage(ResponseMessage.UPDATE_USER);
		response.setData(userDto);

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(new MediaType(MediaType.APPLICATION_JSON, Charset.forName("UTF-8")));
		ResponseEntity<Response> responseEntity = new ResponseEntity<Response>(response, httpHeaders, HttpStatus.OK);
		return responseEntity;
	}

	@Operation(summary = "회원삭제(관리자)")
	@SecurityRequirement(name = "BearerAuth")
	@PreAuthorize("hasRole('ROLE_ADMIN')") // ✅ ADMIN만
	@DeleteMapping("/{userId}")
	public ResponseEntity<Response> admin_user_remove(@PathVariable String userId) throws Exception {

		userService.remove(userId);

		Response response = new Response();
		response.setStatus(ResponseStatusCode.DELETE_USER);
		response.setMessage(ResponseMessage.DELETE_USER);

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(new MediaType(MediaType.APPLICATION_JSON, Charset.forName("UTF-8")));
		return new ResponseEntity<>(response, httpHeaders, HttpStatus.OK);
	}

	@Operation(summary = "회원리스트")
	@SecurityRequirement(name = "BearerAuth")
	@PreAuthorize("hasAnyRole('ROLE_ADMIN')") // 권한 설정
	@GetMapping
	public ResponseEntity<Response> user_list() throws Exception {
		List<UserDto> userList = userService.findUserList();
		Response response = new Response();
		response.setStatus(ResponseStatusCode.READ_USERS);
		response.setMessage(ResponseMessage.READ_USERS);
		response.setData(userList);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(new MediaType(MediaType.APPLICATION_JSON, Charset.forName("UTF-8")));
		ResponseEntity<Response> responseEntity = new ResponseEntity<Response>(response, httpHeaders, HttpStatus.OK);
		return responseEntity;
	}

	@Operation(summary = "소셜회원정보보기")
	@SecurityRequirement(name = "BearerAuth")
	@PreAuthorize("hasAnyRole('ROLE_USER')") // 임시로 권한 설정
	@GetMapping("/social/{email}")
	public ResponseEntity<Response> user_view_email(
			@PathVariable("email") String email,
			Authentication authentication, Principal principal)
			throws Exception {

		if (!email.equals(((SecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
				.getEmail())) {
			throw new AccessDeniedException("접근 권한 없음");
			// throw new UnauthorizedUserException("접근 권한 없음");
			// throw new AuthorizationDeniedException("접근 권한 없음");
		}

		UserDto loginUserDto = userService.findUserByEmail(email);
		System.out.println(">>>" + authentication.getName());
		System.out.println(">>>" + authentication.getAuthorities());
		System.out.println(">>>" + authentication.getPrincipal());
		Response response = new Response();
		response.setStatus(ResponseStatusCode.READ_USER);
		response.setMessage(ResponseMessage.READ_USER);
		response.setData(loginUserDto);

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(new MediaType(MediaType.APPLICATION_JSON, Charset.forName("UTF-8")));
		ResponseEntity<Response> responseEntity = new ResponseEntity<Response>(response, httpHeaders, HttpStatus.OK);
		return responseEntity;
	}
}
