import '../stylesheets/PosButton.css';
import type React from 'react';

interface PosButtonProps {
  className?: string;
  icon?: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

function PosButton(prop: PosButtonProps) {
  return (
    <button 
      disabled={prop.disabled ? prop.disabled : false}
      className={`primary-button ${prop.className ? prop.className : ""}`.trim()} 
      onClick={prop.onClick}>
      {
        prop.icon 
        ?
          <div className="trailing-icon">{prop.icon}</div>
        :
        <></>
      }
      {prop.label}
    </button>
  );
}

export default PosButton;