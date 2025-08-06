import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Phone, Mail, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Common/Header';

const ClientsList: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for recent clients
  const recentClients = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '+33 6 12 34 56 78',
      lastEvaluation: '2024-01-15',
      creditScore: 85,
      status: 'approved',
      amount: 50000
    },
    {
      id: 2,
      name: 'Jean Martin',
      email: 'jean.martin@email.com',
      phone: '+33 6 87 65 43 21',
      lastEvaluation: '2024-01-14',
      creditScore: 72,
      status: 'approved',
      amount: 25000
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      phone: '+33 6 98 76 54 32',
      lastEvaluation: '2024-01-13',
      creditScore: 45,
      status: 'rejected',
      amount: 75000
    },
    {
      id: 4,
      name: 'Pierre Moreau',
      email: 'pierre.moreau@email.com',
      phone: '+33 6 11 22 33 44',
      lastEvaluation: '2024-01-12',
      creditScore: 68,
      status: 'pending',
      amount: 30000
    },
    {
      id: 5,
      name: 'Alice Bernard',
      email: 'alice.bernard@email.com',
      phone: '+33 6 55 66 77 88',
      lastEvaluation: '2024-01-11',
      creditScore: 91,
      status: 'approved',
      amount: 100000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success hover:bg-success/90';
      case 'rejected': return 'bg-destructive hover:bg-destructive/90';
      case 'pending': return 'bg-warning hover:bg-warning/90';
      default: return 'bg-secondary hover:bg-secondary/90';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Refusé';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Clients récents</h1>
                <p className="text-muted-foreground">Dernières évaluations de crédit</p>
              </div>
            </div>
            <Badge variant="outline" className="px-4 py-2">
              {recentClients.length} clients
            </Badge>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentClients.map((client) => (
              <Card key={client.id} className="fintech-card hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(client.status)}>
                            {getStatusText(client.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Score de crédit */}
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Score crédit</span>
                    </div>
                    <span className={`text-lg font-bold ${getScoreColor(client.creditScore)}`}>
                      {client.creditScore}%
                    </span>
                  </div>

                  {/* Montant */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Montant demandé</span>
                    <span className="font-semibold">{formatCurrency(client.amount)}</span>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{formatDate(client.lastEvaluation)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Voir détails
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      Contacter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats footer */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="fintech-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Taux d'approbation</p>
                    <p className="text-xl font-bold text-success">
                      {Math.round((recentClients.filter(c => c.status === 'approved').length / recentClients.length) * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="fintech-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">En attente</p>
                    <p className="text-xl font-bold text-warning">
                      {recentClients.filter(c => c.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="fintech-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Score moyen</p>
                    <p className="text-xl font-bold text-primary">
                      {Math.round(recentClients.reduce((acc, c) => acc + c.creditScore, 0) / recentClients.length)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsList;