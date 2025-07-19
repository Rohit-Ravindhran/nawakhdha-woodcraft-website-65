import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'center' | 'inline';
}

export function PageLoader({ 
  className, 
  size = 'md', 
  text = "Loading...", 
  variant = 'center' 
}: PageLoaderProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = {
    center: 'min-h-[50vh] flex flex-col items-center justify-center',
    inline: 'flex items-center justify-center py-8'
  };

  return (
    <div className={cn(containerClasses[variant], className)}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );
}