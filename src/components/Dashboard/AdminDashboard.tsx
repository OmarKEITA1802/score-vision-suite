import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Common/Header';
import { ScoreChart } from './ScoreChart';
import { PerformanceChart } from './PerformanceChart';
import { ShapChart } from './ShapChart';
import { ClientList } from '../Credit/ClientList';
import { useApi } from '@/hooks/useApi';
import { creditService } from '@/services/creditService';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { FloatingElement, Shimmer } from '@/components/ui/loading-animations';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock,
  Activity,
  BarChart3,
  Download
} from 'lucide-react';
import dashboardHero from '@/assets/dashboard-hero.jpg';

export const AdminDashboard: React.FC = () => {
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
      currency: 'EUR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'primary',
    loading = false 
  }: {
    title: string;
    value: string;
    change?: string;
    icon: any;
    color?: 'primary' | 'success' | 'warning' | 'destructive';
    loading?: boolean;
  }) => (
    <Card className="fintech-card hover-lift">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
            {change && !loading && (
              <p className={`text-xs flex items-center ${
                change.startsWith('+') ? 'text-success' : 'text-destructive'
              }`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {change} vs mois précédent
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-${color}/10`}>
            <Icon className={`h-6 w-6 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Header />
      <div className="space-y-6 p-6">
      {/* Hero Section */}
      <AnimatedContainer animation="fade-in-down" className="relative rounded-xl overflow-hidden">
        <img 
          src={dashboardHero} 
          alt="Credit Scoring Dashboard" 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 flex items-center">
          <AnimatedContainer animation="fade-in-left" delay={300} className="p-8 text-primary-foreground">
            <h1 className="text-3xl font-bold mb-2 text-shimmer">Dashboard Administrateur</h1>
            <p className="text-primary-foreground/90 mb-4">
              Vue d'ensemble des performances et analyses de crédit
            </p>
            <AnimatedContainer animation="fade-in-up" delay={600} className="flex space-x-4">
              <Button variant="secondary" size="sm" className="btn-animated hover-glow">
                <Download className="h-4 w-4 mr-2" />
                Exporter rapport
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-primary-foreground border-primary-foreground/20 btn-animated"
                onClick={() => navigate('/analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics avancées
              </Button>
            </AnimatedContainer>
          </AnimatedContainer>
        </div>
      </AnimatedContainer>

      {/* Métriques principales */}
      <AnimatedContainer stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedContainer animation="slide-up" delay={100}>
          <StatCard
            title="Total Demandes"
            value={summary?.totalApplications.toString() || '0'}
            change="+12%"
            icon={Users}
            loading={summaryLoading}
          />
        </AnimatedContainer>
        <AnimatedContainer animation="slide-up" delay={200}>
          <StatCard
            title="Taux d'Approbation"
            value={summary ? formatPercentage(summary.approvalRate) : '0%'}
            change="+3.2%"
            icon={CheckCircle}
            color="success"
            loading={summaryLoading}
          />
        </AnimatedContainer>
        <AnimatedContainer animation="slide-up" delay={300}>
          <StatCard
            title="Score Moyen"
            value={summary ? formatPercentage(summary.averageScore) : '0%'}
            change="+5.1%"
            icon={TrendingUp}
            color="primary"
            loading={summaryLoading}
          />
        </AnimatedContainer>
        <AnimatedContainer animation="slide-up" delay={400}>
          <StatCard
            title="Volume Total"
            value={summary ? formatCurrency(summary.totalAmount) : '0€'}
            change="+8.7%"
            icon={DollarSign}
            color="success"
            loading={summaryLoading}
          />
        </AnimatedContainer>
      </AnimatedContainer>

      {/* Répartition des statuts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="fintech-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approuvées</p>
                <p className="text-xl font-bold text-success">
                  {summary?.approvedApplications || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Refusées</p>
                <p className="text-xl font-bold text-destructive">
                  {summary?.rejectedApplications || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-xl font-bold text-warning">
                  {summary?.pendingApplications || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activité</p>
                <Badge variant="default" className="bg-primary">
                  En ligne
                </Badge>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreChart data={summary?.monthlyTrend} />
        <PerformanceChart type="pie" />
      </div>

      {/* Performance détaillée et analyse SHAP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart type="bar" />
        <ShapChart />
      </div>

      {/* Liste des clients récents */}
      <ClientList 
        maxItems={10}
        showFilters={true}
        onClientSelect={(client) => {
          console.log('Client sélectionné:', client);
          // Navigation vers le détail du client
        }}
      />

      {/* Demandes récentes */}
      <Card className="fintech-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Demandes Récentes</CardTitle>
              <CardDescription>
                Dernières demandes de crédit soumises
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Voir toutes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {applicationsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-3">
                  <div className="w-10 h-10 bg-muted animate-pulse rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                  </div>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {applications?.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {app.clientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{app.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(app.requestedAmount)} • {new Date(app.submittedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      app.status === 'APPROVED' ? 'default' : 
                      app.status === 'REJECTED' ? 'destructive' : 
                      'secondary'
                    } className={
                      app.status === 'APPROVED' ? 'bg-success' : ''
                    }>
                      {app.status === 'APPROVED' ? 'Approuvé' :
                       app.status === 'REJECTED' ? 'Refusé' :
                       app.status === 'PENDING' ? 'En attente' : 'En cours'}
                    </Badge>
                    <span className="text-sm font-mono">
                      {(app.probability * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </>
  );
};