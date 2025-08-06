import { useState, useEffect, useRef } from 'react';

interface UseAnimationOptions {
  trigger?: 'mount' | 'scroll' | 'hover';
  threshold?: number;
  delay?: number;
  stagger?: boolean;
}

export const useAnimation = ({
  trigger = 'mount',
  threshold = 0.1,
  delay = 0,
  stagger = false
}: UseAnimationOptions = {}) => {
  const [isVisible, setIsVisible] = useState(trigger === 'mount');
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (trigger === 'scroll' && elementRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold }
      );

      observer.observe(elementRef.current);

      return () => observer.disconnect();
    }
  }, [trigger, threshold]);

  useEffect(() => {
    if (delay > 0 && trigger === 'mount') {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay, trigger]);

  const animationProps = {
    ref: elementRef as any,
    style: {
      ...(trigger === 'scroll' && !isVisible && { opacity: 0 }),
      ...(delay > 0 && { animationDelay: `${delay}ms` })
    },
    ...(trigger === 'hover' && {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false)
    })
  };

  const shouldAnimate = trigger === 'mount' || 
                       (trigger === 'scroll' && isVisible) || 
                       (trigger === 'hover' && isHovered);

  return {
    isVisible: shouldAnimate,
    isHovered,
    animationProps,
    elementRef
  };
};

export const useStaggeredAnimation = (itemCount: number, baseDelay = 100) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timers = Array.from({ length: itemCount }, (_, index) => 
      setTimeout(() => {
        setVisibleItems(prev => new Set(prev).add(index));
      }, index * baseDelay)
    );

    return () => timers.forEach(clearTimeout);
  }, [itemCount, baseDelay]);

  return visibleItems;
};

export const useScrollAnimation = (threshold = 0.1) => {
  const [elements, setElements] = useState<Map<string, boolean>>(new Map());
  
  const observeElement = (id: string, element: HTMLElement) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setElements(prev => new Map(prev).set(id, entry.isIntersecting));
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  };

  return { elements, observeElement };
};