import { createQueryParams, handleAPIResponse } from '@/api/_contract/handlers';
import { lmsFetcher } from '@/api/_contract/fetcher';
import {
  proxy_Params,
  proxy_Response
} from '@/types/lms/validated';

// openapi-fetch HTTP 메서드들 destructuring (싱글톤 인스턴스)
const { GET, POST, PUT, PATCH, DELETE } = lmsFetcher;

/**
 * naver 조회
 * 엔드포인트: GET /api/naver
 *
 * @param {proxy_Params} params - API 요청 파라미터
 * @returns {Promise<proxy_Response>} API 응답 데이터
 */
export const fetchApiNaver = async (params: proxy_Params) => {
  return handleAPIResponse<proxy_Response>(
    GET('/api/naver', {
      params: {
        query: params.query
      }
    })
  );
};
