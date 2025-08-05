import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Calculator, Euro, AlertCircle, CheckCircle2 } from 'lucide-react';
import { creditService, CreditPredictionRequest, CreditPredictionResult } from '@/services/creditService';
import { useToast } from '@/hooks/use-toast';
import { EvaluationResult } from './EvaluationResult';

const FAMILY_CIRCUMSTANCES = [
  { value: 'SINGLE', label: 'Célibataire' },
  { value: 'MARRIED', label: 'Marié(e)' },
  { value: 'MARRIED_WITH_CHILDREN', label: 'Marié(e) avec enfants' },
  { value: 'DIVORCED', label: 'Divorcé(e)' },
  { value: 'WIDOWED', label: 'Veuf/Veuve' },
];

const ACTIVITIES = [
  { value: 'EMPLOYEE', label: 'Salarié' },
  { value: 'SELF_EMPLOYED', label: 'Indépendant' },
  { value: 'CIVIL_SERVANT', label: 'Fonctionnaire' },
  { value: 'RETIRED', label: 'Retraité' },
  { value: 'UNEMPLOYED', label: 'Sans emploi' },
  { value: 'STUDENT', label: 'Étudiant' },
];

const LEGAL_FORMS = [
  { value: 'INDIVIDUAL', label: 'Particulier' },
  { value: 'COMPANY', label: 'Entreprise' },
  { value: 'ASSOCIATION', label: 'Association' },
];

export const CreditPredictionForm: React.FC = () => {
  const [formData, setFormData] = useState<CreditPredictionRequest>({
    familyCircumstances: '',
    activity: '',
    legalForm: '',
    isRenewal: 0,
    revenues: 0,
    charges: 0,
    guaranteeEstimatedValue: 0,
    amountAsked: 0,
    debt: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CreditPredictionResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.familyCircumstances) {
      newErrors.familyCircumstances = 'Situation familiale requise';
    }
    if (!formData.activity) {
      newErrors.activity = 'Activité professionnelle requise';
    }
    if (!formData.legalForm) {
      newErrors.legalForm = 'Forme juridique requise';
    }
    if (formData.revenues <= 0) {
      newErrors.revenues = 'Revenus doivent être supérieurs à 0';
    }
    if (formData.charges < 0) {
      newErrors.charges = 'Charges ne peuvent pas être négatives';
    }
    if (formData.guaranteeEstimatedValue < 0) {
      newErrors.guaranteeEstimatedValue = 'Valeur de garantie ne peut pas être négative';
    }
    if (formData.amountAsked <= 0) {
      newErrors.amountAsked = 'Montant demandé doit être supérieur à 0';
    }
    if (formData.debt < 0) {
      newErrors.debt = 'Dette ne peut pas être négative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: 'destructive',
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs dans le formulaire.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const predictionResult = await creditService.predictCredit(formData);
      setResult(predictionResult);
      
      toast({
        title: 'Prédiction terminée',
        description: `Score calculé : ${(predictionResult.probability * 100).toFixed(1)}%`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Erreur lors de la prédiction',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      familyCircumstances: '',
      activity: '',
      legalForm: '',
      isRenewal: 0,
      revenues: 0,
      charges: 0,
      guaranteeEstimatedValue: 0,
      amountAsked: 0,
      debt: 0,
    });
    setResult(null);
    setErrors({});
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  if (result) {
    return (
      <EvaluationResult 
        result={result} 
        formData={formData}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="fintech-card-premium">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full mx-auto mb-4 flex items-center justify-center">
            <Calculator className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Évaluation Crédit</CardTitle>
          <CardDescription>
            Renseignez les informations ci-dessous pour obtenir une prédiction de score crédit
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Informations personnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="familyCircumstances">Situation familiale *</Label>
                  <Select
                    value={formData.familyCircumstances}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, familyCircumstances: value }))}
                  >
                    <SelectTrigger className={errors.familyCircumstances ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {FAMILY_CIRCUMSTANCES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.familyCircumstances && (
                    <p className="text-sm text-destructive">{errors.familyCircumstances}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity">Activité professionnelle *</Label>
                  <Select
                    value={formData.activity}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, activity: value }))}
                  >
                    <SelectTrigger className={errors.activity ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITIES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.activity && (
                    <p className="text-sm text-destructive">{errors.activity}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="legalForm">Forme juridique *</Label>
                  <Select
                    value={formData.legalForm}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, legalForm: value }))}
                  >
                    <SelectTrigger className={errors.legalForm ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {LEGAL_FORMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.legalForm && (
                    <p className="text-sm text-destructive">{errors.legalForm}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Renouvellement de crédit</Label>
                <RadioGroup
                  value={formData.isRenewal.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, isRenewal: parseInt(value) }))}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="new" />
                    <Label htmlFor="new">Nouveau crédit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="renewal" />
                    <Label htmlFor="renewal">Renouvellement</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Separator />

            {/* Informations financières */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="w-2 h-2 bg-success rounded-full mr-3"></span>
                Informations financières
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="revenues">Revenus mensuels (€) *</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="revenues"
                      type="number"
                      placeholder="3000"
                      value={formData.revenues || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, revenues: parseFloat(e.target.value) || 0 }))}
                      className={`pl-10 ${errors.revenues ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.revenues && (
                    <p className="text-sm text-destructive">{errors.revenues}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="charges">Charges mensuelles (€)</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="charges"
                      type="number"
                      placeholder="1200"
                      value={formData.charges || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, charges: parseFloat(e.target.value) || 0 }))}
                      className={`pl-10 ${errors.charges ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.charges && (
                    <p className="text-sm text-destructive">{errors.charges}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guaranteeEstimatedValue">Valeur garantie estimée (€)</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="guaranteeEstimatedValue"
                      type="number"
                      placeholder="50000"
                      value={formData.guaranteeEstimatedValue || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, guaranteeEstimatedValue: parseFloat(e.target.value) || 0 }))}
                      className={`pl-10 ${errors.guaranteeEstimatedValue ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.guaranteeEstimatedValue && (
                    <p className="text-sm text-destructive">{errors.guaranteeEstimatedValue}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amountAsked">Montant demandé (€) *</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amountAsked"
                      type="number"
                      placeholder="25000"
                      value={formData.amountAsked || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, amountAsked: parseFloat(e.target.value) || 0 }))}
                      className={`pl-10 ${errors.amountAsked ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.amountAsked && (
                    <p className="text-sm text-destructive">{errors.amountAsked}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="debt">Dette actuelle (€)</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="debt"
                      type="number"
                      placeholder="5000"
                      value={formData.debt || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, debt: parseFloat(e.target.value) || 0 }))}
                      className={`pl-10 ${errors.debt ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.debt && (
                    <p className="text-sm text-destructive">{errors.debt}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Calculs automatiques */}
            {formData.revenues > 0 && (
              <>
                <Separator />
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">Ratios calculés</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Taux d'endettement:</span>
                      <span className="ml-2 font-medium">
                        {((formData.debt / formData.revenues) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reste à vivre:</span>
                      <span className="ml-2 font-medium">
                        {formatCurrency(formData.revenues - formData.charges)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              Réinitialiser
            </Button>
            
            <Button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  <span>Calcul en cours...</span>
                </div>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculer le score
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};