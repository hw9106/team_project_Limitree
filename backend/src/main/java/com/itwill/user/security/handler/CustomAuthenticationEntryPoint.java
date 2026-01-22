package com.itwill.user.security.handler;

import java.io.IOException;
import java.io.PrintWriter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.itwill.user.controller.Response;
import com.itwill.user.controller.ResponseMessage;
import com.itwill.user.controller.ResponseStatusCode;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 인증 실패시 결과를 처리해주는 로직을 가지고 있는 클래스
 */
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final Logger LOGGER = LoggerFactory.getLogger(CustomAuthenticationEntryPoint.class);

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException {
        /*
         * String exceptionClassName = ex.getClass().getSimpleName();
         * System.out.println(">>>>>>>>>>>>>>> "+exceptionClassName);
         * 
         * 
         * ObjectMapper objectMapper = new ObjectMapper();
         * LOGGER.info("[commence] 인증 실패로 response.sendError 발생");
         * EntryPointErrorResponse entryPointErrorResponse = new
         * EntryPointErrorResponse();
         * entryPointErrorResponse.setCode("UNAUTHORIZED");
         * entryPointErrorResponse.setMsg("인증[Authentication]이 실패하였습니다.");
         * 
         * response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
         * response.setContentType("application/json");
         * response.setCharacterEncoding("utf-8");
         * response.getWriter().write(objectMapper.writeValueAsString(
         * entryPointErrorResponse));
         */
        Response response2 = new Response();
        response2.setStatus(ResponseStatusCode.UNAUTHORIZED_USER);
        response2.setMessage(ResponseMessage.UNAUTHORIZED_USER);
        Gson gson = new Gson();
        String jsonStr = gson.toJson(response2);

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.close();

    }
}