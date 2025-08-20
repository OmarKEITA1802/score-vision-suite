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
  dailyVolume: number;
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
    return apiService.get<User[]>('/admin/users', { searchTerm, roleFilter });
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return apiService.post<User>('/admin/users', userData);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return apiService.put<User>(`/admin/users/${userId}`, updates);
  }

  async deleteUser(userId: string): Promise<void> {
    await apiService.delete(`/admin/users/${userId}`);
  }

  async resetUserPassword(userId: string): Promise<void> {
    await apiService.post(`/admin/users/${userId}/reset-password`);
  }

  // Modèles ML
  async getModels(): Promise<MLModel[]> {
    return apiService.get<MLModel[]>('/admin/models');
  }

  async uploadModel(file: File): Promise<MLModel> {
    return apiService.uploadFile<MLModel>('/admin/models/upload', file);
  }

  async activateModel(modelId: string): Promise<void> {
    await apiService.post(`/admin/models/${modelId}/activate`);
  }

  async deactivateModel(modelId: string): Promise<void> {
    await apiService.post(`/admin/models/${modelId}/deactivate`);
  }

  async deleteModel(modelId: string): Promise<void> {
    await apiService.delete(`/admin/models/${modelId}`);
  }

  // Statistiques système
  async getSystemStats(): Promise<SystemStats> {
    return apiService.get<SystemStats>('/admin/stats');
  }

  // Logs d'audit
  async getAuditLogs(userId?: string, page: number = 1, limit: number = 50): Promise<{
    logs: AuditLog[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return apiService.get('/admin/audit-logs', { userId, page, limit });
  }

  // Génération de rapports
  async generateComplianceReport(): Promise<{ reportUrl: string }> {
    return apiService.post<{ reportUrl: string }>('/admin/compliance-report');
  }

  // Templates d'email
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return apiService.get<EmailTemplate[]>('/admin/email-templates');
  }

  async createEmailTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    return apiService.post<EmailTemplate>('/admin/email-templates', template);
  }

  async updateEmailTemplate(templateId: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> {
    return apiService.put<EmailTemplate>(`/admin/email-templates/${templateId}`, updates);
  }

  async deleteEmailTemplate(templateId: string): Promise<void> {
    await apiService.delete(`/admin/email-templates/${templateId}`);
  }

  // Maintenance système
  async createBackup(): Promise<{ success: boolean; backupId: string }> {
    return apiService.post('/admin/backup');
  }

  async getSystemHealth(): Promise<{
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    checks: Array<{
      name: string;
      status: 'PASS' | 'FAIL';
      message?: string;
    }>;
  }> {
    return apiService.get('/admin/health');
  }
}

export const adminService = new AdminService();