import React from 'react';
import './StreamBlock.css';

interface StreamBlockProps {
  header?: string;
  content: React.ReactNode;
  isStreaming?: boolean;
}

const StreamBlock: React.FC<StreamBlockProps> = ({
  header = 'Atlas · 正在生成',
  content,
  isStreaming = true
}) => {
  return (
    <div className="stream-block">
      <div className="stream-header">
        {isStreaming && <div className="dot"></div>}
        {header}
      </div>
      <div className="stream-content">{content}</div>
    </div>
  );
};

export default StreamBlock;
