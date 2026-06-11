import { createContext, useContext, useState, useCallback } from "react";
import { getUser, setToken, setUser, clearAuth } from "@/api/authToken";

// 로그인 상태를 React에 노출. 토큰 자체는 localStorage(authToken)에 저장되고,
// fetcher가 거기서 직접 읽어 요청에 붙인다. 이 컨텍스트는 "화면 반응성"만 담당.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => getUser());

  const login = useCallback((token, userInfo) => {
    setToken(token);
    setUser(userInfo);
    setUserState(userInfo);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUserState(null);
  }, []);

  const value = { user, isAuthed: !!user, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
