import React from 'react';
import './AgentCard.css';

interface AgentCardProps {
  title: string;
  subtitle?: string;
  description: string;
  tags?: string[];
  status?: 'online' | 'offline' | 'busy';
}

const AgentCard: React.FC<AgentCardProps> = ({
  title,
  subtitle,
  description,
  tags = [],
  status = 'online'
}) => {
  return (
    <div className="agent-card">
      <div className="card-header">
        <div className="card-orb"></div>
        {status && (
          <div className={`status-badge status-${status}`}>
            <div className="status-dot"></div>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {subtitle && <div className="card-subtitle">{subtitle}</div>}
        <p className="card-desc">{description}</p>
        {tags.length > 0 && (
          <div className="card-tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCard;
