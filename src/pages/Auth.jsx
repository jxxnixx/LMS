import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";

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
      <FormField
        label="이메일"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email", {
          required: "이메일을 입력해주세요.",
          pattern: { value: EMAIL_RE, message: "이메일 형식이 올바르지 않습니다." },
        })}
      />
      <FormField
        label="비밀번호"
        type="password"
        placeholder="비밀번호"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password", {
          required: "비밀번호를 입력해주세요.",
          minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." },
        })}
      />

      <Button variant="wood" className="auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "로그인 중…" : "로그인"}
      </Button>
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
      <FormField
        label="이름"
        type="text"
        placeholder="이름"
        maxLength={30}
        autoComplete="name"
        error={errors.name?.message}
        {...register("name", {
          required: "이름을 입력해주세요.",
          validate: (v) => v.trim().length > 0 || "이름을 입력해주세요.",
        })}
      />
      <FormField
        label="이메일"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email", {
          required: "이메일을 입력해주세요.",
          pattern: { value: EMAIL_RE, message: "이메일 형식이 올바르지 않습니다." },
        })}
      />
      <FormField
        label="비밀번호"
        type="password"
        placeholder="8자 이상"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password", {
          required: "비밀번호를 입력해주세요.",
          minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." },
        })}
      />
      <FormField
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호 재입력"
        autoComplete="new-password"
        error={errors.passwordConfirm?.message}
        {...register("passwordConfirm", {
          required: "비밀번호를 한 번 더 입력해주세요.",
          validate: (v) => v === passwordValue || "비밀번호가 일치하지 않습니다.",
        })}
      />

      <Button variant="wood" className="auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "가입 중…" : "회원가입"}
      </Button>
    </form>
  );
}
