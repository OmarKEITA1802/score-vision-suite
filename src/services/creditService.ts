import { apiService } from './api';

export interface CreditPredictionRequest {
  familyCircumstances: string;
  activity: string;
  legalForm: string;
  isRenewal: number; // 0 ou 1
  revenues: number;
  charges: number;
  guaranteeEstimatedValue: number;
  amountAsked: number;
  debt: number;
}

export interface CreditPredictionResult {
  probability: number; // 0-1
  decision: 'APPROVED' | 'REJECTED';
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  shapValues: {
    feature: string;
    impact: number; // -1 à 1
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
  async predictCredit(data: CreditPredictionRequest): Promise<CreditPredictionResult> {
    try {
      // Simulation d'une prédiction réaliste
      return new Promise((resolve) => {
        setTimeout(() => {
          // Calcul simplifié du score basé sur les données
          const revenueRatio = data.revenues / (data.revenues + data.charges);
          const debtRatio = data.debt / data.revenues;
          const guaranteeRatio = data.guaranteeEstimatedValue / data.amountAsked;
          
          let baseScore = 0.5;
          
          // Facteurs positifs
          if (revenueRatio > 0.7) baseScore += 0.2;
          if (debtRatio < 0.3) baseScore += 0.15;
          if (guaranteeRatio > 1.2) baseScore += 0.1;
          if (data.isRenewal === 1) baseScore += 0.05;
          
          // Facteurs négatifs
          if (debtRatio > 0.6) baseScore -= 0.2;
          if (data.amountAsked > data.revenues * 2) baseScore -= 0.1;
          
          const probability = Math.max(0.1, Math.min(0.95, baseScore + (Math.random() - 0.5) * 0.1));
          
          const result: CreditPredictionResult = {
            probability,
            decision: probability > 0.6 ? 'APPROVED' : 'REJECTED',
            confidenceLevel: probability > 0.8 || probability < 0.3 ? 'HIGH' : 
                           probability > 0.65 || probability < 0.45 ? 'MEDIUM' : 'LOW',
            shapValues: [
              {
                feature: 'Ratio Revenus/Charges',
                impact: revenueRatio > 0.7 ? 0.3 : -0.2,
                value: `${(revenueRatio * 100).toFixed(1)}%`
              },
              {
                feature: 'Ratio d\'endettement',
                impact: debtRatio < 0.3 ? 0.2 : -0.25,
                value: `${(debtRatio * 100).toFixed(1)}%`
              },
              {
                feature: 'Garantie/Montant demandé',
                impact: guaranteeRatio > 1 ? 0.15 : -0.1,
                value: `${(guaranteeRatio * 100).toFixed(0)}%`
              }
            ],
            riskFactors: probability < 0.6 ? [
              'Ratio d\'endettement élevé',
              'Revenus insuffisants par rapport aux charges',
              'Montant demandé trop important'
            ] : [],
            recommendations: probability > 0.6 ? [
              'Profil financier solide',
              'Capacité de remboursement confirmée'
            ] : [
              'Réduire le montant demandé',
              'Augmenter la garantie',
              'Améliorer le ratio revenus/charges'
            ]
          };
          
          resolve(result);
        }, 2000); // Simulation du temps de traitement
      });
    } catch (error) {
      throw error;
    }
  }

  async getApplications(): Promise<CreditApplication[]> {
    // Simulation de données d'applications
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockApplications: CreditApplication[] = [
          {
            id: '1',
            clientId: 'client-1',
            clientName: 'Jean Dupont',
            clientEmail: 'jean.dupont@email.com',
            status: 'APPROVED',
            requestedAmount: 50000,
            score: 0.85,
            probability: 0.85,
            submittedAt: '2024-01-15T10:30:00Z',
            reviewedAt: '2024-01-16T14:20:00Z',
            reviewedBy: 'Agent Smith',
            data: {
              familyCircumstances: 'MARRIED_WITH_CHILDREN',
              activity: 'EMPLOYEE',
              legalForm: 'INDIVIDUAL',
              isRenewal: 0,
              revenues: 5000,
              charges: 2000,
              guaranteeEstimatedValue: 60000,
              amountAsked: 50000,
              debt: 10000
            }
          },
          {
            id: '2',
            clientId: 'client-2',
            clientName: 'Marie Martin',
            clientEmail: 'marie.martin@email.com',
            status: 'PENDING',
            requestedAmount: 25000,
            score: 0.72,
            probability: 0.72,
            submittedAt: '2024-01-20T09:15:00Z',
            data: {
              familyCircumstances: 'SINGLE',
              activity: 'SELF_EMPLOYED',
              legalForm: 'INDIVIDUAL',
              isRenewal: 1,
              revenues: 3500,
              charges: 1500,
              guaranteeEstimatedValue: 30000,
              amountAsked: 25000,
              debt: 5000
            }
          }
        ];
        resolve(mockApplications);
      }, 1000);
    });
  }

  async getClients(): Promise<ClientData[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockClients: ClientData[] = [
          {
            id: 'client-1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@email.com',
            phone: '+33 6 12 34 56 78',
            score: 0.85,
            lastScore: 0.80,
            status: 'ACTIVE',
            applications: 3,
            totalApproved: 2,
            lastActivity: '2024-01-16T14:20:00Z',
            createdAt: '2023-06-15T10:00:00Z'
          },
          {
            id: 'client-2',
            firstName: 'Marie',
            lastName: 'Martin',
            email: 'marie.martin@email.com',
            phone: '+33 6 87 65 43 21',
            score: 0.72,
            lastScore: 0.68,
            status: 'ACTIVE',
            applications: 1,
            totalApproved: 0,
            lastActivity: '2024-01-20T09:15:00Z',
            createdAt: '2023-11-20T15:30:00Z'
          }
        ];
        resolve(mockClients);
      }, 800);
    });
  }

  async getScoreSummary(): Promise<ScoreSummary> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockSummary: ScoreSummary = {
          totalApplications: 156,
          approvedApplications: 98,
          rejectedApplications: 45,
          pendingApplications: 13,
          averageScore: 0.68,
          approvalRate: 0.628,
          totalAmount: 2450000,
          monthlyTrend: [
            { month: 'Sep 2023', applications: 12, approved: 8, averageScore: 0.65 },
            { month: 'Oct 2023', applications: 18, approved: 11, averageScore: 0.67 },
            { month: 'Nov 2023', applications: 15, approved: 9, averageScore: 0.63 },
            { month: 'Dec 2023', applications: 22, approved: 14, averageScore: 0.69 },
            { month: 'Jan 2024', applications: 25, approved: 16, averageScore: 0.71 }
          ]
        };
        resolve(mockSummary);
      }, 600);
    });
  }
}

export const creditService = new CreditService();