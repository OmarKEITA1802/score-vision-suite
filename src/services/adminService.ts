import { apiService } from './api';

// Types pour l'administration
export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'agent' | 'client';
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}

export interface MLModel {
  id: string;
  name: string;
  version: string;
  file_path: string;
  is_active: boolean;
  performance_metrics: {
    roc_auc: number;
    precision: number;
    recall: number;
    f1_score: number;
  };
  decision_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: any;
  timestamp: string;
  ip_address: string;
}

export interface SystemStats {
  total_applications: number;
  approved_applications: number;
  rejected_applications: number;
  pending_applications: number;
  total_users: number;
  active_users: number;
  model_accuracy: number;
  daily_volume: Array<{
    date: string;
    count: number;
  }>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  is_default: boolean;
  template_type: 'approval' | 'rejection' | 'request_info' | 'appointment';
  created_at: string;
}

class AdminService {
  // ==================== GESTION UTILISATEURS ====================
  
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<{ users: User[]; total: number }> {
    return apiService.get('/admin/users/', params);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    return apiService.post('/admin/users/', userData);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    return apiService.put(`/admin/users/${userId}/`, userData);
  }

  async deleteUser(userId: string): Promise<void> {
    return apiService.delete(`/admin/users/${userId}/`);
  }

  async resetUserPassword(userId: string): Promise<{ message: string }> {
    return apiService.post(`/admin/users/${userId}/reset-password/`);
  }

  async getUserLoginHistory(userId: string): Promise<Array<{
    timestamp: string;
    ip_address: string;
    user_agent: string;
  }>> {
    return apiService.get(`/admin/users/${userId}/login-history/`);
  }

  // ==================== GESTION MODÈLES ML ====================
  
  async getModels(): Promise<MLModel[]> {
    return apiService.get('/admin/ml-models/');
  }

  async uploadModel(file: File, metadata: {
    name: string;
    version: string;
    decision_threshold: number;
  }): Promise<MLModel> {
    const formData = new FormData();
    formData.append('model_file', file);
    formData.append('metadata', JSON.stringify(metadata));
    
    return apiService.uploadFile('/admin/ml-models/', file);
  }

  async activateModel(modelId: string): Promise<{ message: string }> {
    return apiService.post(`/admin/ml-models/${modelId}/activate/`);
  }

  async deactivateModel(modelId: string): Promise<{ message: string }> {
    return apiService.post(`/admin/ml-models/${modelId}/deactivate/`);
  }

  async deleteModel(modelId: string): Promise<void> {
    return apiService.delete(`/admin/ml-models/${modelId}/`);
  }

  async getModelPerformance(modelId: string): Promise<{
    confusion_matrix: number[][];
    roc_curve_data: Array<{ fpr: number; tpr: number }>;
    feature_importance: Array<{ feature: string; importance: number }>;
  }> {
    return apiService.get(`/admin/ml-models/${modelId}/performance/`);
  }

  async reEvaluateAllApplications(modelId: string): Promise<{
    task_id: string;
    message: string;
  }> {
    return apiService.post(`/admin/ml-models/${modelId}/re-evaluate-all/`);
  }

  // ==================== STATISTIQUES & MONITORING ====================
  
  async getSystemStats(period?: '7d' | '30d' | '90d'): Promise<SystemStats> {
    return apiService.get('/admin/stats/', { period });
  }

  async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    user_id?: string;
    action?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    return apiService.get('/admin/audit-logs/', params);
  }

  async exportAuditLogs(params: {
    start_date: string;
    end_date: string;
    format: 'csv' | 'xlsx';
  }): Promise<Blob> {
    const response = await apiService.client.get('/admin/audit-logs/export/', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  // ==================== TEMPLATES & COMMUNICATIONS ====================
  
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return apiService.get('/admin/email-templates/');
  }

  async createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'created_at'>): Promise<EmailTemplate> {
    return apiService.post('/admin/email-templates/', template);
  }

  async updateEmailTemplate(templateId: string, template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    return apiService.put(`/admin/email-templates/${templateId}/`, template);
  }

  async deleteEmailTemplate(templateId: string): Promise<void> {
    return apiService.delete(`/admin/email-templates/${templateId}/`);
  }

  async previewEmailTemplate(templateId: string, variables: Record<string, any>): Promise<{
    subject: string;
    body: string;
  }> {
    return apiService.post(`/admin/email-templates/${templateId}/preview/`, { variables });
  }

  // ==================== CONFORMITÉ & RGPD ====================
  
  async exportUserData(userId: string): Promise<Blob> {
    const response = await apiService.client.get(`/admin/users/${userId}/export-data/`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async getShapExplanation(applicationId: string): Promise<{
    shap_values: number[];
    features: string[];
    base_value: number;
    plot_url: string;
  }> {
    return apiService.get(`/admin/applications/${applicationId}/shap-explanation/`);
  }

  async generateComplianceReport(params: {
    start_date: string;
    end_date: string;
    include_decisions: boolean;
    include_manual_overrides: boolean;
  }): Promise<{
    report_id: string;
    download_url: string;
  }> {
    return apiService.post('/admin/compliance/generate-report/', params);
  }

  // ==================== MAINTENANCE & SYSTÈME ====================
  
  async cleanupOldData(params: {
    older_than_days: number;
    include_logs: boolean;
    include_files: boolean;
  }): Promise<{
    deleted_count: number;
    freed_space_mb: number;
  }> {
    return apiService.post('/admin/maintenance/cleanup/', params);
  }

  async createBackup(): Promise<{
    backup_id: string;
    download_url: string;
    size_mb: number;
  }> {
    return apiService.post('/admin/maintenance/backup/');
  }

  async getSystemHealth(): Promise<{
    database_status: 'healthy' | 'warning' | 'error';
    redis_status: 'healthy' | 'warning' | 'error';
    disk_usage_percent: number;
    memory_usage_percent: number;
    active_connections: number;
  }> {
    return apiService.get('/admin/system/health/');
  }

  // ==================== PARAMÈTRES GLOBAUX ====================
  
  async getSystemSettings(): Promise<Record<string, any>> {
    return apiService.get('/admin/settings/');
  }

  async updateSystemSettings(settings: Record<string, any>): Promise<Record<string, any>> {
    return apiService.put('/admin/settings/', settings);
  }

  async uploadLogo(file: File): Promise<{ logo_url: string }> {
    return apiService.uploadFile('/admin/settings/logo/', file);
  }
}

export const adminService = new AdminService();