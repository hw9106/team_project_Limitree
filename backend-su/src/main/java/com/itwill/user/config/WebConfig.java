package com.itwill.user.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.itwill.user.repository.UserRepository;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	@Autowired
	private UserRepository userRepository;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOrigins("http://localhost:3000",
											"http://192.168.25.31:3000") // Next.js 주소
				.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
				.allowedHeaders("*")
				.allowCredentials(true) // ⭐ 쿠키 허용
				.maxAge(3600);
	}


}
