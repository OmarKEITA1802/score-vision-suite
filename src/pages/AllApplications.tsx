import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Filter, Eye, Calendar, TrendingUp, FileText, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Common/Header';

interface Application {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  score: number;
  submittedAt: string;
  reviewedAt?: string;
  agentId?: string;
  decision?: 'approved' | 'rejected';
  decisionReason?: string;
}

const AllApplications: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  // Mock data pour toutes les demandes
  const applications: Application[] = [
    {
      id: '1',
      clientName: 'Marie Dubois',
      clientEmail: 'marie.dubois@email.com',
      amount: 150000,
      status: 'approved',
      score: 85,
      submittedAt: '2024-01-15T10:30:00',
      reviewedAt: '2024-01-15T14:20:00',
      agentId: 'agent_001',
      decision: 'approved',
      decisionReason: 'Profil financier solide, revenus stables'
    },
    {
      id: '2',
      clientName: 'Jean Martin',
      clientEmail: 'jean.martin@email.com',
      amount: 75000,
      status: 'pending',
      score: 72,
      submittedAt: '2024-01-14T16:45:00',
    },
    {
      id: '3',
      clientName: 'Sophie Laurent',
      clientEmail: 'sophie.laurent@email.com',
      amount: 200000,
      status: 'rejected',
      score: 45,
      submittedAt: '2024-01-13T09:15:00',
      reviewedAt: '2024-01-13T11:30:00',
      agentId: 'agent_002',
      decision: 'rejected',
      decisionReason: 'Taux d\'endettement trop élevé'
    },
    {
      id: '4',
      clientName: 'Pierre Moreau',
      clientEmail: 'pierre.moreau@email.com',
      amount: 100000,
      status: 'under_review',
      score: 68,
      submittedAt: '2024-01-12T14:20:00',
    },
    {
      id: '5',
      clientName: 'Alice Bernard',
      clientEmail: 'alice.bernard@email.com',
      amount: 300000,
      status: 'approved',
      score: 91,
      submittedAt: '2024-01-11T11:10:00',
      reviewedAt: '2024-01-11T15:45:00',
      agentId: 'agent_001',
      decision: 'approved',
      decisionReason: 'Excellent profil, revenus élevés'
    },
    {
      id: '6',
      clientName: 'David Wilson',
      clientEmail: 'david.wilson@email.com',
      amount: 50000,
      status: 'pending',
      score: 58,
      submittedAt: '2024-01-10T08:30:00',
    }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      case 'amount':
        return b.amount - a.amount;
      case 'score':
        return b.score - a.score;
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejetée</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-warning text-warning">En attente</Badge>;
      case 'under_review':
        return <Badge variant="secondary">En révision</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExamineApplication = (applicationId: string) => {
    navigate(`/credit-application?applicationId=${applicationId}`);
  };

  const getStatsCards = () => {
    const total = applications.length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

    return [
      { label: 'Total demandes', value: total, icon: FileText, color: 'text-primary' },
      { label: 'Approuvées', value: approved, icon: TrendingUp, color: 'text-success' },
      { label: 'En attente', value: pending, icon: Calendar, color: 'text-warning' },
      { label: 'Taux d\'approbation', value: `${approvalRate}%`, icon: TrendingUp, color: 'text-success' },
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
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
                <h1 className="text-3xl font-bold text-foreground">Toutes les demandes</h1>
                <p className="text-muted-foreground">Gestion complète des demandes de crédit</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {getStatsCards().map((stat, index) => (
              <Card key={index} className="fintech-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="fintech-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Filtres et recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center space-x-4 space-y-2">
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="under_review">En révision</SelectItem>
                    <SelectItem value="approved">Approuvées</SelectItem>
                    <SelectItem value="rejected">Rejetées</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Trier par date</SelectItem>
                    <SelectItem value="amount">Trier par montant</SelectItem>
                    <SelectItem value="score">Trier par score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Applications Table */}
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>
                Liste des demandes ({filteredApplications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredApplications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune demande trouvée</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date soumission</TableHead>
                        <TableHead>Date révision</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((application) => (
                        <TableRow key={application.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div>
                              <div className="font-medium">{application.clientName}</div>
                              <div className="text-sm text-muted-foreground">
                                {application.clientEmail}
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <span className="font-medium">
                              {formatCurrency(application.amount)}
                            </span>
                          </TableCell>
                          
                          <TableCell>
                            <span className={`font-bold ${getScoreColor(application.score)}`}>
                              {application.score}%
                            </span>
                          </TableCell>
                          
                          <TableCell>
                            {getStatusBadge(application.status)}
                          </TableCell>
                          
                          <TableCell>
                            <span className="text-sm">
                              {formatDate(application.submittedAt)}
                            </span>
                          </TableCell>
                          
                          <TableCell>
                            {application.reviewedAt ? (
                              <span className="text-sm">
                                {formatDate(application.reviewedAt)}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExamineApplication(application.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Examiner
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AllApplications;