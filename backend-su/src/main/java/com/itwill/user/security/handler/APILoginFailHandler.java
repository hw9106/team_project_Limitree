package com.itwill.user.security.handler;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.google.gson.Gson;
import com.itwill.user.controller.Response;
import com.itwill.user.controller.ResponseMessage;
import com.itwill.user.controller.ResponseStatusCode;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class APILoginFailHandler implements AuthenticationFailureHandler {

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {

		log.info("Login fail....." + exception);

		/**************************
		 * Gson gson = new Gson();
		 * String jsonStr = gson.toJson(Map.of("error", "ERROR_LOGIN"));
		 ************************************************************/
		Response response2 = new Response();
		if (exception instanceof BadCredentialsException) {
			response2.setStatus(ResponseStatusCode.LOGIN_FAIL_PASSWORD_MISMATCH_USER);
			response2.setMessage(ResponseMessage.LOGIN_FAIL_PASSWORD_MISMATCH_USER);

		} else if (exception instanceof UsernameNotFoundException
                || (exception.getCause() instanceof UsernameNotFoundException)) {
			response2.setStatus(ResponseStatusCode.LOGIN_FAIL_NOT_FOUND_USER);
			response2.setMessage(ResponseMessage.LOGIN_FAIL_NOT_FOUND_USER);
		} else {
			response2.setStatus(ResponseStatusCode.UNKNOWN_EXCEPTION);
			response2.setMessage(ResponseMessage.UNKNOWN_EXCEPTION);
		}

		Gson gson = new Gson();
		String jsonStr = gson.toJson(response2);

		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

		PrintWriter printWriter = response.getWriter();
		printWriter.println(jsonStr);
		printWriter.close();

	}

}
