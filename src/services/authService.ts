import { apiService } from './api';
import { User } from '@/contexts/AuthContext';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'client' | 'agent';
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Simulation d'une API réelle - remplace par l'appel API réel
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'admin@creditapp.com' && password === 'admin123') {
            resolve({
              user: {
                id: '1',
                email: 'admin@creditapp.com',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                createdAt: new Date().toISOString(),
              },
              token: 'mock-jwt-token-admin',
            });
          } else if (email === 'agent@creditapp.com' && password === 'agent123') {
            resolve({
              user: {
                id: '2',
                email: 'agent@creditapp.com',
                firstName: 'Agent',
                lastName: 'Smith',
                role: 'agent',
                createdAt: new Date().toISOString(),
              },
              token: 'mock-jwt-token-agent',
            });
          } else if (email === 'client@creditapp.com' && password === 'client123') {
            resolve({
              user: {
                id: '3',
                email: 'client@creditapp.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'client',
                createdAt: new Date().toISOString(),
              },
              token: 'mock-jwt-token-client',
            });
          } else {
            reject({ message: 'Identifiants invalides' });
          }
        }, 1500);
      });
    } catch (error) {
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<LoginResponse> {
    try {
      // Simulation d'une API réelle
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Vérification simple de l'email
          if (userData.email.includes('@')) {
            resolve({
              user: {
                id: Math.random().toString(36).substr(2, 9),
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role || 'client',
                createdAt: new Date().toISOString(),
              },
              token: `mock-jwt-token-${userData.role || 'client'}`,
            });
          } else {
            reject({ message: 'Format d\'email invalide' });
          }
        }, 1500);
      });
    } catch (error) {
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      // Simulation basée sur le token
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (token === 'mock-jwt-token-admin') {
            resolve({
              id: '1',
              email: 'admin@creditapp.com',
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              createdAt: new Date().toISOString(),
            });
          } else if (token === 'mock-jwt-token-agent') {
            resolve({
              id: '2',
              email: 'agent@creditapp.com',
              firstName: 'Agent',
              lastName: 'Smith',
              role: 'agent',
              createdAt: new Date().toISOString(),
            });
          } else if (token === 'mock-jwt-token-client') {
            resolve({
              id: '3',
              email: 'client@creditapp.com',
              firstName: 'John',
              lastName: 'Doe',
              role: 'client',
              createdAt: new Date().toISOString(),
            });
          } else {
            reject({ message: 'Token invalide' });
          }
        }, 800);
      });
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Nettoyage côté serveur si nécessaire
    localStorage.removeItem('auth_token');
  }

  async forgotPassword(email: string): Promise<void> {
    // Simulation d'envoi d'email de reset
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Email de réinitialisation envoyé à ${email}`);
        resolve();
      }, 1000);
    });
  }
}

export const authService = new AuthService();