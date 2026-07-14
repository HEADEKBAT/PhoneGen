'use client';

import { useState } from 'react';

interface ColorPickerProps {
  hex: string;
  onChange: (hex: string) => void;
  label?: string;
  className?: string;
}

export function ColorPicker({ hex, onChange, label, className = '' }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(hex);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      onChange(val);
    }
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <input
          type="color"
          value={hex}
          onChange={handleNativeChange}
          className="absolute inset-0 size-10 cursor-pointer opacity-0"
          aria-label={label || 'Pick color'}
        />
        <div
          className="size-10 rounded-lg border border-border/50 cursor-pointer"
          style={{ backgroundColor: hex }}
        />
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="flex-1 h-9 px-3 text-xs font-mono bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="#000000"
        maxLength={7}
      />
    </div>
  );
}
