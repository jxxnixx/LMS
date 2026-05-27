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
<img width="1402" height="920" alt="스크린샷 2026-05-26 오후 3 09 44" src="https://github.com/user-attachments/assets/53de4ecf-dc48-4fc0-952d-1bfcca4b2100" />
<img width="1380" height="843" alt="스크린샷 2026-05-26 오후 3 11 26" src="https://github.com/user-attachments/assets/cdd42710-71c1-412d-b465-fe47f6c8a048" />

### 2. 지능형 도서 탐색 및 CRUD (Management)
* **실시간 검색:** 250ms 디바운스(Debounce) 처리를 통한 고효율 제목 검색.
* **정밀 필터링:** 상/하위 장르 및 '좋아요' 계층형 필터 시스템.
* **통합 관리:** React-Hook-Form 기반의 도서 등록/수정/삭제 폼 유효성 검사 및 상태 관리.
<img width="1490" height="914" alt="스크린샷 2026-05-26 오후 3 13 39" src="https://github.com/user-attachments/assets/e951c848-ba78-488f-a490-06b525107559" />
<img width="1468" height="912" alt="스크린샷 2026-05-26 오후 3 14 08" src="https://github.com/user-attachments/assets/3c640e26-7489-442f-b419-8fdd32b35503" />
<img width="1465" height="916" alt="스크린샷 2026-05-26 오후 3 14 32" src="https://github.com/user-attachments/assets/4c5ab359-e6f7-4a61-893f-148b22af78ac" />

### 3. 생성형 AI 통합 시스템 (AI Integration)
* **AI 표지 생성:** OpenAI `gpt-image-1` 모델과 구조화된 프롬프트(Structured Prompt)를 활용해 도서 메타데이터 기반 1024x1536 고해상도 표지 자동 제작 (품질 3단계 제어).
* **개인화 맞춤 추천:** '내 책장(좋아요)' 데이터를 바탕으로 `gpt-4o-mini`가 취향을 분석하고, Vite Proxy를 통해 CORS 문제를 우회한 **Naver Book Search API**와 연동하여 실제 도서 6권을 매핑 및 추천.
<img width="976" height="843" alt="스크린샷 2026-05-26 오후 3 16 04" src="https://github.com/user-attachments/assets/16175968-ec48-4fad-8045-77ce93f826b6" />
<img width="654" height="836" alt="스크린샷 2026-05-26 오후 3 17 06" src="https://github.com/user-attachments/assets/13e7d681-3369-4b0a-abfb-09896bb8d57a" />

### 4. ⚙️ 구현 내용 및 트러블 슈팅


* **AI 출력 일관성 확보:** AI 표지 생성 시 디자인이 틀어지는 문제를 방지하고자, 장르별 시각 묘사 및 레이아웃을 강제하는 'Structured Prompt Builder' 로직을 적용했습니다.
* **API 보안 및 CORS 우회:** Naver API 연동 시 브라우저 정책 충돌 및 키 노출을 방지하기 위해 Vite Proxy 서버를 구축하여 안전하게 API 통신을 수행했습니다.

## 🚀 실행 방법

### 1. 레포지토리 클론 및 패키지 설치
```bash
git clone [https://github.com/jxxnixx/LMS.git](https://github.com/jxxnixx/LMS.git)
cd LMS
npm install
npm install json-server@0.17.4
```

### 2. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 입력합니다.
```
VITE_OPENAI_API_KEY=sk-...
VITE_NAVER_CLIENT_ID=...
VITE_NAVER_CLIENT_SECRET=...
```

### 3. 개발 서버 실행 (터미널 2개 필요)
```bash
# 터미널 1 — Mock API 서버
npm run server

# 터미널 2 — React 앱
npm run dev
```

### 4. AI 표지 생성 사용법
1. 도서 상세 페이지 진입
2. **✨ AI 표지 생성** 버튼 클릭
3. OpenAI API Key 입력 (`sk-...` 형식, 조별 키 사용)
4. 품질 선택 후 **표지 생성하기** 클릭
5. 미리보기 확인 후 **이 표지로 저장** 클릭

> ⚠ 표지 생성 시 OpenAI API 비용이 발생합니다.
