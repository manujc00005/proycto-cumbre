'use client';

import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DisclosureBoxProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DisclosureBox({
  title,
  subtitle,
  defaultOpen = false,
  icon,
  children,
  className = '',
}: DisclosureBoxProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className={`rounded-lg border ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="w-full p-4 flex items-start gap-3 text-left transition-colors rounded-lg"
      >
        <div
          className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <ChevronDown className="w-5 h-5" />
        </div>

        {icon ? <div className="w-5 h-5 flex-shrink-0 mt-0.5">{icon}</div> : null}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{title}</p>
          {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
        </div>
      </button>

      {open && (
        <div id={contentId} className="px-4 pb-4 pt-2 border-t">
          {children}
        </div>
      )}
    </div>
  );
}
