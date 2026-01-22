package com.itwill.user.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Product Open Api"))
@SecurityScheme(name = "BearerAuth",
			type = SecuritySchemeType.HTTP, 
			scheme = "bearer",
			bearerFormat = "JWT")
public class OpenApiConfiguration {
	
}
