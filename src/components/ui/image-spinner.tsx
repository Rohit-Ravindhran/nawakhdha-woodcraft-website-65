import React from 'react';
import { cn } from '@/lib/utils';

interface ImageSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ImageSpinner({ className, size = 'md' }: ImageSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn(
      "flex items-center justify-center w-full h-full min-h-[100px] bg-muted/50",
      className
    )}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size]
      )} />
    </div>
  );
}