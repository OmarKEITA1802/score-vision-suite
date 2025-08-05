import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScoreChart } from './ScoreChart';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, FileText, CreditCard, AlertCircle, Plus, LogOut } from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const myScore = 72; // Simulation du score client
  const lastApplications = [
    { date: '2024-01-15', amount: 25000, status: 'APPROVED', score: 85 },
    { date: '2023-11-20', amount: 15000, status: 'APPROVED', score: 78 }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bonjour {user?.firstName} !</h1>
            <p className="text-muted-foreground mt-1">Voici un aperçu de votre profil crédit</p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Score principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="fintech-card-premium lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Votre Score Crédit
            </CardTitle>
            <CardDescription>Évaluation de votre solvabilité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="8" 
                    fill="none"
                    strokeDasharray={`${myScore * 2.51} 251`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{myScore}%</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <Badge variant="default" className="bg-success">Profil Solide</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Votre score vous qualifie pour des crédits avantageux
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="fintech-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Demandes</p>
                  <p className="text-xl font-bold">{lastApplications.length}</p>
                </div>
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="fintech-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dernière évaluation</p>
                  <p className="text-xl font-bold text-success">85%</p>
                </div>
                <CreditCard className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>

          <Button className="w-full btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {/* Historique et recommandations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreChart 
          title="Évolution de votre score"
          description="Progression de votre solvabilité"
        />
        
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
            <CardDescription>Conseils pour améliorer votre profil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-success">Excellent profil</p>
                <p className="text-sm text-muted-foreground">Continuez à maintenir vos bonnes habitudes financières</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};