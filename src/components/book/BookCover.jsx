import { useGenres } from "@/context/GenreContext";

// 표지 이미지 + 미설정 시 장르 색 그라데이션 플레이스홀더.
// variant: 'card'(목록) | 'detail'(상세) | 'mini'(3D 책장)
// color를 직접 넘기면 그 색을, 안 넘기면 책 장르색을 쓴다(3D 책장은 대분류색 공유).
const WRAP = { card: "card-cover", detail: "detail-cover", mini: "mini-cover" };

export default function BookCover({ book, variant = "card", color }) {
  const { themeFor } = useGenres();
  const c = color || themeFor(book.genreCode).color;

  return (
    <div className={WRAP[variant]}>
      {book.coverImageUrl ? (
        <img src={book.coverImageUrl} alt={book.title} />
      ) : variant === "mini" ? (
        <div className="mini-ph" style={{ "--gc": c }}>
          <span>{book.title}</span>
        </div>
      ) : (
        <div className="card-cover-ph" style={{ "--gc": c }}>
          <span className="ph-title">{book.title}</span>
          <span className="ph-tag">표지 준비 중</span>
        </div>
      )}
      {variant === "card" && book.isLiked && (
        <span className="card-like">❤</span>
      )}
    </div>
  );
}
