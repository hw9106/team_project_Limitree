package com.itwill.user;

import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.itwill.user.dto.UserDto;
import com.itwill.user.entity.User;
import com.itwill.user.entity.UserRole;
import com.itwill.user.exception.ExistedUserException;
import com.itwill.user.exception.PasswordMismatchException;
import com.itwill.user.repository.UserRepository;

import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class UserServiceImpl implements UserService {
	@Value("${kakao.client-id}")
	private String kakaoClientId;

	@Value("${kakao.client-secret:}")
	private String kakaoClientSecret;

	@Value("${kakao.redirect-uri}")
	private String kakaoRedirectUri;

	@Value("${kakao.token-uri}")
	private String kakaoTokenUri;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	public PasswordEncoder passwordEncoder;
	/********************************************* */
	@Autowired
	private ModelMapper modelMapper;

	public void modelMapperUse() {
		UserDto userDto = new UserDto();
		User userEntity = new User();

		modelMapper.map(userDto, userEntity);
		User mappedUserEntity = modelMapper.map(userDto, User.class);
		modelMapper.map(userEntity, userDto);
		UserDto mappUserDto = modelMapper.map(userEntity, UserDto.class);

		/*
		 * 
		 * User user = modelMapper.map(userDto, User.class);
		 * 
		 * // 양방향 매핑 필수 처리
		 * if (user.getAuthorities() != null) {
		 * user.getAuthorities().forEach(auth -> auth.setUser(user));
		 * 3
		 * 
		 * 
		 * 
		 * }
		 * ✔ ModelMapper가 자동으로 해주는 것
		 * List<AuthorityDto> → Set<Authority> 변환
		 * 필드 매핑 자동 수행
		 * ✔ 직접 해야 하는 것
		 * authority.setUser(user) (양방향 연결)
		 */

	}

	/*************************************************** */
	/*
	 * 카카오API서버로부터 사용자이메일받아오기
	 */
	@Override
	public UserDto getKakaoMember(String accessToken) {
		String email = getEmailFromKakaoAccessToken(accessToken);
		log.info("email: " + email);
		Optional<User> optionalUser = userRepository.findByEmail(email);
		// 기존의 회원인경우
		if (optionalUser.isPresent()) {
			UserDto userDto = UserDto.toDto(optionalUser.get());
			return userDto;
		}
		/*
		 * 기존회원이 아니었다면
		 * 이름은 '소셜회원'으로
		 * 아이디,패스워드는 임의로 생성
		 */
		User socialUser = this.makeSocialMember(email);
		userRepository.save(socialUser);
		UserDto userDto = UserDto.toDto(socialUser);
		return userDto;
	}

	/*
	 * 회원가입
	 */
	@Override
	public int create(UserDto userDto) throws Exception {

		if (userRepository.existsById(userDto.getUserId())) {
			// 아이디중복
			throw new ExistedUserException(userDto.getUserId() + "는 이미존재하는 아이디입니다.");
		}

		// 회원가입

		User saveUser = User.builder()
				.userId(userDto.getUserId())
				.password(passwordEncoder.encode(userDto.getPassword()))
				.email(userDto.getEmail())
				.name(userDto.getName())
				.social(userDto.isSocial())
				.build();

		saveUser.addRole(UserRole.USER);
		if (userDto.getUserId().startsWith("admin")) {
			saveUser.addRole(UserRole.ADMIN);
		}
		userRepository.save(saveUser);
		return 0;

	}

	/*
	 * 회원상세보기
	 */
	@Override
	public UserDto findUser(String userId) throws Exception {
		return UserDto.toDto(userRepository.findById(userId).get());
	}

	/*
	 * 회원상세보기
	 */
	@Override
	public UserDto findUserByEmail(String email) throws Exception {
		return UserDto.toDto(userRepository.findByEmail(email).get());
	}

	/*
	 * 회원수정
	 */
	@Override
	public int update(UserDto userDto) throws Exception {
		User findUser = userRepository.findById(userDto.getUserId()).get();
		System.out.println(findUser);
		System.out.println(userDto);
		if (userDto.isSocial()) {
			userDto.setSocial(false);
		} else if (!passwordEncoder.matches(userDto.getPassword(), findUser.getPassword())) {
			throw new PasswordMismatchException("패쓰워드불일치");
		}
		findUser.setUserId(userDto.getUserId());
		findUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
		findUser.setName(userDto.getName());
		findUser.setEmail(userDto.getEmail());
		findUser.setSocial(userDto.isSocial());
		userRepository.save(findUser);
		return 0;
	}

	/*
	 * 회원탈퇴
	 */
	@Override
	public int remove(String userId) throws Exception {
		userRepository.deleteById(userId);
		return 0;
	}

	/*
	 * 아이디중복체크
	 */
	@Override
	public boolean isDuplicateId(String userId) throws Exception {
		boolean isExist = userRepository.existsById(userId);
		if (isExist) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public List<UserDto> findUserList() throws Exception {
		return userRepository.findAll().stream().map((User userEntity) -> {
			return UserDto.toDto(userEntity);
		}).collect(Collectors.toList());
	}

	private String getEmailFromKakaoAccessToken(String accessToken) {

		String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";
		if (accessToken == null || accessToken.isBlank()) {
			throw new RuntimeException("Access Token is null");
		}

		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer " + accessToken);
		headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

		HttpEntity<String> entity = new HttpEntity<>(headers);

		ResponseEntity<LinkedHashMap> response = restTemplate.exchange(
				kakaoGetUserURL,
				HttpMethod.GET,
				entity,
				LinkedHashMap.class);

		LinkedHashMap body = response.getBody();
		if (body == null) {
			throw new RuntimeException("KAKAO_USER_RESPONSE_EMPTY");
		}

		Object accountObj = body.get("kakao_account");
		if (!(accountObj instanceof LinkedHashMap)) {
			throw new RuntimeException("KAKAO_ACCOUNT_MISSING");
		}

		LinkedHashMap account = (LinkedHashMap) accountObj;
		Object emailObj = account.get("email");

		if (emailObj == null) {
			// ✅ 여기서 정책 선택:
			// 1) 이메일 동의를 필수로 요구한다면 예외
			throw new RuntimeException("KAKAO_EMAIL_REQUIRED");
			// 2) 아니면 kakao id로 계정 만들고 email 없이 운영(근데 너 엔티티는 email unique라서 어려움)
		}

		return String.valueOf(emailObj);
	}

	private User makeSocialMember(String email) {
		String tempPassword = makeTempPassword();
		log.info("tempPassword: " + tempPassword);
		String userId = generateRandomId(15, false);
		String name = "소셜회원";

		User userEntity = User.builder()
				.userId(userId)
				.email(email)
				.name(name)
				.password(passwordEncoder.encode(tempPassword))
				.social(true)
				.build();
		userEntity.addRole(UserRole.USER);
		return userEntity;
	}

	/**
	 * 자릿수(length) 만큼 랜덤한 문자열을 대문자/소문자에 따라 반환 받습니다.
	 *
	 * @param length      자릿수
	 * @param isUpperCase 대문자 여부
	 * @return 랜덤한 문자열
	 */
	private static String generateRandomId(int length, boolean isUpperCase) {
		String alphabet = "abcdefghijklmnopqrstuvwxyz";
		SecureRandom secureRandom = new SecureRandom();
		StringBuilder sb = new StringBuilder(length);
		for (int i = 0; i < length; i++) {
			sb.append(alphabet.charAt(secureRandom.nextInt(alphabet.length())));
		}
		return isUpperCase ? sb.toString().toUpperCase() : sb.toString().toLowerCase();
	}

	private String makeTempPassword() {
		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < 10; i++) {
			buffer.append((char) ((int) (Math.random() * 55) + 65));
		}
		return buffer.toString();
	}

	@Override
	public UserDto getKakaoMemberByCode(String code) {
		String kakaoAccessToken = getKakaoAccessTokenByCode(code);
		return getKakaoMember(kakaoAccessToken);
	}

	private String getKakaoAccessTokenByCode(String code) {

		if (code == null || code.isBlank()) {
			throw new RuntimeException("KAKAO_CODE_EMPTY");
		}

		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

		// application/x-www-form-urlencoded Body
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", kakaoClientId);
		params.add("redirect_uri", kakaoRedirectUri);
		params.add("code", code);

		// client_secret을 쓰는 앱이면 같이 전송
		if (kakaoClientSecret != null && !kakaoClientSecret.isBlank()) {
			params.add("client_secret", kakaoClientSecret);
		}

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

		ResponseEntity<LinkedHashMap> response = restTemplate.postForEntity(
				kakaoTokenUri,
				request,
				LinkedHashMap.class);

		LinkedHashMap body = response.getBody();
		if (body == null || body.get("access_token") == null) {
			log.error("Kakao token response body: {}", body);
			throw new RuntimeException("KAKAO_TOKEN_FAILED");
		}

		return String.valueOf(body.get("access_token"));
	}

}
