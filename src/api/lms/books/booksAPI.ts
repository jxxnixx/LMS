import { createQueryParams, handleAPIResponse } from '@/api/_contract/handlers';
import { lmsFetcher } from '@/api/_contract/fetcher';
import {
  getBooks_Params,
  getBooks_Response,
  createBook_Body,
  createBook_Response,
  getBook_Params,
  getBook_Response,
  deleteBook_Params,
  deleteBook_Response,
  updateBook_Params,
  updateBook_Body,
  updateBook_Response,
  toggleLike_Params,
  toggleLike_Response
} from '@/types/lms/validated';

// openapi-fetch HTTP 메서드들 destructuring (싱글톤 인스턴스)
const { GET, POST, PUT, PATCH, DELETE } = lmsFetcher;

/**
 * books 조회
 * 엔드포인트: GET /books
 *
 * @param {getBooks_Params} params - API 요청 파라미터
 * @returns {Promise<getBooks_Response>} API 응답 데이터
 */
export const fetchBooks = async (params: getBooks_Params) => {
  return handleAPIResponse<getBooks_Response>(
    GET('/books', {
      params
    })
  );
};

/**
 * books 등록
 * 엔드포인트: POST /books
 *
 * @param {createBook_Body} body - API 요청 본문 데이터
 * @returns {Promise<createBook_Response>} API 응답 데이터
 */
export const createBooks = async (body: createBook_Body) => {
  return handleAPIResponse<createBook_Response>(
    POST('/books', {
      body
    })
  );
};

/**
 * {id} 조회
 * 엔드포인트: GET /books/{id}
 *
 * @param {getBook_Params} params - API 요청 파라미터
 * @returns {Promise<getBook_Response>} API 응답 데이터
 */
export const fetchBooksId = async (params: getBook_Params) => {
  return handleAPIResponse<getBook_Response>(
    GET('/books/{id}', {
      params: {
        path: params.path
      }
    })
  );
};

/**
 * {id} 삭제
 * 엔드포인트: DELETE /books/{id}
 *
 * @param {deleteBook_Params} params - API 요청 파라미터
 * @returns {Promise<deleteBook_Response>} API 응답 데이터
 */
export const removeBooksId = async (params: deleteBook_Params) => {
  return handleAPIResponse<deleteBook_Response>(
    DELETE('/books/{id}', {
      params: {
        path: params.path
      }
    })
  );
};

/**
 * {id} 수정
 * 엔드포인트: PATCH /books/{id}
 *
 * @param {updateBook_Params} params - API 요청 파라미터
 * @param {updateBook_Body} body - API 요청 본문 데이터
 * @returns {Promise<updateBook_Response>} API 응답 데이터
 */
export const modifyBooksId = async (params: updateBook_Params, body: updateBook_Body) => {
  return handleAPIResponse<updateBook_Response>(
    PATCH('/books/{id}', {
      params: {
        path: params.path
      },
      body
    })
  );
};

/**
 * like 수정
 * 엔드포인트: PATCH /books/{id}/like
 *
 * @param {toggleLike_Params} params - API 요청 파라미터
 * @returns {Promise<toggleLike_Response>} API 응답 데이터
 */
export const modifyBooksIdLike = async (params: toggleLike_Params) => {
  return handleAPIResponse<toggleLike_Response>(
    PATCH('/books/{id}/like', {
      params: {
        path: params.path
      }
    })
  );
};
