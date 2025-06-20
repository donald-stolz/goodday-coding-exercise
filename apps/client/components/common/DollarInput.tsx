import React, { useState, useEffect, FocusEvent } from 'react';
import Input from './Input';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
}

interface DollarInputProps
  extends Omit<InputProps, 'value' | 'onChange' | 'type'> {
  value: number | '';
  onChange: (value: number | '') => void;
}

const formatDollar = (value: number | ''): string => {
  if (value === '' || isNaN(Number(value))) return '';
  return `$${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const parseDollar = (str: string): number | '' => {
  const cleaned = str.replace(/[^\d.]/g, '');
  if (!cleaned) return '';
  const num = parseFloat(cleaned);
  return isNaN(num) ? '' : num;
};

const DollarInput: React.FC<DollarInputProps> = ({
  value,
  onChange,
  onBlur,
  onFocus,
  id,
  ...rest
}) => {
  const [displayValue, setDisplayValue] = useState<string>(
    value === '' ? '' : String(value)
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value === '' ? '' : formatDollar(value));
    } else {
      setDisplayValue(value === '' ? '' : String(value));
    }
  }, [value, isFocused]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setDisplayValue(value === '' ? '' : String(value));
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setDisplayValue(value === '' ? '' : formatDollar(value));
    if (onBlur) onBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const parsed = parseDollar(input);
    setDisplayValue(input);
    onChange(parsed);
  };

  return (
    <Input
      {...rest}
      id={id}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={rest.placeholder || '$0.00'}
      inputMode="decimal"
    />
  );
};

export default DollarInput;
