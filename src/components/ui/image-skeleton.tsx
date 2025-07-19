import React from 'react';
import { cn } from '@/lib/utils';
import { ImageSpinner } from '@/components/ui/image-spinner';

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: string;
  rounded?: boolean;
}

export function ImageSkeleton({ 
  className, 
  aspectRatio = "aspect-video", 
  rounded = false 
}: ImageSkeletonProps) {
  return (
    <div className={cn(
      "w-full",
      aspectRatio,
      rounded && "rounded-lg",
      className
    )}>
      <ImageSpinner />
    </div>
  );
}

interface ImageLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  aspectRatio?: string;
  rounded?: boolean;
}

export function ImageLoader({ 
  isLoading, 
  children, 
  className, 
  aspectRatio, 
  rounded 
}: ImageLoaderProps) {
  if (isLoading) {
    return <ImageSkeleton className={className} aspectRatio={aspectRatio} rounded={rounded} />;
  }
  
  return <>{children}</>;
}