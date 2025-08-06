import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, AlertTriangle, RotateCcw, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { CreditPredictionResult, CreditPredictionRequest } from '@/services/creditService';
import { useNavigate } from 'react-router-dom';
import { AgentActions } from './AgentActions';

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

      {/* Détails complets de la demande client */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
            Détails de la demande du client
          </CardTitle>
          <CardDescription>
            Informations complètes fournies par le demandeur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informations financières */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">💰 Informations Financières</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground block text-sm">Montant demandé</span>
                <span className="font-bold text-xl text-primary">{formatCurrency(formData.amountAsked)}</span>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground block text-sm">Revenus mensuels</span>
                <span className="font-bold text-xl text-success">{formatCurrency(formData.revenues)}</span>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground block text-sm">Charges mensuelles</span>
                <span className="font-bold text-xl text-warning">{formatCurrency(formData.charges)}</span>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground block text-sm">Dettes actuelles</span>
                <span className="font-bold text-xl text-destructive">{formatCurrency(formData.debt)}</span>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground block text-sm">Valeur de la garantie</span>
                <span className="font-bold text-xl text-info">{formatCurrency(formData.guaranteeEstimatedValue)}</span>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground block text-sm">Type de crédit</span>
                <span className="font-bold text-lg">
                  {formData.isRenewal ? '🔄 Renouvellement' : '🆕 Nouveau crédit'}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations personnelles et professionnelles */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">👤 Profil du Demandeur</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background/50 rounded-lg border">
                <span className="text-muted-foreground block text-sm">Situation familiale</span>
                <span className="font-semibold text-lg">
                  {formData.familyCircumstances === 'MARRIED_WITH_CHILDREN' && '👨‍👩‍👧‍👦 Marié avec enfants'}
                  {formData.familyCircumstances === 'MARRIED_WITHOUT_CHILDREN' && '👨‍👩 Marié sans enfants'}
                  {formData.familyCircumstances === 'SINGLE' && '👤 Célibataire'}
                  {formData.familyCircumstances === 'DIVORCED' && '💔 Divorcé(e)'}
                  {formData.familyCircumstances === 'WIDOWED' && '🖤 Veuf/Veuve'}
                </span>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border">
                <span className="text-muted-foreground block text-sm">Activité professionnelle</span>
                <span className="font-semibold text-lg">
                  {formData.activity === 'EMPLOYEE' && '👔 Salarié'}
                  {formData.activity === 'SELF_EMPLOYED' && '👨‍💼 Indépendant'}
                  {formData.activity === 'RETIRED' && '🏖️ Retraité'}
                  {formData.activity === 'UNEMPLOYED' && '🔍 Sans emploi'}
                  {formData.activity === 'STUDENT' && '🎓 Étudiant'}
                </span>
              </div>
              <div className="p-4 bg-background/50 rounded-lg border">
                <span className="text-muted-foreground block text-sm">Forme juridique</span>
                <span className="font-semibold text-lg">
                  {formData.legalForm === 'INDIVIDUAL' && '👤 Particulier'}
                  {formData.legalForm === 'COMPANY' && '🏢 Entreprise'}
                  {formData.legalForm === 'ASSOCIATION' && '🤝 Association'}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Analyse financière détaillée */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">📊 Analyse Financière</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-background/50 rounded-lg border">
                <span className="text-muted-foreground block text-sm">Revenus nets</span>
                <span className="font-semibold text-lg text-success">
                  {formatCurrency(formData.revenues - formData.charges)}
                </span>
                <span className="text-xs text-muted-foreground">Revenus - Charges</span>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border">
                <span className="text-muted-foreground block text-sm">Taux d'endettement</span>
                <span className={`font-semibold text-lg ${
                  ((formData.debt / formData.revenues) * 100) > 33 ? 'text-destructive' : 'text-success'
                }`}>
                  {((formData.debt / formData.revenues) * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">Dettes / Revenus</span>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border">
                <span className="text-muted-foreground block text-sm">Ratio garantie</span>
                <span className={`font-semibold text-lg ${
                  (formData.guaranteeEstimatedValue / formData.amountAsked) > 1 ? 'text-success' : 'text-warning'
                }`}>
                  {((formData.guaranteeEstimatedValue / formData.amountAsked) * 100).toFixed(0)}%
                </span>
                <span className="text-xs text-muted-foreground">Garantie / Montant</span>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border">
                <span className="text-muted-foreground block text-sm">Capacité théorique</span>
                <span className={`font-semibold text-lg ${
                  ((formData.amountAsked / (formData.revenues - formData.charges)) * 100) > 300 ? 'text-destructive' : 'text-success'
                }`}>
                  {((formData.amountAsked / (formData.revenues - formData.charges))).toFixed(1)} mois
                </span>
                <span className="text-xs text-muted-foreground">Montant / Revenus nets</span>
              </div>
            </div>
          </div>

          {/* Évaluation des risques */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-3">🎯 Évaluation des Risques</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-success mb-2">✅ Points Positifs</h5>
                <ul className="space-y-1 text-sm">
                  {(formData.revenues - formData.charges) > 0 && (
                    <li>• Revenus nets positifs ({formatCurrency(formData.revenues - formData.charges)})</li>
                  )}
                  {(formData.guaranteeEstimatedValue / formData.amountAsked) > 1 && (
                    <li>• Garantie supérieure au montant demandé</li>
                  )}
                  {((formData.debt / formData.revenues) * 100) < 33 && (
                    <li>• Taux d'endettement acceptable (&lt; 33%)</li>
                  )}
                  {formData.isRenewal === 1 && (
                    <li>• Client existant (renouvellement)</li>
                  )}
                  {formData.activity === 'EMPLOYEE' && (
                    <li>• Situation professionnelle stable (salarié)</li>
                  )}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-destructive mb-2">⚠️ Points d'Attention</h5>
                <ul className="space-y-1 text-sm">
                  {(formData.revenues - formData.charges) <= 0 && (
                    <li>• Revenus nets insuffisants ou négatifs</li>
                  )}
                  {(formData.guaranteeEstimatedValue / formData.amountAsked) < 1 && (
                    <li>• Garantie inférieure au montant demandé</li>
                  )}
                  {((formData.debt / formData.revenues) * 100) > 33 && (
                    <li>• Taux d'endettement élevé (&gt; 33%)</li>
                  )}
                  {formData.activity === 'UNEMPLOYED' && (
                    <li>• Situation professionnelle précaire</li>
                  )}
                  {formData.activity === 'SELF_EMPLOYED' && (
                    <li>• Revenus variables (indépendant)</li>
                  )}
                </ul>
              </div>
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

      {/* Nouvelles fonctionnalités pour l'agent */}
      {isExaminationMode && (
        <AgentActions
          applicationId={applicationId || 'default'}
          result={result}
          formData={formData}
        />
      )}
    </div>
  );
};