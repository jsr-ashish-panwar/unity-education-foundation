import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Organization Info */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="Unity Education Foundation Logo" className="footer-logo-img" />
            <div className="footer-logo-text">
              <span className="logo-title-footer">UNITY</span>
              <span className="logo-subtitle-footer">EDUCATION FOUNDATION</span>
            </div>
          </Link>
          <p className="footer-desc">
            Empowering organizations through efficient operations, reliable data management, advanced monitoring, and professional support services since 2017.
          </p>
          <div className="est-badge">
            <Calendar size={16} />
            <span>Established: 2017</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col links-col">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/"><ArrowRight size={14} /> Home</Link>
            </li>
            <li>
              <Link to="/about"><ArrowRight size={14} /> About Us</Link>
            </li>
            <li>
              <Link to="/team"><ArrowRight size={14} /> Our Team</Link>
            </li>
            <li>
              <Link to="/services"><ArrowRight size={14} /> Services</Link>
            </li>
            <li>
              <Link to="/gallery"><ArrowRight size={14} /> Gallery</Link>
            </li>
            <li>
              <Link to="/contact"><ArrowRight size={14} /> Contact Us</Link>
            </li>
            <li className="footer-admin-link">
              <Link to="/admin"><ArrowRight size={14} /> Admin Portal</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col contact-col">
          <h3 className="footer-title">Get In Touch</h3>
          <ul className="footer-contacts">
            <li>
              <MapPin size={20} className="contact-icon" />
              <span>H. No-69 KASBA SIWAL KHAS, MEERUT 250501 (UP)</span>
            </li>
            <li>
              <Phone size={20} className="contact-icon" />
              <a href="tel:+919557558628">+91 9557558628</a>
            </li>
            <li>
              <Mail size={20} className="contact-icon" />
              <a href="mailto:unityeducationfoundation22@gmail.com">unityeducationfoundation22@gmail.com</a>
            </li>
            <li>
              <Clock size={20} className="contact-icon" />
              <span>Mon – Sat: 9:00 AM – 6:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright">
            &copy; {currentYear} Unity Education Foundation. All Rights Reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span className="separator">|</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: var(--primary-dark);
          color: rgba(255, 255, 255, 0.7);
          padding: 80px 0 0 0;
          font-family: var(--font-body);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr;
          gap: 48px;
          margin-bottom: 60px;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-logo-img {
          height: 60px;
          background-color: white;
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .footer-logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title-footer {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-white);
          line-height: 1;
        }

        .logo-subtitle-footer {
          font-family: var(--font-heading);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--secondary-light);
          letter-spacing: 1.5px;
        }

        .footer-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.6);
        }

        .est-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(255, 255, 255, 0.05);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-family: var(--font-heading);
          font-weight: 600;
          color: var(--secondary-light);
          align-self: flex-start;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          color: var(--text-white);
          position: relative;
          padding-bottom: 12px;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 3px;
          background-color: var(--secondary);
          border-radius: 2px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.6);
        }

        .footer-links a:hover {
          color: var(--secondary-light);
          transform: translateX(4px);
        }

        .footer-admin-link {
          margin-top: 8px;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-admin-link a {
          color: var(--secondary-light) !important;
          font-weight: 700;
        }

        .footer-admin-link a:hover {
          color: var(--secondary) !important;
        }

        .footer-contacts {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-contacts li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.95rem;
        }

        .contact-icon {
          color: var(--secondary);
          flex-shrink: 0;
          margin-top: 3px;
        }

        .footer-contacts a {
          color: rgba(255, 255, 255, 0.6);
        }

        .footer-contacts a:hover {
          color: var(--secondary-light);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 24px 0;
          font-size: 0.9rem;
        }

        .footer-bottom-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-bottom-links a:hover {
          color: var(--text-white);
        }

        .separator {
          color: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr;
          }
          .contact-col {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .contact-col {
            grid-column: span 1;
          }
          .footer-bottom-container {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .footer {
            padding: 48px 0 0 0;
          }
          .footer-grid {
            gap: 28px;
            margin-bottom: 40px;
          }
          .footer-logo {
            justify-content: center;
          }
          .footer-logo-img {
            height: 50px;
          }
          .logo-title-footer {
            font-size: 1.35rem;
          }
          .logo-subtitle-footer {
            font-size: 0.55rem;
          }
          .footer-desc {
            text-align: center;
            font-size: 0.88rem;
          }
          .est-badge {
            align-self: center;
          }
          .footer-col {
            align-items: center;
            text-align: center;
            gap: 16px;
          }
          .footer-title::after {
            left: 50%;
            transform: translateX(-50%);
          }
          .footer-contacts li {
            justify-content: center;
            text-align: center;
            font-size: 0.88rem;
          }
          .footer-links a:hover {
            transform: none; /* Disable horizontal slide hover effect on tap */
          }
        }

      `}</style>
    </footer>
  );
};
export default Footer;
