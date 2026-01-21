package com.itwill.user.security;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import com.itwill.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * CustomUSerDetailsService
 */
@Service
@Log4j2
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
  @Autowired
  private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    log.info("----------------loadUserByUsername-----------------------------");

    return userRepository.findById(username).map(user -> {
                      SecurityUser securityUser = new SecurityUser(
                          user.getUserId(),
                          user.getPassword(),
                          user.getName(),
                          user.getEmail(),
                          user.isSocial(),
                          user.getRoles()
                              .stream()
                              .map(memberRole -> memberRole.name()).collect(Collectors.toList()));
                      log.info(securityUser);
                      return securityUser;
    }).orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 사용자입니다: " + username));

  }

}
