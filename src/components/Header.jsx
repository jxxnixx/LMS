import { Link, NavLink } from 'react-router-dom'

const navClass = ({ isActive }) =>
  isActive ? 'cat-nav-link active' : 'cat-nav-link'

export default function Header() {
  return (
    <header className="cat-header">
      <Link to="/" className="cat-brand">📚 도서관</Link>
      <nav className="cat-nav">
        <NavLink to="/" end className={navClass}>3D 복도</NavLink>
        <NavLink to="/books" end className={navClass}>전체 도서</NavLink>
        <NavLink to="/shelf" className={navClass}>내 책장</NavLink>
        <NavLink to="/books/new" className={navClass}>+ 새 도서</NavLink>
      </nav>
    </header>
  )
}
