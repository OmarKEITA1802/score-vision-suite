import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'fade-in-left' | 'fade-in-right' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'bounce' | 'rotate';
  delay?: number;
  duration?: number;
  stagger?: boolean;
  className?: string;
  trigger?: 'mount' | 'scroll' | 'hover';
  threshold?: number;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = 'fade-in',
  delay = 0,
  duration = 300,
  stagger = false,
  className,
  trigger = 'mount',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(trigger === 'mount');
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger === 'scroll') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }
  }, [trigger, threshold]);

  const getAnimationClass = () => {
    const shouldAnimate = trigger === 'mount' || 
                         (trigger === 'scroll' && isVisible) || 
                         (trigger === 'hover' && isHovered);

    if (!shouldAnimate) return '';

    const animationMap = {
      'fade-in': 'animate-fade-in',
      'fade-in-up': 'animate-fade-in-up',
      'fade-in-down': 'animate-fade-in-down',
      'fade-in-left': 'animate-fade-in-left',
      'fade-in-right': 'animate-fade-in-right',
      'slide-up': 'animate-fade-in-up',
      'slide-down': 'animate-fade-in-down',
      'slide-left': 'animate-fade-in-left',
      'slide-right': 'animate-fade-in-right',
      'scale': 'animate-scale-in',
      'bounce': 'animate-scale-in-bounce',
      'rotate': 'animate-rotate-in'
    };

    return animationMap[animation];
  };

  const containerProps = {
    ref: containerRef,
    className: cn(
      getAnimationClass(),
      stagger && 'stagger-fade-in',
      className
    ),
    style: {
      animationDelay: `${delay}ms`,
      animationDuration: `${duration}ms`,
      ...((trigger === 'scroll' && !isVisible) && {
        opacity: 0
      })
    },
    ...(trigger === 'hover' && {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false)
    })
  };

  return (
    <div {...containerProps}>
      {children}
    </div>
  );
};