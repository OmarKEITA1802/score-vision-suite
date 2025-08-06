import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface DraggableProps {
  id: string;
  index: number;
  children: React.ReactNode;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  className?: string;
  disabled?: boolean;
  dragHandle?: boolean;
}

export const Draggable: React.FC<DraggableProps> = ({
  id,
  index,
  children,
  onMove,
  onDragStart,
  onDragEnd,
  className,
  disabled = false,
  dragHandle = false
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) return;
    
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, index }));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled) return;
    
    // Vérifier si on quitte vraiment l'élément
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsDraggedOver(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsDraggedOver(false);
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const dragIndex = dragData.index;
      
      if (dragIndex !== index) {
        onMove(dragIndex, index);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  return (
    <div
      ref={ref}
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'transition-all duration-200',
        {
          'opacity-50 scale-95': isDragging,
          'ring-2 ring-primary ring-offset-2': isDraggedOver,
          'cursor-move': !disabled && !dragHandle,
          'cursor-not-allowed opacity-50': disabled,
        },
        className
      )}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-grabbed={isDragging}
    >
      {children}
    </div>
  );
};

interface DroppableProps {
  children: React.ReactNode;
  onDrop?: (data: any) => void;
  className?: string;
  acceptedTypes?: string[];
}

export const Droppable: React.FC<DroppableProps> = ({
  children,
  onDrop,
  className,
  acceptedTypes = []
}) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      onDrop?.(data);
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'transition-all duration-200',
        {
          'bg-primary/10 border-2 border-dashed border-primary': isDraggedOver,
        },
        className
      )}
    >
      {children}
    </div>
  );
};