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
    <Card className="fintech-card w-full shadow-lg">
      <CardHeader className="pb-8">
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-primary" />
            <span>Actions Agent - Évaluation de dossier</span>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {userRole} • Demande #{applicationId}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-10 p-2 h-auto bg-muted/50">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex flex-col items-center space-y-2 p-4 text-xs min-h-[80px] transition-all duration-200 hover:bg-accent/50"
                title={tab.description}
              >
                <tab.icon className="h-5 w-5" />
                <span className="hidden sm:inline font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Onglet Consultation */}
          <TabsContent value="consultation" className="space-y-8">
            <div className="text-center mb-8 px-6">
              <h3 className="text-xl font-semibold mb-3">🔍 Consultation de l'analyse automatique</h3>
              <p className="text-muted-foreground leading-relaxed">
                Score généré par le modèle de machine learning et données client détaillées
              </p>
            </div>
            <div className="px-4">
              <ClientDataViewer formData={formData} applicationId={applicationId} />
            </div>
          </TabsContent>

          {/* Onglet Documents */}
          <TabsContent value="documents" className="space-y-8">
            <div className="text-center mb-8 px-6">
              <h3 className="text-xl font-semibold mb-3">📎 Gestion des justificatifs</h3>
              <p className="text-muted-foreground leading-relaxed">
                Consulter et ajouter des documents, télécharger les pièces justificatives
              </p>
            </div>
            <div className="px-4">
              <DocumentManager applicationId={applicationId} />
            </div>
          </TabsContent>

          {/* Onglet Commentaires */}
          <TabsContent value="comments" className="space-y-8">
            <div className="text-center mb-8 px-6">
              <h3 className="text-xl font-semibold mb-3">💬 Notes d'évaluation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ajouter des commentaires et expliquer les décisions
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
              <ApplicationComments applicationId={applicationId} />
              <DecisionContest 
                applicationId={applicationId}
                currentDecision={currentDecision}
                currentScore={scorePercentage}
              />
            </div>
          </TabsContent>

          {/* Onglet Évaluation manuelle */}
          <TabsContent value="evaluation" className="space-y-8">
            <div className="text-center mb-8 px-6">
              <h3 className="text-xl font-semibold mb-3">⚖️ Évaluation manuelle</h3>
              <p className="text-muted-foreground leading-relaxed">
                Valider ou refuser manuellement avec justification obligatoire
              </p>
            </div>
            <div className="px-4">
              <ManualEvaluation
                applicationId={applicationId}
                currentDecision={currentDecision}
                currentScore={scorePercentage}
                onDecisionChange={onDecisionChange}
              />
            </div>
          </TabsContent>

          {/* Onglet Correction */}
          <TabsContent value="correction" className="space-y-8">
            <div className="text-center mb-8 px-6">
              <h3 className="text-xl font-semibold mb-3">🔁 Correction des données</h3>
              <p className="text-muted-foreground leading-relaxed">
                Corriger les informations saisies par le client et re-soumettre au modèle
              </p>
            </div>
            <div className="px-4">
              <DataCorrection
                applicationId={applicationId}
                originalData={formData}
                onDataCorrected={onDataCorrected}
              />
            </div>
          </TabsContent>

          {/* Onglet Planning */}
          <TabsContent value="planning" className="space-y-8">
            <div className="text-center mb-8 px-6">
              <h3 className="text-xl font-semibold mb-3">📅 Rendez-vous et relances</h3>
              <p className="text-muted-foreground leading-relaxed">
                Planifier des RDV, envoyer des relances et gérer le suivi client
              </p>
            </div>
            <div className="px-4">
              <AppointmentScheduler applicationId={applicationId} />
            </div>
          </TabsContent>

          {/* Onglet Rapport */}
          <TabsContent value="report" className="space-y-8">
            <div className="text-center mb-8 px-6">
              <h3 className="text-xl font-semibold mb-3">📜 Génération de rapport</h3>
              <p className="text-muted-foreground leading-relaxed">
                Télécharger un résumé complet du dossier avec toutes les analyses
              </p>
            </div>
            <div className="px-4">
              <EvaluationReport
                applicationId={applicationId}
                result={result}
                formData={formData}
                evaluatorName={`${userRole} - Agent système`}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer avec informations de sécurité */}
        <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-muted/40">
          <div className="flex items-start space-x-4 text-sm text-muted-foreground">
            <Shield className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
            <div className="space-y-3">
              <p className="font-medium text-foreground">🛡️ Bonnes pratiques de sécurité :</p>
              <ul className="space-y-2 leading-relaxed">
                <li>• Toutes les actions sont journalisées dans l'audit log</li>
                <li>• Les décisions manuelles nécessitent une justification</li>
                <li>• Le modèle de ML ne peut jamais être modifié directement</li>
                <li>• Respecter les permissions selon votre rôle : <span className="font-medium text-primary">{userRole}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};