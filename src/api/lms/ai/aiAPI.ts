import { createQueryParams, handleAPIResponse } from '@/api/_contract/handlers';
import { lmsFetcher } from '@/api/_contract/fetcher';
import {
  image_Body,
  image_Response,
  chat_Body,
  chat_Response
} from '@/types/lms/validated';

// openapi-fetch HTTP 메서드들 destructuring (싱글톤 인스턴스)
const { GET, POST, PUT, PATCH, DELETE } = lmsFetcher;

/**
 * image 등록
 * 엔드포인트: POST /ai/image
 *
 * @param {image_Body} body - API 요청 본문 데이터
 * @returns {Promise<image_Response>} API 응답 데이터
 */
export const createAiImage = async (body: image_Body) => {
  return handleAPIResponse<image_Response>(
    POST('/ai/image', {
      body
    })
  );
};

/**
 * chat 등록
 * 엔드포인트: POST /ai/chat
 *
 * @param {chat_Body} body - API 요청 본문 데이터
 * @returns {Promise<chat_Response>} API 응답 데이터
 */
export const createAiChat = async (body: chat_Body) => {
  return handleAPIResponse<chat_Response>(
    POST('/ai/chat', {
      body
    })
  );
};
