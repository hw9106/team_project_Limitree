# 🛍️ Limitree (팀 프로젝트)

## 🧾 팀원 소개
#### 💡팀명: LIMITREE
#### 💡프로젝트명: 온라인 가구 쇼핑 플랫폼
#### 💡팀원 소개: 손보연(팀장) 김선혁(부팀장) 장재혁(헬스남) 박성섭(섭섭이) 정유한(무한) 김연준(묵묵이) 박현우(따돌림)  

---

## 📌 목차
- [프로젝트 소개](#-프로젝트-소개)
- [핵심 가치](#-핵심-가치)
- [✨ 주요 기능](#-주요-기능)
- [🧰 기술 스택](#-기술-스택)
- [🏗️ 시스템 아키텍처](#-시스템-아키텍처)
- [🧩 도메인 설계](#-도메인-설계)
- [📚 API 문서](#-api-문서)
- [🚀 실행 방법](#-실행-방법)
- [📁 폴더 구조](#-폴더-구조)
- [🧯 트러블슈팅 & 해결](#-트러블슈팅--해결)
- [🔭 향후 개선](#-향후-개선)

---

## 🧾 프로젝트 소개
**Limitree**는 쇼핑몰의 핵심 기능(상품/카테고리/장바구니/주문/리뷰/회원/위시리스트/비교)을 구현한 팀 프로젝트입니다.  
프론트는 React 기반으로 UX를 구성하고, 백엔드는 Spring Boot REST API로 도메인별 책임을 분리했습니다.

---

## 🧾 프로젝트 설계
🛍️ Limitree (팀 프로젝트)
1. 요구사항 명세서 [01.요구사항명세서 .docx](https://github.com/user-attachments/files/24786048/01.docx)
2. 화면 정의서 (Wireframe / 화면설계서) [02.사용자화면정의서.docx](https://github.com/user-attachments/files/24786049/02.docx)
3. (UML) 유스케이스 다이어그램 - Usecase Diagram [03.유스케이스모형기술서.doc](https://github.com/user-attachments/files/24786050/03.doc)
4. (UML) 시퀀스 다이어그램 - Sequence Diagram [04.씨퀀스다이어그람기술서.doc](https://github.com/user-attachments/files/24786051/04.doc)
5. (UML) 클래스 다이어그램 - Class Diagram [05.클래스다이어그람기술서.doc](https://github.com/user-attachments/files/24786052/05.doc)
6. ERD Diagram 

### 📌 데이터베이스 (ERD Diagram) 
1. logical
![limitree-logical](https://github.com/user-attachments/assets/65939dbd-a96e-4a1b-bbff-80f5c5d8b685)
2. physical.jpg
<img width="1214" height="627" alt="limitree-physical" src="https://github.com/user-attachments/assets/54ee9cee-91f8-40e6-b4ad-eed218c80821" />

## 🛠 Tech Stack

### 🔹 Backend
| 기술 | 버전/설명 | Badge |
|---|---|---|
| Java | 21 | ![Java](https://img.shields.io/badge/Java-21-007396?logo=java&logoColor=white) |
| Spring | Framework | ![Spring](https://img.shields.io/badge/Spring-6DB33F?logo=spring&logoColor=white) |
| Spring Boot | 3.4.4 | ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.4-6DB33F?logo=springboot&logoColor=white) |
| Spring Security | 인증/인가 | ![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?logo=springsecurity&logoColor=white) |
| JPA | ORM | ![JPA](https://img.shields.io/badge/JPA-59666C?logo=hibernate&logoColor=white) |
| Hibernate | JPA 구현체 | ![Hibernate](https://img.shields.io/badge/Hibernate-59666C?logo=hibernate&logoColor=white) |
| Node.js | 18 | ![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js&logoColor=white) |
| Express | Node Framework | ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) |

---

### 🔹 Frontend
| 기술 | 버전/설명 | Badge |
|---|---|---|
| HTML5 | Markup | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) |
| CSS3 | Style | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) |
| JavaScript | ES6+ | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) |
| TypeScript | Typed JS | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) |
| React | 18 | ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white) |
| Next.js | React Framework | ![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white) |
| Redux | 상태관리 | ![Redux](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=white) |
| Tailwind CSS | Utility CSS | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white) |

---

### 🔹 Database
| 기술 | 설명 | Badge |
|---|---|---|
| Oracle DB | RDBMS | ![Oracle](https://img.shields.io/badge/Oracle-DB-F80000?logo=oracle&logoColor=white) |

---

### 🔹 Version Control & Collaboration
| 기술 | 설명 | Badge |
|---|---|---|
| Git | 형상관리 | ![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white) |
| GitHub | 협업 / 저장소 | ![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white) |


---

## 🎯 핵심 가치
- **도메인 분리**: cart / category / compare / order / product / review / user / wishlist로 책임을 분리
- **일관된 인증 체계**: Spring Security 기반 토큰 인증(프로젝트 내 JWTUtil 사용)으로 보호
- **확장 가능한 구조**: Controller → Service → Repository 레이어 구조를 기반으로 기능 확장 용이
- **협업 친화**: Swagger UI(OpenAPI)로 API 문서화

---

## ✨ 주요 기능
### 1) 상품(Product)
- 상품 목록/상세 조회, 정렬/필터 UX 연동
- 관리자 상품 관리(도메인 분리)

### 2) 카테고리(Category)
- 카테고리 트리 제공 → 네비게이션/필터에 바로 사용

### 3) 장바구니(Cart)
- 장바구니 담기/수량 변경/삭제
- 사용자별 장바구니 관리

### 4) 주문(Order)
- 주문 생성/조회 (주문-주문아이템 구조 기반)
- 주문 완료 화면 UX(새로고침 데이터 유지 등) 고려

### 5) 리뷰(Review)
- 리뷰 조회/작성(UGC), 관리자 삭제/관리 분리

### 6) 회원(User / Auth)
- 일반 로그인 + 소셜 로그인(카카오 엔드포인트 분리)
- 토큰 인증 기반 보호(만료 대응 포함)

### 7) 위시리스트(Wishlist)
- 관심 상품 저장/조회/삭제
- 중복 저장 이슈 방지(프론트-백 계약 중요)

### 8) 비교(Compare)
- 비교 목록 관리
- 중복 체크/카운트 제공 → UI 배지/카운트에 활용

---

## 🧰 기술 스택
### Frontend
- React, React Router, Redux Toolkit, redux-persist, Axios, Bootstrap, React-Bootstrap, i18next, react-i18next, cogo-toast, clsx, Swiper

### Backend
- Spring Boot 3.4.4, Spring Web (spring-boot-starter-web), Spring Data JPA (spring-boot-starter-data-jpa), Spring Security (spring-boot-starter-security), OpenAPI/Swagger UI (springdoc-openapi), ModelMapper, Lombok, Oracle JDBC (ojdbc11)

### Database
- Oracle XE (프로퍼티 기준: `jdbc:oracle:thin:@localhost:1521:xe`)

---

## 🏗️ 시스템 아키텍처
```text
[React (Frontend)]
        |
        |  Axios (REST API)
        v
[Spring Boot (Backend)]
        |
        |  JPA (Repository)
        v
[Oracle DB]
```

---

## 🧩 도메인 설계
> 도메인별로 “역할 → 주요 API → 설계 포인트”로 정리하면 면접/발표에서 설명이 쉬워집니다.

- **Cart**: 구매 전 단계 데이터 관리(수량 변경/삭제 정책)
- **Category**: 트리 API로 프론트 구조 단순화
- **Compare**: 중복 방지 + count API로 UX 개선
- **Order**: 주문 생명주기/정합성(삭제 정책) 고려
- **Product**: 사용자 조회 vs 관리자 CRUD 분리
- **Review**: UGC(리뷰) 정책/권한 고려
- **User**: 일반/소셜 로그인 진입점 분리 + 토큰 갱신
- **Wishlist**: 사용자별 관심상품 중복 처리

---

## 📚 API 문서
- Swagger UI(OpenAPI): `springdoc-openapi-starter-webmvc-ui` 사용  
  > 실행 후 `/swagger-ui` 혹은 프로젝트 설정에 맞는 경로에서 확인

---

## 🚀 실행 방법
> 로컬 개발 기준 (환경에 따라 포트/DB 계정은 변경될 수 있습니다)

### 1) Backend (Spring Boot)
```bash
cd backend-su
./gradlew bootRun
```
- DB 설정: `backend-su/src/main/resources/application.properties`
- 현재 프로젝트 프로퍼티의 DB URL 예시: `jdbc:oracle:thin:@localhost:1521:xe`

### 2) Frontend (React)
```bash
cd frontend-su
npm install
npm start
```

---

## 📁 폴더 구조
```text
team_project_Limitree/
  ├─ backend-su/          # Spring Boot (REST API)
  └─ frontend-su/         # React (UI/UX)
```

---

---

## 🧯 트러블슈팅 & 해결
- **토큰 만료/인증 실패 처리**: 만료/오류 코드 분기 → 재로그인 유도 + 사용자 데이터 초기화
- **주문 완료 페이지 새로고침 이슈**: 리로드 시 상태 유실 → sessionStorage 기반 복원 전략 적용
- **Wishlist/Compare 중복 처리**: check/count API 및 프론트 상태 동기화로 UX 개선

---

## 🔭 향후 개선
- API 응답/에러 포맷 표준화(프론트 처리 단순화)
- 검색/페이징/캐싱 적용(카테고리 트리, 상품 목록 등)
- 권한(관리자/사용자) 분리 강화 및 감사 로그 도입
