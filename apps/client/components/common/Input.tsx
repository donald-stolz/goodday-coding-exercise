import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  containerClassName = '',
  inputClassName = '',
  labelClassName = '',
  ...rest
}) => {
  return (
    <div className={` ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block font-medium mb-1 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`h-10 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-base-300 ${inputClassName}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-label={label}
        tabIndex={0}
        {...rest}
      />
    </div>
  );
};

export default Input;
