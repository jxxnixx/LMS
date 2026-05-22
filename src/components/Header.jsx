import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo">
          <Link to="/">📚 도서 관리 시스템</Link>
        </div>
        <ul className="nav-menu">
          <li><Link to="/">도서 목록</Link></li>
          <li><Link to="/bookshelf">나의 서재</Link></li>
          <li><Link to="/create" className="btn-create">도서 등록</Link></li>
        </ul>
      </nav>
      <style dangerouslySetInnerHTML={{ __html: `
        .header {
          background-color: #fff;
          border-bottom: 1px solid #eee;
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo a {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          text-decoration: none;
        }
        .nav-menu {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }
        .nav-menu a {
          text-decoration: none;
          color: #666;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-menu a:hover {
          color: #007bff;
        }
        .btn-create {
          background-color: #007bff;
          color: white !important;
          padding: 0.5rem 1rem;
          border-radius: 4px;
        }
        .btn-create:hover {
          background-color: #0056b3;
        }
      `}} />
    </header>
  );
};

export default Header;
