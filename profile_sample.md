# <img width="123" height="38" alt="logo" src="https://github.com/user-attachments/assets/af863b77-e603-4838-a6b2-cb76f028a03d" />  

## 팀원 소개
#### 팀명: LIMITREE
#### 프로젝트명: 온라인 가구 쇼핑 플랫폼
#### 팀원 소개: 손보연(팀장) 김선혁(부팀장) 장재혁(헬스남) 박성섭(섭섭이) 정유한(무한) 김연준(묵묵이) 박현우(따돌림)  

---

## 목차
- [프로젝트 소개](#프로젝트-소개)
- [프로젝트 설계](#프로젝트-설계)
- [기술 스펙](#기술-스펙)
- [주요 기능](#주요-기능)
- [시스템 아키텍처](#시스템-아키텍처)
- [API 문서](#api-문서)
- [실행 방법](#실행-방법)
- [폴더 구조](#폴더-구조)
- [Advanced CI CD Pipeline](#advanced-ci-cd-pipeline)
- [LIMITREE 시연](#limitree-시연)

---

## 프로젝트 소개
**Limitree**는 쇼핑몰의 핵심 기능(상품/카테고리/장바구니/주문/리뷰/회원/위시리스트/비교)을 구현한 팀 프로젝트입니다.  
프론트는 React 기반으로 UX를 구성하고, 백엔드는 Spring Boot REST API로 도메인별 책임을 분리했습니다.

---

## 프로젝트 설계
Limitree (팀 프로젝트)
1. 요구사항 명세서 

<img width="500"  alt="요구사항" src="https://github.com/user-attachments/assets/1bcbe91b-4f7c-4289-a2d5-1cafbd993c6b" />

2. 화면 정의서 (Wireframe / 화면설계서)

<img  height="100" alt="6번" src="https://github.com/user-attachments/assets/3b461c12-ed61-4291-a247-cd52ebbe2c13" />             <img height="100" alt="7번" src="https://github.com/user-attachments/assets/3a064bc8-1611-4384-a825-ddcf1b7a9a5f" />             <img height="100" alt="8번" src="https://github.com/user-attachments/assets/fe7bbaf3-6efe-4c63-85c1-9cb332dd2c95" />

3. (UML) 유스케이스 다이어그램 - Usecase Diagram 

<img  height="100" alt="1번" src="https://github.com/user-attachments/assets/4358e56a-d3a1-467b-98e0-0862ddfee5b6" /><img height="100" alt="2번" src="https://github.com/user-attachments/assets/ba46b770-c89b-4570-8daa-c2428c2822bd" /><img height="100" alt="3번" src="https://github.com/user-attachments/assets/561dfdb0-2288-4ef5-8993-f04b84da5610" />

4. (UML) 시퀀스 다이어그램 - Sequence Diagram 

  <img width="200" alt="1번" src="https://github.com/user-attachments/assets/b63210a6-daab-4688-b32f-c34f5f210cf3" /><img width="200"  alt="2번" src="https://github.com/user-attachments/assets/51c5a9df-0ae7-4a69-99a1-cf66d1ec2cad" /><img width="200"  alt="3번" src="https://github.com/user-attachments/assets/dddd6110-9d96-4dec-9c1e-842a6a7b33ca" />

5. (UML) 클래스 다이어그램 - Class Diagram 

<img width="250"  alt="4번" src="https://github.com/user-attachments/assets/b7431192-a567-4e1b-9cf5-b2d37f461bd0" /><img width="250"  alt="5번" src="https://github.com/user-attachments/assets/ad1ff722-eb5f-4853-92e0-8c65adf3dd78" />

6. ERD Diagram 

### 데이터베이스 (ERD Diagram) 
1. logical
![limitree-logical](https://github.com/user-attachments/assets/65939dbd-a96e-4a1b-bbff-80f5c5d8b685)
2. physical.jpg
<img width="1214" height="627" alt="limitree-physical" src="https://github.com/user-attachments/assets/54ee9cee-91f8-40e6-b4ad-eed218c80821" />

## 기술 스펙

### 🔹 Backend (API & Core Service)
> **비즈니스 로직 / 인증·인가 / 데이터 접근 계층 중심**  
> REST API 제공, Spring Security로 인증/인가 처리, JPA로 DB 연동을 담당합니다.

| Category | Tech | Version / Usage | Badge |
|---|---|---|---|
| Language | Java | **Java 21 (LTS)** | ![Java](https://img.shields.io/badge/Java-21-007396?style=for-the-badge&logo=java&logoColor=white) |
| Framework | Spring Framework | Core / DI / AOP | ![Spring](https://img.shields.io/badge/Spring-Framework-6DB33F?style=for-the-badge&logo=spring&logoColor=white) |
| Framework | Spring Boot | **3.4.4** (API Server) | ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) |
| Security | Spring Security | 인증/인가, Filter 기반 보호 | ![Spring Security](https://img.shields.io/badge/Spring%20Security-Auth%2FAuthorization-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white) |
| ORM | JPA | Entity 설계 / 연관관계 매핑 | ![JPA](https://img.shields.io/badge/JPA-ORM-59666C?style=for-the-badge&logo=hibernate&logoColor=white) |
| ORM | Hibernate | JPA Provider / Lazy Loading | ![Hibernate](https://img.shields.io/badge/Hibernate-JPA%20Provider-59666C?style=for-the-badge&logo=hibernate&logoColor=white) |
| Runtime | Node.js | **18** (서브 API/연동 서비스) | ![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js&logoColor=white) |
| Framework | Express | 라우팅/미들웨어 기반 API | ![Express](https://img.shields.io/badge/Express-Node%20Framework-000000?style=for-the-badge&logo=express&logoColor=white) |

---

### 🔹 Frontend (Web UI)
> **React/Next 기반 UI + 상태관리 + 반응형 스타일링**  
> 화면 구성, 컴포넌트 구조화, 전역 상태 관리 및 UX 최적화를 담당합니다.

| Category | Tech | Version / Usage | Badge |
|---|---|---|---|
| Markup | HTML5 | Semantic Markup | ![HTML5](https://img.shields.io/badge/HTML5-Markup-E34F26?style=for-the-badge&logo=html5&logoColor=white) |
| Style | CSS3 | Layout / Responsive | ![CSS3](https://img.shields.io/badge/CSS3-Style-1572B6?style=for-the-badge&logo=css3&logoColor=white) |
| Language | JavaScript | ES6+ | ![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |
| Language | TypeScript | 타입 안정성 / DX 개선 | ![TypeScript](https://img.shields.io/badge/TypeScript-Typed%20JS-3178C6?style=for-the-badge&logo=typescript&logoColor=white) |
| Library | React | **18** (SPA UI) | ![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white) |
| Framework | Next.js | SSR/CSR, Routing | ![Next.js](https://img.shields.io/badge/Next.js-React%20Framework-000000?style=for-the-badge&logo=next.js&logoColor=white) |
| State | Redux | 전역 상태관리 / Store | ![Redux](https://img.shields.io/badge/Redux-State%20Management-764ABC?style=for-the-badge&logo=redux&logoColor=white) |
| CSS | Tailwind CSS | Utility CSS | ![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-Utility%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) |

---

### 🔹 Database (Persistence)
> **Oracle 기반 RDB 설계 & 트랜잭션 기반 데이터 운영**  
> 무결성/정합성을 고려한 테이블 설계, 제약조건 및 관계 모델링을 적용합니다.

| Category | Tech | Usage | Badge |
|---|---|---|---|
| RDBMS | Oracle DB | Schema / Relations / Transaction | ![Oracle](https://img.shields.io/badge/Oracle-Database-F80000?style=for-the-badge&logo=oracle&logoColor=white) |

---

### 🔹 Version Control & Collaboration
> **Git 브랜치 전략 + GitHub PR 중심 협업 프로세스**  
> 이슈 단위 작업 → PR → 리뷰 → 머지 흐름으로 품질을 관리합니다.

| Category | Tech | Usage | Badge |
|---|---|---|---|
| VCS | Git | Branch / Merge / Tag | ![Git](https://img.shields.io/badge/Git-Version%20Control-F05032?style=for-the-badge&logo=git&logoColor=white) |
| Platform | GitHub | PR / Review / Issue | ![GitHub](https://img.shields.io/badge/GitHub-Collaboration-181717?style=for-the-badge&logo=github&logoColor=white) |

---

## CI/CD & Infra

### 🔹 CI/CD Pipeline (GitHub Actions)
> **Push → Test → Build → Docker Image → Registry Push → Deploy**  
> 변경사항이 GitHub에 Push 되면 Actions가 자동으로 실행되어 빌드/테스트 후 이미지 배포까지 자동화합니다.

| Category | Tech | Usage | Badge |
|---|---|---|---|
| CI/CD | GitHub Actions | 자동 빌드/테스트/배포 | ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white) |
| Container | Docker | 서비스별 이미지 패키징 | ![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge&logo=docker&logoColor=white) |
| Orchestration | Docker Compose | 멀티 컨테이너 배포 | ![Docker Compose](https://img.shields.io/badge/Docker%20Compose-Orchestration-2496ED?style=for-the-badge&logo=docker&logoColor=white) |
| Web Server | Nginx | Reverse Proxy / Routing | ![Nginx](https://img.shields.io/badge/Nginx-Reverse%20Proxy-009639?style=for-the-badge&logo=nginx&logoColor=white) |
| Registry | Docker Registry | 이미지 저장/배포 | ![Docker](https://img.shields.io/badge/Docker%20Registry-Image%20Store-2496ED?style=for-the-badge&logo=docker&logoColor=white) |

---

## 주요 기능
### 1) 상품(Product)
- 상품 목록/상세 조회, 정렬/필터 UX 연동
- 관리자 상품 관리(도메인 분리)

<img width="200"  alt="제품" src="https://github.com/user-attachments/assets/477db911-da10-4693-bcc9-5d14fa2da921" /> <img width="200" alt="제품 2" src="https://github.com/user-attachments/assets/34975af9-54cc-4c2a-8ae4-a149dbb7d752" /> <img width="200" alt="제품 3" src="https://github.com/user-attachments/assets/682c8d7d-4252-41f4-8718-79c95f6c4536" />

### 2) 카테고리(Category)
- 카테고리 트리 제공 → 네비게이션/필터에 바로 사용

<img width="200" alt="카테고리 1" src="https://github.com/user-attachments/assets/633e7d28-2869-4548-b1ca-178534a40512" /> <img  width="200" alt="카테고리 2" src="https://github.com/user-attachments/assets/dc6cc66d-b019-4750-81c1-7e7fee41f68f" />

### 3) 장바구니(Cart)
- 장바구니 담기/수량 변경/삭제
- 사용자별 장바구니 관리

<img  width="200" alt="카트 1번" src="https://github.com/user-attachments/assets/57fdcb4b-b2c4-45b4-99a9-2ae86d216dc4" /><img  width="200" alt="카트 2번" src="https://github.com/user-attachments/assets/792dfc9d-eeee-453b-a6f4-7b0a7a877168" />

### 4) 주문(Order)
- 주문 생성/조회 (주문-주문아이템 구조 기반)
- 주문 완료 화면 UX(새로고침 데이터 유지 등) 고려

<img  width="200" alt="주문 1번" src="https://github.com/user-attachments/assets/d7f3583a-b74c-4e15-8fd2-f913025deebb" /> <img  width="200" alt="주문 2번" src="https://github.com/user-attachments/assets/519750a8-305e-4795-a4bd-566f0c8b5c36" />

### 5) 리뷰(Review)
- 리뷰 조회/작성(UGC), 관리자 삭제/관리 분리

<img  width="200" alt="리뷰 1번" src="https://github.com/user-attachments/assets/c5d4a3f0-5c35-470e-be7c-e204b91aa515" /><img  width="200" alt="리뷰 2번" src="https://github.com/user-attachments/assets/7aad97d1-b9b4-4f20-afc5-cbda4742a353" />

### 6) 회원(User / Auth)
- 일반 로그인 + 소셜 로그인(카카오 엔드포인트 분리)
- 토큰 인증 기반 보호(만료 대응 포함)

<img  width="200" alt="로그인" src="https://github.com/user-attachments/assets/85540f60-d7f4-4d6d-b666-282a23a27766" /><img  width="200" alt="회원가입" src="https://github.com/user-attachments/assets/7534e980-2f07-4e67-8606-e02f5a538c11" />
<img  width="200" alt="내정보 1" src="https://github.com/user-attachments/assets/ec4ddc02-c226-4b30-a0aa-00a1903afe4b" /><img  width="200" alt="내정보 2" src="https://github.com/user-attachments/assets/8b09d579-c5b1-4ea6-a0b0-48bf73cee6de" /><img  width="200" alt="내정보 3" src="https://github.com/user-attachments/assets/424cfdf6-ea79-4723-b1d2-21a716fbfb50" />

### 7) 위시리스트(Wishlist)
- 관심 상품 저장/조회/삭제
- 중복 저장 이슈 방지(프론트-백 계약 중요)

<img  width="200" alt="위시리스트" src="https://github.com/user-attachments/assets/cc8d3bb8-3275-4d61-99d0-2fb3c034937c" />

### 8) 비교(Compare)
- 비교 목록 관리
- 중복 체크/카운트 제공 → UI 배지/카운트에 활용

<img  width="200" alt="비교" src="https://github.com/user-attachments/assets/fbf0d61a-bb1f-4adc-b17c-aa608bf86b4b" />

---

## 시스템 아키텍처
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
<img width="500" height="1024" alt="아키텍처" src="https://github.com/user-attachments/assets/33e6a9dc-e7e2-4a0d-8789-d9d1946135b4" />

---

## API 문서
- Swagger UI(OpenAPI): `springdoc-openapi-starter-webmvc-ui` 사용  
  > 실행 후 `/swagger-ui` 혹은 프로젝트 설정에 맞는 경로에서 확인

<img width="500" height="1681" alt="스웨거" src="https://github.com/user-attachments/assets/1503233a-127a-4b71-a4bb-2dbbe934a212" />

---

## 실행 방법
> 로컬 개발 기준 (환경에 따라 포트/DB 계정은 변경될 수 있습니다)

### 1) Backend (Spring Boot)
```bash
cd backend
./gradlew bootRun
```
- DB 설정: `backend/src/main/resources/application.properties`
- 현재 프로젝트 프로퍼티의 DB URL 예시: `jdbc:oracle:thin:@localhost:1521:xe`

### 2) Frontend (React)
```bash
cd frontend
npm i --legacy-peer-deps
npm i xlsx
npm start
```
---

## 폴더 구조
```text
team_project_Limitree/
  ├─ backend/          # Spring Boot (REST API)
  └─ frontend/         # React (UI/UX)
```
---
## Advanced CI CD Pipeline

<img width="1536" height="1024" alt="PI" src="https://github.com/user-attachments/assets/04e8ff4d-a72a-4fae-8953-b6794c976824" />

### Pipeline Description
1. 개발자가 기능 구현 후 GitHub에 Push
2. GitHub Actions를 통해 CI 파이프라인 자동 실행
3. Backend(Spring Boot)는 Gradle 기반 빌드 및 테스트 수행
4. Frontend(React/Next.js)는 빌드 후 정적 리소스 생성
5. 각 서비스별 Docker Image 생성
6. Docker Registry로 이미지 Push
7. 운영 서버에서 최신 이미지 Pull 후 배포
8. Backend는 Oracle DB와 연동되어 서비스 제공

본 프로젝트는 GitHub Actions 기반 CI/CD 파이프라인을 구축하여
코드 변경 시 자동 빌드, 테스트, Docker 이미지 생성 및 배포가
이루어지도록 구성하였습니다.

## LIMITREE 시연
https://github.com/user-attachments/assets/a095d075-e0a3-43f2-9e69-42faf59850e7

## LIMITREE 프레젠테이션

[_260122.LIMITREE._REV1.pdf](https://github.com/user-attachments/files/24790138/_260122.LIMITREE._REV1.pdf)


