import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Eye, 
  ShieldCheck, 
  Zap, 
  Award, 
  ThumbsUp, 
  Activity, 
  CheckCircle, 
  Clock, 
  Mail, 
  Phone, 
  User, 
  Loader2 
} from 'lucide-react';

interface Employee {
  _id?: string;
  name: string;
  role: string;
  category: 'director' | 'secretary' | 'employee';
  photoUrl?: string;
  email?: string;
  phone?: string;
  bio?: string;
}

export const About: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/employees');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setEmployees(json.data);
          }
        }
      } catch (err) {
        console.log("Offline fallback. Using fallback leadership info.");
        setEmployees([
          {
            name: "Dr. Alok Sharma",
            role: "Managing Director",
            category: "director",
            photoUrl: "/assets/director.webp",
            email: "alok.sharma@unityeducation.org",
            phone: "+91 9557558628",
            bio: "Over 15 years of leadership in educational administration and community operational development."
          },
          {
            name: "Mrs. Sunita Siwach",
            role: "Executive Secretary",
            category: "secretary",
            photoUrl: "/assets/secretary.webp",
            email: "sunita.siwach@unityeducation.org",
            phone: "+91 9557558628",
            bio: "Dedicated to streamlining cross-functional workflows and maintaining robust administrative compliance."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const directors = employees.filter(e => e.category === 'director');
  const secretaries = employees.filter(e => e.category === 'secretary');

  const whyChooseUs = [
    {
      title: "Experienced Professionals",
      desc: "Our skilled team brings deep expertise, responsibility, and professionalism to every assignment.",
      icon: <Award size={20} />
    },
    {
      title: "Quality-Focused Approach",
      desc: "We maintain strict standards to ensure extremely accurate, transparent, and reliable outcomes.",
      icon: <ShieldCheck size={20} />
    },
    {
      title: "Timely Execution",
      desc: "We understand the critical importance of deadlines and strive for on-time delivery without compromises.",
      icon: <Clock size={20} />
    },
    {
      title: "Data Accuracy",
      desc: "Our structured verification processes are designed to ensure maximum precision and records integrity.",
      icon: <CheckCircle size={20} />
    },
    {
      title: "Professional Communication",
      desc: "We maintain clear, responsive, and highly effective communication channels across stakeholder networks.",
      icon: <ThumbsUp size={20} />
    },
    {
      title: "Process-Oriented Culture",
      desc: "Our systematic approach ensures consistency, efficiency, and full operational accountability.",
      icon: <Activity size={20} />
    },
    {
      title: "Continuous Improvement",
      desc: "We regularly evaluate and enhance our methodologies to meet evolving organizational needs.",
      icon: <Zap size={20} />
    }
  ];

  return (
    <div className="about-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="bg-glow-blob blob-primary" style={{ top: '8%', left: '-15%' }}></div>
      <div className="bg-glow-blob blob-secondary" style={{ top: '40%', right: '-12%' }}></div>
      <div className="bg-glow-blob blob-primary" style={{ bottom: '10%', left: '-10%' }}></div>

      {/* Subpage Header Banner */}
      <section className="about-hero hero-wallpaper-bg">
        <div className="container text-center">
          <span className="sub-tag">WHO WE ARE</span>
          <h1 className="sub-title">About Unity Education Foundation</h1>
          <p className="sub-desc">Built on the principles of professionalism, integrity, and continuous improvement.</p>
        </div>
      </section>

      {/* Main Story & Principles */}
      <section className="section story-section">
        <div className="container">
          <div className="grid-2 story-grid">
            <div className="story-content">
              <h2 className="story-heading">Empowering Operations with Integrity & Professionalism</h2>
              <p className="story-p">
                Unity Education Foundation is an organization built on the principles of professionalism, integrity, and continuous improvement. We specialize in providing operational and administrative support services that help organizations streamline their day-to-day activities and achieve their objectives efficiently.
              </p>
              <p className="story-p">
                Over the years, the growing demand for accurate data management, effective communication systems, timely documentation, and continuous monitoring has made operational support a critical component of organizational success.
              </p>
              <p className="story-p">
                Understanding this need, Unity Education Foundation offers comprehensive support solutions designed to enhance productivity and improve overall performance.
              </p>
            </div>
            <div className="story-highlights glass-card">
              <h3 className="highlights-heading">Our Core Pillars</h3>
              <div className="pillar-item">
                <div className="pillar-num">01</div>
                <div className="pillar-text">
                  <h4>Professionalism</h4>
                  <p>A systematic and expert approach in executing all operational assignments.</p>
                </div>
              </div>
              <div className="pillar-item">
                <div className="pillar-num">02</div>
                <div className="pillar-text">
                  <h4>Integrity</h4>
                  <p>Absolute transparency, honesty, and ethical practices in every partnership.</p>
                </div>
              </div>
              <div className="pillar-item">
                <div className="pillar-num">03</div>
                <div className="pillar-text">
                  <h4>Continuous Improvement</h4>
                  <p>Regular review and adoption of modern tools and efficient workflows.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Detail */}
      <section className="section section-bg mission-vision-detail">
        <div className="container grid-2">
          <div className="detail-card glass-card">
            <div className="icon-wrapper primary-bg">
              <Target size={30} />
            </div>
            <h3>Our Mission</h3>
            <p>
              To provide reliable, efficient, and innovative operational support services that enable organizations to achieve sustainable growth, improve productivity, and maintain excellence in performance.
            </p>
          </div>
          
          <div className="detail-card glass-card">
            <div className="icon-wrapper secondary-bg">
              <Eye size={30} />
            </div>
            <h3>Our Vision</h3>
            <p>
              To become a trusted and recognized organization known for delivering exceptional monitoring, management, and support services while contributing to organizational development through professionalism and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Spotlight Section */}
      <section className="section leadership-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">LEADERSHIP BOARD</span>
            <h2 className="section-title">Directors & Administrators</h2>
            <p className="section-desc">
              Guiding our operations, building strategic partnerships, and maintaining excellence across all levels of administration.
            </p>
          </div>

          {loading ? (
            <div className="loader-container">
              <Loader2 className="spinner" size={40} />
              <p>Loading profiles...</p>
            </div>
          ) : (
            <div className="leadership-cards-container">
              {/* Director Card */}
              {directors.map((dir, idx) => (
                <div
                  key={idx}
                  className="leader-card glass-card spotlight-card animate-slide-up"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="leader-photo-container">
                    {dir.photoUrl ? (
                      <img src={dir.photoUrl} alt={dir.name} className="leader-photo" />
                    ) : (
                      <div className="photo-placeholder"><User size={60} /></div>
                    )}
                    <span className="badge-role badge-director">Managing Director</span>
                  </div>
                  <div className="leader-info">
                    <h3 className="leader-name">{dir.name}</h3>
                    <p className="leader-role-text">{dir.role}</p>
                    <p className="leader-bio">{dir.bio}</p>
                    <div className="leader-contact-info">
                      {dir.email && (
                        <a href={`mailto:${dir.email}`} className="contact-link">
                          <Mail size={16} /> <span>{dir.email}</span>
                        </a>
                      )}
                      {dir.phone && (
                        <a href={`tel:${dir.phone}`} className="contact-link">
                          <Phone size={16} /> <span>{dir.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Secretary Card */}
              {secretaries.map((sec, idx) => (
                <div
                  key={idx}
                  className="leader-card glass-card spotlight-card animate-slide-up"
                  style={{ animationDelay: `${(idx + directors.length) * 150}ms` }}
                >
                  <div className="leader-photo-container">
                    {sec.photoUrl ? (
                      <img src={sec.photoUrl} alt={sec.name} className="leader-photo" />
                    ) : (
                      <div className="photo-placeholder"><User size={60} /></div>
                    )}
                    <span className="badge-role badge-secretary">Executive Secretary</span>
                  </div>
                  <div className="leader-info">
                    <h3 className="leader-name">{sec.name}</h3>
                    <p className="leader-role-text">{sec.role}</p>
                    <p className="leader-bio">{sec.bio}</p>
                    <div className="leader-contact-info">
                      {sec.email && (
                        <a href={`mailto:${sec.email}`} className="contact-link">
                          <Mail size={16} /> <span>{sec.email}</span>
                        </a>
                      )}
                      {sec.phone && (
                        <a href={`tel:${sec.phone}`} className="contact-link">
                          <Phone size={16} /> <span>{sec.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-choose-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">WHY PARTNER WITH US?</span>
            <h2 className="section-title">Why Choose Unity Education Foundation?</h2>
            <p className="section-desc">
              We combine structured processes, technology-driven solutions, and a result-oriented approach to deliver maximum value.
            </p>
          </div>

          <div className="why-grid">
            {whyChooseUs.map((item, idx) => (
              <div
                key={item.title}
                className="why-card glass-card animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="why-icon-box">
                  {item.icon}
                </div>
                <div className="why-text">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="section commitment-section section-bg">
        <div className="container">
          <div className="commitment-container glass-card text-center">
            <span className="badge-commitment">OUR DIRECT PROMISE</span>
            <h2>Our Commitment to Excellence</h2>
            <p className="commitment-p">
              At Unity Education Foundation, we are committed to building long-term relationships based on trust, quality, and professionalism. We continuously work towards improving operational efficiency, enhancing service quality, and delivering value-driven solutions that contribute to organizational success.
            </p>
            <p className="commitment-p">
              Our commitment extends beyond service delivery—we aim to become a dependable partner that organizations can rely on for operational excellence and sustainable growth.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .about-page {
          padding-top: 80px;
        }

        .about-hero {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 80px 0;
          text-align: center;
        }

        .sub-tag {
          font-family: var(--font-heading);
          color: var(--secondary-light);
          font-weight: 700;
          letter-spacing: 2px;
          font-size: 0.9rem;
          margin-bottom: 12px;
          display: inline-block;
        }

        .sub-title {
          font-size: 2.75rem;
          color: white;
          margin-bottom: 16px;
        }

        .sub-desc {
          font-size: 1.15rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
          margin: 0 auto;
        }

        /* main story */
        .story-grid {
          align-items: center;
        }

        .story-heading {
          font-size: 2.25rem;
          margin-bottom: 24px;
        }

        .story-p {
          color: var(--text-secondary);
          font-size: 1.05rem;
          margin-bottom: 20px;
        }

        .story-highlights {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 36px;
        }

        .highlights-heading {
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .pillar-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .pillar-num {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--secondary);
          background-color: rgba(217, 155, 38, 0.1);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pillar-text h4 {
          font-size: 1.15rem;
          margin-bottom: 4px;
        }

        .pillar-text p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        /* Mission/Vision detail */
        .icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 24px;
        }

        .icon-wrapper.primary-bg {
          background-color: var(--primary);
        }

        .icon-wrapper.secondary-bg {
          background-color: var(--secondary);
        }

        .detail-card h3 {
          font-size: 1.5rem;
          margin-bottom: 16px;
        }

        .detail-card p {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
        }

        /* Leadership Spotlight Styles */
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
          color: var(--text-secondary);
        }

        .spinner {
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
          color: var(--primary);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .leadership-cards-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-top: 40px;
          margin-bottom: 60px;
        }

        .leader-card {
          display: flex;
          gap: 24px;
          align-items: stretch;
          padding: 24px;
          border-top: 4px solid var(--secondary);
          text-align: left;
        }

        .leader-photo-container {
          position: relative;
          flex-shrink: 0;
          width: 160px;
          height: 200px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .leader-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-normal);
        }

        .leader-card:hover .leader-photo {
          transform: scale(1.05);
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;
          background-color: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-light);
        }

        .badge-role {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          text-align: center;
          padding: 6px 0;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: white;
          z-index: 5;
        }

        .badge-director {
          background-color: var(--primary);
        }

        .badge-secretary {
          background-color: var(--secondary);
        }

        .leader-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-grow: 1;
        }

        .leader-name {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .leader-role-text {
          font-family: var(--font-heading);
          font-weight: 600;
          color: var(--secondary);
          font-size: 0.95rem;
          margin-bottom: 12px;
        }

        .leader-bio {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .leader-contact-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .contact-link:hover {
          color: var(--secondary);
          transform: translateX(4px);
        }

        /* Why choose grid */
        .why-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .why-card {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          padding: 24px;
        }

        .why-icon-box {
          background-color: rgba(12, 35, 64, 0.05);
          color: var(--primary);
          padding: 12px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .why-card:hover .why-icon-box {
          background-color: var(--primary);
          color: white;
        }

        .why-text h4 {
          font-size: 1.15rem;
          margin-bottom: 6px;
        }

        .why-text p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        /* Commitment block */
        .commitment-container {
          padding: 50px;
          border-left: 6px solid var(--secondary);
        }

        .badge-commitment {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--secondary-dark);
          background-color: rgba(217, 155, 38, 0.1);
          padding: 4px 12px;
          border-radius: 50px;
          margin-bottom: 20px;
          display: inline-block;
        }

        .commitment-p {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 900px;
          margin: 0 auto 20px auto;
          line-height: 1.8;
        }

        .commitment-p:last-of-type {
          margin-bottom: 0;
        }

        @media (max-width: 992px) {
          .why-grid {
            grid-template-columns: 1fr;
          }
          .leadership-cards-container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .sub-title {
            font-size: 2rem;
          }
          .story-heading {
            font-size: 1.75rem;
          }
          .commitment-container {
            padding: 30px 20px;
          }
        }

        @media (max-width: 576px) {
          .leader-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .leader-photo-container {
            width: 180px;
            height: 225px;
            margin: 0 auto;
          }
          .leader-contact-info {
            align-items: center;
          }
        }

        @media (max-width: 480px) {
          .about-hero {
            padding: 60px 0;
          }
          .sub-title {
            font-size: 1.8rem;
          }
          .sub-desc {
            font-size: 0.98rem;
          }
          .story-heading {
            font-size: 1.5rem;
            margin-bottom: 16px;
          }
          .story-p {
            font-size: 0.95rem;
            margin-bottom: 16px;
          }
          .story-highlights {
            padding: 24px 16px;
            gap: 20px;
          }
          .highlights-heading {
            font-size: 1.3rem;
          }
          .pillar-item {
            gap: 12px;
          }
          .pillar-num {
            width: 44px;
            height: 44px;
            font-size: 1.35rem;
          }
          .pillar-text h4 {
            font-size: 1.05rem;
          }
          .pillar-text p {
            font-size: 0.85rem;
          }
          .detail-card h3 {
            font-size: 1.3rem;
          }
          .detail-card p {
            font-size: 0.92rem;
            line-height: 1.6;
          }
          .why-card {
            padding: 16px;
            gap: 12px;
          }
          .why-icon-box {
            padding: 10px;
          }
          .why-text h4 {
            font-size: 1.05rem;
          }
          .why-text p {
            font-size: 0.88rem;
          }
          .commitment-container {
            padding: 24px 16px;
          }
          .commitment-p {
            font-size: 0.95rem;
            line-height: 1.65;
            margin-bottom: 16px;
          }
        }

      `}</style>
    </div>
  );
};
export default About;
