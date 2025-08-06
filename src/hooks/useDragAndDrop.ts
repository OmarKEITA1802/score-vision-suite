import { useState, useRef, useCallback } from 'react';

export interface DragItem {
  id: string;
  index: number;
  type?: string;
}

export interface DropResult {
  dragIndex: number;
  hoverIndex: number;
  dragId: string;
  hoverId: string;
}

export const useDragAndDrop = <T extends { id: string }>(
  initialItems: T[],
  onReorder?: (items: T[], result: DropResult) => void
) => {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<T | null>(null);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const draggedItem = newItems[dragIndex];
      
      // Supprimer l'élément de sa position actuelle
      newItems.splice(dragIndex, 1);
      // L'insérer à sa nouvelle position
      newItems.splice(hoverIndex, 0, draggedItem);

      const result: DropResult = {
        dragIndex,
        hoverIndex,
        dragId: draggedItem.id,
        hoverId: newItems[hoverIndex === 0 ? 1 : hoverIndex - 1]?.id || ''
      };

      onReorder?.(newItems, result);
      return newItems;
    });
  }, [onReorder]);

  const startDrag = useCallback((item: T) => {
    setIsDragging(true);
    setDraggedItem(item);
  }, []);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    setDraggedItem(null);
  }, []);

  return {
    items,
    setItems,
    moveItem,
    isDragging,
    draggedItem,
    startDrag,
    endDrag
  };
};