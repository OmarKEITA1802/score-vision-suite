import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Common/Header';
import { ScoreChart } from './ScoreChart';
import { PerformanceChart } from './PerformanceChart';
import { ClientList } from '../Credit/ClientList';
import { useApi } from '@/hooks/useApi';
import { creditService } from '@/services/creditService';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  FileText,
  AlertTriangle,
  Plus
} from 'lucide-react';

export const AgentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: summary, loading: summaryLoading } = useApi(
    () => creditService.getScoreSummary(),
    []
  );

  const { data: applications, loading: applicationsLoading } = useApi(
    () => creditService.getApplications(),
    []
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const pendingApplications = applications?.filter(app => app.status === 'PENDING') || [];
  const myApprovals = applications?.filter(app => app.status === 'APPROVED' && app.reviewedBy === 'Agent Smith') || [];

  return (
    <>
      <Header />
      <div className="space-y-6 p-6">
      {/* En-tête Agent */}
      <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard Agent</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos demandes de crédit et clients
            </p>
          </div>
          <div className="flex space-x-3">
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
          </div>
        </div>
      </div>

      {/* Métriques Agent */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="fintech-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Demandes en attente</p>
                <p className="text-2xl font-bold text-warning">{pendingApplications.length}</p>
                <p className="text-xs text-muted-foreground">À traiter aujourd'hui</p>
              </div>
              <div className="p-3 rounded-full bg-warning/10">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Mes approbations</p>
                <p className="text-2xl font-bold text-success">{myApprovals.length}</p>
                <p className="text-xs text-success">+2 cette semaine</p>
              </div>
              <div className="p-3 rounded-full bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Taux de conversion</p>
                <p className="text-2xl font-bold text-primary">
                  {myApprovals.length > 0 ? `${Math.round((myApprovals.length / applications!.length) * 100)}%` : '0%'}
                </p>
                <p className="text-xs text-primary">Performance mensuelle</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Raccourcis pour les tâches courantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/credit-application')}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Nouvelle évaluation</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/dashboard')}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">Clients récents</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/dashboard')}
            >
              <Clock className="h-6 w-6" />
              <span className="text-sm">Demandes urgentes</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/analytics')}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Statistiques</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demandes prioritaires */}
      <Card className="fintech-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
                Demandes Prioritaires
              </CardTitle>
              <CardDescription>
                Demandes nécessitant votre attention immédiate
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-warning text-warning">
              {pendingApplications.length} en attente
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {applicationsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-muted animate-pulse rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-1/3"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                  </div>
                  <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : pendingApplications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune demande en attente</p>
              <p className="text-sm">Toutes les demandes sont à jour</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApplications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {app.clientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{app.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(app.requestedAmount)} • Score: {(app.probability * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Soumis le {new Date(app.submittedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      Examiner
                    </Button>
                    <Button size="sm" className="btn-success">
                      Approuver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Graphiques simplifiés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreChart 
          data={summary?.monthlyTrend}
          title="Évolution des Scores"
          description="Performance mensuelle de vos évaluations"
        />
        <PerformanceChart 
          type="pie"
          title="Mes Décisions"
          description="Répartition de vos approbations/rejets"
        />
      </div>

      {/* Clients actifs */}
      <ClientList 
        maxItems={8}
        showFilters={false}
        onClientSelect={(client) => {
          console.log('Client sélectionné:', client);
        }}
      />
      </div>
    </>
  );
};