import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import { useCreateAuthLoginMutation } from "@/api/lms/auth/useAuthMutations";
import { useAuth } from "@/context/AuthContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginMutation = useCreateAuthLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async ({ email, password }) => {
    try {
      const res = await loginMutation.mutateAsync({ email, password });
      login(res?.token, { email: res?.email, name: res?.name });
      navigate("/");
    } catch {
      // 실패 메시지는 loginMutation.error로 표시
    }
  };

  return (
    <form className='auth-form' onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label='이메일'
        type='email'
        placeholder='you@example.com'
        autoComplete='email'
        error={errors.email?.message}
        {...register("email", {
          required: "이메일을 입력해주세요.",
          pattern: {
            value: EMAIL_RE,
            message: "이메일 형식이 올바르지 않습니다.",
          },
        })}
      />
      <FormField
        label='비밀번호'
        type='password'
        placeholder='비밀번호'
        autoComplete='current-password'
        error={errors.password?.message}
        {...register("password", {
          required: "비밀번호를 입력해주세요.",
          minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다." },
        })}
      />

      {loginMutation.isError && (
        <p className='form-error'>{loginMutation.error.message}</p>
      )}

      <Button
        variant='wood'
        className='auth-submit'
        type='submit'
        disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "로그인 중…" : "로그인"}
      </Button>
    </form>
  );
}

export default LoginForm;
