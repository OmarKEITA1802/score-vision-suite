import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw,
  Scale,
  FileText
} from 'lucide-react';
import { useAgentActions } from '@/hooks/useAgentActions';

interface ManualEvaluationProps {
  applicationId: string;
  currentDecision: 'approved' | 'rejected';
  currentScore: number;
  onDecisionChange?: (decision: string, justification: string) => void;
}

const REJECTION_REASONS = [
  { value: 'insufficient_income', label: 'Revenus insuffisants' },
  { value: 'high_debt_ratio', label: 'Taux d\'endettement trop élevé' },
  { value: 'incomplete_documents', label: 'Documents incomplets' },
  { value: 'negative_credit_history', label: 'Historique de crédit négatif' },
  { value: 'unstable_employment', label: 'Emploi instable' },
  { value: 'other', label: 'Autre raison' }
];

const APPROVAL_REASONS = [
  { value: 'strong_guarantees', label: 'Garanties solides non détectées' },
  { value: 'stable_income_source', label: 'Source de revenus très stable' },
  { value: 'exceptional_circumstances', label: 'Circonstances exceptionnelles' },
  { value: 'additional_information', label: 'Informations complémentaires favorables' },
  { value: 'human_judgment', label: 'Jugement humain favorable' },
  { value: 'other', label: 'Autre raison' }
];

const REEVALUATION_REASONS = [
  { value: 'missing_information', label: 'Informations manquantes' },
  { value: 'data_inconsistency', label: 'Incohérence dans les données' },
  { value: 'need_supervisor', label: 'Besoin d\'un superviseur' },
  { value: 'complex_case', label: 'Cas complexe nécessitant expertise' },
  { value: 'other', label: 'Autre raison' }
];

export const ManualEvaluation: React.FC<ManualEvaluationProps> = ({
  applicationId,
  currentDecision,
  currentScore,
  onDecisionChange
}) => {
  const { executeAction, isLoading } = useAgentActions(applicationId);
  const [justification, setJustification] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'approve' | 'reject' | 'reevaluate';
    label: string;
  } | null>(null);

  const handleAction = async (
    actionType: 'manual_validation' | 'manual_rejection' | 'request_reevaluation',
    decision: string
  ) => {
    if (!selectedReason || !justification.trim()) {
      return;
    }

    const success = await executeAction(actionType, {
      originalDecision: currentDecision,
      originalScore: currentScore,
      newDecision: decision,
      reason: selectedReason,
      justification: justification.trim()
    }, justification);

    if (success) {
      onDecisionChange?.(decision, justification);
      setJustification('');
      setSelectedReason('');
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const openConfirmDialog = (action: { type: 'approve' | 'reject' | 'reevaluate'; label: string }) => {
    setPendingAction(action);
    setShowConfirmDialog(true);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approve': return 'text-success';
      case 'reject': return 'text-destructive';
      case 'reevaluate': return 'text-warning';
      default: return 'text-primary';
    }
  };

  const getReasonOptions = () => {
    if (pendingAction?.type === 'approve') return APPROVAL_REASONS;
    if (pendingAction?.type === 'reject') return REJECTION_REASONS;
    if (pendingAction?.type === 'reevaluate') return REEVALUATION_REASONS;
    return [];
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scale className="h-5 w-5 mr-2 text-primary" />
          Évaluation manuelle
        </CardTitle>
        <div className="flex items-center space-x-3">
          <Badge variant={currentDecision === 'approved' ? 'default' : 'destructive'}>
            Décision actuelle: {currentDecision === 'approved' ? 'Approuvé' : 'Refusé'}
          </Badge>
          <Badge variant="outline">
            Score: {currentScore}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Validation manuelle */}
          <Button
            variant={currentDecision === 'approved' ? 'outline' : 'default'}
            className={`w-full h-20 flex flex-col space-y-2 ${getActionColor('approve')}`}
            onClick={() => openConfirmDialog({ type: 'approve', label: 'Approuver manuellement' })}
            disabled={isLoading}
          >
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-sm font-medium">Approuver</span>
          </Button>

          {/* Refus manuel */}
          <Button
            variant={currentDecision === 'rejected' ? 'outline' : 'destructive'}
            className={`w-full h-20 flex flex-col space-y-2 ${getActionColor('reject')}`}
            onClick={() => openConfirmDialog({ type: 'reject', label: 'Refuser manuellement' })}
            disabled={isLoading}
          >
            <XCircle className="h-6 w-6" />
            <span className="text-sm font-medium">Refuser</span>
          </Button>

          {/* Demande de réévaluation */}
          <Button
            variant="outline"
            className={`w-full h-20 flex flex-col space-y-2 ${getActionColor('reevaluate')}`}
            onClick={() => openConfirmDialog({ type: 'reevaluate', label: 'Demander réévaluation' })}
            disabled={isLoading}
          >
            <RotateCcw className="h-6 w-6" />
            <span className="text-sm font-medium">Réévaluer</span>
          </Button>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Important</p>
              <p className="text-muted-foreground">
                Toute décision manuelle doit être justifiée et sera tracée dans l'audit log.
                Assurez-vous d'avoir toutes les informations nécessaires avant de valider.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Dialog de confirmation */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              {pendingAction?.type === 'approve' && <CheckCircle2 className="h-5 w-5 mr-2 text-success" />}
              {pendingAction?.type === 'reject' && <XCircle className="h-5 w-5 mr-2 text-destructive" />}
              {pendingAction?.type === 'reevaluate' && <RotateCcw className="h-5 w-5 mr-2 text-warning" />}
              {pendingAction?.label}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action remplacera la décision automatique du système. 
              Veuillez fournir une justification détaillée.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Motif *</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un motif..." />
                </SelectTrigger>
                <SelectContent>
                  {getReasonOptions().map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="justification">Justification détaillée *</Label>
              <Textarea
                id="justification"
                placeholder="Expliquez en détail les raisons de votre décision..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingAction) {
                  const actionMap = {
                    'approve': 'manual_validation' as const,
                    'reject': 'manual_rejection' as const,
                    'reevaluate': 'request_reevaluation' as const
                  };
                  
                  const decisionMap = {
                    'approve': 'approved',
                    'reject': 'rejected',
                    'reevaluate': 'under_review'
                  };
                  
                  handleAction(
                    actionMap[pendingAction.type], 
                    decisionMap[pendingAction.type]
                  );
                }
              }}
              disabled={!selectedReason || !justification.trim() || isLoading}
              className={
                pendingAction?.type === 'reject' ? 'bg-destructive hover:bg-destructive/90' :
                pendingAction?.type === 'reevaluate' ? 'bg-warning hover:bg-warning/90' :
                ''
              }
            >
              {isLoading ? 'En cours...' : 'Confirmer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};