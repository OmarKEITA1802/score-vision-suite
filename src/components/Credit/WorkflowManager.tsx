import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  MessageSquare,
  History,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

export type ApplicationStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'PENDING_DOCUMENTS' 
  | 'ANALYSIS' 
  | 'MANAGER_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'CANCELLED';

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending' | 'skipped';
  completedAt?: Date;
  completedBy?: string;
  duration?: number; // en heures
  comments?: string;
}

export interface WorkflowAction {
  id: string;
  type: 'approve' | 'reject' | 'request_documents' | 'escalate' | 'comment';
  label: string;
  requiresComment: boolean;
  nextStatus: ApplicationStatus;
  permissions: string[];
}

interface ApplicationWorkflow {
  id: string;
  applicationId: string;
  currentStatus: ApplicationStatus;
  steps: WorkflowStep[];
  history: Array<{
    id: string;
    action: string;
    performedBy: string;
    performedAt: Date;
    comment?: string;
    previousStatus: ApplicationStatus;
    newStatus: ApplicationStatus;
  }>;
  availableActions: WorkflowAction[];
}

const statusConfig = {
  DRAFT: { label: 'Brouillon', color: 'secondary', icon: Clock },
  SUBMITTED: { label: 'Soumise', color: 'default', icon: ArrowRight },
  UNDER_REVIEW: { label: 'En révision', color: 'default', icon: Clock },
  PENDING_DOCUMENTS: { label: 'Documents manquants', color: 'destructive', icon: AlertTriangle },
  ANALYSIS: { label: 'En analyse', color: 'default', icon: Clock },
  MANAGER_REVIEW: { label: 'Révision manager', color: 'secondary', icon: User },
  APPROVED: { label: 'Approuvée', color: 'secondary', icon: CheckCircle },
  REJECTED: { label: 'Rejetée', color: 'destructive', icon: XCircle },
  CANCELLED: { label: 'Annulée', color: 'secondary', icon: XCircle },
};

const mockWorkflow: ApplicationWorkflow = {
  id: 'wf-1',
  applicationId: 'app-123',
  currentStatus: 'ANALYSIS',
  steps: [
    {
      id: 'step-1',
      name: 'Soumission initiale',
      status: 'completed',
      completedAt: new Date('2024-01-15T10:30:00'),
      completedBy: 'Jean Dupont',
      duration: 0.5,
    },
    {
      id: 'step-2',
      name: 'Vérification documents',
      status: 'completed',
      completedAt: new Date('2024-01-15T14:20:00'),
      completedBy: 'Marie Martin',
      duration: 3.8,
    },
    {
      id: 'step-3',
      name: 'Analyse financière',
      status: 'current',
    },
    {
      id: 'step-4',
      name: 'Révision manager',
      status: 'pending',
    },
    {
      id: 'step-5',
      name: 'Décision finale',
      status: 'pending',
    },
  ],
  history: [
    {
      id: 'hist-1',
      action: 'Demande soumise',
      performedBy: 'Jean Dupont',
      performedAt: new Date('2024-01-15T10:30:00'),
      previousStatus: 'DRAFT',
      newStatus: 'SUBMITTED',
    },
    {
      id: 'hist-2',
      action: 'Documents vérifiés',
      performedBy: 'Marie Martin',
      performedAt: new Date('2024-01-15T14:20:00'),
      comment: 'Tous les documents requis sont présents et conformes',
      previousStatus: 'SUBMITTED',
      newStatus: 'UNDER_REVIEW',
    },
    {
      id: 'hist-3',
      action: 'Analyse démarrée',
      performedBy: 'Sophie Bernard',
      performedAt: new Date('2024-01-16T09:15:00'),
      previousStatus: 'UNDER_REVIEW',
      newStatus: 'ANALYSIS',
    },
  ],
  availableActions: [
    {
      id: 'approve',
      type: 'approve',
      label: 'Approuver',
      requiresComment: false,
      nextStatus: 'APPROVED',
      permissions: ['approve_application'],
    },
    {
      id: 'reject',
      type: 'reject',
      label: 'Rejeter',
      requiresComment: true,
      nextStatus: 'REJECTED',
      permissions: ['reject_application'],
    },
    {
      id: 'escalate',
      type: 'escalate',
      label: 'Escalader au manager',
      requiresComment: true,
      nextStatus: 'MANAGER_REVIEW',
      permissions: ['escalate_application'],
    },
    {
      id: 'request_docs',
      type: 'request_documents',
      label: 'Demander des documents',
      requiresComment: true,
      nextStatus: 'PENDING_DOCUMENTS',
      permissions: ['request_documents'],
    },
  ],
};

interface WorkflowManagerProps {
  applicationId: string;
  onActionPerformed?: (action: WorkflowAction, comment?: string) => void;
}

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  applicationId,
  onActionPerformed,
}) => {
  const [workflow] = useState<ApplicationWorkflow>(mockWorkflow);
  const [selectedAction, setSelectedAction] = useState<WorkflowAction | null>(null);
  const [comment, setComment] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleActionClick = (action: WorkflowAction) => {
    setSelectedAction(action);
    setComment('');
  };

  const handleActionConfirm = () => {
    if (selectedAction) {
      onActionPerformed?.(selectedAction, comment);
      setSelectedAction(null);
      setComment('');
    }
  };

  const StatusIcon = statusConfig[workflow.currentStatus].icon;

  return (
    <div className="space-y-6">
      {/* En-tête du statut */}
      <Card className="fintech-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-lg">Workflow de validation</CardTitle>
                <p className="text-sm text-muted-foreground">Demande #{workflow.applicationId}</p>
              </div>
            </div>
            <Badge 
              variant={statusConfig[workflow.currentStatus].color as any}
              className="text-sm"
            >
              {statusConfig[workflow.currentStatus].label}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Étapes du workflow */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Progression du dossier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflow.steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'completed' 
                        ? 'bg-success text-success-foreground' 
                        : step.status === 'current'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : step.status === 'current' ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  {index < workflow.steps.length - 1 && (
                    <div 
                      className={`w-0.5 h-12 mt-2 ${
                        step.status === 'completed' ? 'bg-success' : 'bg-muted'
                      }`} 
                    />
                  )}
                </div>
                
                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{step.name}</h4>
                    {step.duration && (
                      <span className="text-xs text-muted-foreground">
                        {step.duration}h
                      </span>
                    )}
                  </div>
                  
                  {step.completedAt && step.completedBy && (
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-3 w-3" />
                        <span>{step.completedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistance(step.completedAt, new Date(), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {step.comments && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <MessageSquare className="h-3 w-3 inline mr-1" />
                      {step.comments}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions disponibles */}
      {workflow.availableActions.length > 0 && (
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Actions disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {workflow.availableActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.type === 'approve' ? 'default' : 'outline'}
                  onClick={() => handleActionClick(action)}
                  className={
                    action.type === 'approve' 
                      ? 'btn-success' 
                      : action.type === 'reject'
                      ? 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'
                      : ''
                  }
                >
                  {action.label}
                </Button>
              ))}
            </div>
            
            {selectedAction && (
              <div className="mt-4 p-4 border border-border rounded-lg bg-accent/50">
                <h4 className="font-medium mb-3">
                  {selectedAction.label}
                </h4>
                
                {selectedAction.requiresComment && (
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="comment">Commentaire</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Ajoutez un commentaire explicatif..."
                      rows={3}
                    />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleActionConfirm}
                    disabled={selectedAction.requiresComment && !comment.trim()}
                  >
                    Confirmer
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedAction(null)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Historique */}
      <Card className="fintech-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historique
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Masquer' : 'Afficher'}
            </Button>
          </div>
        </CardHeader>
        
        {showHistory && (
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {workflow.history.map((entry) => (
                  <div key={entry.id} className="flex gap-3 pb-3 border-b border-border last:border-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{entry.action}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistance(entry.performedAt, new Date(), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-1">
                        Par {entry.performedBy}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="text-xs">
                          {statusConfig[entry.previousStatus].label}
                        </Badge>
                        <ArrowRight className="h-3 w-3" />
                        <Badge variant="outline" className="text-xs">
                          {statusConfig[entry.newStatus].label}
                        </Badge>
                      </div>
                      
                      {entry.comment && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          {entry.comment}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        )}
      </Card>
    </div>
  );
};