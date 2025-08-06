import React, { useState } from 'react';
import { ResponsiveLayout } from '@/components/Mobile/ResponsiveLayout';
import { RoleManagementSystem } from '@/components/RoleManagement/RoleManagementSystem';
import { UserManagement } from '@/components/Admin/UserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Brain, 
  BarChart3, 
  FileText, 
  Settings, 
  Shield,
  Database,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <ResponsiveLayout title="Administration">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span>Panneau d'Administration</span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
            <TabsTrigger value="overview" className="flex flex-col items-center space-y-1 p-3">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex flex-col items-center space-y-1 p-3">
              <Users className="h-4 w-4" />
              <span className="text-xs">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex flex-col items-center space-y-1 p-3">
              <Brain className="h-4 w-4" />
              <span className="text-xs">Modèles ML</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex flex-col items-center space-y-1 p-3">
              <Activity className="h-4 w-4" />
              <span className="text-xs">Audit</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex flex-col items-center space-y-1 p-3">
              <FileText className="h-4 w-4" />
              <span className="text-xs">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex flex-col items-center space-y-1 p-3">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Conformité</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex flex-col items-center space-y-1 p-3">
              <Database className="h-4 w-4" />
              <span className="text-xs">Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col items-center space-y-1 p-3">
              <Settings className="h-4 w-4" />
              <span className="text-xs">Paramètres</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>📊 Vue d'ensemble du système</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Statistiques globales du système à venir...
                  <br />
                  Connecté à votre backend Django
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="models">
            <Card>
              <CardHeader>
                <CardTitle>🧠 Gestion des modèles ML</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Interface de gestion des modèles à implémenter...
                  <br />
                  Upload, activation, performance metrics
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>📋 Logs d'audit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Interface d'audit et de traçabilité à implémenter...
                  <br />
                  Historique des actions, recherche, export
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>📝 Templates d'emails</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Gestion des templates d'emails à implémenter...
                  <br />
                  Création, édition, prévisualisation
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>🛡️ Conformité RGPD</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Outils de conformité RGPD à implémenter...
                  <br />
                  Export données, SHAP explanations, rapports
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>🔧 Maintenance système</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Outils de maintenance à implémenter...
                  <br />
                  Nettoyage, sauvegarde, monitoring
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Paramètres globaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Configuration système à implémenter...
                  <br />
                  Paramètres généraux, thème, notifications
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminDashboard;