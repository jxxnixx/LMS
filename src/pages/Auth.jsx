import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Auth({ mode: initialMode = "login" }) {
  // 라우트(/login · /signup)로 초기 모드를 정하고, 탭으로 전환
  const [mode, setMode] = useState(initialMode === "signup" ? "signup" : "login");
  const isSignup = mode === "signup";

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          📚 도서관
        </Link>

        <div className="auth-tabs">
          <button
            type="button"
            className={!isSignup ? "auth-tab on" : "auth-tab"}
            onClick={() => setMode("login")}
          >
            로그인
          </button>
          <button
            type="button"
            className={isSignup ? "auth-tab on" : "auth-tab"}
            onClick={() => setMode("signup")}
          >
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

function LoginForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  // 백엔드 연동 전 — 검증만 통과하면 홈으로 보냄
  const onSubmit = async (data) => {
    console.log("[login]", data);
    navigate("/");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label>이메일</label>
        <input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email", {
            required: "이메일을 입력해주세요.",
            pattern: { value: EMAIL_RE, message: "이메일 형식이 올바르지 않습니다." },
          })}
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>

      <div className="field">
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호"
          autoComplete="current-password"
          {...register("password", {
            required: "비밀번호를 입력해주세요.",
            minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." },
          })}
        />
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>

      <button className="btn btn-wood auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "로그인 중…" : "로그인"}
      </button>
    </form>
  );
}

function SignupForm({ onDone }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", passwordConfirm: "" },
  });
  const passwordValue = watch("password");

  // 백엔드 연동 전 — 가입 성공으로 간주하고 로그인 탭으로 전환
  const onSubmit = async (data) => {
    console.log("[signup]", data);
    reset();
    onDone();
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label>이름</label>
        <input
          type="text"
          placeholder="이름"
          maxLength={30}
          autoComplete="name"
          {...register("name", {
            required: "이름을 입력해주세요.",
            validate: (v) => v.trim().length > 0 || "이름을 입력해주세요.",
          })}
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      <div className="field">
        <label>이메일</label>
        <input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email", {
            required: "이메일을 입력해주세요.",
            pattern: { value: EMAIL_RE, message: "이메일 형식이 올바르지 않습니다." },
          })}
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>

      <div className="field">
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="8자 이상"
          autoComplete="new-password"
          {...register("password", {
            required: "비밀번호를 입력해주세요.",
            minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." },
          })}
        />
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>

      <div className="field">
        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호 재입력"
          autoComplete="new-password"
          {...register("passwordConfirm", {
            required: "비밀번호를 한 번 더 입력해주세요.",
            validate: (v) => v === passwordValue || "비밀번호가 일치하지 않습니다.",
          })}
        />
        {errors.passwordConfirm && (
          <p className="form-error">{errors.passwordConfirm.message}</p>
        )}
      </div>

      <button className="btn btn-wood auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "가입 중…" : "회원가입"}
      </button>
    </form>
  );
}
