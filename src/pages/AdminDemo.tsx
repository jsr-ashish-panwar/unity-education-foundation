import React, { useState, useEffect } from 'react';
import { API_URL, ADMIN_PASSWORD } from '../config';
import { 
  Database, 
  AlertCircle, 
  RefreshCw, 
  Mail, 
  Calendar, 
  Phone, 
  Lock, 
  LogOut, 
  Trash2, 
  UserPlus, 
  Users, 
  Upload, 
  User, 
  CheckCircle,
  Image as ImageIcon,
  Plus
} from 'lucide-react';

interface ContactInquiry {
  _id?: string;
  name: string;
  email: string;
  contact?: string;
  subject: string;
  message: string;
  createdAt: string | Date;
}

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

interface GalleryItem {
  _id?: string;
  title?: string;
  description?: string;
  imageUrl: string;
  createdAt?: string | Date;
}

const compressImage = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const AdminDemo: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('unity_admin_authenticated') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Main navigation tab
  const [activeTab, setActiveTab] = useState<'employees' | 'gallery' | 'inquiries'>('employees');

  // Inquiries State
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [dbStatus, setDbStatus] = useState({
    status: 'checking...',
    database: 'checking...',
    message: 'Checking connection to local server API...'
  });
  const [inquiriesLoading, setInquiriesLoading] = useState(true);

  // Employees State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [empError, setEmpError] = useState('');

  // Add Employee Form State
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empCategory, setEmpCategory] = useState<'director' | 'secretary' | 'employee'>('employee');
  const [empPhotoUrl, setEmpPhotoUrl] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empBio, setEmpBio] = useState('');
  const [isAddingEmp, setIsAddingEmp] = useState(false);
  const [addMessage, setAddMessage] = useState({ type: '', text: '' });

  // Gallery Management State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState('');
  
  // Add Gallery Form State
  const [galTitle, setGalTitle] = useState('');
  const [galDescription, setGalDescription] = useState('');
  const [galImageUrl, setGalImageUrl] = useState('');
  const [isAddingGal, setIsAddingGal] = useState(false);
  const [galMessage, setGalMessage] = useState({ type: '', text: '' });

  // Filename display states
  const [empFileName, setEmpFileName] = useState('');
  const [galFileName, setGalFileName] = useState('');

  // Load Inquiries
  const loadInquiries = async () => {
    setInquiriesLoading(true);
    let apiContacts: ContactInquiry[] = [];
    let localContacts: ContactInquiry[] = [];

    // Fetch from Local Storage
    try {
      const stored = localStorage.getItem('unity_local_contacts');
      if (stored) {
        localContacts = JSON.parse(stored);
      }
    } catch (err) {
      console.error("Failed to read local storage", err);
    }

    // Fetch from Express API
    try {
      const statusRes = await fetch(`${API_URL}/api/status`);
      if (statusRes.ok) {
        const statusJson = await statusRes.json();
        setDbStatus({
          status: statusJson.status,
          database: statusJson.database,
          message: statusJson.message
        });

        const contactsRes = await fetch(`${API_URL}/api/contacts`);
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
    const taggedLocal = localContacts.map(c => ({ ...c, origin: 'local' as const }));
    const taggedApi = apiContacts.map(c => ({ ...c, origin: 'database' as const }));
    
    const combined = [...taggedLocal, ...taggedApi].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    setInquiries(combined);
    setInquiriesLoading(false);
  };

  // Load Employees
  const loadEmployees = async () => {
    setEmployeesLoading(true);
    setEmpError('');
    try {
      const res = await fetch(`${API_URL}/api/employees`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setEmployees(json.data);
        } else {
          setEmpError(json.error || 'Failed to retrieve employees list');
        }
      } else {
        setEmpError(`Backend returned status ${res.status}`);
      }
    } catch (err) {
      setEmpError('Express server is offline. Add/delete modifications will run in frontend fallback memory.');
      setEmployees([
        {
          _id: 'mock_dir',
          name: "Dr. Alok Sharma",
          role: "Managing Director",
          category: "director",
          photoUrl: "/assets/director.webp",
          email: "alok.sharma@unityeducation.org",
          phone: "+91 9557558628",
          bio: "Over 15 years of leadership in educational administration and community operational development."
        },
        {
          _id: 'mock_sec',
          name: "Mrs. Chandni Chauhan",
          role: "Secretary",
          category: "secretary",
          photoUrl: "/mrs.chandni chauhan.jpeg",
          email: "chandnichauhan443@gmail.com",
          phone: "+91 8979288628",
          bio: "Dedicated to streamlining cross-functional workflows and maintaining robust administrative compliance."
        }
      ]);
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Load Gallery Items
  const loadGalleryItems = async () => {
    setGalleryLoading(true);
    setGalleryError('');
    try {
      const res = await fetch(`${API_URL}/api/gallery`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setGalleryItems(json.data);
        } else {
          setGalleryError(json.error || 'Failed to retrieve gallery items');
        }
      } else {
        setGalleryError(`Backend returned status ${res.status}`);
      }
    } catch (err) {
      setGalleryError('Server offline. Using local gallery memory.');
      setGalleryItems([
        {
          _id: 'mock_gal_1',
          title: "Educational Support Distribution",
          description: "Providing learning materials and kits to children at community centers.",
          imageUrl: "/wall1.jpg"
        },
        {
          _id: 'mock_gal_2',
          title: "Community Outreach",
          description: "Helping build robust community operations and supportive networks.",
          imageUrl: "/mrs.chandni chauhan.jpeg"
        }
      ]);
    } finally {
      setGalleryLoading(false);
    }
  };

  // Trigger loading when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadInquiries();
      loadEmployees();
      loadGalleryItems();
    }
  }, [isAuthenticated]);

  // Handle password login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('unity_admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('unity_admin_authenticated');
    setPasswordInput('');
  };

  // Handle Photo File Upload -> Base64 for Employees
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEmpFileName(file.name);
      setAddMessage({ type: 'success', text: 'Compressing image...' });
      try {
        const compressed = await compressImage(file, 400, 500, 0.7);
        setEmpPhotoUrl(compressed);
        setAddMessage({ type: 'success', text: 'Image optimized successfully!' });
      } catch (err) {
        setAddMessage({ type: 'error', text: 'Failed to optimize image.' });
        setEmpFileName('');
      }
    }
  };

  // Handle File Upload -> Base64 for Gallery
  const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGalFileName(file.name);
      setGalMessage({ type: 'success', text: 'Compressing image...' });
      try {
        const compressed = await compressImage(file, 800, 600, 0.7);
        setGalImageUrl(compressed);
        setGalMessage({ type: 'success', text: 'Image optimized successfully!' });
      } catch (err) {
        setGalMessage({ type: 'error', text: 'Failed to optimize image.' });
        setGalFileName('');
      }
    }
  };

  // Add Employee Form Submit
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empRole || !empCategory) {
      setAddMessage({ type: 'error', text: 'Please fill out Name, Designation/Role, and Category.' });
      return;
    }

    setIsAddingEmp(true);
    setAddMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_URL}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: empName,
          role: empRole,
          category: empCategory,
          photoUrl: empPhotoUrl,
          email: empEmail,
          phone: empPhone,
          bio: empBio
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setAddMessage({ type: 'success', text: 'Employee profile added successfully!' });
        setEmpName('');
        setEmpRole('');
        setEmpCategory('employee');
        setEmpPhotoUrl('');
        setEmpFileName('');
        setEmpEmail('');
        setEmpPhone('');
        setEmpBio('');
        await loadEmployees();
      } else {
        setAddMessage({ type: 'error', text: json.error || 'Failed to save employee profile.' });
      }
    } catch (err) {
      const newMockEmp: Employee = {
        _id: 'mock_emp_' + Math.random().toString(36).substr(2, 9),
        name: empName,
        role: empRole,
        category: empCategory,
        photoUrl: empPhotoUrl || undefined,
        email: empEmail || undefined,
        phone: empPhone || undefined,
        bio: empBio || undefined
      };
      setEmployees(prev => [...prev, newMockEmp]);
      setAddMessage({ type: 'success', text: 'Backend offline: Added employee to frontend memory.' });
      setEmpName('');
      setEmpRole('');
      setEmpCategory('employee');
      setEmpPhotoUrl('');
      setEmpEmail('');
      setEmpPhone('');
      setEmpBio('');
    } finally {
      setIsAddingEmp(false);
    }
  };

  // Delete Employee
  const handleDeleteEmployee = async (id: string | undefined, name: string) => {
    if (!id) return;
    if (!window.confirm(`Are you sure you want to remove ${name} from the team?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/employees/${id}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (res.ok && json.success) {
        await loadEmployees();
      } else {
        alert(json.error || 'Failed to delete employee profile.');
      }
    } catch (err) {
      setEmployees(prev => prev.filter(emp => emp._id !== id));
      alert('Backend offline: Removed employee from frontend memory.');
    }
  };

  // Add Gallery Item Submit
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galImageUrl) {
      setGalMessage({ type: 'error', text: 'Please choose an image file or provide a photo URL.' });
      return;
    }

    setIsAddingGal(true);
    setGalMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: galTitle,
          description: galDescription,
          imageUrl: galImageUrl
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setGalMessage({ type: 'success', text: 'Gallery photo added successfully!' });
        setGalTitle('');
        setGalDescription('');
        setGalImageUrl('');
        setGalFileName('');
        await loadGalleryItems();
      } else {
        setGalMessage({ type: 'error', text: json.error || 'Failed to save gallery item.' });
      }
    } catch (err) {
      const newMockGal: GalleryItem = {
        _id: 'mock_gal_' + Math.random().toString(36).substr(2, 9),
        title: galTitle,
        description: galDescription,
        imageUrl: galImageUrl
      };
      setGalleryItems(prev => [newMockGal, ...prev]);
      setGalMessage({ type: 'success', text: 'Backend offline: Added photo to frontend memory.' });
      setGalTitle('');
      setGalDescription('');
      setGalImageUrl('');
    } finally {
      setIsAddingGal(false);
    }
  };

  // Delete Gallery Item
  const handleDeleteGalleryItem = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm(`Are you sure you want to delete this image from the gallery?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (res.ok && json.success) {
        await loadGalleryItems();
      } else {
        alert(json.error || 'Failed to delete gallery photo.');
      }
    } catch (err) {
      setGalleryItems(prev => prev.filter(item => item._id !== id));
      alert('Backend offline: Removed image from frontend memory.');
    }
  };

  const clearLocalInquiries = () => {
    if (window.confirm("Are you sure you want to clear local storage logs?")) {
      localStorage.removeItem('unity_local_contacts');
      loadInquiries();
    }
  };

  // RENDER LOGIN WINDOW IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <section className="admin-hero hero-wallpaper-bg">
          <div className="container text-center">
            <span className="sub-tag">SECURITY VERIFICATION</span>
            <h1 className="sub-title">Admin Access Needed</h1>
            <p className="sub-desc">Please log in with your foundation credentials to view system utilities.</p>
          </div>
        </section>

        <section className="section login-overlay-container">
          <div className="glass-card login-card animate-slide-up">
            <div className="login-icon-box">
              <Lock size={32} />
            </div>
            <h2 className="login-title">Staff Portal</h2>
            <p className="login-subtitle">Enter administrator password to continue</p>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-pass">Access Password</label>
                <input 
                  type="password"
                  id="admin-pass"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              {loginError && (
                <div className="login-error animate-shake">
                  <AlertCircle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block">
                Authorize Access
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  // RENDER ADMIN DASHBOARD IF AUTHENTICATED
  return (
    <div className="admin-page">
      {/* Subpage Header Banner */}
      <section className="admin-hero hero-wallpaper-bg">
        <div className="container text-center">
          <span className="sub-tag">SYSTEM CONSOLE</span>
          <h1 className="sub-title">Admin Dashboard</h1>
          <p className="sub-desc">MongoDB Atlas employee configuration database and user inquiry log sheets.</p>
        </div>
      </section>

      {/* Main Admin Section */}
      <section className="section admin-body">
        <div className="container">
          
          {/* Dashboard Header Panel */}
          <div className="admin-tab-nav-panel glass-card">
            <div className="tab-buttons-group">
              <button 
                className={`tab-toggle-btn ${activeTab === 'employees' ? 'active' : ''}`}
                onClick={() => setActiveTab('employees')}
              >
                <Users size={18} />
                <span>Manage Team</span>
              </button>
              <button 
                className={`tab-toggle-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                onClick={() => setActiveTab('gallery')}
              >
                <ImageIcon size={18} />
                <span>Manage Gallery</span>
              </button>
              <button 
                className={`tab-toggle-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
                onClick={() => setActiveTab('inquiries')}
              >
                <Mail size={18} />
                <span>Inquiry Logs ({inquiries.length})</span>
              </button>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Lock Console</span>
            </button>
          </div>

          {/* TAB 1: EMPLOYEES CONFIGURATION PANEL */}
          {activeTab === 'employees' && (
            <div className="admin-management-layout">
              
              {/* Left Column: Form to Add Employees */}
              <div className="glass-card panel-form-card">
                <div className="form-card-header">
                  <UserPlus size={22} className="header-icon-primary" />
                  <h3>Register New Team Member</h3>
                </div>

                <form onSubmit={handleAddEmployee} className="add-emp-form">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="Dr. Rajesh Kumar"
                        value={empName}
                        onChange={(e) => setEmpName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Designation / Role *</label>
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="Project Supervisor"
                        value={empRole}
                        onChange={(e) => setEmpRole(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select 
                        className="form-input form-select"
                        value={empCategory}
                        onChange={(e) => setEmpCategory(e.target.value as any)}
                        required
                      >
                        <option value="director">Director</option>
                        <option value="secretary">Secretary</option>
                        <option value="employee">Staff / Support Employee</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Photo Upload (Max 2MB)</label>
                      <div className="file-input-wrapper">
                        <Upload size={16} />
                        <span>{empFileName || 'Choose Profile Photo'}</span>
                        <input 
                          type="file"
                          accept="image/*"
                          className="file-input-hidden"
                          onChange={handlePhotoFileChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Or Photo URL (Web Link)</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="https://example.com/photo.jpg"
                      value={empPhotoUrl}
                      onChange={(e) => setEmpPhotoUrl(e.target.value)}
                    />
                  </div>

                  {empPhotoUrl && (
                    <div className="photo-preview-container">
                      <img src={empPhotoUrl} alt="Employee Profile Preview" className="photo-preview-image" />
                      <button 
                        type="button" 
                        className="btn-preview-delete" 
                        onClick={() => setEmpPhotoUrl('')}
                      >
                        Clear Photo
                      </button>
                    </div>
                  )}

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email"
                        className="form-input"
                        placeholder="rajesh.kumar@unityeducation.org"
                        value={empEmail}
                        onChange={(e) => setEmpEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Contact Phone</label>
                      <input 
                        type="tel"
                        className="form-input"
                        placeholder="+91 9876543210"
                        value={empPhone}
                        onChange={(e) => setEmpPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Biography / Description</label>
                    <textarea 
                      className="form-input form-textarea"
                      placeholder="Summarize coordinates administrative workflows and support operations..."
                      rows={3}
                      value={empBio}
                      onChange={(e) => setEmpBio(e.target.value)}
                    />
                  </div>

                  {addMessage.text && (
                    <div className={`form-feedback-message ${addMessage.type}`}>
                      {addMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                      <span>{addMessage.text}</span>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary btn-block" disabled={isAddingEmp}>
                    {isAddingEmp ? (
                      <>
                        <RefreshCw className="spinner" size={16} />
                        <span>Saving profile...</span>
                      </>
                    ) : (
                      <span>Add Employee Profile</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: List of current employees */}
              <div className="glass-card panel-list-card">
                <div className="list-card-header">
                  <div className="header-left">
                    <Users size={22} className="header-icon-secondary" />
                    <h3>Active Staff Directory ({employees.length})</h3>
                  </div>
                  <button className="btn btn-outline btn-refresh-list" onClick={loadEmployees} title="Reload list" disabled={employeesLoading}>
                    <RefreshCw size={14} className={employeesLoading ? 'spinner' : ''} />
                  </button>
                </div>

                {employeesLoading ? (
                  <div className="loader-container">
                    <RefreshCw className="spinner" size={32} />
                    <p>Fetching active roles...</p>
                  </div>
                ) : empError && employees.length === 0 ? (
                  <div className="error-list-box">
                    <AlertCircle size={32} />
                    <p>{empError}</p>
                  </div>
                ) : employees.length === 0 ? (
                  <div className="empty-list-box">
                    <AlertCircle size={32} />
                    <p>No employees found. Register a new member using the form.</p>
                  </div>
                ) : (
                  <div className="employee-list-grid">
                    {employees.map((emp) => (
                      <div key={emp._id} className="admin-emp-card">
                        {emp.photoUrl ? (
                          <img src={emp.photoUrl} alt={emp.name} className="admin-emp-photo" />
                        ) : (
                          <div className="admin-emp-placeholder">
                            <User size={30} />
                          </div>
                        )}
                        <div className="admin-emp-info">
                          <div>
                            <h4 className="admin-emp-name">{emp.name}</h4>
                            <p className="admin-emp-role">{emp.role}</p>
                            <span className={`admin-emp-badge badge-category-${emp.category}`}>
                              {emp.category}
                            </span>
                          </div>
                          <div className="admin-emp-contact-text">
                            {emp.email && <span className="small-contact">{emp.email}</span>}
                            {emp.phone && <span className="small-contact">{emp.phone}</span>}
                          </div>
                        </div>

                        <button 
                          className="btn-delete-emp"
                          onClick={() => handleDeleteEmployee(emp._id, emp.name)}
                          title={`Delete ${emp.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: GALLERY ACCESS MANAGEMENT PANEL */}
          {activeTab === 'gallery' && (
            <div className="admin-management-layout">
              
              {/* Left Column: Form to Upload Gallery Photos */}
              <div className="glass-card panel-form-card">
                <div className="form-card-header">
                  <Plus size={22} className="header-icon-primary" />
                  <h3>Upload Gallery Image</h3>
                </div>

                <form onSubmit={handleAddGalleryItem} className="add-emp-form">
                  <div className="form-group">
                    <label className="form-label">Image Title / Caption</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="e.g. Distribution Camp 2026"
                      value={galTitle}
                      onChange={(e) => setGalTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image File Upload (Max 2MB)</label>
                    <div className="file-input-wrapper">
                      <Upload size={16} />
                      <span>{galFileName || 'Choose Image File'}</span>
                      <input 
                        type="file"
                        accept="image/*"
                        className="file-input-hidden"
                        onChange={handleGalleryFileChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Or Image URL</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="https://example.com/photo.jpg"
                      value={galImageUrl}
                      onChange={(e) => setGalImageUrl(e.target.value)}
                    />
                  </div>

                  {galImageUrl && (
                    <div className="photo-preview-container">
                      <img src={galImageUrl} alt="Gallery Preview" className="photo-preview-image" style={{ width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        className="btn-preview-delete" 
                        onClick={() => setGalImageUrl('')}
                      >
                        Clear Image
                      </button>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Image Description / Context</label>
                    <textarea 
                      className="form-input form-textarea"
                      placeholder="Describe the activity, event, or resources shown..."
                      rows={4}
                      value={galDescription}
                      onChange={(e) => setGalDescription(e.target.value)}
                    />
                  </div>

                  {galMessage.text && (
                    <div className={`form-feedback-message ${galMessage.type}`}>
                      {galMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                      <span>{galMessage.text}</span>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary btn-block" disabled={isAddingGal}>
                    {isAddingGal ? (
                      <>
                        <RefreshCw className="spinner" size={16} />
                        <span>Uploading photo...</span>
                      </>
                    ) : (
                      <span>Upload Gallery Photo</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: Existing Gallery Catalog */}
              <div className="glass-card panel-list-card">
                <div className="list-card-header">
                  <div className="header-left">
                    <ImageIcon size={22} className="header-icon-secondary" />
                    <h3>Live Gallery Archive ({galleryItems.length})</h3>
                  </div>
                  <button className="btn btn-outline btn-refresh-list" onClick={loadGalleryItems} title="Reload list" disabled={galleryLoading}>
                    <RefreshCw size={14} className={galleryLoading ? 'spinner' : ''} />
                  </button>
                </div>

                {galleryLoading ? (
                  <div className="loader-container">
                    <RefreshCw className="spinner" size={32} />
                    <p>Fetching catalog...</p>
                  </div>
                ) : galleryError && galleryItems.length === 0 ? (
                  <div className="error-list-box">
                    <AlertCircle size={32} />
                    <p>{galleryError}</p>
                  </div>
                ) : galleryItems.length === 0 ? (
                  <div className="empty-list-box">
                    <AlertCircle size={32} />
                    <p>No gallery images uploaded yet. Use the upload panel.</p>
                  </div>
                ) : (
                  <div className="employee-list-grid">
                    {galleryItems.map((item) => (
                      <div key={item._id} className="admin-emp-card">
                        <img src={item.imageUrl} alt={item.title || "Gallery"} className="admin-emp-photo" style={{ width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                        <div className="admin-emp-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <h4 className="admin-emp-name" style={{ fontSize: '0.95rem' }}>{item.title || "Activity photo"}</h4>
                          <p className="admin-emp-role" style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '4px', lineHeight: '1.4' }}>
                            {item.description ? (item.description.length > 50 ? `${item.description.substring(0, 50)}...` : item.description) : "No description"}
                          </p>
                        </div>

                        <button 
                          className="btn-delete-emp"
                          onClick={() => handleDeleteGalleryItem(item._id)}
                          title="Delete photo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: CONTACT INQUIRIES LOG SHEET (Existing Admin View) */}
          {activeTab === 'inquiries' && (
            <>
              <div className="grid-2 admin-top-grid">
                {/* Database Connection Status card */}
                <div className="glass-card status-card">
                  <div className="status-header">
                    <Database size={24} className="status-logo-icon" />
                    <h3>Database Engine Status</h3>
                    <button className="btn btn-outline refresh-btn" onClick={loadInquiries} title="Refresh connection" disabled={inquiriesLoading}>
                      <RefreshCw size={14} className={inquiriesLoading ? 'spinner' : ''} />
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
                    <button className="btn btn-primary btn-refresh" onClick={loadInquiries} disabled={inquiriesLoading}>
                      <RefreshCw size={16} className={inquiriesLoading ? 'spinner' : ''} /> Reload logs
                    </button>
                  </div>
                </div>

                {inquiriesLoading ? (
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
            </>
          )}

        </div>
      </section>

      <style>{`
        .admin-page {
          padding-top: 80px;
          min-height: 100vh;
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

        /* Access Login Overlay */
        .login-overlay-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          padding: 40px 20px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 40px 32px;
          text-align: center;
          border-top: 4px solid var(--primary);
        }

        .login-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: rgba(12, 35, 64, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          color: var(--primary);
        }

        .login-title {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 6px;
        }

        .login-subtitle {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 24px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          text-align: left;
        }

        .spinner {
          animation: spin 1s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Tab Navigation Panel */
        .admin-tab-nav-panel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .tab-buttons-group {
          display: flex;
          gap: 8px;
        }

        .tab-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-secondary);
          padding: 10px 20px;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all 0.3s ease;
        }

        .tab-toggle-btn:hover {
          background-color: rgba(12, 35, 64, 0.05);
          color: var(--primary);
        }

        .tab-toggle-btn.active {
          background-color: var(--primary);
          color: white;
        }

        .btn-logout {
          background-color: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.15);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-logout:hover {
          background-color: #ef4444;
          color: white;
        }

        /* Layout for Employee CRUD section */
        .admin-management-layout {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 32px;
          align-items: start;
        }

        .panel-form-card {
          padding: 30px;
        }

        .panel-list-card {
          padding: 30px;
        }

        .form-card-header, .list-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 16px;
          margin-bottom: 24px;
        }

        .header-icon-primary {
          color: var(--primary);
        }

        .header-icon-secondary {
          color: var(--secondary);
        }

        .list-card-header {
          justify-content: space-between;
        }

        .list-card-header .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .add-emp-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .form-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .form-input {
          padding: 10px 14px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(12, 35, 64, 0.08);
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          padding-right: 36px;
          cursor: pointer;
        }

        .file-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px dashed var(--border-color);
          padding: 10px;
          border-radius: var(--radius-sm);
          background-color: var(--bg-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .file-input-wrapper:hover {
          border-color: var(--primary);
          color: var(--primary);
          background-color: rgba(12, 35, 64, 0.02);
        }

        .file-input-hidden {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .photo-preview-container {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: white;
        }

        .photo-preview-image {
          width: 50px;
          height: 60px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .btn-preview-delete {
          font-size: 0.8rem;
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .form-textarea {
          resize: vertical;
        }

        .form-feedback-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .form-feedback-message.success {
          background-color: rgba(16, 185, 129, 0.08);
          color: var(--accent);
          border: 1px solid rgba(16, 185, 129, 0.15);
        }

        .form-feedback-message.error {
          background-color: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }

        /* Employee Directory Card Display */
        .btn-refresh-list {
          padding: 8px;
        }

        .error-list-box, .empty-list-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          text-align: center;
          color: var(--text-secondary);
        }

        .employee-list-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          max-height: 520px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .admin-emp-card {
          display: flex;
          gap: 12px;
          padding: 12px;
          background-color: white;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          position: relative;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }

        .admin-emp-card:hover {
          box-shadow: var(--shadow-md);
        }

        .admin-emp-photo {
          width: 60px;
          height: 80px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
        }

        .admin-emp-placeholder {
          width: 60px;
          height: 80px;
          border-radius: var(--radius-sm);
          background-color: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-light);
          flex-shrink: 0;
        }

        .admin-emp-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          flex-grow: 1;
          padding-right: 20px;
        }

        .admin-emp-name {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1rem;
          color: var(--primary);
          line-height: 1.2;
          margin-bottom: 2px;
        }

        .admin-emp-role {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .admin-emp-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 4px;
        }

        .badge-category-director {
          background-color: rgba(12, 35, 64, 0.08);
          color: var(--primary);
        }

        .badge-category-secretary {
          background-color: rgba(217, 155, 38, 0.08);
          color: var(--secondary-dark);
        }

        .badge-category-employee {
          background-color: rgba(16, 185, 129, 0.08);
          color: var(--accent);
        }

        .admin-emp-contact-text {
          display: flex;
          flex-direction: column;
          margin-top: 6px;
        }

        .small-contact {
          font-size: 0.75rem;
          color: var(--text-light);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }

        .btn-delete-emp {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .btn-delete-emp:hover {
          background-color: rgba(239, 68, 68, 0.08);
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
          max-width: 100%;
          white-space: pre-wrap;
          word-break: break-all;
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
          text-align: left;
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
          text-align: left;
        }

        @media (max-width: 992px) {
          .admin-management-layout {
            grid-template-columns: 1fr;
          }
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

        @media (max-width: 576px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .employee-list-grid {
            grid-template-columns: 1fr;
          }
          .admin-tab-nav-panel {
            padding: 12px 16px;
          }
          .tab-toggle-btn {
            padding: 8px 12px;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .admin-hero {
            padding: 60px 0;
          }
          .admin-top-grid {
            margin-bottom: 20px;
          }
          .instructions-list {
            padding-left: 16px;
            font-size: 0.85rem;
          }
          .inquiry-logs-section {
            padding: 24px 16px;
          }
          .logs-header h3 {
            font-size: 1.25rem;
          }
          .logs-actions {
            flex-direction: column;
            gap: 8px;
          }
          .sender-profile {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }
          .sender-email {
            margin-left: 0;
            font-size: 0.85rem;
            word-break: break-all;
          }
          .log-meta {
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 4px;
          }
          .inquiry-log-card {
            padding: 16px;
          }
          .log-subject-row {
            font-size: 0.9rem;
          }
          .log-message-box {
            padding: 10px 12px;
            font-size: 0.9rem;
          }
          .login-card {
            padding: 30px 20px;
          }
          .panel-form-card, .panel-list-card {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
};
export default AdminDemo;
