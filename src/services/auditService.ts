import { apiService } from './api';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  applicationId: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
}

export type AuditAction = 
  | 'view_application'
  | 'add_comment' 
  | 'contest_decision'
  | 'upload_document'
  | 'download_document'
  | 'manual_validation'
  | 'manual_rejection'
  | 'request_reevaluation'
  | 'correct_data'
  | 'schedule_appointment'
  | 'send_follow_up'
  | 'generate_report'
  | 'modify_application';

class AuditService {
  // Enregistrer une action - connectez à votre API
  async logAction(
    userId: string,
    userName: string, 
    action: AuditAction,
    applicationId: string,
    details: Record<string, any> = {}
  ): Promise<void> {
    await apiService.post('/audit/log', {
      userId,
      userName,
      action,
      applicationId,
      details
    });
  }

  // Récupérer les logs d'une application
  async getApplicationLogs(applicationId: string): Promise<AuditLog[]> {
    return apiService.get<AuditLog[]>(`/audit/applications/${applicationId}`);
  }

  // Récupérer les logs d'un utilisateur
  async getUserLogs(userId: string, limit: number = 50): Promise<AuditLog[]> {
    return apiService.get<AuditLog[]>(`/audit/users/${userId}`, { limit });
  }

  // Vérifier les permissions d'action
  async verifyActionPermission(
    userId: string, 
    action: AuditAction, 
    applicationId: string
  ): Promise<boolean> {
    const response = await apiService.post<{ allowed: boolean }>('/audit/verify-permission', {
      userId,
      action,
      applicationId
    });
    return response.allowed;
  }
}

export const auditService = new AuditService();