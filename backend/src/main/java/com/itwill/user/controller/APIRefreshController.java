package com.itwill.user.controller;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itwill.user.util.CustomJWTException;
import com.itwill.user.util.JWTUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
public class APIRefreshController {

  @RequestMapping("/api/member/refresh")
  public Map<String, Object> refresh(@RequestHeader("Authorization") String authHeader, @RequestParam("refreshToken") String refreshToken){

    if(refreshToken == null) {
      throw new CustomJWTException("NULL_REFRASH");
    }
    
    if(authHeader == null || authHeader.length() < 7) {
      throw new CustomJWTException("INVALID_STRING");
    }

    String accessToken = authHeader.substring(7);
    log.info("authHeader: " + authHeader);
    log.info("accessToken: " + accessToken);
    log.info("refreshToken: " + refreshToken);
    //Access 토큰이 만료되지 않았다면 
    if(checkExpiredToken(accessToken) == false ) {
      return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
    }

    //Refresh토큰 검증 
    Map<String, Object> claims = JWTUtil.validateToken(refreshToken);
    log.info("refresh ... claims: " + claims);
    //checkTime에 사용할 exp 값 미리 저장
    Long expValue = (Long) claims.get("exp");

    // 불변 Map을 수정 가능한 HashMap으로 복사 후 exp, iat 제거(그래야 1분짜리 토큰을 재발행 가능!)
    Map<String, Object> newClaims = new HashMap<>(claims);
    newClaims.remove("exp");
    newClaims.remove("iat");

    String newAccessToken = JWTUtil.generateToken(newClaims, 15);
    String newRefreshToken = JWTUtil.generateToken(newClaims, 60*24);
    // String newRefreshToken =  checkTime(expValue) == true ? JWTUtil.generateToken(newClaims, 60*24) : refreshToken;

    
    log.info("newAccessToken: " + newAccessToken);
    log.info("newRefreshToken: " + newRefreshToken);

    return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken);
  }

  //시간이 1시간 미만으로 남았다면
  private boolean checkTime(Long exp) {

    //JWT exp를 날짜로 변환
    java.util.Date expDate = new java.util.Date( (long)exp * (1000 ));

    //현재 시간과의 차이 계산 - 밀리세컨즈
    long gap   = expDate.getTime() - System.currentTimeMillis();

    //분단위 계산 
    long leftMin = gap / (1000 * 60);

    //1시간도 안남았는지.. 
    return leftMin < 60;
  }

  private boolean checkExpiredToken(String token) {

    try{
      JWTUtil.validateToken(token);
    }catch(CustomJWTException ex) {
      if(ex.getMessage().equals("Expired")){
          return true;
      }
    }
    return false;
  }
  
}