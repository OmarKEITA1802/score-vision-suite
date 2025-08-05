import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { AgentDashboard } from '@/components/Dashboard/AgentDashboard';
import { ClientDashboard } from '@/components/Dashboard/ClientDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'agent':
      return <AgentDashboard />;
    case 'client':
      return <ClientDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Rôle non reconnu</h1>
            <p className="text-muted-foreground">Contactez l'administrateur</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;