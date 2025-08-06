import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  User, 
  FileText, 
  MessageSquare,
  Scale,
  Edit,
  Calendar,
  Download
} from 'lucide-react';
import { CreditPredictionResult, CreditPredictionRequest } from '@/services/creditService';
import { ClientDataViewer } from './ClientDataViewer';
import { DocumentManager } from './DocumentManager';
import { ApplicationComments } from './ApplicationComments';
import { ManualEvaluation } from './ManualEvaluation';
import { DataCorrection } from './DataCorrection';
import { AppointmentScheduler } from './AppointmentScheduler';
import { EvaluationReport } from './EvaluationReport';
import { DecisionContest } from './DecisionContest';
import { useRolePermissions } from '@/contexts/RolePermissionContext';

interface AgentActionsProps {
  applicationId: string;
  result: CreditPredictionResult;
  formData: CreditPredictionRequest;
  onDataCorrected?: (correctedData: CreditPredictionRequest, justification: string) => void;
  onDecisionChange?: (decision: string, justification: string) => void;
}

export const AgentActions: React.FC<AgentActionsProps> = ({
  applicationId,
  result,
  formData,
  onDataCorrected,
  onDecisionChange
}) => {
  const { hasPermission, getUserRole } = useRolePermissions();
  const [activeTab, setActiveTab] = useState('consultation');

  const userRole = getUserRole();
  const scorePercentage = Math.round(result.probability * 100);
  const currentDecision = result.decision.toLowerCase() as 'approved' | 'rejected';

  // Vérifier les permissions pour chaque onglet
  const canViewData = hasPermission('view_clients');
  const canManageDocuments = hasPermission('edit_application');
  const canComment = hasPermission('edit_application');
  const canManualEvaluation = hasPermission('approve_without_validation') || hasPermission('edit_application');
  const canCorrectData = hasPermission('edit_application');
  const canSchedule = hasPermission('view_clients');
  const canGenerateReport = hasPermission('view_analytics');

  const tabs = [
    {
      id: 'consultation',
      label: 'Consultation',
      icon: User,
      description: 'Analyse automatique et données client',
      permission: canViewData
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      description: 'Justificatifs et pièces jointes',
      permission: canManageDocuments
    },
    {
      id: 'comments',
      label: 'Commentaires',
      icon: MessageSquare,
      description: 'Notes et évaluations',
      permission: canComment
    },
    {
      id: 'evaluation',
      label: 'Évaluation',
      icon: Scale,
      description: 'Décision manuelle',
      permission: canManualEvaluation
    },
    {
      id: 'correction',
      label: 'Correction',
      icon: Edit,
      description: 'Modification des données',
      permission: canCorrectData
    },
    {
      id: 'planning',
      label: 'Planning',
      icon: Calendar,
      description: 'RDV et relances',
      permission: canSchedule
    },
    {
      id: 'report',
      label: 'Rapport',
      icon: Download,
      description: 'Génération PDF',
      permission: canGenerateReport
    }
  ].filter(tab => tab.permission);

  return (
    <Card className="fintech-card w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Actions Agent - Évaluation de dossier
          </div>
          <Badge variant="outline" className="text-xs">
            {userRole} • Demande #{applicationId}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex flex-col items-center space-y-1 p-3 text-xs"
                title={tab.description}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Onglet Consultation */}
          <TabsContent value="consultation" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">🔍 Consultation de l'analyse automatique</h3>
              <p className="text-sm text-muted-foreground">
                Score généré par le modèle de machine learning et données client détaillées
              </p>
            </div>
            <ClientDataViewer formData={formData} applicationId={applicationId} />
          </TabsContent>

          {/* Onglet Documents */}
          <TabsContent value="documents" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">📎 Gestion des justificatifs</h3>
              <p className="text-sm text-muted-foreground">
                Consulter et ajouter des documents, télécharger les pièces justificatives
              </p>
            </div>
            <DocumentManager applicationId={applicationId} />
          </TabsContent>

          {/* Onglet Commentaires */}
          <TabsContent value="comments" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">💬 Notes d'évaluation</h3>
              <p className="text-sm text-muted-foreground">
                Ajouter des commentaires et expliquer les décisions
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ApplicationComments applicationId={applicationId} />
              <DecisionContest 
                applicationId={applicationId}
                currentDecision={currentDecision}
                currentScore={scorePercentage}
              />
            </div>
          </TabsContent>

          {/* Onglet Évaluation manuelle */}
          <TabsContent value="evaluation" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">⚖️ Évaluation manuelle</h3>
              <p className="text-sm text-muted-foreground">
                Valider ou refuser manuellement avec justification obligatoire
              </p>
            </div>
            <ManualEvaluation
              applicationId={applicationId}
              currentDecision={currentDecision}
              currentScore={scorePercentage}
              onDecisionChange={onDecisionChange}
            />
          </TabsContent>

          {/* Onglet Correction */}
          <TabsContent value="correction" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">🔁 Correction des données</h3>
              <p className="text-sm text-muted-foreground">
                Corriger les informations saisies par le client et re-soumettre au modèle
              </p>
            </div>
            <DataCorrection
              applicationId={applicationId}
              originalData={formData}
              onDataCorrected={onDataCorrected}
            />
          </TabsContent>

          {/* Onglet Planning */}
          <TabsContent value="planning" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">📅 Rendez-vous et relances</h3>
              <p className="text-sm text-muted-foreground">
                Planifier des RDV, envoyer des relances et gérer le suivi client
              </p>
            </div>
            <AppointmentScheduler applicationId={applicationId} />
          </TabsContent>

          {/* Onglet Rapport */}
          <TabsContent value="report" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">📜 Génération de rapport</h3>
              <p className="text-sm text-muted-foreground">
                Télécharger un résumé complet du dossier avec toutes les analyses
              </p>
            </div>
            <EvaluationReport
              applicationId={applicationId}
              result={result}
              formData={formData}
              evaluatorName={`${userRole} - Agent système`}
            />
          </TabsContent>
        </Tabs>

        {/* Footer avec informations de sécurité */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start space-x-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">🛡️ Bonnes pratiques de sécurité :</p>
              <ul className="mt-1 space-y-1">
                <li>• Toutes les actions sont journalisées dans l'audit log</li>
                <li>• Les décisions manuelles nécessitent une justification</li>
                <li>• Le modèle de ML ne peut jamais être modifié directement</li>
                <li>• Respecter les permissions selon votre rôle : {userRole}</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};