import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onLogin, onSignup }) {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <a href="#" className="nav-logo">
          <div className="nav-logo-mark">V</div>
          <span className="nav-logo-text">Vdart</span>
        </a>

        {/* Links */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
          <li><a href="#reach" onClick={() => setMenuOpen(false)}>Global Reach</a></li>
          <li><a href="#innovation" onClick={() => setMenuOpen(false)}>Innovation</a></li>
          <li><a href="#careers" onClick={() => setMenuOpen(false)}>Careers</a></li>
        </ul>

        {/* Auth */}
        <div className="nav-auth">
          {user ? (
            <>
              <span className="nav-user">👋 {user.full_name.split(' ')[0]}</span>
              <button className="btn-outline" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="nav-login" onClick={onLogin}>Login</button>
              <button className="btn-primary nav-signup" onClick={onSignup}>Sign Up</button>
            </>
          )}
        </div>

        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(m => !m)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 18px 0;
          transition: 0.3s ease;
        }
        .navbar.scrolled {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 2px 24px rgba(10,22,40,0.08);
          padding: 12px 0;
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .nav-logo-mark {
          width: 36px; height: 36px;
          background: var(--blue);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          font-weight: 900;
          font-size: 18px;
          font-family: var(--font-display);
        }
        .nav-logo-text {
          font-size: 20px;
          font-weight: 800;
          color: var(--navy);
          letter-spacing: -0.5px;
        }
        .nav-links {
          display: flex;
          list-style: none;
          gap: 32px;
          margin: 0 auto;
        }
        .nav-links a {
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-700);
          transition: var(--transition);
        }
        .nav-links a:hover { color: var(--navy); }
        .nav-auth {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .nav-login {
          background: none;
          color: var(--navy);
          font-size: 14px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 50px;
          transition: var(--transition);
        }
        .nav-login:hover { color: var(--blue); }
        .nav-signup { font-size: 14px; padding: 10px 22px; }
        .nav-user {
          font-size: 14px;
          font-weight: 600;
          color: var(--navy);
        }
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          margin-left: auto;
          padding: 4px;
        }
        .nav-hamburger span {
          display: block;
          width: 22px; height: 2px;
          background: var(--navy);
          border-radius: 2px;
          transition: 0.3s ease;
        }
        @media (max-width: 768px) {
          .nav-links {
            position: fixed;
            top: 60px; left: 0; right: 0;
            background: var(--white);
            flex-direction: column;
            align-items: center;
            gap: 20px;
            padding: 24px;
            box-shadow: var(--shadow-md);
            transform: translateY(-100%);
            opacity: 0;
            pointer-events: none;
            transition: 0.3s ease;
          }
          .nav-links.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
          }
          .nav-hamburger { display: flex; }
          .nav-login, .nav-signup { display: none; }
        }
      `}</style>
    </nav>
  );
}
