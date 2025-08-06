import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRolePermissions } from '@/contexts/RolePermissionContext';
import { ResponsiveLayout } from '@/components/Mobile/ResponsiveLayout';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  MapPin,
  Phone,
  Building
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { getUserRole, getRoleConfig } = useRolePermissions();
  
  const userRole = getUserRole();
  const roleConfig = getRoleConfig(userRole);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.nav.profile}</h1>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles et vos préférences
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profil principal */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Vos informations de profil et de contact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="text-lg">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>
                    <Badge variant="outline" className="w-fit">
                      <Shield className="h-3 w-3 mr-1" />
                      {roleConfig?.name} (Niveau {roleConfig?.level})
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" value={`${user.firstName} ${user.lastName}`} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      value="Non renseigné" 
                      readOnly 
                      className="text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input 
                      id="location" 
                      value="Non renseigné" 
                      readOnly 
                      className="text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button disabled>
                    Modifier le profil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activité récente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Dernière connexion</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Profil créé</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Rôle et permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Rôle actuel</Label>
                  <div className="mt-1">
                    <Badge variant="default" className="w-full justify-center">
                      {roleConfig?.name}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Niveau d'accès</Label>
                  <div className="mt-1 text-2xl font-bold text-center">
                    {roleConfig?.level}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Permissions</Label>
                  <div className="mt-2 space-y-1">
                    {roleConfig?.permissions.slice(0, 3).map((permission) => (
                      <div key={permission} className="text-xs text-muted-foreground">
                        • {permission.replace(/_/g, ' ')}
                      </div>
                    ))}
                    {roleConfig && roleConfig.permissions.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{roleConfig.permissions.length - 3} autres
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informations système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID utilisateur:</span>
                    <span className="font-mono text-xs">{user.id}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut:</span>
                    <Badge variant="secondary" className="text-xs">Actif</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Profile;