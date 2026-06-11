// label + 입력 + 에러 한 묶음. react-hook-form의 register를 그대로 펼쳐 쓴다.
//   <FormField label="이메일" error={errors.email?.message}
//             type="email" {...register("email", rules)} />
// textarea·셀렉트 등 커스텀 입력은 children으로 넣는다.
export default function FormField({ label, error, children, ...inputProps }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children ?? <input {...inputProps} />}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
