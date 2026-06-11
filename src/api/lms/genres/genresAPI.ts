import { createQueryParams, handleAPIResponse } from '@/api/_contract/handlers';
import { lmsFetcher } from '@/api/_contract/fetcher';
import {
  getGenres_Params,
  getGenres_Response
} from '@/types/lms/validated';

// openapi-fetch HTTP 메서드들 destructuring (싱글톤 인스턴스)
const { GET, POST, PUT, PATCH, DELETE } = lmsFetcher;

/**
 * genres 조회
 * 엔드포인트: GET /genres
 *
 * @param {getGenres_Params} params - API 요청 파라미터
 * @returns {Promise<getGenres_Response>} API 응답 데이터
 */
export const fetchGenres = async (params: getGenres_Params) => {
  return handleAPIResponse<getGenres_Response>(
    GET('/genres', {
      params
    })
  );
};
