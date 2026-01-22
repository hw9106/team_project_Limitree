package com.itwill;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.itwill.user.entity.User;
import com.itwill.user.entity.UserRole;
import com.itwill.user.repository.UserRepository;

@SpringBootApplication
@EntityScan(basePackages = "com.itwill")
public class UserBackendApplication implements CommandLineRunner {
		@Autowired
	UserRepository userRepository;
	@Autowired
	PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(UserBackendApplication.class, args);
	}
	@Override
	public void run(String... args) throws Exception {
		User user1 = User.builder()
				.userId("guard1")
				.name("김경호1")
				.email("guard1@gmail.com")
				.password(passwordEncoder.encode("1111")).social(false)
				.build();
		user1.addRole(UserRole.USER);

		User user2 = User.builder()
				.userId("guard2")
				.name("김경호2")
				.email("guard2@gmail.com")
				.password(passwordEncoder.encode("2222")).social(false)
				.build();
		user2.addRole(UserRole.USER);
		User user3 = User.builder()
				.userId("guard3")
				.name("김경호3")
				.email("guard3@gmail.com")
				.password(passwordEncoder.encode("3333")).social(false)
				.build();
		user3.addRole(UserRole.USER);
		user3.addRole(UserRole.MANAGER);

		User user4 = User.builder()
				.userId("guard4")
				.name("김경호4")
				.email("guard4@gmail.com")
				.password(passwordEncoder.encode("4444")).social(false)
				.build();
		user4.addRole(UserRole.USER);
		user4.addRole(UserRole.ADMIN);

		User user5 = User.builder()
				.userId("admin")
				.name("admin")
				.email("admin@admin")
				.password(passwordEncoder.encode("admin")).social(false)
				.build();
		user5.addRole(UserRole.ADMIN);
		
		userRepository.save(user1);
		userRepository.save(user2);
		userRepository.save(user3);
		userRepository.save(user4);
		userRepository.save(user5);

	}
}
