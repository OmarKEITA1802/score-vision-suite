import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, 
  Save, 
  RotateCcw, 
  AlertTriangle,
  Calculator,
  Euro
} from 'lucide-react';
import { CreditPredictionRequest } from '@/services/creditService';
import { useAgentActions } from '@/hooks/useAgentActions';

interface DataCorrectionProps {
  applicationId: string;
  originalData: CreditPredictionRequest;
  onDataCorrected?: (correctedData: CreditPredictionRequest, justification: string) => void;
}

const correctionSchema = z.object({
  revenues: z.number().min(1).max(1000000),
  charges: z.number().min(0).max(1000000),
  debt: z.number().min(0).max(10000000),
  amountAsked: z.number().min(1).max(10000000),
  guaranteeEstimatedValue: z.number().min(0),
  familyCircumstances: z.string(),
  activity: z.string(),
  legalForm: z.string(),
  isRenewal: z.number(),
  justification: z.string().min(10, 'Justification requise (minimum 10 caractères)')
});

type CorrectionFormData = z.infer<typeof correctionSchema>;

export const DataCorrection: React.FC<DataCorrectionProps> = ({
  applicationId,
  originalData,
  onDataCorrected
}) => {
  const { executeAction, isLoading } = useAgentActions(applicationId);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<CorrectionFormData>({
    resolver: zodResolver(correctionSchema),
    defaultValues: {
      ...originalData,
      justification: ''
    }
  });

  const watchedData = form.watch();
  const hasChanges = Object.keys(originalData).some(key => {
    const originalValue = originalData[key as keyof CreditPredictionRequest];
    const currentValue = watchedData[key as keyof CorrectionFormData];
    return originalValue !== currentValue;
  });

  const onSubmit = async (data: CorrectionFormData) => {
    const { justification, ...correctedData } = data;
    
    const changes = Object.keys(originalData).reduce((acc, key) => {
      const originalValue = originalData[key as keyof CreditPredictionRequest];
      const newValue = correctedData[key as keyof CreditPredictionRequest];
      if (originalValue !== newValue) {
        acc[key] = { from: originalValue, to: newValue };
      }
      return acc;
    }, {} as Record<string, any>);

    const success = await executeAction('correct_data', {
      changes,
      originalData,
      correctedData
    }, justification);

    if (success) {
      onDataCorrected?.(correctedData as CreditPredictionRequest, justification);
      setIsEditing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(value);
  };

  const calculateDebtRatio = (debt: number, revenues: number) => {
    return revenues > 0 ? ((debt / revenues) * 100).toFixed(1) : '0';
  };

  const calculateRemainingToLive = (revenues: number, charges: number) => {
    return revenues - charges;
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Edit className="h-5 w-5 mr-2 text-primary" />
            Correction des données
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Informations financières */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Euro className="h-4 w-4 mr-2 text-primary" />
                Données financières
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="revenues"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Revenus mensuels (CFA)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={!isEditing}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                      {originalData.revenues !== watchedData.revenues && (
                        <div className="text-xs text-warning">
                          Original: {formatCurrency(originalData.revenues)}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="charges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Charges mensuelles (CFA)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={!isEditing}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                      {originalData.charges !== watchedData.charges && (
                        <div className="text-xs text-warning">
                          Original: {formatCurrency(originalData.charges)}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="debt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dette actuelle (CFA)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={!isEditing}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                      {originalData.debt !== watchedData.debt && (
                        <div className="text-xs text-warning">
                          Original: {formatCurrency(originalData.debt)}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amountAsked"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant demandé (CFA)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={!isEditing}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                      {originalData.amountAsked !== watchedData.amountAsked && (
                        <div className="text-xs text-warning">
                          Original: {formatCurrency(originalData.amountAsked)}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guaranteeEstimatedValue"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Valeur garantie estimée (CFA)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={!isEditing}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                      {originalData.guaranteeEstimatedValue !== watchedData.guaranteeEstimatedValue && (
                        <div className="text-xs text-warning">
                          Original: {formatCurrency(originalData.guaranteeEstimatedValue)}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Calculs automatiques */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                Calculs automatiques
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span>Taux d'endettement:</span>
                  <Badge variant={parseFloat(calculateDebtRatio(watchedData.debt, watchedData.revenues)) > 33 ? 'destructive' : 'default'}>
                    {calculateDebtRatio(watchedData.debt, watchedData.revenues)}%
                  </Badge>
                </div>
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span>Reste à vivre:</span>
                  <Badge variant={calculateRemainingToLive(watchedData.revenues, watchedData.charges) >= 0 ? 'default' : 'destructive'}>
                    {formatCurrency(calculateRemainingToLive(watchedData.revenues, watchedData.charges))}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Justification obligatoire si édition */}
            {isEditing && (
              <>
                <Separator />
                <FormField
                  control={form.control}
                  name="justification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Justification de la correction *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Expliquez pourquoi ces données doivent être corrigées (erreur de saisie, informations complémentaires reçues, etc.)"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {hasChanges && (
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Attention</p>
                        <p className="text-muted-foreground">
                          La correction des données entraînera une nouvelle évaluation automatique.
                          Cette action sera tracée dans l'audit log.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>

          {isEditing && (
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setIsEditing(false);
                }}
                disabled={isLoading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              
              <Button
                type="submit"
                disabled={!hasChanges || isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Sauvegarde...' : 'Enregistrer les corrections'}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
};