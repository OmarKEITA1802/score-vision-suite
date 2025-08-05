import React from 'react';
import { ResponsiveLayout } from '@/components/Mobile/ResponsiveLayout';
import { RoleManagementSystem } from '@/components/RoleManagement/RoleManagementSystem';

const AdminDashboard = () => {
  return (
    <ResponsiveLayout title="Administration">
      <RoleManagementSystem />
    </ResponsiveLayout>
  );
};

export default AdminDashboard;