'use client';

import { Eye, EyeOff } from 'lucide-react';

interface LockButtonProps {
  locked: boolean;
  onToggle: () => void;
  className?: string;
}

export function LockButton({ locked, onToggle, className = '' }: LockButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center justify-center size-7 rounded-md transition-colors ${
        locked
          ? 'bg-primary/20 text-primary'
          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
      } ${className}`}
      title={locked ? 'Unlock color' : 'Lock color'}
    >
      {locked ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  );
}
