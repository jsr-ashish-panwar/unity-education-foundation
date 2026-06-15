import React, { useState, useEffect } from 'react';
import { Database, AlertCircle, RefreshCw, Mail, Calendar, Phone } from 'lucide-react';

interface ContactInquiry {
  _id?: string;
  name: string;
  email: string;
  contact?: string;
  subject: string;
  message: string;
  createdAt: string | Date;
}

export const AdminDemo: React.FC = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [dbStatus, setDbStatus] = useState({
    status: 'checking...',
    database: 'checking...',
    message: 'Checking connection to local server API...'
  });
  const [loading, setLoading] = useState(true);


  const loadData = async () => {
    setLoading(true);
    let apiContacts: ContactInquiry[] = [];
    let localContacts: ContactInquiry[] = [];

    // 1. Fetch from Local Storage
    try {
      const stored = localStorage.getItem('unity_local_contacts');
      if (stored) {
        localContacts = JSON.parse(stored);
      }
    } catch (err) {
      console.error("Failed to read local storage", err);
    }

    // 2. Fetch from Express API
    try {
      const statusRes = await fetch('http://localhost:5000/api/status');
      if (statusRes.ok) {
        const statusJson = await statusRes.json();
        setDbStatus({
          status: statusJson.status,
          database: statusJson.database,
          message: statusJson.message
        });

        const contactsRes = await fetch('http://localhost:5000/api/contacts');
        if (contactsRes.ok) {
          const contactsJson = await contactsRes.json();
          if (contactsJson.success) {
            apiContacts = contactsJson.data;
          }
        }
      }
    } catch (err) {
      setDbStatus({
        status: 'offline',
        database: 'disconnected',
        message: 'Express Backend server is currently offline. Running in pure client mock storage.'
      });
    }

    // Merge lists
    // Tag them to display their origin
    const taggedLocal = localContacts.map(c => ({ ...c, origin: 'local' as const }));
    const taggedApi = apiContacts.map(c => ({ ...c, origin: 'database' as const }));
    
    // Sort combined by date
    const combined = [...taggedLocal, ...taggedApi].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    setInquiries(combined);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const clearLocalInquiries = () => {
    if (window.confirm("Are you sure you want to clear local storage logs?")) {
      localStorage.removeItem('unity_local_contacts');
      loadData();
    }
  };

  return (
    <div className="admin-page">
      {/* Subpage Header Banner */}
      <section className="admin-hero">
        <div className="container text-center">
          <span className="sub-tag">SYSTEM CONSOLE</span>
          <h1 className="sub-title">Admin Dashboard</h1>
          <p className="sub-desc">Future MongoDB Atlas connectivity management and communication logs.</p>
        </div>
      </section>

      {/* Main Admin Section */}
      <section className="section admin-body">
        <div className="container">
          <div className="grid-2 admin-top-grid">
            {/* Database Connection Status card */}
            <div className="glass-card status-card">
              <div className="status-header">
                <Database size={24} className="status-logo-icon" />
                <h3>Database Engine Status</h3>
                <button className="btn btn-outline refresh-btn" onClick={loadData} title="Refresh connection">
                  <RefreshCw size={14} />
                </button>
              </div>

              <div className="status-body-content">
                <div className="status-indicator-row">
                  <span className="indicator-label">API Status:</span>
                  <span className={`indicator-badge badge-${dbStatus.status}`}>
                    {dbStatus.status.toUpperCase()}
                  </span>
                </div>

                <div className="status-indicator-row">
                  <span className="indicator-label">Database Mode:</span>
                  <span className={`indicator-badge badge-${dbStatus.database}`}>
                    {dbStatus.database.toUpperCase()}
                  </span>
                </div>

                <div className="status-message-box">
                  <p>{dbStatus.message}</p>
                </div>
              </div>
            </div>

            {/* Instruction Card */}
            <div className="glass-card instruction-card">
              <h3>MongoDB Atlas Instructions</h3>
              <p className="instructions-p">
                To connect this website's Express server to your live **MongoDB Atlas Cluster**:
              </p>
              <ol className="instructions-list">
                <li>
                  Create a database cluster on <a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noopener noreferrer">MongoDB Atlas</a>.
                </li>
                <li>
                  Copy your MongoDB connection string.
                </li>
                <li>
                  Create a <code>.env</code> file in the <code>server/</code> folder:
                  <pre className="env-pre">MONGODB_URI=mongodb+srv://&lt;user&gt;:&lt;pass&gt;@your-cluster.mongodb.net/unity</pre>
                </li>
                <li>
                  Start the Express server using <code>npm run dev</code> or <code>npm start</code> in the server directory.
                </li>
              </ol>
            </div>
          </div>

          {/* Inquiry list section */}
          <div className="inquiry-logs-section glass-card">
            <div className="logs-header">
              <div className="logs-header-left">
                <Mail size={22} className="logs-icon" />
                <h3>Submitted Inquiries Log ({inquiries.length})</h3>
              </div>
              <div className="logs-actions">
                <button className="btn btn-outline btn-clear" onClick={clearLocalInquiries}>
                  Clear Client Logs
                </button>
                <button className="btn btn-primary btn-refresh" onClick={loadData}>
                  <RefreshCw size={16} /> Reload logs
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loader-container">
                <RefreshCw className="spinner" size={32} />
                <p>Fetching inquiry sheets...</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="empty-logs-box">
                <AlertCircle size={40} className="empty-icon" />
                <h4>No inquiries logged yet</h4>
                <p>Go to the Contact Us page, submit a message, and check back here!</p>
              </div>
            ) : (
              <div className="inquiries-list">
                {inquiries.map((inq, idx) => {
                  const date = new Date(inq.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  const isLocal = (inq as any).origin === 'local';

                  return (
                    <div key={idx} className={`inquiry-log-card ${isLocal ? 'origin-local' : 'origin-db'}`}>
                      <div className="log-card-header">
                        <div className="sender-profile">
                          <span className="sender-name">{inq.name}</span>
                          <span className="sender-email">({inq.email})</span>
                        </div>
                        <div className="log-meta">
                          <span className={`origin-badge ${isLocal ? 'badge-local' : 'badge-db'}`}>
                            {isLocal ? 'LOCAL STORAGE' : 'ATLAS MONGO'}
                          </span>
                          <span className="log-date">
                            <Calendar size={12} /> {date}
                          </span>
                        </div>
                      </div>

                      <div className="log-subject-row">
                        <strong>Subject:</strong> {inq.subject}
                      </div>

                      {inq.contact && (
                        <div className="log-phone-row">
                          <Phone size={12} /> <span>Phone: {inq.contact}</span>
                        </div>
                      )}

                      <div className="log-message-box">
                        <p>{inq.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .admin-page {
          padding-top: 80px;
        }

        .admin-hero {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 80px 0;
          text-align: center;
        }

        .admin-top-grid {
          margin-bottom: 32px;
        }

        /* Status card */
        .status-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .status-logo-icon {
          color: var(--secondary);
        }

        .status-header h3 {
          flex-grow: 1;
        }

        .refresh-btn {
          padding: 8px;
        }

        .status-indicator-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .indicator-label {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .indicator-badge {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 50px;
        }

        .badge-online, .badge-connected {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--accent);
        }

        .badge-offline, .badge-disconnected {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .badge-mocked, .badge-checking\.\.\. {
          background-color: rgba(217, 155, 38, 0.1);
          color: var(--secondary-dark);
        }

        .status-message-box {
          margin-top: 20px;
          padding: 16px;
          background-color: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        /* Instruction card */
        .instructions-p {
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .instructions-list {
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .instructions-list a {
          color: var(--secondary-dark);
          text-decoration: underline;
        }

        .env-pre {
          background-color: var(--bg-tertiary);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-family: monospace;
          margin-top: 4px;
          overflow-x: auto;
        }

        /* Logs Section */
        .inquiry-logs-section {
          padding: 40px;
        }

        .logs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .logs-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logs-icon {
          color: var(--primary);
        }

        .logs-actions {
          display: flex;
          gap: 12px;
        }

        .btn-clear {
          padding: 8px 16px;
          font-size: 0.85rem;
        }

        .btn-refresh {
          padding: 8px 16px;
          font-size: 0.85rem;
        }

        .empty-logs-box {
          text-align: center;
          padding: 60px 0;
          color: var(--text-secondary);
        }

        .empty-icon {
          color: var(--text-light);
          margin-bottom: 12px;
        }

        .empty-logs-box h4 {
          font-size: 1.25rem;
          margin-bottom: 6px;
        }

        /* Log card entries */
        .inquiries-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .inquiry-log-card {
          background-color: white;
          border-radius: var(--radius-sm);
          padding: 20px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          transition: var(--transition-normal);
        }

        .inquiry-log-card:hover {
          box-shadow: var(--shadow-md);
        }

        .inquiry-log-card.origin-local {
          border-left: 4px solid var(--secondary);
        }

        .inquiry-log-card.origin-db {
          border-left: 4px solid var(--accent);
        }

        .log-card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .sender-name {
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--primary);
          font-size: 1.1rem;
        }

        .sender-email {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-left: 6px;
        }

        .log-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .origin-badge {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }

        .badge-local {
          background-color: rgba(217, 155, 38, 0.1);
          color: var(--secondary-dark);
        }

        .badge-db {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--accent);
        }

        .log-date {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.82rem;
          color: var(--text-light);
        }

        .log-subject-row {
          margin-bottom: 6px;
          font-size: 0.95rem;
        }

        .log-phone-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .log-message-box {
          background-color: var(--bg-secondary);
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.95rem;
          color: var(--text-primary);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .log-card-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .logs-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .logs-actions {
            width: 100%;
          }
          .btn-clear, .btn-refresh {
            flex-grow: 1;
          }
        }
      `}</style>
    </div>
  );
};
export default AdminDemo;
