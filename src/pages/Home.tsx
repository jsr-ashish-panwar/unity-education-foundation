import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Star, Award, Cpu, Users, ArrowRight, Heart } from 'lucide-react';
import logo from '../assets/logo.png';

export const Home: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const isMobile = () => window.innerWidth <= 768;

    const handleResize = () => {
      if (!canvas) return;
      if (isMobile()) {
        canvas.style.display = 'none';
      } else {
        canvas.style.display = 'block';
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Initial check
    if (isMobile()) {
      canvas.style.display = 'none';
    }

    const numParticles = 75;
    const particles: { x: number; y: number; z: number; color: string }[] = [];
    const radius = Math.min(width, height) * 0.38;

    for (let i = 0; i < numParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      particles.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        color: i % 2 === 0 ? '#d99b26' : '#0c2340'
      });
    }

    let angleX = 0.0015;
    let angleY = 0.002;
    const fov = 320;

    let targetAngleX = 0.0015;
    let targetAngleY = 0.002;

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile()) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      targetAngleY = (x / width) * 0.008;
      targetAngleX = (y / height) * 0.008;
    };

    const parentSection = canvas.parentElement;
    if (parentSection) {
      parentSection.addEventListener('mousemove', handleMouseMove);
    }

    const animate = () => {
      if (isMobile()) {
        ctx.clearRect(0, 0, width, height);
        animationId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      angleX += (targetAngleX - angleX) * 0.05;
      angleY += (targetAngleY - angleY) * 0.05;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projected: { x: number; y: number; size: number; z: number; color: string }[] = [];

      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];

        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y2;
        p.z = z2;

        const scale = fov / (fov + z2 + radius);
        const projX = x1 * scale + width / 2;
        const projY = y2 * scale + height / 2;
        const size = Math.max(1, scale * 3);

        projected.push({
          x: projX,
          y: projY,
          size: size,
          z: z2,
          color: p.color
        });
      }

      ctx.lineWidth = 0.45;
      for (let i = 0; i < numParticles; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < numParticles; j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 80) {
            const opacity = (1 - dist / 80) * 0.22 * (fov / (fov + (p1.z + p2.z) / 2 + radius));
            ctx.strokeStyle = `rgba(217, 155, 38, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < numParticles; i++) {
        const p = projected[i];
        const opacity = 0.12 + 0.68 * (fov / (fov + p.z + radius));
        ctx.fillStyle = p.color === '#d99b26' ? `rgba(217, 155, 38, ${opacity})` : `rgba(12, 35, 64, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (parentSection) {
        parentSection.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  const coreValues = [
    {
      title: "Integrity",
      desc: "We maintain honesty, transparency, and ethical practices in all our operations.",
      icon: <Shield size={24} />
    },
    {
      title: "Excellence",
      desc: "We strive for the highest standards of quality and performance in every task we undertake.",
      icon: <Star size={24} />
    },
    {
      title: "Accountability",
      desc: "We take responsibility for our work and ensure timely delivery of services.",
      icon: <Award size={24} />
    },
    {
      title: "Innovation",
      desc: "We continuously adopt modern tools and methods to improve operational efficiency.",
      icon: <Cpu size={24} />
    },
    {
      title: "Teamwork",
      desc: "We believe collaboration and coordination are essential for achieving success.",
      icon: <Users size={24} />
    },
    {
      title: "Commitment",
      desc: "We remain dedicated to meeting organizational goals with consistency and professionalism.",
      icon: <Heart size={24} />
    }
  ];

  return (
    <div className="home-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="bg-glow-blob blob-primary" style={{ top: '5%', left: '-10%' }}></div>
      <div className="bg-glow-blob blob-secondary" style={{ top: '35%', right: '-15%' }}></div>
      <div className="bg-glow-blob blob-primary" style={{ bottom: '15%', left: '-20%' }}></div>

      {/* Hero Section */}
      <section className="hero-section hero-wallpaper-bg hero-wallpaper-light" style={{ position: 'relative', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.75
        }}></canvas>
        <div className="container hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content animate-fade-in">
            <span className="hero-tag">ESTABLISHED 2017</span>
            <h1 className="hero-title">
              Empowering Organizations Through <span className="highlight">Efficient Operations</span> & Support Services
            </h1>
            <p className="hero-subtitle">
              Unity Education Foundation delivers high-quality operational support, database management, monitoring systems, and professional administration.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="btn btn-primary">
                Explore Services <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Get Support
              </Link>
            </div>
          </div>
          <div className="hero-image-container animate-float">
            <div className="logo-glow-wrapper">
              <img src={logo} alt="Unity Education Foundation Big Logo" className="hero-logo-large" />
            </div>
          </div>
        </div>
      </section>

      {/* Welcome & Overview */}
      <section className="section welcome-section">
        <div className="container">
          <div className="grid-2 welcome-grid">
            <div className="welcome-left">
              <span className="section-tag">WELCOME TO UNITY</span>
              <h2 className="welcome-title">Building a Strong Foundation for Your Success</h2>
              <p className="welcome-text">
                Every successful project and organization requires a strong foundation of accurate data, effective communication, timely reporting, and continuous monitoring. 
              </p>
              <p className="welcome-text">
                With a team of skilled professionals and a commitment to excellence, we work towards ensuring smooth execution of operations through structured processes, technology-driven solutions, and a result-oriented approach.
              </p>
              <div className="welcome-stats">
                <div className="stat-card">
                  <span className="stat-num">2017</span>
                  <span className="stat-label">Founded</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">100%</span>
                  <span className="stat-label">Accuracy Focus</span>
                </div>
              </div>
            </div>
            <div className="welcome-right glass-card">
              <h3 className="card-sub-title">Our Focus & Core Standards</h3>
              <ul className="welcome-bullets">
                <li>
                  <strong>Quality Control:</strong> Strict guidelines ensuring premium outcomes.
                </li>
                <li>
                  <strong>Transparency:</strong> Open processes and direct feedback pipelines.
                </li>
                <li>
                  <strong>Efficiency:</strong> Leveraged digital systems and custom workflows.
                </li>
                <li>
                  <strong>Accountability:</strong> Complete responsibility for execution and timelines.
                </li>
              </ul>
              <Link to="/about" className="btn btn-secondary welcome-btn">
                Read More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section section-bg mission-vision-section">
        <div className="container grid-2">
          <div className="glass-card mission-card">
            <span className="card-tag">MISSION</span>
            <h3 className="mission-title">Our Purpose</h3>
            <p className="mission-text">
              To provide reliable, efficient, and innovative operational support services that enable organizations to achieve sustainable growth, improve productivity, and maintain excellence in performance.
            </p>
          </div>
          <div className="glass-card vision-card">
            <span className="card-tag">VISION</span>
            <h3 className="vision-title">Our Aspiration</h3>
            <p className="vision-text">
              To become a trusted and recognized organization known for delivering exceptional monitoring, management, and support services while contributing to organizational development through professionalism and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section values-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">OUR VALUES</span>
            <h2 className="section-title">The Principles We Stand By</h2>
            <p className="section-desc">
              At Unity Education Foundation, our actions are guided by six fundamental principles that govern our operations and relationships.
            </p>
          </div>
          
          <div className="grid-3 values-grid">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="value-card glass-card animate-slide-up"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <div className="value-icon-box">
                  {val.icon}
                </div>
                <h3 className="value-card-title">{val.title}</h3>
                <p className="value-card-desc">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container cta-container glass-card">
          <h2 className="cta-title">Let's Build Efficiency Together</h2>
          <p className="cta-subtitle">
            Whether you are looking for operational support, data management solutions, monitoring services, documentation assistance, or communication support, Unity Education Foundation is ready to help your organization achieve excellence.
          </p>
          <Link to="/contact" className="btn btn-secondary btn-lg cta-btn">
            Get Started Today <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <style>{`
        .home-page {
          padding-top: 80px; /* Offset fixed header */
        }

        /* Hero CSS */
        .hero-section {
          background: radial-gradient(circle at 10% 20%, rgba(12, 35, 64, 0.04) 0%, rgba(255, 255, 255, 1) 90%);
          padding: 100px 0 80px 0;
          overflow: hidden;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 48px;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-tag {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 2.5px;
          color: var(--secondary-dark);
          background-color: rgba(217, 155, 38, 0.14);
          border: 1px solid rgba(217, 155, 38, 0.3);
          padding: 6px 16px;
          border-radius: 50px;
          margin-bottom: 20px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 24px;
          color: var(--primary-dark);
        }

        .hero-title .highlight {
          background: linear-gradient(120deg, var(--secondary-dark) 0%, var(--secondary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: var(--text-secondary);
          margin-bottom: 36px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .hero-image-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo-glow-wrapper {
          position: relative;
          padding: 20px;
        }

        .logo-glow-wrapper::before {
          content: '';
          position: absolute;
          width: 80%;
          height: 80%;
          background: radial-gradient(circle, rgba(217, 155, 38, 0.15) 0%, rgba(217, 155, 38, 0) 70%);
          top: 10%;
          left: 10%;
          z-index: -1;
          filter: blur(20px);
        }

        .hero-logo-large {
          max-width: 100%;
          height: auto;
          max-height: 380px;
          filter: drop-shadow(0 15px 30px rgba(12, 35, 64, 0.15));
        }

        /* Welcome section */
        .welcome-grid {
          align-items: stretch;
        }

        .welcome-title {
          font-size: 2.25rem;
          margin-bottom: 24px;
        }

        .welcome-text {
          color: var(--text-secondary);
          font-size: 1.05rem;
          margin-bottom: 20px;
        }

        .welcome-stats {
          display: flex;
          gap: 24px;
          margin-top: 32px;
        }

        .stat-card {
          background-color: var(--bg-tertiary);
          border-left: 4px solid var(--secondary);
          padding: 16px 24px;
          border-radius: var(--radius-sm);
          flex: 1;
        }

        .stat-num {
          display: block;
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .card-sub-title {
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .welcome-bullets {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 30px;
        }

        .welcome-bullets li {
          position: relative;
          padding-left: 24px;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .welcome-bullets li::before {
          content: '✓';
          position: absolute;
          left: 0;
          top: 0;
          color: var(--accent);
          font-weight: 900;
        }

        .welcome-btn {
          width: 100%;
        }

        /* Mission / Vision */
        .card-tag {
          display: inline-block;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--secondary-dark);
          letter-spacing: 1.5px;
          margin-bottom: 12px;
        }

        .mission-title, .vision-title {
          font-size: 1.75rem;
          margin-bottom: 16px;
        }

        .mission-text, .vision-text {
          color: var(--text-secondary);
          font-size: 1.05rem;
        }

        .mission-card {
          border-left: 6px solid var(--primary);
        }

        .vision-card {
          border-left: 6px solid var(--secondary);
        }

        /* Values card */
        .value-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 24px;
        }

        .value-icon-box {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: rgba(217, 155, 38, 0.1);
          color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: var(--transition-normal);
        }

        .value-card:hover .value-icon-box {
          background-color: var(--secondary);
          color: var(--text-white);
          transform: scale(1.1);
        }

        .value-card-title {
          font-size: 1.3rem;
          margin-bottom: 12px;
        }

        .value-card-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        /* CTA */
        .cta-container {
          text-align: center;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          border: none;
          color: var(--text-white);
          padding: 60px 40px;
        }

        .cta-title {
          color: var(--text-white);
          font-size: 2.5rem;
          margin-bottom: 16px;
        }

        .cta-subtitle {
          color: rgba(255, 255, 255, 0.8);
          max-width: 800px;
          margin: 0 auto 32px auto;
          font-size: 1.1rem;
        }

        .cta-btn {
          min-width: 200px;
        }

        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .hero-content {
            align-items: center;
          }
          
          .hero-title {
            font-size: 3rem;
          }
          
          .hero-logo-large {
            max-height: 280px;
          }
        }

        @media (max-width: 768px) {
          canvas {
            display: none !important;
          }
          .hero-title {
            font-size: 2.25rem;
          }
          .cta-title {
            font-size: 2rem;
          }
          .hero-image-container {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 60px 0 40px 0;
          }
          .hero-title {
            font-size: 1.85rem;
            line-height: 1.25;
            margin-bottom: 16px;
          }
          .hero-subtitle {
            font-size: 1rem;
            margin-bottom: 24px;
          }
          .hero-logo-large {
            max-height: 200px;
          }
          .welcome-title {
            font-size: 1.6rem;
            margin-bottom: 16px;
          }
          .welcome-text {
            font-size: 0.95rem;
            margin-bottom: 16px;
          }
          .welcome-stats {
            flex-direction: column;
            gap: 12px;
            margin-top: 24px;
          }
          .stat-card {
            padding: 12px 16px;
            text-align: center;
          }
          .stat-num {
            font-size: 1.75rem;
          }
          .card-sub-title {
            font-size: 1.3rem;
          }
          .welcome-bullets {
            gap: 12px;
            margin-bottom: 24px;
          }
          .welcome-bullets li {
            font-size: 0.88rem;
          }
          .mission-title, .vision-title {
            font-size: 1.4rem;
          }
          .mission-text, .vision-text {
            font-size: 0.92rem;
          }
          .value-card {
            padding: 24px 16px;
          }
          .value-icon-box {
            width: 50px;
            height: 50px;
            margin-bottom: 16px;
          }
          .value-card-title {
            font-size: 1.15rem;
          }
          .value-card-desc {
            font-size: 0.88rem;
          }
          .cta-container {
            padding: 36px 16px;
          }
          .cta-title {
            font-size: 1.65rem;
          }
          .cta-subtitle {
            font-size: 0.95rem;
            margin-bottom: 24px;
          }
        }
       `}</style>

    </div>
  );
};
export default Home;
