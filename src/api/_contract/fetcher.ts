/**
 * lmsFetcher — 모든 API 호출이 거쳐 가는 공통 클라이언트 (손으로 쓰는 계약 파일).
 *
 * ▷ openapi-fetch: 백엔드 OpenAPI 스키마(@/types/lms/schema)를 읽어 타입이 자동으로 맞는 fetch를
 *   만들어준다. 잘못된 경로/바디는 타입 단계에서 잡힌다. 생성된 도메인 함수들이
 *   `const { GET, POST } = lmsFetcher`로 꺼내 쓴다.
 * ▷ 미들웨어: 요청이 나가기 직전(onRequest)에 끼어들어 매 요청에 로그인 토큰을 자동으로 붙인다.
 * ▷ 토큰 주입: 이 파일은 authStore를 직접 import하지 않는다(순환 의존·재사용성). 대신
 *   "토큰을 돌려주는 함수"를 바깥에서 setAuthTokenGetter로 건네받는다.
 */
import createClient, { type Middleware } from "openapi-fetch";

import type { paths } from "@/types/lms/schema";

// VITE_LMS(codegen 서버명 규칙) 우선, 없으면 기존 VITE_API_BASE_URL로 폴백.
const baseUrl = import.meta.env.VITE_LMS || import.meta.env.VITE_API_BASE_URL;

export const lmsFetcher = createClient<paths>({ baseUrl });

/** 요청 시점에 현재 accessToken을 꺼내주는 게터. 앱 부트 시 실제 토큰 소스로 연결한다. */
let getAccessToken: () => string | null | undefined = () => null;
export function setAuthTokenGetter(fn: () => string | null | undefined) {
  getAccessToken = fn;
}

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    if (import.meta.env.DEV) console.log("[api] →", request.method, request.url);
    const token = getAccessToken();
    if (token) request.headers.set("Authorization", `Bearer ${token}`);
    return request;
  },
};

lmsFetcher.use(authMiddleware);
