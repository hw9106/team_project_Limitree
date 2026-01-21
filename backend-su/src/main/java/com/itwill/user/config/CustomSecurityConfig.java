package com.itwill.user.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.itwill.user.security.CustomUserDetailsService;
import com.itwill.user.security.filter.JWTCheckFilter;
import com.itwill.user.security.handler.APILoginFailHandler;
import com.itwill.user.security.handler.APILoginSuccessHandler;
import com.itwill.user.security.handler.CustomAccessDeniedHandler;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Configuration
@Log4j2
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class CustomSecurityConfig {

  @Autowired
  private CustomUserDetailsService userDetailsService;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    log.info("---------------------security config---------------------------");

    http.httpBasic(hb -> hb.disable());
    http.csrf(csrf -> csrf.disable());
    http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    http.authorizeHttpRequests(auth -> auth
      // 1) CORS Preflight
      .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

      // 2) 로그인/회원가입/리프레시(토큰 없이 허용)
      .requestMatchers("/user/login").permitAll()
      .requestMatchers(HttpMethod.POST, "/user").permitAll()
      .requestMatchers("/api/member/**").permitAll()
      .requestMatchers("/user/logout").permitAll()
      
      // 3) 공개 조회 API (GET만)
      .requestMatchers(HttpMethod.GET, "/product/list").permitAll()
      .requestMatchers(HttpMethod.GET, "/product/**").permitAll()
      .requestMatchers(HttpMethod.GET, "/api/categories", "/api/categories/**").permitAll()
      .requestMatchers(HttpMethod.GET, "/reviews/**").permitAll()
      
      // 4) error
      .requestMatchers("/error").permitAll()

      // 5) 나머지는 전부 JWT 필요
      .anyRequest().authenticated()
    );

    // 로그인 처리 (폼로그인 방식 유지)
    http.formLogin(config -> {
      config.loginProcessingUrl("/user/login");
      config.successHandler(new APILoginSuccessHandler());
      config.failureHandler(new APILoginFailHandler());
      config.usernameParameter("userId");
      config.passwordParameter("password");
      config.permitAll();
    });

    // ✅ JWT 필터 등록 (인증 판단 전에 실행)
    http.addFilterBefore(new JWTCheckFilter(), UsernamePasswordAuthenticationFilter.class);

    http.exceptionHandling(config -> {
      config.accessDeniedHandler(new CustomAccessDeniedHandler());
      // 인증 안 된 상태의 401 처리를 커스텀하고 싶으면 여기 entryPoint를 켜면 됨.
      // config.authenticationEntryPoint(new CustomAuthenticationEntryPoint());
    });

    http.userDetailsService(userDetailsService);
    http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(List.of("*"));
    configuration.setAllowCredentials(true);
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setExposedHeaders(List.of("Authorization"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public AuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder);
    provider.setHideUserNotFoundExceptions(false);
    return provider;
  }

  /**
   * Swagger/정적 리소스는 필터 체인 자체 제외
   */
  @Bean
  public WebSecurityCustomizer webSecurityCustomizer() {
    return (webSecurity) -> {
      webSecurity.ignoring().requestMatchers(
          "/swagger-ui/**",
          "/v3/api-docs/**",
          "/swagger-ui.html",
          "/swagger/**",
          "/swagger-ui/**"
      );
      webSecurity.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    };
  }
}
