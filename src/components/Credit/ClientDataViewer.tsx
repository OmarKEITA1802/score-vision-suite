import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Building2, 
  CreditCard,
  TrendingUp,
  History
} from 'lucide-react';
import { CreditPredictionRequest } from '@/services/creditService';

interface ClientDataViewerProps {
  formData: CreditPredictionRequest;
  applicationId: string;
}

export const ClientDataViewer: React.FC<ClientDataViewerProps> = ({
  formData,
  applicationId
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(value);
  };

  const debtRatio = ((formData.debt / formData.revenues) * 100).toFixed(1);
  const remainingToLive = formData.revenues - formData.charges;

  // Données simulées pour l'historique
  const creditHistory = [
    {
      id: '1',
      date: '2023-01-15',
      amount: 50000,
      type: 'Crédit personnel',
      status: 'Remboursé',
      duration: '12 mois'
    },
    {
      id: '2', 
      date: '2022-06-10',
      amount: 25000,
      type: 'Crédit express',
      status: 'Remboursé',
      duration: '6 mois'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Informations personnelles */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Situation familiale:</span>
                <Badge variant="outline" className="ml-2">
                  {formData.familyCircumstances === 'MARRIED' ? 'Marié(e)' : 
                   formData.familyCircumstances === 'SINGLE' ? 'Célibataire' :
                   formData.familyCircumstances}
                </Badge>
              </div>
              
              <div className="flex items-center text-sm">
                <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Activité:</span>
                <Badge variant="outline" className="ml-2">
                  {formData.activity === 'EMPLOYEE' ? 'Salarié' :
                   formData.activity === 'SELF_EMPLOYED' ? 'Indépendant' :
                   formData.activity}
                </Badge>
              </div>

              <div className="flex items-center text-sm">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Forme juridique:</span>
                <Badge variant="outline" className="ml-2">
                  {formData.legalForm === 'INDIVIDUAL' ? 'Particulier' :
                   formData.legalForm === 'COMPANY' ? 'Entreprise' :
                   formData.legalForm}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              {/* Données simulées */}
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Téléphone:</span>
                <span className="ml-2 font-medium">+221 77 123 45 67</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2 font-medium">client@example.com</span>
              </div>

              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Adresse:</span>
                <span className="ml-2 font-medium">Dakar, Sénégal</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Situation financière détaillée */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Situation financière détaillée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-primary">Revenus et charges</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenus mensuels:</span>
                  <span className="font-medium">{formatCurrency(formData.revenues)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Charges mensuelles:</span>
                  <span className="font-medium">{formatCurrency(formData.charges)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reste à vivre:</span>
                  <span className={`font-medium ${remainingToLive >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(remainingToLive)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-primary">Endettement</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dette actuelle:</span>
                  <span className="font-medium">{formatCurrency(formData.debt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taux d'endettement:</span>
                  <span className={`font-medium ${parseFloat(debtRatio) > 33 ? 'text-destructive' : 'text-success'}`}>
                    {debtRatio}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-primary">Demande actuelle</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant demandé:</span>
                  <span className="font-medium">{formatCurrency(formData.amountAsked)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Garantie estimée:</span>
                  <span className="font-medium">{formatCurrency(formData.guaranteeEstimatedValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant={formData.isRenewal ? 'secondary' : 'default'}>
                    {formData.isRenewal ? 'Renouvellement' : 'Nouveau'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historique des crédits */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2 text-primary" />
            Historique des crédits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {creditHistory.map((credit) => (
              <div key={credit.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{credit.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(credit.date).toLocaleDateString('fr-FR')} • {credit.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(credit.amount)}</p>
                  <Badge 
                    variant={credit.status === 'Remboursé' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {credit.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};