# 📚 3D 몰입형 디지털 도서관 (LMS)

단순한 리스트 형태를 탈피하여, 사용자가 실제 도서관을 걷는 듯한 경험을 제공하는 **3D 기반 지능형 도서 관리 시스템**입니다. 프레이머 모션(Framer Motion)을 활용한 시각적 몰입감과, 생성형 AI를 활용한 도서 표지 생성 및 맞춤형 추천 기능을 제공합니다.

## 👥 팀원 소개 (AI_16조)
* **조장 / UI:** 김연주 (요구사항 정의, 기능 명세서 작성, Git 관리)
* **PM / 기획:** 장봉경 (기능 명세서, 프로젝트 문서화)
* **CRUD 연동:** 권오현, 류지후
* **OpenAI 연동:** 조승대
* **스타일링 & QA:** 강민수
* **발표 & 문서화:** 김경순

## 🛠 기술 스택
* **FrontEnd:** React 19, Vite, Framer Motion, React-Router-DOM, React-Hook-Form
* **BackEnd (Mock):** json-server
* **External API:** OpenAI API (gpt-image-1, gpt-4o-mini), Naver Book Search API

## ✨ 핵심 기능

### 1. 3D 도서관 복도 탐색 (Experience)
* 무거운 WebGL 없이 CSS 3D Transforms와 Framer Motion만을 조합하여 가상 공간의 깊이감과 원근감 구현.
* 11개 상위 장르별 브랜드 컬러를 부여하고, 사용자의 선택에 따라 복도 뷰 ⇄ 책장 뷰가 심리스(Seamless)하게 전환.

### 2. 지능형 도서 탐색 및 CRUD (Management)
* **실시간 검색:** 250ms 디바운스(Debounce) 처리를 통한 고효율 제목 검색.
* **정밀 필터링:** 상/하위 장르 및 '좋아요' 계층형 필터 시스템.
* **통합 관리:** React-Hook-Form 기반의 도서 등록/수정/삭제 폼 유효성 검사 및 상태 관리.

### 3. 생성형 AI 통합 시스템 (AI Integration)
* **AI 표지 생성:** OpenAI `gpt-image-1` 모델과 구조화된 프롬프트(Structured Prompt)를 활용해 도서 메타데이터 기반 1024x1536 고해상도 표지 자동 제작 (품질 3단계 제어).
* **개인화 맞춤 추천:** '내 책장(좋아요)' 데이터를 바탕으로 `gpt-4o-mini`가 취향을 분석하고, Vite Proxy를 통해 CORS 문제를 우회한 **Naver Book Search API**와 연동하여 실제 도서 6권을 매핑 및 추천.

## 🚀 실행 방법

### 1. 패키지 설치
```bash
npm install
