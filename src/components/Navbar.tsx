import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navbarClasses = [
    'navbar',
    (isScrolled || !isHomePage) ? 'scrolled' : ''
  ].filter(Boolean).join(' ');

  return (
    <nav className={navbarClasses}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src={logo} alt="Unity Education Foundation" className="logo-img" />
          <div className="logo-text-container">
            <span className="logo-title">UNITY</span>
            <span className="logo-subtitle">EDUCATION FOUNDATION</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            About Us
          </NavLink>
          <NavLink to="/team" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Our Team
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Services
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Gallery
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Contact Us
          </NavLink>

        </div>

        {/* Mobile Toggle */}
        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`nav-links-mobile ${isOpen ? 'open' : ''}`}>
        <NavLink to="/" className={({ isActive }) => `nav-item-mobile ${isActive ? 'active' : ''}`} onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `nav-item-mobile ${isActive ? 'active' : ''}`} onClick={closeMenu}>
          About Us
        </NavLink>
        <NavLink to="/team" className={({ isActive }) => `nav-item-mobile ${isActive ? 'active' : ''}`} onClick={closeMenu}>
          Our Team
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => `nav-item-mobile ${isActive ? 'active' : ''}`} onClick={closeMenu}>
          Services
        </NavLink>
        <NavLink to="/gallery" className={({ isActive }) => `nav-item-mobile ${isActive ? 'active' : ''}`} onClick={closeMenu}>
          Gallery
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => `nav-item-mobile ${isActive ? 'active' : ''}`} onClick={closeMenu}>
          Contact Us
        </NavLink>
      </div>

      {/* Styles for Navbar since we are doing vanilla CSS */}
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          z-index: 1000;
          display: flex;
          align-items: center;
          background-color: transparent;
          border-bottom: 1px solid transparent;
          transition: var(--transition-normal);
        }
        
        .navbar.scrolled {
          background-color: var(--bg-glass);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          height: 70px;
          box-shadow: var(--shadow-sm);
          border-bottom: 1px solid var(--border-color);
        }


        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          flex-grow: 1;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-img {
          height: 50px;
          width: auto;
          transition: var(--transition-normal);
        }

        .navbar.scrolled .logo-img {
          height: 44px;
        }

        .logo-text-container {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
          letter-spacing: 1px;
        }

        .logo-subtitle {
          font-family: var(--font-heading);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-secondary);
          letter-spacing: 1.5px;
          margin-top: 2px;
        }

        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-item {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-secondary);
          position: relative;
          padding: 8px 0;
        }

        .nav-item:hover, .nav-item.active {
          color: var(--primary);
        }

        .nav-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--secondary);
          transition: var(--transition-normal);
        }

        .nav-item:hover::after, .nav-item.active::after {
          width: 100%;
        }



        .nav-toggle {
          display: none;
          background: transparent;
          color: var(--primary);
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: var(--transition-fast);
          width: 44px;
          height: 44px;
        }

        .nav-links-mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none;
          }

          .nav-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .nav-toggle:hover, .nav-toggle:active {
            background-color: rgba(12, 35, 64, 0.08);
          }

          .nav-links-mobile {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 80px;
            left: 0;
            width: 100%;
            background-color: var(--bg-glass);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border-color);
            padding: 16px;
            gap: 8px;
            transform: translateY(-120%);
            opacity: 0;
            pointer-events: none;
            transition: var(--transition-normal);
            box-shadow: var(--shadow-md);
            z-index: 999;
          }

          .navbar.scrolled .nav-links-mobile {
            top: 70px;
          }

          .nav-links-mobile.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
          }

          .nav-item-mobile {
            font-family: var(--font-heading);
            font-size: 1.05rem;
            font-weight: 700;
            color: var(--text-secondary);
            padding: 12px 16px;
            border-radius: var(--radius-sm);
            transition: all 0.2s ease;
          }

          .nav-item-mobile.active, .nav-item-mobile:hover {
            color: var(--primary);
            background-color: rgba(12, 35, 64, 0.05);
            padding-left: 20px;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            height: 65px;
          }
          .navbar.scrolled {
            height: 60px;
          }
          .logo-img {
            height: 38px;
          }
          .navbar.scrolled .logo-img {
            height: 34px;
          }
          .logo-title {
            font-size: 1.2rem;
          }
          .logo-subtitle {
            font-size: 0.52rem;
            letter-spacing: 1px;
          }
          .nav-links-mobile {
            top: 65px;
            padding: 16px;
            gap: 12px;
          }
          .navbar.scrolled .nav-links-mobile {
            top: 60px;
          }
          .nav-item-mobile {
            font-size: 0.95rem;
            padding: 6px 0;
          }
        }

      `}</style>
    </nav>
  );
};
export default Navbar;
