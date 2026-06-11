/**
 * API 응답 핸들러 — 손으로 쓰는 "계약" 파일(생성 코드가 import. codegen이 덮어쓰지 않음).
 *
 * ▷ 화면 → 서버 호출 사슬:
 *   화면: useXxxQuery()/useXxxMutation().mutateAsync(body)
 *     → 생성 함수 fetchXxx/createXxx (src/api/lms/** — 자동 생성)
 *       → handleAPIResponse( lmsFetcher.GET/POST(...) )   ← 이 파일 + fetcher.ts
 *   생성 코드는 얇은 껍데기이고, 토큰 부착(fetcher)·에러 정규화(이 파일)는 두 계약 파일에 모인다.
 *
 * ▷ 정규화 규칙:
 *   → 2xx 성공: 응답 본문(data)을 T로 반환
 *   → HTTP 에러(4xx/5xx)·네트워크 실패: ApiError로 정규화해 throw → 화면 try/catch가 처리
 */

export class ApiError extends Error {
  status: number;
  code?: string;
  body?: unknown;
  constructor(message: string, status: number, code?: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

type FetchResult = {
  data?: unknown;
  error?: unknown;
  response: Response;
};

function normalizeError(error: unknown, response: Response): ApiError {
  // 백엔드 에러 바디 { code, message } 우선 해석
  const err = error as
    | { error?: { code?: string; message?: string }; code?: string; message?: string }
    | undefined;
  const code = err?.error?.code ?? err?.code;
  const message =
    err?.error?.message ?? err?.message ?? `요청 실패 (HTTP ${response.status})`;
  return new ApiError(message, response.status, code, error);
}

/**
 * openapi-fetch 호출 결과를 받아 성공이면 data를 T로 반환, 실패면 throw.
 * @param call openapi-fetch가 돌려준 { data, error, response } 약속
 */
export async function handleAPIResponse<T>(call: Promise<FetchResult>): Promise<T> {
  let result: FetchResult;
  try {
    result = await call;
  } catch (e) {
    // 전송 단계 실패(서버 못 닿음 등) — response 자체가 없다.
    throw e instanceof Error ? e : new ApiError(String(e), 0);
  }
  const { data, error, response } = result;
  if (error || !response.ok) {
    throw normalizeError(error, response);
  }
  return data as T;
}

/**
 * 쿼리 파라미터 헬퍼. openapi-fetch가 params.query로 직렬화를 처리하므로 대부분 그대로 전달한다.
 * (생성 코드 호환용 export)
 */
export function createQueryParams<T extends Record<string, unknown>>(
  params?: T,
): T | undefined {
  return params;
}
