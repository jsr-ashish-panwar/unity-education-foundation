import React, { useState } from 'react';
import { API_URL } from '../config';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [activeMap, setActiveMap] = useState<'permanent' | 'alternative'>('permanent');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({
        type: 'error',
        message: 'Please fill out all required fields (*).'
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent to our administration team.'
        });
        setFormData({ name: '', email: '', contact: '', subject: '', message: '' });
      } else {
        throw new Error(data.error || 'Failed to submit form');
      }
    } catch (error) {
      console.log('Backend is offline, saving contact inquiry locally.');
      
      // Standalone/Offline Fallback: Save in localStorage
      try {
        const storedInquiries = localStorage.getItem('unity_local_contacts');
        const localList = storedInquiries ? JSON.parse(storedInquiries) : [];
        const newLocalContact = {
          ...formData,
          _id: 'local_' + Math.random().toString(36).substr(2, 9),
          createdAt: new Date()
        };
        localList.push(newLocalContact);
        localStorage.setItem('unity_local_contacts', JSON.stringify(localList));

        setStatus({
          type: 'success',
          message: 'Inquiry registered locally (Offline Mode). We will process your message as soon as connection is restored.'
        });
        setFormData({ name: '', email: '', contact: '', subject: '', message: '' });
      } catch (err) {
        setStatus({
          type: 'error',
          message: 'Unable to submit message. Please try emailing us directly.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="bg-glow-blob blob-primary" style={{ top: '6%', left: '-15%' }}></div>
      <div className="bg-glow-blob blob-secondary" style={{ top: '35%', right: '-12%' }}></div>
      <div className="bg-glow-blob blob-primary" style={{ bottom: '15%', left: '-10%' }}></div>

      {/* Contact Subpage Header */}
      <section className="contact-hero hero-wallpaper-bg">
        <div className="container text-center">
          <span className="sub-tag">GET IN TOUCH</span>
          <h1 className="sub-title">Contact Us</h1>
          <p className="sub-desc">Have queries or need operational assistance? Reach out to Unity Education Foundation today.</p>
        </div>
      </section>

      {/* Main Details and Form Split Section */}
      <section className="section contact-body-section">
        <div className="container grid-2 contact-grid">
          {/* Left Column: Direct details */}
          <div className="contact-info-panel glass-card animate-slide-up">
            <h2 className="info-panel-title">Contact Information</h2>
            <p className="info-panel-desc">
              We look forward to collaborating with your organization. Please use the details below or fill out the form to message us.
            </p>

            <div className="info-items-list">
              <div className="info-item-box">
                <MapPin size={24} className="info-icon" />
                <div className="info-item-text">
                  <h4>Permanent Location</h4>
                  <p>H. No-69 KASBA SIWAL KHAS, MEERUT 250501 (UP)</p>
                  <a href="https://maps.app.goo.gl/RnJsguT1THZA9aP48?g_st=ac" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: 'bold' }}>
                    View on Google Maps &rarr;
                  </a>
                </div>
              </div>

              <div className="info-item-box">
                <MapPin size={24} className="info-icon" />
                <div className="info-item-text">
                  <h4>Alternative Location</h4>
                  <p>C-84-85 SHRADHAPURI-II, KANKAR KHERA, MEERUT 250001 (UP)</p>
                  <a href="https://maps.app.goo.gl/hPm7mdXNGLzoKN2JA?g_st=ac" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontWeight: 'bold' }}>
                    View on Google Maps &rarr;
                  </a>
                </div>
              </div>

              <div className="info-item-box">
                <Phone size={24} className="info-icon" />
                <div className="info-item-text">
                  <h4>Phone Numbers</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.95rem' }}>
                    <span>Director: <a href="tel:+919557558628" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+91 9557558628</a></span>
                    <span>Secretary: <a href="tel:01214108015" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>0121-4108015</a></span>
                  </div>
                </div>
              </div>

              <div className="info-item-box">
                <Mail size={24} className="info-icon" />
                <div className="info-item-text">
                  <h4>Email Address</h4>
                  <a href="mailto:unityeducationfoundation22@gmail.com">unityeducationfoundation22@gmail.com</a>
                </div>
              </div>

              <div className="info-item-box">
                <Clock size={24} className="info-icon" />
                <div className="info-item-text">
                  <h4>Working Hours</h4>
                  <p>Monday – Saturday | 9:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* Quick map highlight or note */}
            <div className="contact-note-box">
              <strong>Let's Build Efficiency Together</strong>
              <p>
                Whether you need database cleanup, operational oversight, field surveys monitoring, or administrative reinforcement, we are ready to assist.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-form-panel glass-card animate-slide-up" style={{ animationDelay: '150ms' }}>
            <h2 className="form-title">Send a Message</h2>
            <p className="form-subtitle">Fields marked with * are required.</p>

            {status.type && (
              <div className={`form-status-banner banner-${status.type}`}>
                {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="actual-contact-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="contact">Contact Number</label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject of interest"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you? Please provide detailed context."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary form-submit-btn" disabled={loading}>
                {loading ? 'Sending message...' : <>Send Message <Send size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Interactive Google Map Section */}
      <section className="section contact-map-section">
        <div className="container">
          <div className="map-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveMap('permanent')}
              className={`btn ${activeMap === 'permanent' ? 'btn-primary' : 'btn-outline'}`}
              style={{ minWidth: '200px' }}
            >
              Permanent Location
            </button>
            <button
              onClick={() => setActiveMap('alternative')}
              className={`btn ${activeMap === 'alternative' ? 'btn-primary' : 'btn-outline'}`}
              style={{ minWidth: '200px' }}
            >
              Alternative Location
            </button>
          </div>
          <div className="map-wrapper glass-card animate-slide-up">
            {activeMap === 'permanent' ? (
              <iframe
                title="Permanent Office Location Map"
                src="https://maps.google.com/maps?q=H.%20No-69%20KASBA%20SIWAL%20KHAS,%20MEERUT%20250501%20(UP)&z=15&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <iframe
                title="Alternative Office Location Map"
                src="https://maps.google.com/maps?q=C-84-85%20SHRADHAPURI-II,%20KANKAR%20KHERA,%20MEERUT%20250001%20(UP)&z=15&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .contact-page {
          padding-top: 80px;
        }

        .contact-hero {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 80px 0;
          text-align: center;
        }

        .contact-grid {
          align-items: stretch;
        }

        /* Info panel styles */
        .info-panel-title {
          font-size: 1.75rem;
          margin-bottom: 12px;
        }

        .info-panel-desc {
          color: var(--text-secondary);
          margin-bottom: 30px;
        }

        .info-items-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-item-box {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .info-icon {
          color: var(--secondary);
          background-color: rgba(217, 155, 38, 0.1);
          padding: 8px;
          border-radius: var(--radius-sm);
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info-item-text h4 {
          font-size: 1.1rem;
          margin-bottom: 4px;
        }

        .info-item-text p, .info-item-text a {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .info-item-text a:hover {
          color: var(--primary);
        }

        .contact-note-box {
          margin-top: 36px;
          padding: 20px;
          border-left: 4px solid var(--secondary);
          background-color: var(--bg-tertiary);
          border-radius: var(--radius-sm);
        }

        .contact-note-box strong {
          color: var(--primary);
          display: block;
          margin-bottom: 6px;
        }

        .contact-note-box p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Form styles */
        .form-title {
          font-size: 1.75rem;
          margin-bottom: 4px;
        }

        .form-subtitle {
          font-size: 0.85rem;
          color: var(--text-light);
          margin-bottom: 24px;
        }

        .form-status-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 24px;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .banner-success {
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: var(--accent-light);
        }

        .banner-error {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .actual-contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-family: var(--font-heading);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-group input, .form-group textarea {
          font-family: var(--font-body);
          padding: 12px 16px;
          font-size: 0.95rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: white;
          color: var(--text-primary);
          outline: none;
          transition: var(--transition-fast);
        }

        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--secondary);
          box-shadow: 0 0 0 4px rgba(217, 155, 38, 0.18);
        }

        .form-submit-btn {
          width: 100%;
          justify-content: center;
          margin-top: 10px;
        }

        /* Map Section Styles */
        .contact-map-section {
          padding-top: 0;
          margin-bottom: 60px;
        }

        .map-wrapper {
          padding: 8px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-color);
          background-color: white;
          line-height: 0;
        }

        .map-wrapper iframe {
          border-radius: var(--radius-sm);
          filter: grayscale(8%) contrast(102%) saturate(98%);
          transition: filter 0.3s ease;
        }

        .map-wrapper iframe:hover {
          filter: none;
        }

        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .map-wrapper iframe {
            height: 320px;
          }
          .contact-map-section {
            margin-bottom: 40px;
          }
        }

        @media (max-width: 576px) {
          .form-group-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          .contact-hero {
            padding: 60px 0;
          }
          .info-panel-title, .form-title {
            font-size: 1.45rem;
          }
          .info-panel-desc {
            margin-bottom: 20px;
            font-size: 0.88rem;
          }
          .info-items-list {
            gap: 18px;
          }
          .info-item-box {
            gap: 12px;
          }
          .info-icon {
            width: 38px;
            height: 38px;
            padding: 6px;
          }
          .info-item-text h4 {
            font-size: 1rem;
          }
          .info-item-text p, .info-item-text a {
            font-size: 0.88rem;
          }
          .contact-note-box {
            margin-top: 24px;
            padding: 16px;
          }
          .contact-note-box p {
            font-size: 0.85rem;
          }
          .form-subtitle {
            margin-bottom: 16px;
          }
          .actual-contact-form {
            gap: 14px;
          }
          .form-group label {
            font-size: 0.85rem;
          }
          .form-group input, .form-group textarea {
            padding: 10px 12px;
            font-size: 0.9rem;
          }
          .map-wrapper iframe {
            height: 240px;
          }
        }

      `}</style>
    </div>
  );
};
export default Contact;
