import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label?: string;
  options: SelectOption[];
  containerClassName?: string;
  selectClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  required,
  disabled,
  containerClassName = '',
  selectClassName = '',
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
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`h-10 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-base-300 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${selectClassName}`}
        aria-label={label}
        tabIndex={0}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
