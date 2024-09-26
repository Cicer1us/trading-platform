import React, { useEffect, useRef, useState } from 'react';
import { NumberInput } from '../Inputs/Inputs';

interface DebounceInputProps {
  decimalScale?: number;
  value: number | null;
  onChange: (input: number | null) => void;
  error?: string;
  setLoading?: (loading: boolean) => void;
  debounceInterval: number;
  disabled?: boolean;
}

export const DebounceInput = ({
  decimalScale = 4,
  value,
  onChange,
  error = '',
  setLoading = () => null,
  debounceInterval = 500,
  disabled,
}: DebounceInputProps) => {
  const [inputValue, setInputValue] = useState<number | null>(value);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const updateInput = (currentValue: number | null = null) => {
    if (timer.current) clearTimeout(timer.current);
    if (currentValue !== inputValue) {
      if (currentValue) {
        setLoading(true);
        setInputValue(currentValue);

        timer.current = setTimeout(() => {
          onChange(currentValue);
        }, debounceInterval);
      } else {
        setInputValue(currentValue);
        onChange(currentValue);
      }
    }
  };

  useEffect(() => {
    // if parents value differs from current
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  return (
    <NumberInput
      disabled={disabled}
      maxLength={14}
      decimalScale={decimalScale}
      value={inputValue === null ? value : inputValue}
      onChange={updateInput}
      error={error}
    />
  );
};
