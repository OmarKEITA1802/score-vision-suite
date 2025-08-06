import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingDotsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  className, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn('animate-dots', sizeClasses[size], className)}>
      <span>●</span>
    </div>
  );
};

interface ShimmerProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({ 
  className, 
  width = 'w-full', 
  height = 'h-4' 
}) => {
  return (
    <div 
      className={cn(
        'skeleton-shimmer bg-muted rounded',
        width,
        height,
        className
      )}
    />
  );
};

interface PulseLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success';
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({ 
  className, 
  size = 'md',
  color = 'primary'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    success: 'border-success'
  };

  return (
    <div 
      className={cn(
        'rounded-full border-2 border-transparent animate-glow-pulse',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'normal' | 'strong';
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className,
  intensity = 'normal'
}) => {
  const intensityClasses = {
    subtle: 'animate-float',
    normal: 'animate-float',
    strong: 'animate-bounce-in'
  };

  return (
    <div className={cn(intensityClasses[intensity], className)}>
      {children}
    </div>
  );
};

interface WiggleElementProps {
  children: React.ReactNode;
  className?: string;
  trigger?: 'hover' | 'auto';
}

export const WiggleElement: React.FC<WiggleElementProps> = ({
  children,
  className,
  trigger = 'hover'
}) => {
  return (
    <div 
      className={cn(
        trigger === 'hover' ? 'hover:animate-wiggle' : 'animate-wiggle',
        className
      )}
    >
      {children}
    </div>
  );
};