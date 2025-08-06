import React from 'react';
import { ResponsiveLayout } from '@/components/Mobile/ResponsiveLayout';
import { AnimationShowcase } from '@/components/ui/animation-showcase';

const AnimationDemo = () => {
  return (
    <ResponsiveLayout title="Animations">
      <AnimationShowcase />
    </ResponsiveLayout>
  );
};

export default AnimationDemo;