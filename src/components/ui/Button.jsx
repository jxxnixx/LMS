import { Link } from "react-router-dom";

// 공통 버튼. variant로 색을 고르고, to를 주면 <Link>로 렌더된다.
// active는 토글형 버튼(btn-like 등)의 'on' 상태에 쓴다.
const VARIANTS = {
  wood: "btn-wood",
  ghost: "btn-ghost",
  ai: "btn-ai",
  danger: "btn-danger",
  like: "btn-like",
};

export default function Button({
  variant,
  to,
  active = false,
  className = "",
  children,
  ...rest
}) {
  const cls = ["btn", VARIANTS[variant], active && "on", className]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
