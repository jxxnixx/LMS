import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "@/context/AuthContext";

const navClass = ({ isActive }) =>
  isActive ? "cat-nav-link active" : "cat-nav-link";

export default function Header() {
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className='cat-header'>
      <Link to='/' className='cat-brand'>
        📚 도서관
      </Link>
      <nav className='cat-nav'>
        <NavLink to='/' end className={navClass}>
          3D 복도
        </NavLink>
        <NavLink to='/books' end className={navClass}>
          전체 도서
        </NavLink>
        {isAuthed ? (
          <>
            <NavLink to='/shelf' className={navClass}>
              내 책장
            </NavLink>
            <NavLink to='/books/new' className={navClass}>
              + 새 도서
            </NavLink>
          </>
        ) : (
          <></>
        )}
      </nav>
      <div className='cat-auth'>
        {isAuthed ? (
          <>
            <span className='cat-user'>{user?.name || user?.email}님</span>
            <Button variant='ghost' onClick={handleLogout}>
              로그아웃
            </Button>
          </>
        ) : (
          <>
            <Button variant='ghost' to='/login'>
              로그인
            </Button>
            <Button variant='wood' to='/signup'>
              회원가입
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
