import { apiService } from './api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'CLIENT' | 'AGENT' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  lastLogin?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'CLIENT' | 'AGENT';
}

class AuthService {
  // Connexion - connectez à votre API
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/login', {
      email,
      password
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  }

  // Inscription
  async register(userData: RegisterData): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/register', userData);
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  }

  // Profil utilisateur
  async getProfile(): Promise<User> {
    return apiService.get<User>('/auth/profile');
  }

  // Déconnexion
  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
    localStorage.removeItem('auth_token');
  }

  // Mot de passe oublié
  async forgotPassword(email: string): Promise<void> {
    await apiService.post('/auth/forgot-password', { email });
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Obtenir le token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

export const authService = new AuthService();