import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { Loader2, Maximize2, X, Image as ImageIcon } from 'lucide-react';

interface GalleryItem {
  _id?: string;
  title?: string;
  description?: string;
  imageUrl: string;
  createdAt?: string | Date;
}

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${API_URL}/api/gallery`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setItems(json.data);
          }
        }
      } catch (err) {
        console.log("Backend offline, using fallback data.");
        setItems([
          {
            _id: 'fallback_1',
            title: "Educational Support Distribution",
            description: "Providing learning materials and kits to children at community centers.",
            imageUrl: "/wall1.jpg"
          },
          {
            _id: 'fallback_2',
            title: "Community Outreach",
            description: "Helping build robust community operations and supportive networks.",
            imageUrl: "/mrs.chandni chauhan.jpeg"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div className="gallery-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="bg-glow-blob blob-primary" style={{ top: '6%', left: '-15%' }}></div>
      <div className="bg-glow-blob blob-secondary" style={{ top: '35%', right: '-12%' }}></div>
      <div className="bg-glow-blob blob-primary" style={{ bottom: '15%', left: '-10%' }}></div>

      {/* Hero Header */}
      <section className="gallery-hero hero-wallpaper-bg">
        <div className="container text-center">
          <span className="sub-tag">OUR ARCHIVE</span>
          <h1 className="sub-title">Resource & Activity Gallery</h1>
          <p className="sub-desc">A visual showcase of community operations, educational seminars, and field workshops.</p>
        </div>
      </section>

      {/* Showcase Grid */}
      <section className="section gallery-body">
        <div className="container">
          {loading ? (
            <div className="loader-container">
              <Loader2 className="spinner" size={40} />
              <p>Loading photo archive...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-gallery text-center">
              <ImageIcon size={60} className="empty-icon" />
              <h3>No Gallery Images Found</h3>
              <p>Upload new photos via the admin console to display them here.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {items.map((item, idx) => (
                <div 
                  key={item._id || idx} 
                  className="gallery-item-wrapper animate-slide-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="gallery-card glass-card">
                    <div className="gallery-photo-box">
                      <img src={item.imageUrl} alt={item.title || "Gallery Item"} className="gallery-img" />
                      <div className="gallery-hover-overlay">
                        <div className="zoom-icon-box">
                          <Maximize2 size={20} />
                        </div>
                      </div>
                    </div>
                    
                    {(item.title || item.description) && (
                      <div className="gallery-info">
                        <h3 className="gallery-name">{item.title || "Activity Showcase"}</h3>
                        <p className="gallery-designation">{item.description ? (item.description.length > 50 ? `${item.description.substring(0, 50)}...` : item.description) : ""}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox / Modal */}
      {selectedItem && (
        <div className="lightbox-overlay" onClick={() => setSelectedItem(null)}>
          <div className="lightbox-modal glass-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setSelectedItem(null)}>
              <X size={24} />
            </button>
            
            <div className="lightbox-content-grid">
              <div className="lightbox-image-column">
                <img src={selectedItem.imageUrl} alt={selectedItem.title || "Gallery Item"} className="lightbox-big-img" />
              </div>
              
              <div className="lightbox-info-column">
                <span className="lightbox-tag badge-category-employee">
                  GALLERY IMAGE
                </span>
                <h2 className="lightbox-name">{selectedItem.title || "Activity Showcase"}</h2>
                
                {selectedItem.description && (
                  <div className="lightbox-bio-section" style={{ marginTop: '16px' }}>
                    <h5>Description</h5>
                    <p className="lightbox-bio-text">{selectedItem.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gallery-page {
          padding-top: 80px;
          min-height: 100vh;
        }

        .gallery-hero {
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
          padding: 80px 0;
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

        .empty-gallery {
          padding: 80px 20px;
          color: var(--text-secondary);
        }

        .empty-icon {
          color: var(--text-light);
          margin-bottom: 16px;
        }

        /* Showcase Grid styling */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-top: 20px;
        }

        @media (max-width: 1200px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            max-width: 320px;
            margin: 0 auto;
          }
        }

        .gallery-item-wrapper {
          cursor: pointer;
        }

        .gallery-card {
          padding: 0;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-sm);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gallery-item-wrapper:hover .gallery-card {
          transform: translateY(-8px);
          box-shadow: var(--shadow-md);
          border-color: var(--secondary);
        }

        .gallery-photo-box {
          position: relative;
          width: 100%;
          height: 260px;
          overflow: hidden;
          background-color: var(--bg-tertiary);
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gallery-item-wrapper:hover .gallery-img {
          transform: scale(1.06);
        }

        .gallery-hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(12, 35, 64, 0.4) 0%, rgba(12, 35, 64, 0) 100%);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.3s ease;
        }

        .gallery-item-wrapper:hover .gallery-hover-overlay {
          opacity: 1;
        }

        .zoom-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--bg-glass);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          box-shadow: var(--shadow-sm);
          transform: scale(0.8);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gallery-item-wrapper:hover .zoom-icon-box {
          transform: scale(1);
        }

        .gallery-info {
          padding: 20px;
          text-align: center;
          background-color: white;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .gallery-name {
          font-size: 1.15rem;
          color: var(--primary-dark);
          margin-bottom: 4px;
          line-height: 1.3;
          font-family: var(--font-heading);
          font-weight: 700;
        }

        .gallery-designation {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Lightbox popup styling */
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
          max-width: 800px;
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
          grid-template-columns: 1.2fr 1fr;
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
          height: 360px;
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
        }

        .badge-category-employee {
          background-color: var(--accent);
        }

        .lightbox-name {
          font-size: 1.6rem;
          color: var(--primary-dark);
          margin-bottom: 4px;
          font-family: var(--font-heading);
          font-weight: 800;
        }

        .lightbox-bio-section {
          width: 100%;
        }

        .lightbox-bio-section h5 {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--text-light);
          letter-spacing: 1px;
          margin-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 4px;
        }

        .lightbox-bio-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};
export default Gallery;
