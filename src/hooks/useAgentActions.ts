import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRolePermissions } from '@/contexts/RolePermissionContext';
import { auditService, AuditAction } from '@/services/auditService';
import { useToast } from '@/hooks/use-toast';

export interface AgentAction {
  type: AuditAction;
  label: string;
  description: string;
  requiresJustification: boolean;
  permission: string;
  icon: string;
}

export const AGENT_ACTIONS: AgentAction[] = [
  {
    type: 'add_comment',
    label: 'Ajouter un commentaire',
    description: 'Ajouter une note d\'évaluation au dossier',
    requiresJustification: false,
    permission: 'edit_application',
    icon: 'MessageSquare'
  },
  {
    type: 'contest_decision',
    label: 'Contester la décision',
    description: 'Remettre en question la décision automatique',
    requiresJustification: true,
    permission: 'edit_application',
    icon: 'AlertTriangle'
  },
  {
    type: 'manual_validation',
    label: 'Validation manuelle',
    description: 'Approuver manuellement une demande',
    requiresJustification: true,
    permission: 'approve_without_validation',
    icon: 'CheckCircle'
  },
  {
    type: 'manual_rejection',
    label: 'Refus manuel',
    description: 'Refuser manuellement une demande',
    requiresJustification: true,
    permission: 'edit_application',
    icon: 'XCircle'
  },
  {
    type: 'request_reevaluation',
    label: 'Demander réévaluation',
    description: 'Passer le dossier en révision manuelle',
    requiresJustification: true,
    permission: 'edit_application',
    icon: 'RotateCcw'
  },
  {
    type: 'correct_data',
    label: 'Corriger les données',
    description: 'Modifier les informations saisies par le client',
    requiresJustification: true,
    permission: 'edit_application',
    icon: 'Edit'
  },
  {
    type: 'schedule_appointment',
    label: 'Planifier RDV',
    description: 'Programmer un rendez-vous avec le client',
    requiresJustification: false,
    permission: 'view_clients',
    icon: 'Calendar'
  },
  {
    type: 'generate_report',
    label: 'Générer rapport PDF',
    description: 'Créer un rapport d\'évaluation complet',
    requiresJustification: false,
    permission: 'view_analytics',
    icon: 'FileText'
  }
];

export const useAgentActions = (applicationId: string) => {
  const { user } = useAuth();
  const { hasPermission } = useRolePermissions();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const executeAction = async (
    action: AuditAction,
    details: Record<string, any> = {},
    justification?: string
  ) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Utilisateur non authentifié'
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      // Vérifier les permissions
      const actionConfig = AGENT_ACTIONS.find(a => a.type === action);
      if (actionConfig && !hasPermission(actionConfig.permission as any)) {
        toast({
          variant: 'destructive',
          title: 'Permission refusée',
          description: `Vous n'avez pas la permission pour: ${actionConfig.label}`
        });
        return false;
      }

      // Vérifier la justification si requise
      if (actionConfig?.requiresJustification && !justification) {
        toast({
          variant: 'destructive',
          title: 'Justification requise',
          description: 'Cette action nécessite une justification'
        });
        return false;
      }

      // Vérifier les permissions avec le service d'audit
      const canExecute = await auditService.verifyActionPermission(
        user.id,
        action,
        applicationId
      );

      if (!canExecute) {
        toast({
          variant: 'destructive',
          title: 'Action bloquée',
          description: 'Cette action a été bloquée pour des raisons de sécurité'
        });
        return false;
      }

      // Logger l'action
      await auditService.logAction(
        user.id,
        user.email,
        action,
        applicationId,
        {
          ...details,
          justification,
          timestamp: new Date().toISOString()
        }
      );

      toast({
        title: 'Action exécutée',
        description: `${actionConfig?.label || action} effectuée avec succès`
      });

      return true;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Erreur lors de l\'exécution de l\'action'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableActions = (): AgentAction[] => {
    return AGENT_ACTIONS.filter(action => 
      hasPermission(action.permission as any)
    );
  };

  return {
    executeAction,
    getAvailableActions,
    isLoading
  };
};