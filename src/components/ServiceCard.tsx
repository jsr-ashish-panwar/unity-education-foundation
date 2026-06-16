import React from 'react';
import { Check } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  points: string[];
  delay?: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, points, delay }) => {
  return (
    <div 
      className="service-card glass-card animate-slide-up"
      style={{ animationDelay: delay ? `${delay}ms` : undefined }}
    >
      <div className="service-card-header">
        <div className="service-icon-wrapper">
          {icon}
        </div>
        <h3 className="service-card-title">{title}</h3>
      </div>
      <p className="service-card-desc">{description}</p>
      
      <div className="service-points-divider"></div>
      
      <ul className="service-points-list">
        {points.map((point, index) => (
          <li key={index} className="service-point-item">
            <Check size={16} className="service-check-icon" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <style>{`
        .service-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          border-top: 4px solid var(--primary);
        }

        .service-card:hover {
          border-top-color: var(--secondary);
        }

        .service-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .service-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          background-color: rgba(12, 35, 64, 0.05);
          color: var(--primary);
          transition: var(--transition-normal);
        }

        .service-card:hover .service-icon-wrapper {
          background-color: var(--secondary);
          color: var(--text-white);
          transform: scale(1.05);
        }

        .service-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
        }

        .service-card-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 20px;
          flex-grow: 1;
        }

        .service-points-divider {
          height: 1px;
          background-color: var(--border-color);
          margin-bottom: 16px;
          width: 100%;
        }

        .service-points-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .service-point-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .service-check-icon {
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};
export default ServiceCard;
