package com.itwill.user.config;

import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Configuration;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
/*
 * web.xml설정을 대신할 클래스
 * -  톰캣실행시 기본설정
 */

@Configuration
public class WebAppInitConf implements ServletContextInitializer {
	public WebAppInitConf() {
		System.out.println("### WebApplicationInitializer()생성자");
	}

	@Override
	public void onStartup(ServletContext servletContext) throws ServletException {
		System.out.println("### onStartup()메쏘드");

	}

}
