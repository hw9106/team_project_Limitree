package com.itwill.user.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.itwill.user.UserService;
import com.itwill.user.dto.UserDto;
import com.itwill.user.util.JWTUtil;

// ✅ 아래 3개는 네 프로젝트 패키지에 맞춰 import 경로 확인 필요
import com.itwill.user.controller.Response;
import com.itwill.user.controller.ResponseMessage;
import com.itwill.user.controller.ResponseStatusCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequiredArgsConstructor
public class SocialController {

  private final UserService userService;

  @PostMapping("/api/member/kakao")
  public ResponseEntity<Response> kakaoLogin(@RequestBody Map<String, String> body) {

    String code = body.get("code");
    if (code == null || code.isBlank()) {
      Response bad = new Response();
      bad.setStatus(ResponseStatusCode.ERROR_ACCESS_TOKEN); // 너 코드 체계에 맞는 에러코드로 바꿔도 됨
      bad.setMessage("code is required");
      bad.setData(Map.of());
      return ResponseEntity.badRequest().body(bad);
    }

    // ✅ A안: code -> (백엔드에서 token 교환) -> 유저 조회/가입
    UserDto userDto = userService.getKakaoMemberByCode(code);

    Map<String, Object> claims = userDto.getClaims();

    // ✅ 토큰 payload에서 password 제거(보안)
    claims.remove("password");

    String jwtAccessToken = JWTUtil.generateToken(claims, 10);
    String jwtRefreshToken = JWTUtil.generateToken(claims, 60 * 24);

    claims.put("accessToken", jwtAccessToken);
    claims.put("refreshToken", jwtRefreshToken);

    Response response = new Response();
    response.setStatus(ResponseStatusCode.LOGIN_SUCCESS);
    response.setMessage(ResponseMessage.LOGIN_SUCCESS);
    response.setData(claims);

    return ResponseEntity.ok(response);
  }
}
