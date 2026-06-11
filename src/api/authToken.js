// 로그인 토큰 저장소 (localStorage). fetcher가 setAuthTokenGetter로 getToken을 주입받아
// 매 요청 Authorization 헤더에 붙인다. 화면은 로그인/회원가입 성공 시 setToken을 호출.
const TOKEN_KEY = "lms_token";
const USER_KEY = "lms_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function setUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
