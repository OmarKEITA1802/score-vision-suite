import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity,
  Brain,
  Shield,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';
import { adminService, SystemStats } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';

export const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSystemStats(period);
      setStats(response);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de charger les statistiques'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Chargement des statistiques...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            Aucune donnée disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  // Données pour les graphiques
  const approvalRate = stats.total_applications > 0 
    ? Math.round((stats.approved_applications / stats.total_applications) * 100)
    : 0;

  const rejectionRate = stats.total_applications > 0
    ? Math.round((stats.rejected_applications / stats.total_applications) * 100)
    : 0;

  const pendingRate = stats.total_applications > 0
    ? Math.round((stats.pending_applications / stats.total_applications) * 100)
    : 0;

  const pieData = [
    { name: 'Approuvées', value: stats.approved_applications, color: '#10b981' },
    { name: 'Refusées', value: stats.rejected_applications, color: '#ef4444' },
    { name: 'En attente', value: stats.pending_applications, color: '#f59e0b' },
  ];

  const dailyVolumeData = stats.daily_volume.map(item => ({
    date: new Date(item.date).toLocaleDateString('fr-FR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    count: item.count
  }));

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <span>Vue d'ensemble du système</span>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                  <SelectItem value="90d">90 derniers jours</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={loadStats} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total demandes</p>
                <p className="text-3xl font-bold">{stats.total_applications.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Toutes périodes confondues
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux d'approbation</p>
                <p className="text-3xl font-bold text-green-600">{approvalRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+2.3% vs période précédente</span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs actifs</p>
                <p className="text-3xl font-bold">{stats.active_users}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Sur {stats.total_users} total
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Précision du modèle</p>
                <p className="text-3xl font-bold text-purple-600">{Math.round(stats.model_accuracy * 100)}%</p>
                <div className="flex items-center mt-1">
                  <Brain className="h-3 w-3 text-purple-600 mr-1" />
                  <span className="text-xs text-purple-600">Modèle v2.1 actif</span>
                </div>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution quotidienne */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Volume quotidien des demandes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                  name="Demandes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition des décisions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Répartition des décisions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                <p className="text-sm font-medium">{stats.approved_applications}</p>
                <p className="text-xs text-muted-foreground">Approuvées</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                <p className="text-sm font-medium">{stats.rejected_applications}</p>
                <p className="text-xs text-muted-foreground">Refusées</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                <p className="text-sm font-medium">{stats.pending_applications}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes et notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Alertes système</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Demandes en attente</span>
                </div>
                <Badge variant="outline" className="text-yellow-600">
                  {stats.pending_applications}
                </Badge>
              </div>
              
              {stats.pending_applications > 10 && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Surcharge détectée</span>
                  </div>
                  <Badge variant="destructive">
                    Critique
                  </Badge>
                </div>
              )}

              {stats.model_accuracy < 0.8 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Précision modèle faible</span>
                  </div>
                  <Badge variant="outline" className="text-orange-600">
                    Attention
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Activité récente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Nouvelle demande approuvée</span>
                <span className="text-muted-foreground ml-auto">Il y a 5min</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Agent connecté</span>
                <span className="text-muted-foreground ml-auto">Il y a 12min</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Demande refusée</span>
                <span className="text-muted-foreground ml-auto">Il y a 18min</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Modèle mis à jour</span>
                <span className="text-muted-foreground ml-auto">Il y a 2h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>État du système</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Base de données</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Opérationnelle
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Django</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Opérationnelle
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Modèle ML</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Actif v2.1
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Stockage</span>
                <Badge variant="outline">
                  78% utilisé
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};