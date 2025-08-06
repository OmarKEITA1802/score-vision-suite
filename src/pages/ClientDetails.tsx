import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Header } from '@/components/Common/Header';
import { RoleProtectedRoute } from '@/components/Common/RoleProtectedRoute';
import { ClientEditForm } from '@/components/Credit/ClientEditForm';
import { useAuth } from '@/contexts/AuthContext';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { creditService, ClientData } from '@/services/creditService';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  CreditCard, 
  Calendar,
  TrendingUp,
  TrendingDown,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export const ClientDetails: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clientId } = useParams();
  const [searchParams] = useSearchParams();
  const clientIdFromQuery = searchParams.get('id');
  const finalClientId = clientId || clientIdFromQuery;

  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<ClientData | null>(null);

  const { data: clientData, loading: clientLoading, error: clientError } = useApi(
    () => finalClientId ? creditService.getClientDetails(finalClientId) : Promise.resolve(null),
    [finalClientId]
  );

  const { data: applications, loading: applicationsLoading } = useApi(
    () => finalClientId ? creditService.getClientApplications(finalClientId) : Promise.resolve([]),
    [finalClientId]
  );

  const { data: auditLogs, loading: logsLoading } = useApi(
    () => finalClientId ? adminService.getAuditLogs({ user_id: finalClientId }).then(res => res || { logs: [] }) : Promise.resolve({ logs: [] }),
    [finalClientId]
  );

  // Mutations pour les opérations d'administration
  const { mutate: updateClient, loading: updateLoading } = useApiMutation(
    (updates: { clientId: string; data: Partial<ClientData> }) => 
      creditService.updateClient(updates.clientId, updates.data),
    {
      onSuccess: (updatedClient) => {
        toast.success('Client mis à jour avec succès');
        setIsEditMode(false);
        setClientToEdit(null);
        // Recharger les données du client
        window.location.reload();
      },
      onError: (error) => {
        toast.error(`Erreur lors de la mise à jour: ${error}`);
      }
    }
  );

  const { mutate: deleteClient, loading: deleteLoading } = useApiMutation(
    (clientId: string) => creditService.deleteClient(clientId),
    {
      onSuccess: () => {
        toast.success('Client supprimé avec succès');
        navigate('/dashboard');
      },
      onError: (error) => {
        toast.error(`Erreur lors de la suppression: ${error}`);
      }
    }
  );

  if (!finalClientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive">Aucun client spécifié</h1>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (clientLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
            <span>Chargement des détails du client...</span>
          </div>
        </div>
      </div>
    );
  }

  if (clientError || !clientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive">Client non trouvé</h1>
            <p className="text-muted-foreground mt-2">Le client demandé n'existe pas ou vous n'avez pas les permissions pour le voir.</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-success">Approuvé</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Refusé</Badge>;
      case 'PENDING':
        return <Badge variant="outline" className="border-warning text-warning">En attente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const handleEditClient = () => {
    setClientToEdit(clientData);
    setIsEditMode(true);
  };

  const handleSaveClient = (updates: Partial<ClientData>) => {
    if (finalClientId) {
      updateClient({ clientId: finalClientId, data: updates });
    }
  };

  const handleDeleteClient = () => {
    if (finalClientId) {
      deleteClient(finalClientId);
    }
  };

  const isAdmin = user?.role === 'admin';

  if (isEditMode && clientToEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <ClientEditForm
              client={clientToEdit}
              onSave={handleSaveClient}
              onCancel={() => {
                setIsEditMode(false);
                setClientToEdit(null);
              }}
              isLoading={updateLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
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
                <h1 className="text-3xl font-bold">Détails du client</h1>
                <p className="text-muted-foreground">Informations complètes et historique</p>
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex space-x-2">
                <Button
                  onClick={handleEditClient}
                  className="flex items-center space-x-2"
                  disabled={updateLoading}
                >
                  <Edit className="h-4 w-4" />
                  <span>Modifier</span>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex items-center space-x-2"
                      disabled={deleteLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Supprimer</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer définitivement ce client ? 
                        Cette action est irréversible et supprimera toutes les données associées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteClient}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* Profil du client */}
          <Card className="fintech-card mb-8">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${clientData.firstName}-${clientData.lastName}`} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-2xl">
                    {clientData.firstName[0]}{clientData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{clientData.firstName} {clientData.lastName}</h2>
                  <p className="text-muted-foreground text-lg">{clientData.profession || 'Profession non renseignée'}</p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant={clientData.status === 'ACTIVE' ? 'default' : 'secondary'} className={clientData.status === 'ACTIVE' ? 'bg-success' : ''}>
                      {clientData.status === 'ACTIVE' ? 'Actif' : clientData.status}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{clientData.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{clientData.phone || 'Non renseigné'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-center">
                    <p className={`text-4xl font-bold ${getScoreColor(clientData.score * 100)}`}>
                      {(clientData.score * 100).toFixed(0)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Score crédit</p>
                    <div className="flex items-center justify-center mt-2">
                      {clientData.score > clientData.lastScore ? (
                        <TrendingUp className="h-4 w-4 text-success mr-1" />
                      ) : clientData.score < clientData.lastScore ? (
                        <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                      ) : null}
                      <span className="text-sm">
                        {((clientData.score - clientData.lastScore) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contenu principal avec onglets */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="applications">Demandes ({applications?.length || 0})</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations personnelles */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Prénom</p>
                        <p className="font-medium">{clientData.firstName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nom</p>
                        <p className="font-medium">{clientData.lastName}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{clientData.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{clientData.phone || 'Non renseigné'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Adresse</p>
                      <p className="font-medium">{clientData.address || 'Non renseignée'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Date d'inscription</p>
                      <p className="font-medium">{formatDate(clientData.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Informations financières */}
                <Card className="fintech-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Situation financière
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenus mensuels</p>
                        <p className="font-medium text-lg text-success">
                          {clientData.monthlyIncome ? formatCurrency(clientData.monthlyIncome) : 'Non renseigné'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dettes actuelles</p>
                        <p className="font-medium text-lg text-destructive">
                          {clientData.currentDebt ? formatCurrency(clientData.currentDebt) : 'Non renseigné'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Taux d'endettement</p>
                      <p className="font-medium text-lg">
                        {clientData.debtRatio ? `${(clientData.debtRatio * 100).toFixed(1)}%` : 'Non calculé'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Demandes totales</p>
                        <p className="font-medium">{clientData.applications || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Approuvées</p>
                        <p className="font-medium text-success">{clientData.totalApproved || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Statistiques de performance */}
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Statistiques de performance</CardTitle>
                  <CardDescription>Évolution du score et historique des demandes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{(clientData.score * 100).toFixed(0)}%</p>
                      <p className="text-sm text-muted-foreground">Score actuel</p>
                    </div>
                    
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                      <p className="text-2xl font-bold text-success">{clientData.totalApproved || 0}</p>
                      <p className="text-sm text-muted-foreground">Approuvées</p>
                    </div>
                    
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                      <p className="text-2xl font-bold text-destructive">{(clientData.applications || 0) - (clientData.totalApproved || 0)}</p>
                      <p className="text-sm text-muted-foreground">Refusées</p>
                    </div>
                    
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <Calendar className="h-8 w-8 text-warning mx-auto mb-2" />
                      <p className="text-2xl font-bold">{formatDate(clientData.lastActivity).split(' ')[0]}</p>
                      <p className="text-sm text-muted-foreground">Dernière activité</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Demandes */}
            <TabsContent value="applications" className="space-y-6">
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Historique des demandes de crédit</CardTitle>
                  <CardDescription>
                    Toutes les demandes soumises par ce client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2">Chargement des demandes...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications?.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Aucune demande trouvée pour ce client
                        </div>
                      ) : (
                        applications?.map((app: any) => (
                          <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <FileText className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Demande #{app.id}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatCurrency(app.requestedAmount)} • {formatDate(app.submittedAt)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Score: {(app.probability * 100).toFixed(0)}%
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              {getStatusBadge(app.status)}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedApplication(app)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Détails
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents */}
            <TabsContent value="documents" className="space-y-6">
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Documents du client</CardTitle>
                  <CardDescription>
                    Tous les documents soumis et générés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Fonctionnalité de gestion des documents à implémenter</p>
                    <Button variant="outline" className="mt-4">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter les données RGPD
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Historique */}
            <TabsContent value="history" className="space-y-6">
              <Card className="fintech-card">
                <CardHeader>
                  <CardTitle>Journal d'audit</CardTitle>
                  <CardDescription>
                    Historique de toutes les actions effectuées sur ce client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {logsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2">Chargement de l'historique...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {auditLogs?.logs?.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Aucun événement d'audit trouvé
                        </div>
                      ) : (
                        auditLogs?.logs?.map((log: any) => (
                          <div key={log.id} className="flex items-start space-x-3 p-3 border-l-2 border-primary/20">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="font-medium">{log.action}</p>
                              <p className="text-sm text-muted-foreground">
                                Par {log.user_email} • {formatDate(log.timestamp)}
                              </p>
                              {log.details && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {JSON.stringify(log.details)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};