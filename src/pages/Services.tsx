import React from 'react';
import { Briefcase, Database, Eye, FileText, Share2, Laptop } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';

export const Services: React.FC = () => {
  const servicesList = [
    {
      title: "Operational Support Services",
      description: "We provide comprehensive operational support designed to improve efficiency and ensure seamless execution of day-to-day activities.",
      icon: <Briefcase size={24} />,
      points: [
        "Administrative coordination",
        "Operational process management",
        "Workflow monitoring",
        "Task tracking and follow-up",
        "Process optimization",
        "Performance monitoring"
      ]
    },
    {
      title: "Data Management Services",
      description: "Accurate data is essential for informed decision-making. Our team specializes in managing and maintaining large volumes of information with precision and confidentiality.",
      icon: <Database size={24} />,
      points: [
        "Data entry and processing",
        "Data verification and validation",
        "Database maintenance",
        "Record management",
        "Data organization",
        "Spreadsheet management",
        "Digital documentation support"
      ]
    },
    {
      title: "Monitoring & Evaluation",
      description: "Continuous monitoring is essential for maintaining quality standards, evaluating key indices, and ensuring overall operational effectiveness.",
      icon: <Eye size={24} />,
      points: [
        "Performance tracking",
        "Activity monitoring",
        "Progress assessment",
        "Quality control processes",
        "Operational reviews",
        "Productivity analysis",
        "Reporting and feedback mechanisms"
      ]
    },
    {
      title: "Documentation & Reporting",
      description: "Proper documentation forms the backbone of any successful organization. We design and package detailed compliance papers.",
      icon: <FileText size={24} />,
      points: [
        "Report preparation",
        "Digital record maintenance",
        "Documentation management",
        "Compliance support",
        "Information organization",
        "Performance reports",
        "Administrative reporting"
      ]
    },
    {
      title: "Communication & Coordination",
      description: "Effective communication is critical for smooth organizational functioning. We coordinate internal and external channels.",
      icon: <Share2 size={24} />,
      points: [
        "Email management",
        "Stakeholder communication",
        "Call support services",
        "Information dissemination",
        "Follow-up coordination",
        "Query resolution support",
        "Internal communication management"
      ]
    },
    {
      title: "Technology-Enabled Support",
      description: "We leverage modern digital tools and systems to improve efficiency and ensure seamless operational pipelines.",
      icon: <Laptop size={24} />,
      points: [
        "Digital workflow support",
        "Online record management",
        "System monitoring",
        "Information tracking",
        "Technology-assisted reporting",
        "Digital coordination services"
      ]
    }
  ];

  return (
    <div className="services-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="bg-glow-blob blob-primary" style={{ top: '8%', left: '-15%' }}></div>
      <div className="bg-glow-blob blob-secondary" style={{ top: '35%', right: '-12%' }}></div>
      <div className="bg-glow-blob blob-primary" style={{ bottom: '15%', left: '-10%' }}></div>

      {/* Services Sub-Hero Banner */}
      <section className="services-hero hero-wallpaper-bg">
        <div className="container text-center">
          <span className="sub-tag">WHAT WE OFFER</span>
          <h1 className="sub-title">Our Services</h1>
          <p className="sub-desc">Structuring operations, processing data, and enabling growth through technology-driven support.</p>
        </div>
      </section>

      {/* Grid List of 6 Services */}
      <section className="section services-grid-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">CORE COMPETENCIES</span>
            <h2 className="section-title">Comprehensive Support Solutions</h2>
            <p className="section-desc">
              We offer structured, high-quality administrative and technological services designed to enhance productivity and improve overall performance.
            </p>
          </div>

          <div className="grid-3 services-list-grid">
            {servicesList.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                points={service.points}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="section services-banner section-bg">
        <div className="container text-center">
          <div className="quote-card glass-card">
            <h3>Excellence in Action, Precision in Operations</h3>
            <p>
              "We combine professional skillsets with modern digital workflows to execute every client assignment with unmatched accuracy and speed."
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .services-page {
          padding-top: 80px;
        }

        .services-hero {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 80px 0;
          text-align: center;
        }

        .services-list-grid {
          margin-top: 20px;
        }

        .quote-card {
          padding: 40px;
          border-left: 6px solid var(--primary);
          max-width: 800px;
          margin: 0 auto;
        }

        .quote-card h3 {
          font-size: 1.5rem;
          margin-bottom: 12px;
        }

        .quote-card p {
          font-style: italic;
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .services-hero {
            padding: 60px 0;
          }
          .sub-title {
            font-size: 2rem;
          }
          .quote-card {
            padding: 30px 20px;
          }
        }

        @media (max-width: 480px) {
          .services-hero {
            padding: 50px 0;
          }
          .sub-title {
            font-size: 1.8rem;
          }
          .sub-desc {
            font-size: 0.95rem;
          }
          .quote-card {
            padding: 24px 16px;
          }
          .quote-card h3 {
            font-size: 1.25rem;
          }
          .quote-card p {
            font-size: 0.95rem;
          }
        }
      `}</style>

    </div>
  );
};
export default Services;
