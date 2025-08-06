import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Printer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Building2
} from 'lucide-react';
import { CreditPredictionResult, CreditPredictionRequest } from '@/services/creditService';
import { useAgentActions } from '@/hooks/useAgentActions';

interface EvaluationReportProps {
  applicationId: string;
  result: CreditPredictionResult;
  formData: CreditPredictionRequest;
  agentComments?: string[];
  evaluatorName?: string;
}

export const EvaluationReport: React.FC<EvaluationReportProps> = ({
  applicationId,
  result,
  formData,
  agentComments = [],
  evaluatorName = 'Agent système'
}) => {
  const { executeAction, isLoading } = useAgentActions(applicationId);

  const scorePercentage = Math.round(result.probability * 100);
  const isApproved = result.decision === 'APPROVED';
  const debtRatio = ((formData.debt / formData.revenues) * 100).toFixed(1);
  const remainingToLive = formData.revenues - formData.charges;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(value);
  };

  const handleGenerateReport = async () => {
    await executeAction('generate_report', {
      reportType: 'evaluation_summary',
      applicationId,
      score: scorePercentage,
      decision: result.decision
    });

    // Générer le contenu du rapport
    const reportContent = generateReportHTML();
    
    // Créer un blob et télécharger
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-evaluation-${applicationId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const generateReportHTML = () => {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport d'Évaluation Crédit - ${applicationId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { color: #2563eb; font-size: 24px; font-weight: bold; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .data-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .status { padding: 4px 12px; border-radius: 4px; color: white; font-weight: bold; }
        .approved { background-color: #10b981; }
        .rejected { background-color: #ef4444; }
        .score { font-size: 36px; font-weight: bold; text-align: center; margin: 20px 0; }
        .shap-item { margin: 10px 0; }
        .shap-bar { height: 20px; background: #f3f4f6; border-radius: 10px; position: relative; margin: 5px 0; }
        .shap-positive { background: #10b981; }
        .shap-negative { background: #ef4444; }
        ul { list-style-type: disc; margin-left: 20px; }
        .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
        @media print { body { margin: 0; } .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏦 FINTECH CREDIT</div>
        <h1>Rapport d'Évaluation de Crédit</h1>
        <p>Demande #${applicationId}</p>
        <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>

    <div class="section">
        <h2>📊 Résultat de l'Évaluation</h2>
        <div class="score" style="color: ${isApproved ? '#10b981' : '#ef4444'}">
            Score: ${scorePercentage}%
        </div>
        <div style="text-align: center;">
            <span class="status ${isApproved ? 'approved' : 'rejected'}">
                ${isApproved ? '✅ CRÉDIT APPROUVÉ' : '❌ CRÉDIT REFUSÉ'}
            </span>
        </div>
        <div style="text-align: center; margin-top: 15px;">
            <strong>Niveau de confiance:</strong> 
            ${result.confidenceLevel === 'HIGH' ? 'Élevé' : 
              result.confidenceLevel === 'MEDIUM' ? 'Moyen' : 'Faible'}
        </div>
    </div>

    <div class="section">
        <h2>👤 Informations du Demandeur</h2>
        <div class="grid">
            <div>
                <div class="data-row">
                    <span>Situation familiale:</span>
                    <strong>${formData.familyCircumstances}</strong>
                </div>
                <div class="data-row">
                    <span>Activité:</span>
                    <strong>${formData.activity}</strong>
                </div>
                <div class="data-row">
                    <span>Forme juridique:</span>
                    <strong>${formData.legalForm}</strong>
                </div>
            </div>
            <div>
                <div class="data-row">
                    <span>Type de demande:</span>
                    <strong>${formData.isRenewal ? 'Renouvellement' : 'Nouveau crédit'}</strong>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>💰 Situation Financière</h2>
        <div class="grid">
            <div>
                <div class="data-row">
                    <span>Revenus mensuels:</span>
                    <strong>${formatCurrency(formData.revenues)}</strong>
                </div>
                <div class="data-row">
                    <span>Charges mensuelles:</span>
                    <strong>${formatCurrency(formData.charges)}</strong>
                </div>
                <div class="data-row">
                    <span>Dette actuelle:</span>
                    <strong>${formatCurrency(formData.debt)}</strong>
                </div>
            </div>
            <div>
                <div class="data-row">
                    <span>Montant demandé:</span>
                    <strong>${formatCurrency(formData.amountAsked)}</strong>
                </div>
                <div class="data-row">
                    <span>Valeur garantie:</span>
                    <strong>${formatCurrency(formData.guaranteeEstimatedValue)}</strong>
                </div>
                <div class="data-row">
                    <span>Taux d'endettement:</span>
                    <strong style="color: ${parseFloat(debtRatio) > 33 ? '#ef4444' : '#10b981'}">${debtRatio}%</strong>
                </div>
                <div class="data-row">
                    <span>Reste à vivre:</span>
                    <strong style="color: ${remainingToLive >= 0 ? '#10b981' : '#ef4444'}">${formatCurrency(remainingToLive)}</strong>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>📈 Analyse SHAP - Facteurs d'Influence</h2>
        ${result.shapValues.map(shap => `
            <div class="shap-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span><strong>${shap.feature}:</strong> ${shap.value}</span>
                    <span style="color: ${shap.impact > 0 ? '#10b981' : '#ef4444'}">
                        ${shap.impact > 0 ? '↗' : '↘'} ${(shap.impact * 100).toFixed(1)}%
                    </span>
                </div>
                <div class="shap-bar">
                    <div style="
                        width: ${Math.abs(shap.impact) * 100}%; 
                        height: 100%; 
                        background: ${shap.impact > 0 ? '#10b981' : '#ef4444'};
                        border-radius: 10px;
                        ${shap.impact < 0 ? 'margin-left: ' + (50 - Math.abs(shap.impact) * 100) + '%;' : 'margin-left: 50%;'}
                    "></div>
                </div>
            </div>
        `).join('')}
    </div>

    ${result.riskFactors.length > 0 ? `
    <div class="section">
        <h2>⚠️ Facteurs de Risque</h2>
        <ul>
            ${result.riskFactors.map(factor => `<li>${factor}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <div class="section">
        <h2>💡 Recommandations</h2>
        <ul>
            ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>

    ${agentComments.length > 0 ? `
    <div class="section">
        <h2>💬 Commentaires de l'Agent</h2>
        <ul>
            ${agentComments.map(comment => `<li>${comment}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <div class="footer">
        <p><strong>Évaluateur:</strong> ${evaluatorName}</p>
        <p><strong>Date de génération:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        <p>Ce rapport a été généré automatiquement par le système d'évaluation crédit.</p>
    </div>
</body>
</html>
    `;
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Rapport d'évaluation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Résumé exécutif */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
          <h3 className="font-semibold mb-3">Résumé exécutif</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className={`text-2xl font-bold ${isApproved ? 'text-success' : 'text-destructive'}`}>
                {scorePercentage}%
              </div>
              <div className="text-muted-foreground">Score de crédit</div>
            </div>
            <div className="text-center">
              <Badge variant={isApproved ? 'default' : 'destructive'} className="text-sm">
                {isApproved ? 'APPROUVÉ' : 'REFUSÉ'}
              </Badge>
              <div className="text-muted-foreground mt-1">Décision</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {result.confidenceLevel === 'HIGH' ? 'Élevé' : 
                 result.confidenceLevel === 'MEDIUM' ? 'Moyen' : 'Faible'}
              </div>
              <div className="text-muted-foreground">Confiance</div>
            </div>
          </div>
        </div>

        {/* Aperçu du contenu */}
        <div className="space-y-4">
          <h4 className="font-medium">Le rapport comprendra :</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Résultat détaillé de l'évaluation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Informations complètes du demandeur</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Analyse financière détaillée</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Facteurs d'influence (SHAP)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Facteurs de risque identifiés</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Recommandations personnalisées</span>
            </div>
            {agentComments.length > 0 && (
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Commentaires de l'agent</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Informations d'audit et traçabilité</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Informations de génération */}
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Date de génération: {new Date().toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Évaluateur: {evaluatorName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Demande #{applicationId}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex items-center space-x-2"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimer</span>
        </Button>
        
        <Button
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>{isLoading ? 'Génération...' : 'Télécharger PDF'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};