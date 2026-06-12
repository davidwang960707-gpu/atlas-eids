import React from 'react';
import './WorkflowTimeline.css';

type TimelineStatus = 'done' | 'running' | 'pending' | 'blocked';

interface Step {
  label: string;
  status: TimelineStatus;
  text: string;
}

interface WorkflowTimelineProps {
  title: string;
  steps: Step[];
}

const labelMap: Record<TimelineStatus, string> = {
  done: '已完成',
  running: '进行中',
  pending: '待开始',
  blocked: '受阻'
};

const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ title, steps }) => {
  return (
    <section className="workflow-timeline" aria-label={title}>
      <header className="workflow-timeline__header">
        <span className="metric-strip__label">Workflow Monitor</span>
        <h3>{title}</h3>
      </header>
      <div className="workflow-timeline__list">
        {steps.map((step) => (
          <article className="timeline-item" key={step.label}>
            <div className={`timeline-dot timeline-dot--${step.status}`}></div>
            <div>
              <p className="timeline-item__label">{step.label}</p>
              <p className="timeline-item__text">{step.text}</p>
            </div>
            <strong className={`timeline-item__state timeline-item__state--${step.status}`}>{labelMap[step.status]}</strong>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WorkflowTimeline;
