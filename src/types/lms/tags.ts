/**
 * 🏷️ LMS 서버 태그 리스트
 *
 * LMS 서버의 OpenAPI 스키마에서 자동 추출된 태그들입니다.
 *
 * 🔧 생성 명령어: npm run api:extract-tags
 *
 * 📊 총 4개 태그 발견
 */

// === 🏷️ LMS 서버 태그 리스트 ===

/**
 * LMS 서버의 모든 Swagger 태그들
 */
export const LMS_TAGS = [
  'api',
  'auth',
  'books',
  'genres',
] as const;

/**
 * LMS 서버 태그별 API 수량 통계
 */
export const LMS_TAG_STATS = {
  'api': 1,
  'auth': 4,
  'books': 3,
  'genres': 1,
} as const;

/**
 * LMS 서버 태그 요약
 */
export const LMS_TAG_SUMMARY = {
  server: 'lms',
  total: 4,
  tags: LMS_TAGS,
  stats: LMS_TAG_STATS
} as const;

// === 🎯 타입 정의 ===

/**
 * LMS 서버 태그 타입
 */
export type LmsTag = typeof LMS_TAGS[number];

/**
 * LMS 서버 태그 통계 타입
 */
export type LmsTagStats = typeof LMS_TAG_STATS;

// === 🔧 기본 export ===

export default {
  TAGS: LMS_TAGS,
  STATS: LMS_TAG_STATS,
  SUMMARY: LMS_TAG_SUMMARY
};