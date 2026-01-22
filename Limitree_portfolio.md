# Limitree (팀 프로젝트) 포트폴리오

> 최신 업데이트: 2026-01-22

## 프로젝트 한 줄 소개

- 쇼핑몰 형태의 팀 프로젝트로, 기능을 **도메인(카테고리) 단위로 분리**해 개발했습니다.

## 발표/설명 흐름(요약)

- 프로젝트 개요 & 아키텍처
- 기술 스택(Frontend / Backend / DB)
- 카테고리(도메인)별 기능 소개 (각 3~5분)
- 공통 처리: 인증(JWT) / 예외 / 데이터 정책
- 트러블슈팅 & 개선 아이디어
- Q&A

## 전체 아키텍처

- Front: React Router 기반 페이지 흐름 (예: /product/:id, /shop-grid-standard)
- Back: Spring 기반 REST API (도메인별 Controller 분리)
- Auth: Spring Security 기반 + 토큰 인증(JWTUtil)
- 도메인: cart/category/compare/order/product/review/user/wishlist

## 기술 스택

### Frontend

- React
- React Router (react-router-dom)
- 상태관리: Redux Toolkit (@reduxjs/toolkit)
- HTTP: Axios
- UI: Bootstrap / React-Bootstrap
- 다국어: i18next + react-i18next
- UX: cogo-toast(알림), clsx(클래스 유틸)

### Backend / DB

- Spring Boot 3.4.4 (Web)
- Spring Security (인증/인가)
- Spring Data JPA (ORM)
- ModelMapper (DTO 매핑)
- Lombok
- Springdoc OpenAPI (Swagger UI)
- DB: Oracle (ojdbc11)
- 추가 드라이버: MariaDB client 포함

## 도메인(카테고리)별 기능

> 각 도메인은 **역할 → 실제 API → 설계 포인트** 순서로 정리했습니다.

### Cart (장바구니)

- **관련 Controller**: CartRestController

**역할/책임**
- 사용자 장바구니 상태 CRUD
- 수량 변경/전체 삭제 제공
- 구매 전 단계 데이터 관리

**주요 API (실제 매핑)**
- `POST /cart`
- `PUT /cart`
- `DELETE /cart/{cartItemId}`
- `DELETE /carts/{userId}`
- `GET /carts/{userId}`

**설계 포인트 / 정책 / 개선**
- id 기반 단건 삭제(/cart/{cartItemId}) vs 사용자 전체 삭제(/carts/{userId}) 분리
- 수량 변경은 PUT /cart로 처리
- 개선 아이디어: 캐싱/검색/페이징/권한 분리 강화(필요 시)

### Category (카테고리)

- **관련 Controller**: CategoryController

**역할/책임**
- 카테고리 트리 제공
- 프론트 네비/필터 기반 데이터
- 상품 탐색 UX의 기준

**주요 API (실제 매핑)**
- `GET /api/categories/tree`

**설계 포인트 / 정책 / 개선**
- 트리 API로 프론트 구조 단순화 (/api/categories/tree)
- 개선 아이디어: 캐싱/검색/페이징/권한 분리 강화(필요 시)

### Compare (비교)

- **관련 Controller**: CompareController

**역할/책임**
- 상품 비교 목록 관리
- 중복 체크 및 개수 제공
- 사용자별 비교 데이터 관리

**주요 API (실제 매핑)**
- `POST /compare/add`
- `GET /compare/check/{userId}/{productId}`
- `GET /compare/count/{userId}`
- `DELETE /compare/delete/{compareItemId}`
- `DELETE /compare/user/{userId}`
- `GET /compare/{userId}`

**설계 포인트 / 정책 / 개선**
- check API로 중복 비교 방지 (/compare/check/{userId}/{productId})
- count API로 UI 배지/카운트 제공
- 개선 아이디어: 캐싱/검색/페이징/권한 분리 강화(필요 시)

### Order (주문)

- **관련 Controller**: OrderRestController

**역할/책임**
- 주문 생성/조회/삭제 등 주문 생명주기
- 주문-주문아이템 구조로 라인아이템 관리
- 정합성(탈퇴/삭제 정책) 고려

**주요 API (실제 매핑)**
- `DELETE /admin/orders`
- `POST /order`
- `DELETE /order/{orderId}`
- `GET /order/{orderId}`
- `GET /orders`
- `GET /orders/my`

**설계 포인트 / 정책 / 개선**
- 주문 조회는 사용자 기준(/orders/{userId})
- 주문 완료 화면 데이터 유지를 고려(새로고침 대응)
- 개선 아이디어: 캐싱/검색/페이징/권한 분리 강화(필요 시)

### Product (상품)

- **관련 Controller**: AdminProductController, ProductController

**역할/책임**
- 상품 조회/상세/관리(관리자)
- 카테고리 연동/검색·정렬 기반 확장
- 관리자 CRUD 분리

**주요 API (실제 매핑)**
- `POST /admin/product/bulk-create`
- `DELETE /admin/product/deleteAll`
- `GET /admin/product/list`
- `POST /product/create`
- `DELETE /product/delete/{id}`
- `GET /product/list`
- `PUT /product/update/{id}`
- `GET /product/{id}`

**설계 포인트 / 정책 / 개선**
- 관리자용 컨트롤러(AdminProductController)와 사용자 조회(ProductController) 분리
- 상품 상세는 프론트 /product/:id와 연계
- 개선 아이디어: 캐싱/검색/페이징/권한 분리 강화(필요 시)

### Review (리뷰)

- **관련 Controller**: AdminReviewController, ReviewController

**역할/책임**
- 리뷰 조회/작성/삭제(관리자 포함)
- 상품 상세와 결합되는 UGC
- 정책(권한/삭제) 고려

**주요 API (실제 매핑)**
- `GET /products/{productId}/reviews/admin`
- `DELETE /products/{productId}/reviews/admin/{reviewId}`
- `POST /products/{productId}/reviews/write`
- `DELETE /reviews/admin/{reviewId}`

**설계 포인트 / 정책 / 개선**
- 관리자 삭제/관리(AdminReviewController)와 사용자 조회/작성(ReviewController) 분리
- 상품 상세 페이지와 결합되는 영역
- 개선 아이디어: 캐싱/검색/페이징/권한 분리 강화(필요 시)

### User (회원/인증)

- **관련 Controller**: APIRefreshController, SocialController, UserRestController

**역할/책임**
- 일반 로그인 + 카카오 로그인
- JWT 발급/갱신(refresh)
- 내 정보 조회/수정 등 회원 관리

**주요 API (실제 매핑)**
- `POST /api/member/kakao`
- `GET /user/context`
- `POST /user/login`
- `GET /user/logout`
- `GET /user/social/{email}`
- `DELETE /user/{userId}`
- `GET /user/{userId}`
- `PUT /user/{userId}`

**흐름 포인트**
- ANY /api/member/refresh

**설계 포인트 / 정책 / 개선**
- 일반 로그인과 소셜 로그인의 진입점 분리(/api/member/login, /api/member/kakao)
- 토큰 갱신 API 존재(/api/member/refresh)
- 개선 아이디어: 캐싱/검색/페이징/권한 분리 강화(필요 시)

### Wishlist (위시리스트)

- **관련 Controller**: WishListRestController

**역할/책임**
- 관심상품 저장/조회/삭제
- 사용자별 중복 처리
- 마이페이지 연동 기능

**주요 API (실제 매핑)**
- `POST /wishlist`
- `GET /wishlist/{userId}`
- `DELETE /wishlist/{wishlistId}`
- `DELETE /wishlists/{userId}`

**설계 포인트 / 정책 / 개선**
- 사용자 기준 조회/삭제 경로 제공
- 중복 저장 이슈 방지 로직 필요(프론트-백엔드 계약)
- 개선 아이디어: 캐싱/검색/페이징/권한 분리 강화(필요 시)

## 트러블슈팅 & 해결 경험 (예시)

- **토큰 만료 처리(JWT)**: 만료/오류 코드 분기 → 재로그인 유도 및 사용자 데이터 초기화

- **주문 완료 페이지 새로고침 이슈**: 화면 리로드 시 상태 유실 → sessionStorage 기반 복원 전략 적용

- **Wishlist/Compare 중복 처리**: `check/count` API 및 프론트 상태 동기화로 UX 개선


## 향후 개선 아이디어

- API 응답 스펙/에러 포맷을 더 표준화하여 프론트 처리 단순화

- 검색/페이징/캐싱(예: 카테고리 트리) 적용으로 성능 개선

- 권한(관리자/일반 사용자) 분리 강화 및 감사 로그 도입
