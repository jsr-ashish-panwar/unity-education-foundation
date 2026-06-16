import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  User,
  Loader2,
  X,
  Users,
  Briefcase,
  ShieldCheck,
  Calendar
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

export const Team: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Employee | null>(null);

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
        console.log("Offline fallback. Using fallback leadership and staff info.");
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
            name: "Mrs. Chandni Chauhan",
            role: "Executive Secretary",
            category: "secretary",
            photoUrl: "/mrs.chandni chauhan.jpeg",
            email: "chandnichauhan443@gmail.com",
            phone: "+91 8979288628",
            bio: "Dedicated to streamlining cross-functional workflows and maintaining robust administrative compliance."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const leadership = employees.filter(e => e.category === 'director' || e.category === 'secretary');
  const staff = employees.filter(e => e.category === 'employee');

  return (
    <div className="team-page" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background visual blobs */}
      <div className="bg-glow-blob blob-primary" style={{ top: '10%', right: '-10%' }}></div>
      <div className="bg-glow-blob blob-secondary" style={{ top: '50%', left: '-15%' }}></div>
      <div className="bg-glow-blob blob-primary" style={{ bottom: '5%', right: '-5%' }}></div>

      {/* Hero Header Banner */}
      <section className="team-hero hero-wallpaper-bg">
        <div className="container text-center">
          <span className="sub-tag">OUR PEOPLE</span>
          <h1 className="sub-title">Meet Our Dedicated Team</h1>
          <p className="sub-desc">
            The skilled administrators, supervisors, and support personnel driving operational excellence and administrative compliance at Unity Education Foundation.
          </p>
        </div>
      </section>

      {/* Leadership Board */}
      <section className="section team-section-board">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">EXECUTIVE OFFICERS</span>
            <h2 className="section-title">Leadership & Management</h2>
            <p className="section-desc">
              Guiding our operations, building strategic partnerships, and maintaining accountability.
            </p>
          </div>

          {loading ? (
            <div className="loader-container">
              <Loader2 className="spinner" size={40} />
              <p>Loading team members...</p>
            </div>
          ) : leadership.length === 0 ? (
            <div className="empty-team-box text-center">
              <Users size={40} className="empty-icon" />
              <p>No leadership board records currently available.</p>
            </div>
          ) : (
            <div className="team-cards-grid leadership-grid">
              {leadership.map((member, idx) => (
                <div
                  key={member._id || idx}
                  className="team-card glass-card animate-slide-up"
                  style={{ animationDelay: `${idx * 150}ms` }}
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="team-photo-container">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="team-photo" />
                    ) : (
                      <div className="photo-placeholder"><User size={50} /></div>
                    )}
                    <span className={`badge-role-tag badge-${member.category}`}>
                      {member.category === 'director' ? 'Managing Director' : 'Executive Secretary'}
                    </span>
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-role-text">{member.role}</p>
                    {member.bio && <p className="team-bio-trim">{member.bio}</p>}
                    <div className="team-card-contacts">
                      {member.email && (
                        <div className="contact-item">
                          <Mail size={14} /> <span>{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="contact-item">
                          <Phone size={14} /> <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Staff / Support Section */}
      <section className="section team-section-staff section-bg">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">OPERATIONAL STAFF</span>
            <h2 className="section-title">Support & Coordination Officers</h2>
            <p className="section-desc">
              The dedicated field coordinators, supervisors, and support teams executing community operations daily.
            </p>
          </div>

          {loading ? (
            <div className="loader-container">
              <Loader2 className="spinner" size={40} />
              <p>Loading staff profiles...</p>
            </div>
          ) : staff.length === 0 ? (
            <div className="empty-team-box text-center glass-card">
              <Briefcase size={32} className="empty-icon" />
              <h4>No staff members registered yet</h4>
              <p>You can add support staff through the Admin panel to display them here.</p>
            </div>
          ) : (
            <div className="team-cards-grid staff-grid">
              {staff.map((member, idx) => (
                <div
                  key={member._id || idx}
                  className="team-card glass-card animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="team-photo-container">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="team-photo" />
                    ) : (
                      <div className="photo-placeholder"><User size={40} /></div>
                    )}
                    <span className="badge-role-tag badge-staff">Staff Member</span>
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-role-text">{member.role}</p>
                    {member.bio && <p className="team-bio-trim">{member.bio}</p>}
                    <div className="team-card-contacts">
                      {member.email && (
                        <div className="contact-item">
                          <Mail size={14} /> <span>{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="contact-item">
                          <Phone size={14} /> <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox / Modal for detailed member profile */}
      {selectedMember && (
        <div className="lightbox-overlay" onClick={() => setSelectedMember(null)}>
          <div className="lightbox-modal glass-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setSelectedMember(null)}>
              <X size={24} />
            </button>

            <div className="lightbox-content-grid">
              <div className="lightbox-image-column">
                {selectedMember.photoUrl ? (
                  <img src={selectedMember.photoUrl} alt={selectedMember.name} className="lightbox-big-img" />
                ) : (
                  <div className="lightbox-placeholder">
                    <User size={80} />
                  </div>
                )}
              </div>

              <div className="lightbox-info-column">
                <span className={`lightbox-tag badge-category-${selectedMember.category}`}>
                  {selectedMember.category === 'director' 
                    ? 'Managing Director' 
                    : selectedMember.category === 'secretary' 
                    ? 'Executive Secretary' 
                    : 'Staff / Support Employee'}
                </span>
                <h2 className="lightbox-name">{selectedMember.name}</h2>
                <h4 className="lightbox-role">{selectedMember.role}</h4>

                {selectedMember.bio && (
                  <div className="lightbox-bio-section">
                    <h5>Biography & Scope of Work</h5>
                    <p className="lightbox-bio-text">{selectedMember.bio}</p>
                  </div>
                )}

                <div className="lightbox-contact-section">
                  <h5>Contact details</h5>
                  <div className="lightbox-contact-links">
                    {selectedMember.email ? (
                      <a href={`mailto:${selectedMember.email}`} className="lightbox-link">
                        <Mail size={16} /> <span>{selectedMember.email}</span>
                      </a>
                    ) : (
                      <span className="no-contact-text">No email coordinates</span>
                    )}

                    {selectedMember.phone ? (
                      <a href={`tel:${selectedMember.phone}`} className="lightbox-link">
                        <Phone size={16} /> <span>{selectedMember.phone}</span>
                      </a>
                    ) : (
                      <span className="no-contact-text">No contact phone</span>
                    )}
                  </div>
                </div>

                <div className="lightbox-footer-badge">
                  <ShieldCheck size={14} />
                  <span>Verified Organization Personnel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Component Styles */}
      <style>{`
        .team-page {
          padding-top: 80px;
          min-height: 100vh;
        }

        .team-hero {
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
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Grids & Cards */
        .team-cards-grid {
          display: grid;
          gap: 32px;
          margin-top: 40px;
        }

        .leadership-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .staff-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 992px) {
          .staff-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .leadership-grid, .staff-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
          }
        }

        .team-card {
          display: flex;
          gap: 20px;
          align-items: stretch;
          padding: 20px;
          border-top: 4px solid var(--secondary);
          text-align: left;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .team-card:hover {
          transform: translateY(-6px);
          border-top-color: var(--primary);
          box-shadow: var(--shadow-md);
        }

        .team-photo-container {
          position: relative;
          flex-shrink: 0;
          width: 130px;
          height: 165px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          background-color: var(--bg-tertiary);
        }

        .team-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-normal);
        }

        .team-card:hover .team-photo {
          transform: scale(1.05);
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-light);
        }

        .badge-role-tag {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          text-align: center;
          padding: 4px 0;
          font-family: var(--font-heading);
          font-size: 0.7rem;
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

        .badge-staff {
          background-color: var(--primary-dark);
        }

        .team-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-grow: 1;
        }

        .team-name {
          font-size: 1.35rem;
          margin-bottom: 4px;
          color: var(--primary-dark);
        }

        .team-role-text {
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--secondary);
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .team-bio-trim {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 12px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .team-card-contacts {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-light);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 180px;
        }

        /* Loader & Empty States */
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

        .empty-team-box {
          padding: 40px;
          color: var(--text-secondary);
        }

        .empty-icon {
          color: var(--text-light);
          margin-bottom: 12px;
        }

        /* Lightbox Detail View */
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(12, 35, 64, 0.65);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .lightbox-modal {
          width: 100%;
          max-width: 760px;
          background-color: white;
          border-radius: var(--radius-sm);
          padding: 32px;
          position: relative;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
        }

        .lightbox-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .lightbox-close-btn:hover {
          background-color: var(--bg-secondary);
          color: var(--primary);
        }

        .lightbox-content-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 640px) {
          .lightbox-content-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .lightbox-modal {
            padding: 24px 20px;
            max-height: 90vh;
            overflow-y: auto;
          }
        }

        .lightbox-image-column {
          width: 100%;
          height: 320px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background-color: var(--bg-tertiary);
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 640px) {
          .lightbox-image-column {
            height: 240px;
          }
        }

        .lightbox-big-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lightbox-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-light);
        }

        .lightbox-info-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .lightbox-tag {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 4px;
          color: white;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .badge-category-director {
          background-color: var(--primary);
        }

        .badge-category-secretary {
          background-color: var(--secondary);
        }

        .badge-category-employee {
          background-color: var(--primary-dark);
        }

        .lightbox-name {
          font-size: 1.8rem;
          color: var(--primary-dark);
          margin-bottom: 4px;
        }

        .lightbox-role {
          font-size: 1rem;
          font-weight: 700;
          color: var(--secondary);
          margin-bottom: 20px;
        }

        .lightbox-bio-section, .lightbox-contact-section {
          width: 100%;
          margin-bottom: 18px;
        }

        .lightbox-bio-section h5, .lightbox-contact-section h5 {
          font-family: var(--font-heading);
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--text-light);
          letter-spacing: 1px;
          margin-bottom: 6px;
          font-weight: 700;
        }

        .lightbox-bio-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .lightbox-contact-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .lightbox-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 600;
          transition: var(--transition-fast);
        }

        .lightbox-link:hover {
          color: var(--primary);
        }

        .no-contact-text {
          font-size: 0.9rem;
          color: var(--text-light);
          font-style: italic;
        }

        .lightbox-footer-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--accent);
          background-color: rgba(16, 185, 129, 0.08);
          padding: 6px 12px;
          border-radius: 50px;
          font-weight: 700;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Team;
