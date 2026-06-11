import { createQueryParams, handleAPIResponse } from '@/api/_contract/handlers';
import { lmsFetcher } from '@/api/_contract/fetcher';
import {
  signup_Body,
  signup_Response,
  sendCode_Body,
  sendCode_Response,
  login_Body,
  login_Response,
  checkCode_Body,
  checkCode_Response
} from '@/types/lms/validated';

// openapi-fetch HTTP 메서드들 destructuring (싱글톤 인스턴스)
const { GET, POST, PUT, PATCH, DELETE } = lmsFetcher;

/**
 * signup 등록
 * 엔드포인트: POST /auth/signup
 *
 * @param {signup_Body} body - API 요청 본문 데이터
 * @returns {Promise<signup_Response>} API 응답 데이터
 */
export const createAuthSignup = async (body: signup_Body) => {
  return handleAPIResponse<signup_Response>(
    POST('/auth/signup', {
      body
    })
  );
};

/**
 * send-code 등록
 * 엔드포인트: POST /auth/send-code
 *
 * @param {sendCode_Body} body - API 요청 본문 데이터
 * @returns {Promise<sendCode_Response>} API 응답 데이터
 */
export const createAuthSendCode = async (body: sendCode_Body) => {
  return handleAPIResponse<sendCode_Response>(
    POST('/auth/send-code', {
      body
    })
  );
};

/**
 * login 등록
 * 엔드포인트: POST /auth/login
 *
 * @param {login_Body} body - API 요청 본문 데이터
 * @returns {Promise<login_Response>} API 응답 데이터
 */
export const createAuthLogin = async (body: login_Body) => {
  return handleAPIResponse<login_Response>(
    POST('/auth/login', {
      body
    })
  );
};

/**
 * check-code 등록
 * 엔드포인트: POST /auth/check-code
 *
 * @param {checkCode_Body} body - API 요청 본문 데이터
 * @returns {Promise<checkCode_Response>} API 응답 데이터
 */
export const createAuthCheckCode = async (body: checkCode_Body) => {
  return handleAPIResponse<checkCode_Response>(
    POST('/auth/check-code', {
      body
    })
  );
};
