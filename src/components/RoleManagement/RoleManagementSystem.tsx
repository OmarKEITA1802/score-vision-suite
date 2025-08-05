import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Shield,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Crown,
  Lock,
  Key,
  UserPlus,
  Settings
} from 'lucide-react';
import { useRolePermissions, Permission, Role } from '@/contexts/RolePermissionContext';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: Date;
  department: string;
  permissions: Permission[];
}

interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  level: number;
  color: string;
  isSystem: boolean;
}

// Utilisateurs simulés
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Marie Dupont',
    email: 'marie.dupont@example.com',
    role: 'agent',
    status: 'active',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
    department: 'Crédit',
    permissions: ['view_dashboard', 'view_applications', 'create_application']
  },
  {
    id: '2',
    name: 'Jean Martin',
    email: 'jean.martin@example.com',
    role: 'manager',
    status: 'active',
    lastLogin: new Date(Date.now() - 30 * 60 * 1000),
    department: 'Crédit',
    permissions: ['view_dashboard', 'view_applications', 'manage_users']
  },
  {
    id: '3',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@example.com',
    role: 'senior_agent',
    status: 'inactive',
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
    department: 'Crédit',
    permissions: ['view_dashboard', 'view_applications', 'approve_application']
  },
];

const allPermissions: Array<{
  id: Permission;
  name: string;
  description: string;
  category: string;
}> = [
  { id: 'view_dashboard', name: 'Voir le tableau de bord', description: 'Accès au tableau de bord principal', category: 'Affichage' },
  { id: 'view_applications', name: 'Voir les demandes', description: 'Consulter les demandes de crédit', category: 'Demandes' },
  { id: 'create_application', name: 'Créer des demandes', description: 'Créer de nouvelles demandes', category: 'Demandes' },
  { id: 'edit_application', name: 'Modifier les demandes', description: 'Modifier les demandes existantes', category: 'Demandes' },
  { id: 'delete_application', name: 'Supprimer les demandes', description: 'Supprimer des demandes', category: 'Demandes' },
  { id: 'approve_application', name: 'Approuver les demandes', description: 'Approuver ou rejeter des demandes', category: 'Approbation' },
  { id: 'reject_application', name: 'Rejeter les demandes', description: 'Rejeter des demandes de crédit', category: 'Approbation' },
  { id: 'view_clients', name: 'Voir les clients', description: 'Consulter les informations clients', category: 'Clients' },
  { id: 'edit_clients', name: 'Modifier les clients', description: 'Modifier les informations clients', category: 'Clients' },
  { id: 'delete_clients', name: 'Supprimer les clients', description: 'Supprimer des comptes clients', category: 'Clients' },
  { id: 'view_analytics', name: 'Voir les analyses', description: 'Accès aux rapports et analyses', category: 'Analyses' },
  { id: 'export_data', name: 'Exporter les données', description: 'Exporter des rapports et données', category: 'Analyses' },
  { id: 'manage_users', name: 'Gérer les utilisateurs', description: 'Créer et modifier des utilisateurs', category: 'Administration' },
  { id: 'manage_roles', name: 'Gérer les rôles', description: 'Créer et modifier des rôles', category: 'Administration' },
  { id: 'system_admin', name: 'Administration système', description: 'Accès complet au système', category: 'Administration' },
];

const PermissionIcon = ({ permission }: { permission: Permission }) => {
  const iconMap = {
    'view_dashboard': Eye,
    'view_applications': Eye,
    'create_application': Plus,
    'edit_application': Edit,
    'delete_application': Trash2,
    'approve_application': Check,
    'reject_application': X,
    'view_clients': Users,
    'edit_clients': Edit,
    'delete_clients': Trash2,
    'view_analytics': Eye,
    'export_data': Eye,
    'manage_users': UserPlus,
    'manage_roles': Shield,
    'system_admin': Crown,
  };
  
  const Icon = iconMap[permission] || Shield;
  return <Icon className="h-4 w-4" />;
};

const StatusBadge = ({ status }: { status: User['status'] }) => {
  const variants = {
    active: { variant: 'default' as const, label: 'Actif' },
    inactive: { variant: 'secondary' as const, label: 'Inactif' },
    pending: { variant: 'outline' as const, label: 'En attente' }
  };
  
  const { variant, label } = variants[status];
  return <Badge variant={variant}>{label}</Badge>;
};

const RoleBadge = ({ role }: { role: Role }) => {
  const roleConfig = {
    client: { color: 'bg-blue-100 text-blue-800', label: 'Client' },
    agent: { color: 'bg-green-100 text-green-800', label: 'Agent' },
    senior_agent: { color: 'bg-purple-100 text-purple-800', label: 'Agent Senior' },
    manager: { color: 'bg-orange-100 text-orange-800', label: 'Manager' },
    admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
    super_admin: { color: 'bg-gray-100 text-gray-800', label: 'Super Admin' },
  };
  
  const config = roleConfig[role];
  return (
    <Badge className={config.color}>
      {config.label}
    </Badge>
  );
};

export const RoleManagementSystem: React.FC = () => {
  const { getAllRoles, hasPermission } = useRolePermissions();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');

  const roles = getAllRoles();
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof allPermissions>);

  const handleCreateUser = () => {
    toast({
      title: 'Utilisateur créé',
      description: 'Le nouvel utilisateur a été créé avec succès.',
    });
    setIsCreateUserOpen(false);
  };

  const handleUpdateUserRole = (userId: string, newRole: Role) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    
    toast({
      title: 'Rôle mis à jour',
      description: 'Le rôle de l\'utilisateur a été modifié.',
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  if (!hasPermission('manage_users') && !hasPermission('manage_roles')) {
    return (
      <Card className="fintech-card">
        <CardContent className="p-8 text-center">
          <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Accès restreint</h3>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder à la gestion des rôles.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des rôles et permissions
          </CardTitle>
          <CardDescription>
            Gérez les utilisateurs, rôles et permissions de votre organisation
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Gestion des utilisateurs */}
        <TabsContent value="users" className="space-y-4">
          <Card className="fintech-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Utilisateurs</CardTitle>
                  <CardDescription>
                    Gérez les comptes utilisateurs et leurs rôles
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  
                  <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Nouvel utilisateur
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                        <DialogDescription>
                          Ajoutez un nouvel utilisateur au système
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Nom complet</Label>
                            <Input id="name" placeholder="Jean Dupont" />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="jean@example.com" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="role">Rôle</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un rôle" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(roles).map(([key, role]) => (
                                  <SelectItem key={key} value={key}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="department">Département</Label>
                            <Input id="department" placeholder="Crédit" />
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleCreateUser}>
                          Créer l'utilisateur
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-xs text-muted-foreground">{user.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={user.status} />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.lastLogin.toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.lastLogin.toLocaleTimeString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={user.role}
                            onValueChange={(value) => handleUpdateUserRole(user.id, value as Role)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(roles).map(([key, role]) => (
                                <SelectItem key={key} value={key}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Switch
                            checked={user.status === 'active'}
                            onCheckedChange={() => handleToggleUserStatus(user.id)}
                          />
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des rôles */}
        <TabsContent value="roles" className="space-y-4">
          <Card className="fintech-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rôles système</CardTitle>
                  <CardDescription>
                    Configurez les rôles et leurs permissions
                  </CardDescription>
                </div>
                
                <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau rôle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Créer un nouveau rôle</DialogTitle>
                      <DialogDescription>
                        Définissez un nouveau rôle avec ses permissions
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="roleName">Nom du rôle</Label>
                          <Input id="roleName" placeholder="Analyste Senior" />
                        </div>
                        <div>
                          <Label htmlFor="roleLevel">Niveau</Label>
                          <Input id="roleLevel" type="number" placeholder="3" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="roleDescription">Description</Label>
                        <Textarea id="roleDescription" placeholder="Description du rôle..." />
                      </div>
                      
                      <div>
                        <Label>Permissions</Label>
                        <ScrollArea className="h-40 border rounded-md p-4">
                          {Object.entries(groupedPermissions).map(([category, permissions]) => (
                            <div key={category} className="mb-4">
                              <h4 className="font-medium mb-2">{category}</h4>
                              <div className="space-y-2">
                                {permissions.map((permission) => (
                                  <div key={permission.id} className="flex items-center space-x-2">
                                    <Switch id={permission.id} />
                                    <div className="flex-1">
                                      <Label htmlFor={permission.id} className="text-sm">
                                        {permission.name}
                                      </Label>
                                      <p className="text-xs text-muted-foreground">
                                        {permission.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={() => setIsCreateRoleOpen(false)}>
                        Créer le rôle
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(roles).map(([key, role]) => (
                  <Card key={key} className="fintech-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <Badge variant="outline">Niveau {role.level}</Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {role.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Permissions ({role.permissions.length})</Label>
                          <ScrollArea className="h-32 mt-2">
                            <div className="space-y-1">
                              {role.permissions.map((permission) => (
                                <div key={permission} className="flex items-center gap-2 text-sm">
                                  <PermissionIcon permission={permission} />
                                  <span>
                                    {allPermissions.find(p => p.id === permission)?.name || permission}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matrice des permissions */}
        <TabsContent value="permissions" className="space-y-4">
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Matrice des permissions</CardTitle>
              <CardDescription>
                Vue d'ensemble des permissions par rôle
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      {category}
                    </h3>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/3">Permission</TableHead>
                            {Object.entries(roles).map(([key, role]) => (
                              <TableHead key={key} className="text-center">
                                {role.name}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {permissions.map((permission) => (
                            <TableRow key={permission.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <PermissionIcon permission={permission.id} />
                                  <div>
                                    <div className="font-medium text-sm">{permission.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {permission.description}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              {Object.entries(roles).map(([key, role]) => (
                                <TableCell key={key} className="text-center">
                                  {role.permissions.includes(permission.id) ? (
                                    <Check className="h-5 w-5 text-success mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};