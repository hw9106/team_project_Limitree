package com.itwill.user.security.handler;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import com.google.gson.Gson;
import com.itwill.user.controller.Response;
import com.itwill.user.controller.ResponseMessage;
import com.itwill.user.controller.ResponseStatusCode;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CustomAccessDeniedHandler implements AccessDeniedHandler {

  @Override
  public void handle(HttpServletRequest request, HttpServletResponse response,
      AccessDeniedException accessDeniedException) throws IOException, ServletException {
    /***********************************************************************
     * Gson gson = new Gson();
     * String jsonStr = gson.toJson(Map.of("error", "ERROR_ACCESSDENIED"));
     ***********************************************************************/
    Gson gson = new Gson();
    Response response2 = new Response();
    response2.setStatus(ResponseStatusCode.ERROR_ACCESSDENIED);
    response2.setMessage(ResponseMessage.ERROR_ACCESSDENIED);
    String jsonStr = gson.toJson(response2);
    response.setContentType("application/json");
    response.setStatus(HttpStatus.FORBIDDEN.value());
    PrintWriter printWriter = response.getWriter();
    printWriter.println(jsonStr);
    printWriter.close();

  }

}
