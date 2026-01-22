# Limitree (팀 프로젝트)

## 팀원 소개
#### 팀명: LIMITREE
#### 프로젝트명: 온라인 가구 쇼핑 플랫폼
#### 팀원 소개: 손보연(팀장) 김선혁(부팀장) 장재혁(헬스남) 박성섭(섭섭이) 정유한(무한) 김연준(묵묵이) 박현우(따돌림)  

---

## 목차
- [프로젝트 소개](#-프로젝트-소개)
- [프로젝트 설계](#-프로젝트-설계)
- [기술 스펙](#-기술-스펙펙)
- [핵심 가치](#-핵심-가치)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [도메인 설계](#-도메인-설계)
- [API 문서](#-api-문서)
- [실행 방법](#-실행-방법)
- [폴더 구조](#-폴더-구조)
- [트러블슈팅 & 해결](#-트러블슈팅--해결)
- [향후 개선](#-향후-개선)

---

## 프로젝트 소개
**Limitree**는 쇼핑몰의 핵심 기능(상품/카테고리/장바구니/주문/리뷰/회원/위시리스트/비교)을 구현한 팀 프로젝트입니다.  
프론트는 React 기반으로 UX를 구성하고, 백엔드는 Spring Boot REST API로 도메인별 책임을 분리했습니다.

---

## 프로젝트 설계
Limitree (팀 프로젝트)
1. 요구사항 명세서 [01.요구사항명세서 .docx](https://github.com/user-attachments/files/24786048/01.docx)
2. 화면 정의서 (Wireframe / 화면설계서) [02.사용자화면정의서.docx](https://github.com/user-attachments/files/24786049/02.docx)
3. (UML) 유스케이스 다이어그램 - Usecase Diagram [03.유스케이스모형기술서.doc](https://github.com/user-attachments/files/24786050/03.doc)
4. (UML) 시퀀스 다이어그램 - Sequence Diagram [04.씨퀀스다이어그람기술서.doc](https://github.com/user-attachments/files/24786051/04.doc)
5. (UML) 클래스 다이어그램 - Class Diagram [05.클래스다이어그람기술서.doc](https://github.com/user-attachments/files/24786052/05.doc)
6. ERD Diagram 

### 데이터베이스 (ERD Diagram) 
1. logical
![limitree-logical](https://github.com/user-attachments/assets/65939dbd-a96e-4a1b-bbff-80f5c5d8b685)
2. physical.jpg
<img width="1214" height="627" alt="limitree-physical" src="https://github.com/user-attachments/assets/54ee9cee-91f8-40e6-b4ad-eed218c80821" />

## 기술 스펙

# 🛒 Project Portfolio — (프로젝트명 넣기)

> **Spring Boot + Next.js 기반의 커머스/서비스형 웹 프로젝트**  
> GitHub Actions 기반 CI/CD로 빌드·테스트·도커 이미지 배포를 자동화하고, 운영 서버에서 최신 이미지를 Pull 받아 배포합니다.

---

## ✨ Highlights

- ✅ **Spring Security 기반 인증/인가** (JWT 기반 접근 제어, 보호 리소스 분리)
- ✅ **JPA/Hibernate 기반 ORM 설계** (연관관계/트랜잭션/지연로딩 전략 적용)
- ✅ **React/Next.js 기반 UI 구성** (컴포넌트 구조화, 상태관리, 반응형 UI)
- ✅ **GitHub Actions CI/CD** (테스트 → 빌드 → Docker Image → Registry Push → 운영 배포)
- ✅ **운영환경 배포** (Docker Compose + Nginx Reverse Proxy + Oracle 연동)

---

## 🧩 Tech Stack

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

## 🚀 CI/CD & Infra

### 🔹 CI/CD Pipeline (GitHub Actions)
> **Push → Test → Build → Docker Image → Registry Push → Deploy**  
> 변경사항이 GitHub에 Push 되면 Actions가 자동으로 실행되어 빌드/테스트 후 이미지 배포까지 자동화합니다.

- **CI**
  - Backend: Gradle Build & Test
  - Frontend: Build (Next.js/React)
  - Docker Image Build (서비스별 이미지 생성)
  - Docker Registry로 Push
- **CD**
  - 운영 서버에서 최신 이미지 Pull
  - Docker Compose로 컨테이너 재기동
  - Nginx를 통해 Reverse Proxy로 서비스 제공
  - Backend ↔ Oracle DB 연동

| Category | Tech | Usage | Badge |
|---|---|---|---|
| CI/CD | GitHub Actions | 자동 빌드/테스트/배포 | ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white) |
| Container | Docker | 서비스별 이미지 패키징 | ![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge&logo=docker&logoColor=white) |
| Orchestration | Docker Compose | 멀티 컨테이너 배포 | ![Docker Compose](https://img.shields.io/badge/Docker%20Compose-Orchestration-2496ED?style=for-the-badge&logo=docker&logoColor=white) |
| Web Server | Nginx | Reverse Proxy / Routing | ![Nginx](https://img.shields.io/badge/Nginx-Reverse%20Proxy-009639?style=for-the-badge&logo=nginx&logoColor=white) |
| Registry | Docker Registry | 이미지 저장/배포 | ![Docker](https://img.shields.io/badge/Docker%20Registry-Image%20Store-2496ED?style=for-the-badge&logo=docker&logoColor=white) |

---

## 🗂️ Architecture Overview (High-Level)

- **Frontend(Next.js/React)**: 사용자 UI / 페이지 라우팅 / 상태관리
- **Backend(Spring Boot)**: 비즈니스 로직 / 인증/인가 / API 제공
- **Database(Oracle)**: 트랜잭션 기반 데이터 저장소
- **Nginx**: Reverse Proxy로 요청 분기 및 정적 리소스 처리
- **Docker Compose**: 서비스 단위 컨테이너 운영 및 배포 자동화

---

## 📌 Quick Start (예시)

> 아래는 예시입니다. 실제 프로젝트 실행 명령에 맞게 수정하세요.

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
./gradlew bootRun

## 핵심 가치
- **도메인 분리**: cart / category / compare / order / product / review / user / wishlist
- **일관된 인증 체계**: Spring Security 기반 토큰 인증(프로젝트 내 JWTUtil 사용)으로 보호
- **확장 가능한 구조**: Controller → Service → Repository 레이어 구조를 기반으로 기능 확장 용이
- **협업 친화**: Swagger UI(OpenAPI)로 API 문서화

---

## 주요 기능
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
---

## API 문서
- Swagger UI(OpenAPI): `springdoc-openapi-starter-webmvc-ui` 사용  
  > 실행 후 `/swagger-ui` 혹은 프로젝트 설정에 맞는 경로에서 확인

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
## Advanced CI/CD Pipeline

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


