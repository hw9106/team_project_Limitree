package com.itwill.user.security.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.google.gson.Gson;
import com.itwill.user.controller.Response;
import com.itwill.user.controller.ResponseMessage;
import com.itwill.user.controller.ResponseStatusCode;
import com.itwill.user.security.SecurityUser;
import com.itwill.user.util.JWTUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

    String method = request.getMethod();
    String path = request.getRequestURI();
    log.info("JWTCheckFilter shouldNotFilter - method: {}, path: {}", method, path);

    // 1) Preflight(CORS) OPTIONS는 무조건 제외
    if ("OPTIONS".equalsIgnoreCase(method)) return true;

    // 2) 로그인/회원가입/토큰리프레시(토큰 없어도 되어야 함)
    if (path.equals("/user/login")) return true;
    if (path.equals("/user/logout")) return true;   // ✅ 추가
    if ("POST".equalsIgnoreCase(method) && path.equals("/user")) return true;

    // /api/member 또는 /api/member/ 하위 모두 제외
    if (path.equals("/api/member") || path.startsWith("/api/member/")) return true;

    // 3) ✅ 공개 조회 API들 (SecurityConfig permitAll과 1:1 일치)
    if ("GET".equalsIgnoreCase(method)) {

      // 상품 목록/상품 조회 공개
      if (path.equals("/product/list") || path.startsWith("/product/") || path.equals("/product")) return true;

      // 카테고리 공개
      if (path.equals("/api/categories") || path.startsWith("/api/categories/")) return true;

      // 리뷰 조회 공개
      if (path.startsWith("/reviews/") || path.equals("/reviews")) return true;
    }

    // 4) Swagger / error 등은 필터 제외(원하면)
    if (path.startsWith("/swagger") || path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui")
        || path.startsWith("/error")) return true;

    // 그 외는 JWT 검사 대상
    return false;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String authHeaderStr = request.getHeader("Authorization");

    // ✅ 토큰이 없거나 Bearer 형식이 아니면 그냥 통과
    // (최종적으로는 SecurityFilterChain의 authenticated에서 401 처리됨)
    if (!StringUtils.hasText(authHeaderStr) || !authHeaderStr.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    String accessToken = authHeaderStr.substring(7).trim();

    try {
      Map<String, Object> claims = JWTUtil.validateToken(accessToken);
      log.info("JWT claims: {}", claims);

      String userid = (String) claims.get("userId");
      String name = (String) claims.get("name");
      String email = (String) claims.get("email");
      Boolean social = (Boolean) claims.get("social");
      List<String> roleNames = (List<String>) claims.get("roleNames");

      SecurityUser securityUser = new SecurityUser(
          userid,
          "",
          name,
          email,
          social != null && social.booleanValue(),
          roleNames
      );

      UsernamePasswordAuthenticationToken authenticationToken =
          new UsernamePasswordAuthenticationToken(securityUser, null, securityUser.getAuthorities());

      SecurityContextHolder.getContext().setAuthentication(authenticationToken);

      filterChain.doFilter(request, response);

    } catch (Exception e) {

      log.error("JWT Check Error..............");
      log.error("예외객체타입  : {}", e.getClass().getSimpleName());
      log.error("예외객체메세지: {}", e.getMessage());

      Response response2 = new Response();
      String message = e.getMessage();

      if ("Expired".equals(message)) {
        response2.setStatus(ResponseStatusCode.ERROR_EXPIRED_TOKEN);
        response2.setMessage(ResponseMessage.ERROR_EXPIRED_TOKEN);
      } else {
        response2.setStatus(ResponseStatusCode.ERROR_ACCESS_TOKEN);
        response2.setMessage(ResponseMessage.ERROR_ACCESS_TOKEN);
      }

      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType("application/json;charset=UTF-8");

      String jsonStr = new Gson().toJson(response2);
      PrintWriter printWriter = response.getWriter();
      printWriter.println(jsonStr);
      printWriter.close();
    }
  }
}
