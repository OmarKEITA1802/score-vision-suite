import { apiService } from './api';
import { User } from './authService';

export type { User } from './authService';

export interface MLModel {
  id: string;
  name: string;
  version: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TRAINING';
  accuracy: number;
  createdAt: string;
  lastUsed?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  successRate: number;
  averageScore: number;
  serverHealth: 'GOOD' | 'WARNING' | 'CRITICAL';
  dailyVolume: Array<{
    date: string;
    count: number;
  }>;
  modelAccuracy: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'APPROVAL' | 'REJECTION' | 'REMINDER';
  isActive: boolean;
}

class AdminService {
  // Gestion des utilisateurs
  async getUsers(searchTerm?: string, roleFilter?: string): Promise<User[]> {
    return apiService.get<User[]>('/api/v1/users', { searchTerm, roleFilter });
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return apiService.post<User>('/api/v1/users', userData);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return apiService.put<User>(`/api/v1/users/${userId}`, updates);
  }

  async deleteUser(userId: string): Promise<void> {
    await apiService.delete(`/api/v1/users/${userId}`);
  }

  async resetUserPassword(userId: string): Promise<void> {
    await apiService.post(`/api/v1/users/${userId}/reset-password`);
  }

  async getUserLoginHistory(userId: string): Promise<Array<{
    id: string;
    loginTime: string;
    ipAddress: string;
    userAgent: string;
    success: boolean;
  }>> {
    return apiService.get(`/api/v1/users/${userId}/login-history`);
  }

  // Modèles ML
  async getModels(): Promise<MLModel[]> {
    return apiService.get<MLModel[]>('/api/v1/ml-models');
  }

  async uploadModel(file: File, onProgress?: (progress: number) => void): Promise<MLModel> {
    return apiService.uploadFile<MLModel>('/api/v1/ml-models/upload', file, onProgress);
  }

  async activateModel(modelId: string): Promise<void> {
    await apiService.post(`/api/v1/ml-models/${modelId}/activate`);
  }

  async deactivateModel(modelId: string): Promise<void> {
    await apiService.post(`/api/v1/ml-models/${modelId}/deactivate`);
  }

  async deleteModel(modelId: string): Promise<void> {
    await apiService.delete(`/api/v1/ml-models/${modelId}`);
  }

  async getModelPerformance(modelId: string): Promise<{
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: number[][];
    rocCurve: Array<{ fpr: number; tpr: number; threshold: number }>;
  }> {
    return apiService.get(`/api/v1/ml-models/${modelId}/performance`);
  }

  async reEvaluateAllApplications(modelId: string): Promise<{ jobId: string; estimatedTime: number }> {
    return apiService.post(`/api/v1/ml-models/${modelId}/re-evaluate`);
  }

  // Statistiques système
  async getSystemStats(): Promise<SystemStats> {
    return apiService.get<SystemStats>('/api/v1/admin/stats');
  }

  // Logs d'audit
  async getAuditLogs(userId?: string, page: number = 1, limit: number = 50): Promise<{
    logs: AuditLog[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return apiService.get('/api/v1/audit-logs', { userId, page, limit });
  }

  async exportAuditLogs(startDate: string, endDate: string, format: 'CSV' | 'JSON' | 'PDF' = 'CSV'): Promise<Blob> {
    const response = await apiService.client.get('/api/v1/audit-logs/export', {
      params: { startDate, endDate, format },
      responseType: 'blob'
    });
    return response.data;
  }

  // Génération de rapports
  async generateComplianceReport(): Promise<{ reportUrl: string }> {
    return apiService.post<{ reportUrl: string }>('/api/v1/admin/compliance-report');
  }

  // Templates d'email
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return apiService.get<EmailTemplate[]>('/api/v1/email-templates');
  }

  async createEmailTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    return apiService.post<EmailTemplate>('/api/v1/email-templates', template);
  }

  async updateEmailTemplate(templateId: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> {
    return apiService.put<EmailTemplate>(`/api/v1/email-templates/${templateId}`, updates);
  }

  async deleteEmailTemplate(templateId: string): Promise<void> {
    await apiService.delete(`/api/v1/email-templates/${templateId}`);
  }

  async previewEmailTemplate(templateId: string, data: Record<string, any>): Promise<{
    subject: string;
    htmlBody: string;
    textBody: string;
  }> {
    return apiService.post(`/api/v1/email-templates/${templateId}/preview`, { data });
  }

  // Conformité et GDPR
  async exportUserData(userId: string, format: 'JSON' | 'PDF' = 'JSON'): Promise<Blob> {
    const response = await apiService.client.get(`/api/v1/users/${userId}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }

  async getShapExplanation(applicationId: string): Promise<{
    shapValues: Array<{
      feature: string;
      value: number;
      impact: number;
      description: string;
    }>;
    baseValue: number;
    prediction: number;
  }> {
    return apiService.get(`/api/v1/applications/${applicationId}/shap-explanation`);
  }

  // Maintenance système
  async createBackup(): Promise<{ success: boolean; backupId: string }> {
    return apiService.post('/api/v1/admin/backup');
  }

  async getSystemHealth(): Promise<{
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    checks: Array<{
      name: string;
      status: 'PASS' | 'FAIL';
      message?: string;
      lastChecked: string;
    }>;
    uptime: number;
    version: string;
  }> {
    return apiService.get('/api/v1/admin/health');
  }

  async cleanupOldData(retentionDays: number): Promise<{
    deletedRecords: number;
    freedSpace: string;
    success: boolean;
  }> {
    return apiService.post('/api/v1/admin/cleanup', { retentionDays });
  }

  // Paramètres globaux
  async getSystemSettings(): Promise<{
    maintenanceMode: boolean;
    allowRegistration: boolean;
    maxFileSize: number;
    emailNotifications: boolean;
    auditRetentionDays: number;
    defaultUserRole: string;
    companyInfo: {
      name: string;
      logo: string;
      address: string;
      phone: string;
      email: string;
    };
  }> {
    return apiService.get('/api/v1/admin/settings');
  }

  async updateSystemSettings(settings: Partial<{
    maintenanceMode: boolean;
    allowRegistration: boolean;
    maxFileSize: number;
    emailNotifications: boolean;
    auditRetentionDays: number;
    defaultUserRole: string;
    companyInfo: {
      name: string;
      logo: string;
      address: string;
      phone: string;
      email: string;
    };
  }>): Promise<void> {
    await apiService.put('/api/v1/admin/settings', settings);
  }

  async uploadLogo(file: File): Promise<{ logoUrl: string }> {
    return apiService.uploadFile<{ logoUrl: string }>('/api/v1/admin/upload-logo', file);
  }
}

export const adminService = new AdminService();