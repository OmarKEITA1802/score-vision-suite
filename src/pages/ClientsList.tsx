import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowLeft, Phone, Mail, Calendar, TrendingUp, AlertCircle, User, CreditCard, MapPin, Briefcase, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Common/Header';

const ClientsList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
      amount: 50000,
      address: '123 Rue de la Paix, 75001 Paris',
      profession: 'Ingénieur logiciel',
      monthlyIncome: 4500,
      debt: 1200,
      employmentDuration: '3 ans',
      familyStatus: 'Célibataire'
    },
    {
      id: 2,
      name: 'Jean Martin',
      email: 'jean.martin@email.com',
      phone: '+33 6 87 65 43 21',
      lastEvaluation: '2024-01-14',
      creditScore: 72,
      status: 'approved',
      amount: 25000,
      address: '456 Avenue des Champs, 69000 Lyon',
      profession: 'Commercial',
      monthlyIncome: 3200,
      debt: 800,
      employmentDuration: '5 ans',
      familyStatus: 'Marié(e)'
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      phone: '+33 6 98 76 54 32',
      lastEvaluation: '2024-01-13',
      creditScore: 45,
      status: 'rejected',
      amount: 75000,
      address: '789 Boulevard Saint-Michel, 13000 Marseille',
      profession: 'Professeur',
      monthlyIncome: 2800,
      debt: 1800,
      employmentDuration: '2 ans',
      familyStatus: 'Divorcé(e)'
    },
    {
      id: 4,
      name: 'Pierre Moreau',
      email: 'pierre.moreau@email.com',
      phone: '+33 6 11 22 33 44',
      lastEvaluation: '2024-01-12',
      creditScore: 68,
      status: 'pending',
      amount: 30000,
      address: '321 Rue Victor Hugo, 33000 Bordeaux',
      profession: 'Comptable',
      monthlyIncome: 3500,
      debt: 900,
      employmentDuration: '4 ans',
      familyStatus: 'Marié(e)'
    },
    {
      id: 5,
      name: 'Alice Bernard',
      email: 'alice.bernard@email.com',
      phone: '+33 6 55 66 77 88',
      lastEvaluation: '2024-01-11',
      creditScore: 91,
      status: 'approved',
      amount: 100000,
      address: '654 Place de la République, 59000 Lille',
      profession: 'Médecin',
      monthlyIncome: 7000,
      debt: 500,
      employmentDuration: '8 ans',
      familyStatus: 'Marié(e)'
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

  const handleViewDetails = (client: any) => {
    setSelectedClient(client);
    setIsDetailModalOpen(true);
  };

  const handleContact = (client: any) => {
    setSelectedClient(client);
    setIsContactModalOpen(true);
  };

  const handlePhoneCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleEmail = (email: string, name: string) => {
    const subject = encodeURIComponent(`Contact concernant votre demande de crédit`);
    const body = encodeURIComponent(`Bonjour ${name},\n\nJe vous contacte concernant votre demande de crédit.\n\nCordialement,`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  const handleSMS = (phone: string, name: string) => {
    const message = encodeURIComponent(`Bonjour ${name}, je vous contacte concernant votre demande de crédit.`);
    window.open(`sms:${phone}?body=${message}`);
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(client)}
                    >
                      Voir détails
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleContact(client)}
                    >
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

      {/* Modal de détails */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Détails du client</span>
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur {selectedClient?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-6">
              {/* En-tête du client */}
              <div className="flex items-center space-x-4 p-4 bg-background/50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedClient.name}`} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                    {selectedClient.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedClient.name}</h3>
                  <p className="text-muted-foreground">{selectedClient.profession}</p>
                  <Badge className={getStatusColor(selectedClient.status)}>
                    {getStatusText(selectedClient.status)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{selectedClient.creditScore}%</p>
                  <p className="text-sm text-muted-foreground">Score crédit</p>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.familyStatus}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Informations professionnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Profession</p>
                      <p className="font-medium">{selectedClient.profession}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenus mensuels</p>
                      <p className="font-medium">{formatCurrency(selectedClient.monthlyIncome)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ancienneté</p>
                      <p className="font-medium">{selectedClient.employmentDuration}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Informations financières */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Situation financière
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Montant demandé</p>
                      <p className="text-lg font-bold text-primary">{formatCurrency(selectedClient.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dettes actuelles</p>
                      <p className="text-lg font-bold text-destructive">{formatCurrency(selectedClient.debt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Taux d'endettement</p>
                      <p className="text-lg font-bold">
                        {((selectedClient.debt / selectedClient.monthlyIncome) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dernière évaluation</p>
                      <p className="text-lg font-bold">{formatDate(selectedClient.lastEvaluation)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Fermer
                </Button>
                <Button>
                  Nouvelle évaluation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de contact */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Contacter le client</span>
            </DialogTitle>
            <DialogDescription>
              Choisissez un moyen de communication avec {selectedClient?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-4">
              {/* Options de contact */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-16 flex items-center justify-start space-x-4"
                  onClick={() => {
                    handlePhoneCall(selectedClient.phone);
                    setIsContactModalOpen(false);
                  }}
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Appeler</p>
                    <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-16 flex items-center justify-start space-x-4"
                  onClick={() => {
                    handleEmail(selectedClient.email, selectedClient.name);
                    setIsContactModalOpen(false);
                  }}
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Envoyer un email</p>
                    <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-16 flex items-center justify-start space-x-4"
                  onClick={() => {
                    handleSMS(selectedClient.phone, selectedClient.name);
                    setIsContactModalOpen(false);
                  }}
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Envoyer un SMS</p>
                    <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
                  </div>
                </Button>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setIsContactModalOpen(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsList;