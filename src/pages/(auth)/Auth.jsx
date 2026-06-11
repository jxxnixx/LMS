import { useState } from "react";
import { Link } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import { useNavigate } from "react-router-dom";

export default function Auth({ mode: initialMode = "login" }) {
  // 라우트(/login · /signup)로 초기 모드를 정하고, 탭으로 전환
  const [mode, setMode] = useState(
    initialMode === "signup" ? "signup" : "login",
  );

  const isSignup = mode === "signup";

  const navigate = useNavigate();

  return (
    <div className='auth-wrap'>
      <div className='auth-card'>
        <Link to='/' className='auth-brand'>
          📚 도서관
        </Link>

        <div className='auth-tabs'>
          <button
            className={!isSignup ? "auth-tab on" : "auth-tab"}
            onClick={() => {
              setMode("login");
              navigate("/login");
            }}>
            로그인
          </button>

          <button
            className={isSignup ? "auth-tab on" : "auth-tab"}
            onClick={() => {
              setMode("signup");
              navigate("/signup");
            }}>
            회원가입
          </button>
        </div>

        {isSignup ? (
          <SignupForm onDone={() => setMode("login")} />
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
