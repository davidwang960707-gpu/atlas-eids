import React from 'react';
import './NeuralInput.css';

interface NeuralInputProps {
  value?: string;
  placeholder?: string;
  mention?: string;
  onChange?: (value: string) => void;
}

const NeuralInput: React.FC<NeuralInputProps> = ({
  value = '',
  placeholder = '输入您的问题...',
  mention,
  onChange
}) => {
  return (
    <div className="neural-input">
      <div className="input-orb">
        <span></span>
      </div>
      <label className="input-text">
        {mention && <span className="mention">@{mention}</span>}
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange?.(event.target.value)}
        />
      </label>
      <button className="magic-action" type="button" aria-label="AI assist">
        AI
      </button>
    </div>
  );
};

export default NeuralInput;
