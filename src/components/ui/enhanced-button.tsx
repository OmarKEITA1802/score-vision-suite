import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FloatingElement, WiggleElement } from './loading-animations';

interface EnhancedButtonProps extends ButtonProps {
  animation?: 'none' | 'hover-lift' | 'glow' | 'shimmer' | 'float' | 'wiggle';
  ripple?: boolean;
  loading?: boolean;
  glowColor?: 'primary' | 'success' | 'warning' | 'destructive';
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  className,
  animation = 'hover-lift',
  ripple = false,
  loading = false,
  glowColor = 'primary',
  disabled,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled && !loading) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }
    
    if (onClick && !disabled && !loading) {
      onClick(e);
    }
  };

  const getAnimationClasses = () => {
    const classes: string[] = [];
    
    switch (animation) {
      case 'hover-lift':
        classes.push('hover-lift');
        break;
      case 'glow':
        classes.push('hover-glow');
        break;
      case 'shimmer':
        classes.push('btn-animated');
        break;
      default:
        break;
    }
    
    if (loading) {
      classes.push('animate-pulse');
    }
    
    return classes.join(' ');
  };

  const ButtonContent = () => (
    <Button
      {...props}
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden',
        getAnimationClasses(),
        className
      )}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none animate-ping rounded-full bg-white/30"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
      
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Chargement...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );

  if (animation === 'float') {
    return (
      <FloatingElement>
        <ButtonContent />
      </FloatingElement>
    );
  }

  if (animation === 'wiggle') {
    return (
      <WiggleElement trigger="hover">
        <ButtonContent />
      </WiggleElement>
    );
  }

  return <ButtonContent />;
};