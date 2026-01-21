package com.itwill.user.entity;

import java.util.ArrayList;
import java.util.List;

import com.itwill.user.dto.UserDto;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/*
 *  사용자관리를 위하여 필요한 도메인클래스(VO,DTO)
 *  USERINFO 테이블의 각컬럼에해당하는 멤버를 가지고있다
 */

@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
@ToString
@Entity(name = "userinfo")
public class User {

	@Id
	@Column(name = "userid")
	private String userId;
	private String password;
	private String name;
	@Column(unique = true)
	private String email;

	private boolean social;

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "USERINFO_ROLES", joinColumns = @JoinColumn(name = "USERID"))
	@Column(name = "ROLES")
	@Builder.Default
	private List<UserRole> roles = new ArrayList<>();

	public void addRole(UserRole userRole) {
		roles.add(userRole);
	}

	public static User toEntity(UserDto userDto) {
		return User.builder()
				.userId(userDto.getUserId())
				.password(userDto.getPassword())
				.name(userDto.getName())
				.email(userDto.getEmail())
				.social(userDto.isSocial())
				.roles(userDto.getRoles())
				.build();
	}
}
