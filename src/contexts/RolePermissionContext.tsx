import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

export type Permission = 
  | 'view_dashboard'
  | 'view_applications'
  | 'create_application'
  | 'edit_application'
  | 'delete_application'
  | 'approve_application'
  | 'reject_application'
  | 'view_clients'
  | 'edit_clients'
  | 'delete_clients'
  | 'view_analytics'
  | 'export_data'
  | 'manage_users'
  | 'manage_roles'
  | 'system_admin'
  | 'modify_credit_score'          // Modifier directement le score généré par le modèle
  | 'delete_client_data'           // Supprimer ou falsifier des données clients
  | 'approve_without_validation'   // Approuver un crédit seul sans validation managériale
  | 'modify_scoring_engine'        // Modifier la logique du moteur de scoring
  | 'override_system_decisions';   // Outrepasser les décisions automatiques

export type Role = 'client' | 'agent' | 'senior_agent' | 'manager' | 'admin' | 'super_admin';

interface RolePermissionConfig {
  [key: string]: {
    name: string;
    description: string;
    permissions: Permission[];
    level: number;
  };
}

const ROLE_PERMISSIONS: RolePermissionConfig = {
  client: {
    name: 'Client',
    description: 'Utilisateur standard, peut voir ses propres données',
    level: 1,
    permissions: [
      'view_dashboard',
      'create_application',
      'view_applications'
    ]
  },
  agent: {
    name: 'Agent',
    description: 'Agent de crédit, peut traiter les demandes - RESTRICTIONS: Ne peut pas modifier les scores, supprimer des données clients, approuver seul ou modifier le moteur',
    level: 2,
    permissions: [
      'view_dashboard',
      'view_applications',
      'create_application',
      'edit_application',
      'view_clients',
      'view_analytics'
      // INTERDICTIONS EXPLICITES pour les agents:
      // - modify_credit_score (risque de fraude)
      // - delete_client_data (intégrité des données)
      // - approve_without_validation (contrôle managérial requis)
      // - modify_scoring_engine (réservé admin)
    ]
  },
  senior_agent: {
    name: 'Agent Senior',
    description: 'Agent expérimenté avec plus de responsabilités',
    level: 3,
    permissions: [
      'view_dashboard',
      'view_applications',
      'create_application',
      'edit_application',
      'approve_application',
      'reject_application',
      'view_clients',
      'edit_clients',
      'view_analytics',
      'export_data'
    ]
  },
  manager: {
    name: 'Manager',
    description: 'Responsable d\'équipe, supervise les agents',
    level: 4,
    permissions: [
      'view_dashboard',
      'view_applications',
      'create_application',
      'edit_application',
      'delete_application',
      'approve_application',
      'reject_application',
      'view_clients',
      'edit_clients',
      'delete_clients',
      'view_analytics',
      'export_data',
      'manage_users'
    ]
  },
  admin: {
    name: 'Administrateur',
    description: 'Administrateur système avec accès complet incluant les actions critiques',
    level: 5,
    permissions: [
      'view_dashboard',
      'view_applications',
      'create_application',
      'edit_application',
      'delete_application',
      'approve_application',
      'reject_application',
      'view_clients',
      'edit_clients',
      'delete_clients',
      'view_analytics',
      'export_data',
      'manage_users',
      'manage_roles',
      'system_admin',
      // ACTIONS CRITIQUES RÉSERVÉES AUX ADMINS:
      'modify_credit_score',          // Modifier directement le score généré par le modèle
      'delete_client_data',           // Supprimer ou falsifier des données clients
      'approve_without_validation',   // Approuver un crédit seul sans validation managériale
      'modify_scoring_engine',        // Modifier la logique du moteur de scoring
      'override_system_decisions'     // Outrepasser les décisions automatiques
    ]
  },
  super_admin: {
    name: 'Super Administrateur',
    description: 'Accès complet au système avec toutes les permissions critiques',
    level: 6,
    permissions: [
      'view_dashboard',
      'view_applications',
      'create_application',
      'edit_application',
      'delete_application',
      'approve_application',
      'reject_application',
      'view_clients',
      'edit_clients',
      'delete_clients',
      'view_analytics',
      'export_data',
      'manage_users',
      'manage_roles',
      'system_admin',
      'modify_credit_score',
      'delete_client_data',
      'approve_without_validation',
      'modify_scoring_engine',
      'override_system_decisions'
    ]
  }
};

interface RolePermissionContextType {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  getUserRole: () => Role;
  getRoleConfig: (role: Role) => RolePermissionConfig[string] | undefined;
  getAllRoles: () => RolePermissionConfig;
  canAccessRoute: (route: string) => boolean;
  isHigherRole: (role: Role) => boolean;
}

const RolePermissionContext = createContext<RolePermissionContextType | undefined>(undefined);

export const useRolePermissions = () => {
  const context = useContext(RolePermissionContext);
  if (!context) {
    throw new Error('useRolePermissions must be used within a RolePermissionProvider');
  }
  return context;
};

export const RolePermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const getUserRole = useCallback((): Role => {
    return (user?.role as Role) || 'client';
  }, [user]);

  const getRoleConfig = useCallback((role: Role) => {
    return ROLE_PERMISSIONS[role];
  }, []);

  const hasPermission = useCallback((permission: Permission): boolean => {
    const userRole = getUserRole();
    const roleConfig = getRoleConfig(userRole);
    return roleConfig?.permissions.includes(permission) || false;
  }, [getUserRole, getRoleConfig]);

  const hasAnyPermission = useCallback((permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  const hasAllPermissions = useCallback((permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  }, [hasPermission]);

  const getAllRoles = useCallback(() => {
    return ROLE_PERMISSIONS;
  }, []);

  const canAccessRoute = useCallback((route: string): boolean => {
    const routePermissions: { [key: string]: Permission[] } = {
      '/dashboard': ['view_dashboard'],
      '/credit-application': ['create_application'],
      '/applications': ['view_applications'],
      '/clients': ['view_clients'],
      '/analytics': ['view_analytics'],
      '/admin': ['system_admin'],
      '/users': ['manage_users'],
      '/roles': ['manage_roles']
    };

    const requiredPermissions = routePermissions[route];
    if (!requiredPermissions) return true; // Route publique

    return hasAnyPermission(requiredPermissions);
  }, [hasAnyPermission]);

  const isHigherRole = useCallback((role: Role): boolean => {
    const userRole = getUserRole();
    const userLevel = getRoleConfig(userRole)?.level || 0;
    const targetLevel = getRoleConfig(role)?.level || 0;
    
    return userLevel > targetLevel;
  }, [getUserRole, getRoleConfig]);

  return (
    <RolePermissionContext.Provider
      value={{
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        getUserRole,
        getRoleConfig,
        getAllRoles,
        canAccessRoute,
        isHigherRole,
      }}
    >
      {children}
    </RolePermissionContext.Provider>
  );
};