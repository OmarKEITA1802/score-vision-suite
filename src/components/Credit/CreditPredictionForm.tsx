import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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

// Schéma de validation Zod
const creditFormSchema = z.object({
  familyCircumstances: z.string().min(1, 'Situation familiale requise'),
  activity: z.string().min(1, 'Activité professionnelle requise'),
  legalForm: z.string().min(1, 'Forme juridique requise'),
  isRenewal: z.number(),
  revenues: z.number()
    .min(1, 'Les revenus doivent être supérieurs à 0')
    .max(1000000, 'Les revenus semblent irréalistes'),
  charges: z.number()
    .min(0, 'Les charges ne peuvent pas être négatives')
    .max(1000000, 'Les charges semblent irréalistes'),
  guaranteeEstimatedValue: z.number()
    .min(0, 'La valeur de garantie ne peut pas être négative'),
  amountAsked: z.number()
    .min(1, 'Le montant demandé doit être supérieur à 0')
    .max(10000000, 'Le montant demandé semble irréaliste'),
  debt: z.number()
    .min(0, 'La dette ne peut pas être négative')
    .max(10000000, 'La dette semble irréaliste'),
}).refine((data) => {
  // Validation du taux d'endettement
  const debtRatio = (data.debt / data.revenues) * 100;
  return debtRatio <= 100;
}, {
  message: 'Le taux d\'endettement ne peut pas dépasser 100%',
  path: ['debt'],
}).refine((data) => {
  // Validation du reste à vivre
  const remainingToLive = data.revenues - data.charges;
  return remainingToLive >= 0;
}, {
  message: 'Les charges ne peuvent pas dépasser les revenus',
  path: ['charges'],
}).refine((data) => {
  // Validation du montant demandé par rapport aux revenus
  const creditToIncomeRatio = data.amountAsked / (data.revenues * 12);
  return creditToIncomeRatio <= 10;
}, {
  message: 'Le montant demandé ne peut pas dépasser 10 fois vos revenus annuels',
  path: ['amountAsked'],
});

type CreditFormData = z.infer<typeof creditFormSchema>;

export const CreditPredictionForm: React.FC = () => {
  const [result, setResult] = useState<CreditPredictionResult | null>(null);
  const [searchParams] = useSearchParams();
  const [isExaminationMode, setIsExaminationMode] = useState(false);
  const { toast } = useToast();
  
  const applicationId = searchParams.get('applicationId');

  const form = useForm<CreditFormData>({
    resolver: zodResolver(creditFormSchema),
    defaultValues: {
      familyCircumstances: '',
      activity: '',
      legalForm: '',
      isRenewal: 0,
      revenues: 0,
      charges: 0,
      guaranteeEstimatedValue: 0,
      amountAsked: 0,
      debt: 0,
    },
    mode: 'onChange', // Validation en temps réel
  });

  const onSubmit = async (data: CreditFormData) => {
    try {
      const predictionResult = await creditService.predictCredit(data as CreditPredictionRequest);
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
    }
  };

  // Load application data for examination
  useEffect(() => {
    if (applicationId) {
      setIsExaminationMode(true);
      // Simulate loading existing application and its model decision
      const loadApplication = async () => {
        try {
          // This would normally fetch the application data and model decision
          const mockApplicationData = {
            familyCircumstances: 'MARRIED',
            activity: 'EMPLOYEE',
            legalForm: 'INDIVIDUAL',
            isRenewal: 0,
            revenues: 250000,
            charges: 80000,
            guaranteeEstimatedValue: 500000,
            amountAsked: 150000,
            debt: 50000,
          };
          
          // Set form data
          form.reset(mockApplicationData);
          
          // Simulate the model's decision
          const modelDecision = await creditService.predictCredit(mockApplicationData as CreditPredictionRequest);
          setResult(modelDecision);
          
          toast({
            title: 'Mode examen',
            description: 'Visualisation de la décision du modèle pour cette demande',
          });
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: 'Impossible de charger les données de la demande',
          });
        }
      };
      
      loadApplication();
    }
  }, [applicationId, form, toast]);

  const handleReset = () => {
    if (!isExaminationMode) {
      form.reset();
      setResult(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(value);
  };

  const formData = form.watch();
  const isLoading = form.formState.isSubmitting;

  if (result) {
    return (
      <EvaluationResult 
        result={result} 
        formData={formData as CreditPredictionRequest}
        onReset={handleReset}
        isExaminationMode={isExaminationMode}
        applicationId={applicationId}
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Informations personnelles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="familyCircumstances"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Situation familiale *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FAMILY_CIRCUMSTANCES.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="activity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activité professionnelle *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ACTIVITIES.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalForm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forme juridique *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LEGAL_FORMS.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isRenewal"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Renouvellement de crédit</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value.toString()}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Informations financières */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="w-2 h-2 bg-success rounded-full mr-3"></span>
                  Informations financières
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="revenues"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revenus mensuels (CFA) *</FormLabel>
                        <div className="relative">
                          <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="3000"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="charges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Charges mensuelles (CFA)</FormLabel>
                        <div className="relative">
                          <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1200"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guaranteeEstimatedValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valeur garantie estimée (CFA)</FormLabel>
                        <div className="relative">
                          <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="50000"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amountAsked"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Montant demandé (CFA) *</FormLabel>
                        <div className="relative">
                          <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="25000"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="debt"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Dette actuelle (CFA)</FormLabel>
                        <div className="relative">
                          <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5000"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Calculs automatiques */}
              {formData.revenues > 0 && (
                <>
                  <Separator />
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <h4 className="font-medium flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-success" />
                      Ratios calculés
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Taux d'endettement:</span>
                        <span className={`ml-2 font-medium ${
                          ((formData.debt / formData.revenues) * 100) > 33 ? 'text-destructive' : 'text-success'
                        }`}>
                          {((formData.debt / formData.revenues) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reste à vivre:</span>
                        <span className={`ml-2 font-medium ${
                          (formData.revenues - formData.charges) < 300 ? 'text-destructive' : 'text-success'
                        }`}>
                          {formatCurrency(formData.revenues - formData.charges)}
                        </span>
                      </div>
                    </div>
                    {((formData.debt / formData.revenues) * 100) > 33 && (
                      <div className="flex items-center text-sm text-destructive mt-2">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Taux d'endettement élevé (recommandé: &lt; 33%)
                      </div>
                    )}
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
                disabled={isLoading || !form.formState.isValid}
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
        </Form>
      </Card>
    </div>
  );
};