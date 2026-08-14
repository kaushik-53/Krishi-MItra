import { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
    return (<div className="input-wrapper">
        {label && (<label htmlFor={inputId} className="input-label">
            {label}
          </label>)}
        <div className="input-container">
          {leftIcon && (<div className="input-icon-left">
              {leftIcon}
            </div>)}
          <input ref={ref} id={inputId} className={`
              glass-input
              ${leftIcon ? 'input-field-left-pad' : ''}
              ${rightIcon ? 'input-field-right-pad' : ''}
              ${error ? 'input-error-border' : ''}
              ${className}
            `} aria-invalid={!!error} aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined} {...props}/>
          {rightIcon && (<div className="input-icon-right">
              {rightIcon}
            </div>)}
        </div>
        {error && (<p id={`${inputId}-error`} className="input-error-text" role="alert">
            {error}
          </p>)}
        {helperText && !error && (<p id={`${inputId}-helper`} className="input-helper-text">
            {helperText}
          </p>)}
      </div>);
});
Input.displayName = 'Input';
export default Input;
