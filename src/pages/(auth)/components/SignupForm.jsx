import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import {
  useCreateAuthSignupMutation,
  useCreateAuthSendCodeMutation,
  useCreateAuthCheckCodeMutation,
} from "@/api/lms/auth/useAuthMutations";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupForm({ onDone }) {
  const signupMutation = useCreateAuthSignupMutation();
  const sendCodeMutation = useCreateAuthSendCodeMutation();
  const checkCodeMutation = useCreateAuthCheckCodeMutation();

  // 이메일 인증 단계: 코드 전송됨 / 인증 완료
  const [codeSent, setCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      code: "",
    },
  });
  const passwordValue = watch("password");

  // 1) 인증코드 전송 — 이메일 형식 통과 시 send-code 호출
  const handleSendCode = async () => {
    if (!(await trigger("email"))) return;
    try {
      await sendCodeMutation.mutateAsync({ email: getValues("email") });
      setCodeSent(true);
    } catch {
      // 실패 메시지는 sendCodeMutation.error로 표시
    }
  };

  // 2) 코드 확인 — check-code 성공 시 인증 완료 처리
  const handleCheckCode = async () => {
    const code = getValues("code")?.trim();
    if (!code) return;
    try {
      await checkCodeMutation.mutateAsync({ email: getValues("email"), code });
      setEmailVerified(true);
    } catch {
      // 실패 메시지는 checkCodeMutation.error로 표시
    }
  };

  // 3) 회원가입 — 이메일 인증 완료 후에만 가능
  const onSubmit = async ({ name, email, password }) => {
    if (!emailVerified) return;
    try {
      await signupMutation.mutateAsync({ name, email, password });
      reset();
      setCodeSent(false);
      setEmailVerified(false);
      onDone(); // 가입 성공 → 로그인 탭으로 전환
    } catch {
      // 실패 메시지는 signupMutation.error로 표시
    }
  };

  return (
    <form className='auth-form' onSubmit={handleSubmit(onSubmit)}>
      {/* 이메일 + 인증코드 전송 */}
      <div className='field'>
        <label>이메일</label>
        <div className='auth-verify-row'>
          <input
            type='email'
            placeholder='you@example.com'
            autoComplete='email'
            disabled={emailVerified}
            {...register("email", {
              required: "이메일을 입력해주세요.",
              pattern: {
                value: EMAIL_RE,
                message: "이메일 형식이 올바르지 않습니다.",
              },
            })}
          />
          <Button
            type='button'
            variant='ghost'
            className='auth-verify-btn'
            onClick={handleSendCode}
            disabled={emailVerified || sendCodeMutation.isPending}>
            {sendCodeMutation.isPending
              ? "전송 중…"
              : codeSent
                ? "재전송"
                : "인증코드 전송"}
          </Button>
        </div>
        {errors.email && <p className='form-error'>{errors.email.message}</p>}
        {sendCodeMutation.isError && (
          <p className='form-error'>{sendCodeMutation.error.message}</p>
        )}
        {codeSent && !emailVerified && (
          <p className='auth-hint-ok'>
            📧 인증코드를 보냈어요. 메일함을 확인하세요.
          </p>
        )}
      </div>

      {/* 인증코드 입력 (전송 후 표시) */}
      {codeSent && (
        <div className='field'>
          <label>인증코드</label>
          <div className='auth-verify-row'>
            <input
              type='text'
              inputMode='numeric'
              placeholder='메일로 받은 코드'
              disabled={emailVerified}
              {...register("code")}
            />
            <Button
              type='button'
              variant={emailVerified ? "wood" : "ghost"}
              className='auth-verify-btn'
              onClick={handleCheckCode}
              disabled={emailVerified || checkCodeMutation.isPending}>
              {emailVerified
                ? "✓ 인증됨"
                : checkCodeMutation.isPending
                  ? "확인 중…"
                  : "확인"}
            </Button>
          </div>
          {checkCodeMutation.isError && (
            <p className='form-error'>{checkCodeMutation.error.message}</p>
          )}
          {emailVerified && <p className='auth-hint-ok'>✓ 이메일 인증 완료</p>}
        </div>
      )}

      <FormField
        label='이름'
        type='text'
        placeholder='이름'
        maxLength={30}
        autoComplete='name'
        error={errors.name?.message}
        {...register("name", {
          required: "이름을 입력해주세요.",
          validate: (v) => v.trim().length > 0 || "이름을 입력해주세요.",
        })}
      />
      <FormField
        label='비밀번호'
        type='password'
        placeholder='8자 이상'
        autoComplete='new-password'
        error={errors.password?.message}
        {...register("password", {
          required: "비밀번호를 입력해주세요.",
          minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." },
        })}
      />
      <FormField
        label='비밀번호 확인'
        type='password'
        placeholder='비밀번호 재입력'
        autoComplete='new-password'
        error={errors.passwordConfirm?.message}
        {...register("passwordConfirm", {
          required: "비밀번호를 한 번 더 입력해주세요.",
          validate: (v) =>
            v === passwordValue || "비밀번호가 일치하지 않습니다.",
        })}
      />

      {!emailVerified && (
        <p className='auth-hint'>이메일 인증을 완료해야 가입할 수 있어요.</p>
      )}
      {signupMutation.isError && (
        <p className='form-error'>{signupMutation.error.message}</p>
      )}

      <Button
        variant='wood'
        className='auth-submit'
        type='submit'
        disabled={signupMutation.isPending || !emailVerified}>
        {signupMutation.isPending ? "가입 중…" : "회원가입"}
      </Button>
    </form>
  );
}

export default SignupForm;
