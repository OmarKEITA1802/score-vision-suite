import React from 'react';
import { ResponsiveLayout } from '@/components/Mobile/ResponsiveLayout';
import { DragDropDemo } from '@/components/ui/drag-drop-demo';

const DragDropPage = () => {
  return (
    <ResponsiveLayout title="Drag & Drop">
      <DragDropDemo />
    </ResponsiveLayout>
  );
};

export default DragDropPage;