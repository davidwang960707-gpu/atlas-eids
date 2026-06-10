import React from 'react';
import './InsightPanel.css';

type InsightLevel = 'success' | 'warning' | 'info';

interface InsightItem {
  label: string;
  value: string;
  level: InsightLevel;
}

interface InsightPanelProps {
  title: string;
  summary: string;
  confidence: number;
  items: InsightItem[];
}

const levelText: Record<InsightLevel, string> = {
  success: '已确认',
  warning: '需复核',
  info: '建议'
};

const InsightPanel: React.FC<InsightPanelProps> = ({
  title,
  summary,
  confidence,
  items
}) => {
  return (
    <div className="insight-panel">
      <div className="insight-panel__header">
        <div>
          <span className="insight-panel__eyebrow">AI Insight</span>
          <h3>{title}</h3>
        </div>
        <div className="insight-panel__score" aria-label={`置信度 ${confidence}%`}>
          <span>{confidence}%</span>
          <small>置信度</small>
        </div>
      </div>

      <p className="insight-panel__summary">{summary}</p>

      <div className="insight-panel__meter">
        <div style={{ width: `${confidence}%` }} />
      </div>

      <div className="insight-panel__grid">
        {items.map((item) => (
          <article className={`insight-item insight-item--${item.level}`} key={item.label}>
            <div className="insight-item__meta">
              <span className="insight-item__dot" />
              {levelText[item.level]}
            </div>
            <strong>{item.label}</strong>
            <p>{item.value}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default InsightPanel;
