// Configuration des endpoints API
export const API_CONFIG = {
  // Changez cette URL pour pointer vers votre backend
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  
  // Endpoints pour votre API
  ENDPOINTS: {
    // Authentification
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/auth/profile',
      LOGOUT: '/auth/logout',
      FORGOT_PASSWORD: '/auth/forgot-password'
    },
    
    // Crédit
    CREDIT: {
      PREDICT: '/credit/predict',
      APPLICATIONS: '/credit/applications',
      SUMMARY: '/credit/summary'
    },
    
    // Clients
    CLIENTS: {
      LIST: '/clients',
      DETAILS: (id: string) => `/clients/${id}`,
      APPLICATIONS: (id: string) => `/clients/${id}/applications`,
      UPDATE: (id: string) => `/clients/${id}`,
      DELETE: (id: string) => `/clients/${id}`
    },
    
    // Administration
    ADMIN: {
      USERS: '/admin/users',
      MODELS: '/admin/models',
      STATS: '/admin/stats',
      AUDIT_LOGS: '/admin/audit-logs',
      EMAIL_TEMPLATES: '/admin/email-templates',
      BACKUP: '/admin/backup',
      HEALTH: '/admin/health',
      COMPLIANCE_REPORT: '/admin/compliance-report'
    },
    
    // Audit
    AUDIT: {
      LOG: '/audit/log',
      APPLICATIONS: (id: string) => `/audit/applications/${id}`,
      USERS: (id: string) => `/audit/users/${id}`,
      VERIFY_PERMISSION: '/audit/verify-permission'
    }
  }
};

// Instructions pour connecter vos API :
/*
1. Changez la variable BASE_URL dans votre fichier .env.local :
   VITE_API_URL=https://votre-api.com/api

2. Assurez-vous que votre backend expose les endpoints suivants :
   
   POST /auth/login - Connexion utilisateur
   POST /auth/register - Inscription utilisateur
   GET /auth/profile - Profil utilisateur actuel
   POST /auth/logout - Déconnexion
   
   POST /credit/predict - Prédiction de crédit
   GET /credit/applications - Liste des applications
   GET /credit/summary - Résumé des statistiques
   
   GET /clients - Liste des clients
   GET /clients/:id - Détails d'un client
   PUT /clients/:id - Mise à jour d'un client
   DELETE /clients/:id - Suppression d'un client
   
   GET /admin/users - Liste des utilisateurs (admin)
   POST /admin/users - Création d'utilisateur (admin)
   GET /admin/stats - Statistiques système (admin)
   
   POST /audit/log - Enregistrement d'audit
   GET /audit/applications/:id - Logs d'une application
   
3. Format de réponse attendu :
   {
     "success": true,
     "data": {...},
     "message": "Message optionnel"
   }

4. Headers requis :
   - Authorization: Bearer {token}
   - Content-Type: application/json
*/