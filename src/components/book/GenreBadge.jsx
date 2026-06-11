import { useGenres } from "@/context/GenreContext";

// 장르 색을 입힌 뱃지. variant: 'card'(목록·카드) | 'detail'(상세, 더 진한 배경)
// 색은 --gc 변수로 주입하고, 실제 색/배경은 catalog.css가 처리한다.
export default function GenreBadge({ code, variant = "card" }) {
  const { themeFor, labelFor } = useGenres();
  const color = themeFor(code).color;
  const cls = variant === "detail" ? "detail-genre" : "card-genre";

  return (
    <span className={cls} style={{ "--gc": color }}>
      {labelFor(code)}
    </span>
  );
}
