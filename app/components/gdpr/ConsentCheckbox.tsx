'use client';

import React from 'react';

interface ConsentCheckboxProps {
  id: string;
  checked: boolean;
  required?: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function ConsentCheckbox({
  id,
  checked,
  required = false,
  onChange,
  children,
  className = '',
}: ConsentCheckboxProps) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <input
        type="checkbox"
        id={id}
        required={required}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 text-orange-500 rounded border-zinc-700 focus:ring-orange-500 focus:ring-offset-zinc-900"
      />
      <label htmlFor={id} className="text-zinc-300 leading-relaxed text-sm">
        {children}
      </label>
    </div>
  );
}
