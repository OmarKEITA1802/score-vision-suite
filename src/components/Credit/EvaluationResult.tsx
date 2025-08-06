import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, AlertTriangle, RotateCcw, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { CreditPredictionResult, CreditPredictionRequest } from '@/services/creditService';
import { useNavigate } from 'react-router-dom';

interface EvaluationResultProps {
  result: CreditPredictionResult;
  formData: CreditPredictionRequest;
  onReset: () => void;
  isExaminationMode?: boolean;
  applicationId?: string | null;
}

export const EvaluationResult: React.FC<EvaluationResultProps> = ({
  result,
  formData,
  onReset,
  isExaminationMode = false,
  applicationId,
}) => {
  const navigate = useNavigate();
  const scorePercentage = Math.round(result.probability * 100);
  const isApproved = result.decision === 'APPROVED';

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'from-success/20 to-success/5';
    if (score >= 50) return 'from-warning/20 to-warning/5';
    return 'from-destructive/20 to-destructive/5';
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'HIGH':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'MEDIUM':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'LOW':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header mode examen */}
      {isExaminationMode && (
        <Card className="fintech-card border-primary/50 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Mode Examen - Décision du Modèle</h3>
                  <p className="text-sm text-muted-foreground">
                    Demande #{applicationId} - Visualisation de l'analyse automatisée
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                Examen
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Résultat principal */}
      <Card className={`fintech-card-premium bg-gradient-to-br ${getScoreBgColor(scorePercentage)}`}>
        <CardHeader className="text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isApproved ? 'bg-success/20' : 'bg-destructive/20'
          }`}>
            {isApproved ? (
              <CheckCircle2 className="h-10 w-10 text-success" />
            ) : (
              <XCircle className="h-10 w-10 text-destructive" />
            )}
          </div>
          <CardTitle className="text-3xl font-bold">
            Score Crédit: {scorePercentage}%
          </CardTitle>
          <CardDescription className="text-lg">
            <Badge 
              variant={isApproved ? 'default' : 'destructive'}
              className={`text-base px-4 py-2 ${
                isApproved ? 'bg-success hover:bg-success/90' : ''
              }`}
            >
              {isApproved ? '✅ Crédit Approuvé' : '❌ Crédit Refusé'}
            </Badge>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Gauge de score */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Probabilité d'approbation</span>
              <span className={`text-sm font-bold ${getScoreColor(scorePercentage)}`}>
                {scorePercentage}%
              </span>
            </div>
            <Progress 
              value={scorePercentage} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Niveau de confiance */}
          <div className="flex items-center justify-center space-x-2 p-3 bg-background/50 rounded-lg">
            {getConfidenceIcon(result.confidenceLevel)}
            <span className="font-medium">
              Niveau de confiance: {
                result.confidenceLevel === 'HIGH' ? 'Élevé' :
                result.confidenceLevel === 'MEDIUM' ? 'Moyen' : 'Faible'
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Analyse SHAP */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Facteurs d'influence (Analyse SHAP)
          </CardTitle>
          <CardDescription>
            Impact des variables sur la décision de crédit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.shapValues.map((shap, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{shap.feature}</span>
                <div className="flex items-center space-x-2">
                  {shap.impact > 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className="text-sm font-mono">{shap.value}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-2 relative">
                  <div
                    className={`absolute top-0 h-2 rounded-full ${
                      shap.impact > 0 ? 'bg-success' : 'bg-destructive'
                    }`}
                    style={{
                      width: `${Math.abs(shap.impact) * 100}%`,
                      left: shap.impact > 0 ? '50%' : `${50 - Math.abs(shap.impact) * 100}%`
                    }}
                  />
                  <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-border"></div>
                </div>
                <span className={`text-xs font-medium ${
                  shap.impact > 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {shap.impact > 0 ? '+' : ''}{(shap.impact * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Facteurs de risque et recommandations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.riskFactors.length > 0 && (
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Facteurs de risque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.riskFactors.map((factor, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-destructive">•</span>
                    <span className="text-sm">{factor}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="fintech-card">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-success">•</span>
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Résumé des données */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle>Résumé de la demande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block">Montant demandé</span>
              <span className="font-bold">{formatCurrency(formData.amountAsked)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Revenus mensuels</span>
              <span className="font-bold">{formatCurrency(formData.revenues)}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Taux d'endettement</span>
              <span className="font-bold">
                {((formData.debt / formData.revenues) * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Type</span>
              <span className="font-bold">
                {formData.isRenewal ? 'Renouvellement' : 'Nouveau crédit'}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={isExaminationMode ? () => navigate('/dashboard') : onReset}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isExaminationMode ? 'Retour au tableau de bord' : 'Retour'}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
            >
              Imprimer le rapport
            </Button>
          </div>
          
          {!isExaminationMode && (
            <Button
              onClick={onReset}
              className="btn-primary"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Nouvelle évaluation
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};