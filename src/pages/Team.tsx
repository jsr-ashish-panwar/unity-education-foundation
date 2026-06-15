import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, Loader2 } from 'lucide-react';

interface Employee {
  name: string;
  role: string;
  category: 'director' | 'secretary' | 'employee';
  photoUrl?: string;
  email?: string;
  phone?: string;
  bio?: string;
}

const LOCAL_FALLBACK_EMPLOYEES: Employee[] = [
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
  },
  {
    name: "Rajesh Kumar",
    role: "Senior Operations Manager",
    category: "employee",
    photoUrl: "/assets/employee1.webp",
    email: "rajesh.k@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Manages day-to-day workflow tracking and administrative systems with extreme precision."
  },
  {
    name: "Priyanka Chaudhary",
    role: "Data Analytics Head",
    category: "employee",
    photoUrl: "/assets/employee2.webp",
    email: "priyanka.c@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Specialist in large-scale database operations, verification procedures, and documentation structures."
  },
  {
    name: "Amit Kasana",
    role: "Lead Field Monitoring Officer",
    category: "employee",
    photoUrl: "/assets/employee3.webp",
    email: "amit.k@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Coordinates field-level evaluation frameworks and regular compliance auditing audits."
  },
  {
    name: "Komal Tyagi",
    role: "Reporting & Documentation Specialist",
    category: "employee",
    photoUrl: "/assets/employee4.webp",
    email: "komal.t@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Transforms complex operational data points into structured, highly-detailed reports."
  },
  {
    name: "Rahul Verma",
    role: "Stakeholder Communications Coordinator",
    category: "employee",
    photoUrl: "/assets/employee5.webp",
    email: "rahul.v@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Ensures seamless queries resolution and prompt responses across all digital contact nodes."
  },
  {
    name: "Neha Siddiqui",
    role: "Systems Administrator",
    category: "employee",
    photoUrl: "/assets/employee6.webp",
    email: "neha.s@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Leverages modern tracking networks and system monitoring configurations."
  }
];

export const Team: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(LOCAL_FALLBACK_EMPLOYEES);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/employees');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data.length > 0) {
            setEmployees(json.data);
          }
        }
      } catch (err) {
        console.log("Backend offline, using high-fidelity frontend backup data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Separate directors/secretaries (leadership) from regular employees
  const directors = employees.filter(e => e.category === 'director');
  const secretaries = employees.filter(e => e.category === 'secretary');
  const staff = employees.filter(e => e.category === 'employee');

  return (
    <div className="team-page">
      {/* Subpage Header Banner */}
      <section className="team-hero">
        <div className="container text-center">
          <span className="sub-tag">OUR TEAM</span>
          <h1 className="sub-title">Meet Our Professionals</h1>
          <p className="sub-desc">A team of dedicated professionals working with precision, responsibility, and commitment.</p>
        </div>
      </section>

      {/* Leadership Spotlight Section */}
      <section className="section leadership-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">LEADERSHIP SPOTLIGHT</span>
            <h2 className="section-title">Our Directors & Administrators</h2>
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
                <div key={idx} className="leader-card glass-card spotlight-card">
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
                <div key={idx} className="leader-card glass-card spotlight-card">
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

      {/* Staff Section */}
      <section className="section staff-section section-bg">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">OPERATIONAL SUPPORT TEAM</span>
            <h2 className="section-title">Support Professionals</h2>
            <p className="section-desc">
              Dedicated specialists in data management, monitoring & evaluation, workflow control, and digital documentation.
            </p>
          </div>

          {!loading && (
            <div className="grid-3 staff-grid">
              {staff.map((employee, idx) => (
                <div key={idx} className="staff-card glass-card">
                  <div className="staff-photo-container">
                    {employee.photoUrl ? (
                      <img src={employee.photoUrl} alt={employee.name} className="staff-photo" />
                    ) : (
                      <div className="photo-placeholder"><User size={40} /></div>
                    )}
                  </div>
                  <div className="staff-info">
                    <h3 className="staff-name">{employee.name}</h3>
                    <span className="staff-role-badge">{employee.role}</span>
                    <p className="staff-bio">{employee.bio}</p>
                    <div className="staff-contact">
                      {employee.email && (
                        <a href={`mailto:${employee.email}`} className="staff-link">
                          <Mail size={14} /> <span>{employee.email}</span>
                        </a>
                      )}
                      {employee.phone && (
                        <a href={`tel:${employee.phone}`} className="staff-link">
                          <Phone size={14} /> <span>{employee.phone}</span>
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

      <style>{`
        .team-page {
          padding-top: 80px;
        }

        .team-hero {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 80px 0;
          text-align: center;
        }

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

        /* Spotlight Leadership Styles */
        .leadership-cards-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-top: 40px;
        }

        .leader-card {
          display: flex;
          gap: 24px;
          align-items: stretch;
          padding: 24px;
          border-top: 4px solid var(--secondary);
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
        }

        .contact-link:hover {
          color: var(--primary);
        }

        /* Staff Card Styles */
        .staff-photo-container {
          width: 100%;
          height: 220px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: var(--shadow-sm);
        }

        .staff-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-normal);
        }

        .staff-card:hover .staff-photo {
          transform: scale(1.05);
        }

        .staff-info {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .staff-name {
          font-size: 1.25rem;
          margin-bottom: 6px;
        }

        .staff-role-badge {
          display: inline-block;
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          background-color: rgba(12, 35, 64, 0.05);
          padding: 4px 12px;
          border-radius: 50px;
          margin-bottom: 12px;
        }

        .staff-bio {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
          min-height: 60px;
          line-height: 1.5;
        }

        .staff-contact {
          width: 100%;
          border-top: 1px solid var(--border-color);
          padding-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
        }

        .staff-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .staff-link:hover {
          color: var(--secondary);
        }

        @media (max-width: 992px) {
          .leadership-cards-container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .leader-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .leader-photo-container {
            width: 100%;
            height: 240px;
          }
          .leader-contact-info {
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};
export default Team;
