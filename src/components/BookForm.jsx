import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import GenreSelect from "./GenreSelect";

export default function BookForm({
  genres,
  initial,
  submitLabel,
  submitting,
  error,
  onSubmit,
  cancelTo,
}) {
  const initialSub = genres.find((g) => g.code === initial.genreCode);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }, // isValid는 더 이상 필요 없으므로 제거
  } = useForm({
    defaultValues: {
      title: initial.title || "",
      author: initial.author || "",
      topCode: initialSub ? initialSub.parentCode : "",
      genreCode: initial.genreCode || "",
      content: initial.content || "",
    },
    // 제출 버튼을 눌렀을 때 1차로 에러를 보여주고,
    // 그 이후부터는 타이핑할 때마다 에러를 없애주도록 'onBlur'나 기본값 사용을 권장합니다.
  });

  const topCodeValue = watch("topCode");
  const contentValue = watch("content");

  const onValidSubmit = (data) => {
    onSubmit({
      title: data.title.trim(),
      author: data.author.trim(),
      genreCode: data.genreCode,
      content: data.content.trim(),
    });
  };

  return (
    <form className='form-card' onSubmit={handleSubmit(onValidSubmit)}>
      <div className='field'>
        <label>제목 *</label>
        <input
          type='text'
          placeholder='작품 제목'
          maxLength={100}
          {...register("title", {
            required: "제목을 입력해주세요.",
            minLength: {
              value: 1,
              message: "제목은 최소 1자 이상이어야 합니다.",
            },
            validate: (val) =>
              val.trim().length > 0 || "공백만으로 제목을 설정할 수 없습니다.",
          })}
        />
        {errors.title && <p className='form-error'>{errors.title.message}</p>}
      </div>

      <div className='field'>
        <label>작가명 *</label>
        <input
          type='text'
          placeholder='필명 또는 이름'
          maxLength={50}
          {...register("author", {
            required: "작가명을 입력해주세요.",
            minLength: {
              value: 1,
              message: "작가명은 최소 1자 이상이어야 합니다.",
            },
            validate: (val) =>
              val.trim().length > 0 ||
              "공백만으로 작가명을 설정할 수 없습니다.",
          })}
        />
        {errors.author && <p className='form-error'>{errors.author.message}</p>}
      </div>

      <div className='field'>
        <label>장르 *</label>
        <Controller
          name='genreCode'
          control={control}
          rules={{ required: "장르를 선택해주세요." }}
          render={({ field }) => (
            <GenreSelect
              genres={genres}
              topCode={topCodeValue}
              subCode={field.value}
              onChange={(top, sub) => {
                setValue("topCode", top);
                field.onChange(sub);
              }}
              variant='field'
            />
          )}
        />
        {errors.genreCode && (
          <p className='form-error'>{errors.genreCode.message}</p>
        )}
      </div>

      <div className='field'>
        <label>본문 내용 *</label>
        <textarea
          placeholder='줄거리나 핵심 키워드를 20자 이상 자세히 적어주세요. AI가 이 내용을 바탕으로 표지를 그려요.'
          maxLength={1000}
          {...register("content", {
            required: "본문 내용을 입력해주세요.",
            minLength: {
              value: 20,
              message:
                "AI가 표지를 그릴 수 있도록 최소 20자 이상 설명해주세요.",
            },
            validate: (val) =>
              val.trim().length >= 20 ||
              "공백을 제외하고 20자 이상 입력해주세요.",
          })}
        />
        <div className='char-count'>{contentValue.length} / 1000자</div>
        {errors.content && (
          <p className='form-error'>{errors.content.message}</p>
        )}
      </div>

      {error && <p className='form-error'>⚠ {error}</p>}

      <div className='form-actions'>
        <Link className='btn btn-ghost' to={cancelTo}>
          취소
        </Link>
        {/* ✅ 버튼은 네트워크 통신 중(submitting)일 때만 막습니다. */}
        <button className='btn btn-wood' type='submit' disabled={submitting}>
          {submitting ? "저장 중…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
