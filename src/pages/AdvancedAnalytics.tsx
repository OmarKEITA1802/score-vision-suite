import React from 'react';
import { ResponsiveLayout } from '@/components/Mobile/ResponsiveLayout';
import { AdvancedCharts } from '@/components/Dashboard/AdvancedCharts';

const AdvancedAnalytics = () => {
  return (
    <ResponsiveLayout title="Analyses Avancées">
      <AdvancedCharts />
    </ResponsiveLayout>
  );
};

export default AdvancedAnalytics;