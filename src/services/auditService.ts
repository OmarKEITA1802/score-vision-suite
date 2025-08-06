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
  private logs: AuditLog[] = [];

  async logAction(
    userId: string,
    userName: string, 
    action: AuditAction,
    applicationId: string,
    details: Record<string, any> = {}
  ): Promise<void> {
    const logEntry: AuditLog = {
      id: crypto.randomUUID(),
      userId,
      userName,
      action,
      applicationId,
      details,
      timestamp: new Date(),
      ipAddress: await this.getClientIP()
    };

    this.logs.push(logEntry);
    
    // En production, ceci sauvegarderait dans Supabase
    console.log('Audit Log:', logEntry);
    
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async getApplicationLogs(applicationId: string): Promise<AuditLog[]> {
    return this.logs.filter(log => log.applicationId === applicationId);
  }

  async getUserLogs(userId: string, limit: number = 50): Promise<AuditLog[]> {
    return this.logs
      .filter(log => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private async getClientIP(): Promise<string> {
    // En production, récupérer la vraie IP
    return '127.0.0.1';
  }

  // Méthodes de vérification pour la compliance
  async verifyActionPermission(
    userId: string, 
    action: AuditAction, 
    applicationId: string
  ): Promise<boolean> {
    // Vérifications de sécurité et permissions
    const recentActions = await this.getUserLogs(userId, 10);
    
    // Exemples de vérifications :
    // - Limite du nombre d'actions par heure
    // - Vérification des permissions spécifiques
    // - Détection d'activité suspecte
    
    return true; // Simplifié pour la démo
  }
}

export const auditService = new AuditService();