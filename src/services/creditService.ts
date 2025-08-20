import { apiService } from './api';

export interface CreditPredictionRequest {
  familyCircumstances: string;
  activity: string;
  legalForm: string;
  isRenewal: number;
  revenues: number;
  charges: number;
  guaranteeEstimatedValue: number;
  amountAsked: number;
  debt: number;
}

export interface CreditPredictionResult {
  probability: number;
  decision: 'APPROVED' | 'REJECTED';
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  shapValues: {
    feature: string;
    impact: number;
    value: string | number;
  }[];
  riskFactors: string[];
  recommendations: string[];
}

export interface CreditApplication {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  requestedAmount: number;
  score: number;
  probability: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  data: CreditPredictionRequest;
  result?: CreditPredictionResult;
}

export interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  profession?: string;
  monthlyIncome?: number;
  currentDebt?: number;
  debtRatio?: number;
  score: number;
  lastScore: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BLACKLISTED';
  applications: number;
  totalApproved: number;
  lastActivity: string;
  createdAt: string;
}

export interface ScoreSummary {
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  averageScore: number;
  approvalRate: number;
  totalAmount: number;
  monthlyTrend: {
    month: string;
    applications: number;
    approved: number;
    averageScore: number;
  }[];
}

class CreditService {
  // Prédiction de crédit - connectez à votre API
  async predictCredit(data: CreditPredictionRequest): Promise<CreditPredictionResult> {
    return apiService.post<CreditPredictionResult>('/credit/predict', data);
  }

  // Applications de crédit
  async getApplications(): Promise<CreditApplication[]> {
    return apiService.get<CreditApplication[]>('/credit/applications');
  }

  async getApplication(id: string): Promise<CreditApplication> {
    return apiService.get<CreditApplication>(`/credit/applications/${id}`);
  }

  async createApplication(data: CreditPredictionRequest): Promise<CreditApplication> {
    return apiService.post<CreditApplication>('/credit/applications', data);
  }

  async updateApplication(id: string, updates: Partial<CreditApplication>): Promise<CreditApplication> {
    return apiService.put<CreditApplication>(`/credit/applications/${id}`, updates);
  }

  // Clients
  async getClients(): Promise<ClientData[]> {
    return apiService.get<ClientData[]>('/clients');
  }

  async getClientDetails(clientId: string): Promise<ClientData> {
    return apiService.get<ClientData>(`/clients/${clientId}`);
  }

  async getClientApplications(clientId: string): Promise<CreditApplication[]> {
    return apiService.get<CreditApplication[]>(`/clients/${clientId}/applications`);
  }

  async updateClient(clientId: string, updates: Partial<ClientData>): Promise<ClientData> {
    return apiService.put<ClientData>(`/clients/${clientId}`, updates);
  }

  async deleteClient(clientId: string): Promise<boolean> {
    await apiService.delete(`/clients/${clientId}`);
    return true;
  }

  // Statistiques
  async getScoreSummary(): Promise<ScoreSummary> {
    return apiService.get<ScoreSummary>('/credit/summary');
  }
}

export const creditService = new CreditService();