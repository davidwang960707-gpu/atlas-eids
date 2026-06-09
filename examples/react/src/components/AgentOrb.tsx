import React from 'react';
import './AgentOrb.css';

export type OrbState = 'idle' | 'thinking' | 'running' | 'error';

interface AgentOrbProps {
  state?: OrbState;
  size?: number;
  showRing?: boolean;
}

const AgentOrb: React.FC<AgentOrbProps> = ({
  state = 'idle',
  size = 80,
  showRing = true
}) => {
  const orbStyle = {
    width: size,
    height: size,
    '--orb-size': `${size}px`
  } as React.CSSProperties;

  return (
    <div
      className={`orb-wrapper state-${state}`}
      style={orbStyle}
    >
      <div className="orb-atmosphere"></div>
      {showRing && (
        <>
          <div className="orb-ring orb-ring-primary"></div>
          <div className="orb-ring orb-ring-secondary"></div>
        </>
      )}
      <div className="orb">
        <div className="orb-liquid"></div>
      </div>
    </div>
  );
};

export default AgentOrb;
