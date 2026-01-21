package com.itwill.user.security;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SecurityUser extends User {

	private String userId;
	private String password;
	private String name;
	private String email;
	private boolean social;
	private List<String> roleNames = new ArrayList<>();

	public SecurityUser(String userId, String password, String name, String email, boolean social,
			List<String> roleNames) {
		super(userId, password,
				roleNames.stream().map(str -> new SimpleGrantedAuthority("ROLE_" + str)).collect(Collectors.toList()));
		this.userId = userId;
		this.password = password;
		this.name = name;
		this.email = email;
		this.social = social;
		this.roleNames = roleNames;
	}

	public Map<String, Object> getClaims() {
		Map<String, Object> dataMap = new HashMap<>();
		dataMap.put("userId", userId);
		dataMap.put("password", password);
		dataMap.put("name", name);
		dataMap.put("email", email);
		dataMap.put("social", social);
		dataMap.put("roleNames", roleNames);
		return dataMap;
	}

}
