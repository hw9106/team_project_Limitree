package com.itwill.user.security.handler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.google.gson.Gson;
import com.itwill.user.controller.Response;
import com.itwill.user.controller.ResponseMessage;
import com.itwill.user.controller.ResponseStatusCode;
import com.itwill.user.security.SecurityUser;
import com.itwill.user.util.JWTUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, 
		HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();
		Map<String, Object> claims = securityUser.getClaims();
		String accessToken = JWTUtil.generateToken(claims, 1);
		String refreshToken = JWTUtil.generateToken(claims, 60 * 24);
		claims.put("accessToken", accessToken);
		claims.put("refreshToken", refreshToken);

		/****************************
		 * Gson gson = new Gson();
		 * String jsonStr = gson.toJson(claims);
		 ******************************/
		Gson gson = new Gson();

		Response response2 = new Response();
		response2.setStatus(ResponseStatusCode.LOGIN_SUCCESS);
		response2.setMessage(ResponseMessage.LOGIN_SUCCESS);
		response2.setData(claims);
		String jsonStr = gson.toJson(response2);

		response.setContentType("application/json; charset=UTF-8");
		PrintWriter printWriter = response.getWriter();
		printWriter.println(jsonStr);
		printWriter.close();

	}

}
