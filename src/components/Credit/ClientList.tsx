import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Search, Filter, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { creditService, ClientData } from '@/services/creditService';
import { useApi } from '@/hooks/useApi';

interface ClientListProps {
  maxItems?: number;
  showFilters?: boolean;
  onClientSelect?: (client: ClientData) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  maxItems,
  showFilters = true,
  onClientSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');

  const { data: clients, loading, error } = useApi(
    () => creditService.getClients(),
    []
  );

  const filteredClients = clients?.filter(client => {
    const matchesSearch = 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    const matchesScore = scoreFilter === 'all' || 
      (scoreFilter === 'high' && client.score >= 0.7) ||
      (scoreFilter === 'medium' && client.score >= 0.5 && client.score < 0.7) ||
      (scoreFilter === 'low' && client.score < 0.5);

    return matchesSearch && matchesStatus && matchesScore;
  }).slice(0, maxItems);

  const getStatusBadge = (status: ClientData['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-success">Actif</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary">Inactif</Badge>;
      case 'BLACKLISTED':
        return <Badge variant="destructive">Liste noire</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 0.7) {
      return <Badge variant="default" className="bg-success">Bon</Badge>;
    } else if (score >= 0.5) {
      return <Badge variant="outline" className="border-warning text-warning">Moyen</Badge>;
    } else {
      return <Badge variant="destructive">Faible</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className="fintech-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Chargement des clients...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="fintech-card">
        <CardContent className="p-8">
          <div className="text-center text-destructive">
            Erreur lors du chargement des clients: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fintech-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Liste des Clients
            </CardTitle>
            <CardDescription>
              {filteredClients?.length || 0} client(s) 
              {maxItems && ` (${maxItems} affichés)`}
            </CardDescription>
          </div>
          
          {showFilters && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="ACTIVE">Actif</SelectItem>
                  <SelectItem value="INACTIVE">Inactif</SelectItem>
                  <SelectItem value="BLACKLISTED">Liste noire</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous scores</SelectItem>
                  <SelectItem value="high">Score élevé</SelectItem>
                  <SelectItem value="medium">Score moyen</SelectItem>
                  <SelectItem value="low">Score faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!filteredClients || filteredClients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun client trouvé
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Évolution</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Demandes</TableHead>
                  <TableHead>Dernière activité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {client.firstName} {client.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="text-xs text-muted-foreground">
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">
                          {(client.score * 100).toFixed(0)}%
                        </span>
                        {getScoreBadge(client.score)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {client.score > client.lastScore ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : client.score < client.lastScore ? (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        ) : (
                          <span className="h-4 w-4 text-muted-foreground">•</span>
                        )}
                        <span className="text-sm">
                          {client.score > client.lastScore ? '+' : ''}
                          {((client.score - client.lastScore) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(client.status)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <div>{client.applications} demande(s)</div>
                        <div className="text-muted-foreground">
                          {client.totalApproved} approuvée(s)
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(client.lastActivity)}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onClientSelect?.(client)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
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
  );
};