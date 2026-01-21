package com.itwill.user.entity;

/*
 * << Java의 Enum >>
 * Enum은 열거형, 즉 서로 연관된 상수들의 집합을 의미합니다.
 * final static string로 나타내던 고정값을 모아놓은 집합이라고 볼 수 있어요.
 * Java의 enum은 클래스처럼 사용할 수 있다는게 다른 언어와 가장 큰 차이점입니다.
 * 
 * 
 * 1. 생성방법
 * - 열거형으로 선언된 순서에 따라 0 부터 인덱스 값을 가진다. 순차적으로 증가된다.
 * - enum 열거형으로 지정된 상수들은 모두 대문자로 선언
 * - 마지막에 열거형 변수들을 선언한 후 세미콜론(;)은 찍지 않는다.
 * 
 * 2. 클래스설명
 * - 사용자롤을 구성하는 UserRole Enum이며, 각 상수(USER, MANAGER, ADMIN)는 UserRole Enum의
 * 인스턴스이다.
 * - Enum 상수는 고정된 값을 가지며, 외부에서 변경불가능능
 * - Enum 클래스는 기본적으로 values()와 valueOf(String name) 메서드가 제공.
 * - values() : Enum의 모든 상수를 배열로 반환해요.
 * - valueOf(String name) : 해당 이름을 가진 Enum 상수를 반환.
 * 
 2. 사용방법
   - UserRole userRole = UserRole.USER;
  
  - if (userRole == UserRole.USER) {
      System.out.println("UserRole is USER");
    }
 * - UserRole role = UserRole.ADMIN; // Enum 타입도 객체!
    
  switch (role) {
    case USER:
      System.out.println("USER!");
      break;
    case ADMIN:
      System.out.println("ADMIN!");
      break;
    case MANAGER:
      System.out.println("MANAGER!");
      break;
  }
 */

public enum UserRole {

  USER, MANAGER, ADMIN

}

/*
 * public class UserRole {
 * 
 * public static final int USER = 0;
 * public static final int MANAGER = 1;
 * public static final int ADMIN = 2;
 * 
 * }
 */