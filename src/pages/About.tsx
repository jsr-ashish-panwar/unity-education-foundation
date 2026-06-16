import React from 'react';
import { Target, Eye, ShieldCheck, Zap, Award, ThumbsUp, Activity, CheckCircle, Clock } from 'lucide-react';

export const About: React.FC = () => {
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
                key={idx}
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
