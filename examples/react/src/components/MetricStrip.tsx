import React from 'react';
import './MetricStrip.css';

interface Metric {
  label: string;
  value: string;
  delta?: string;
}

interface MetricStripProps {
  title: string;
  metrics: Metric[];
}

const MetricStrip: React.FC<MetricStripProps> = ({ title, metrics }) => {
  return (
    <section className="metric-strip" aria-label={title}>
      <header className="metric-strip__header">
        <span className="metric-strip__label">Metric Overview</span>
        <h3>{title}</h3>
      </header>
      <div className="metric-strip__grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <p className="metric-card__label">{metric.label}</p>
            <strong className="metric-card__value">{metric.value}</strong>
            {metric.delta && <p className="metric-card__delta">{metric.delta}</p>}
          </article>
        ))}
      </div>
    </section>
  );
};

export default MetricStrip;
