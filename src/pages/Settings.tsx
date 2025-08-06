import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/components/Common/ThemeProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveLayout } from '@/components/Mobile/ResponsiveLayout';
import { ThemeToggle } from '@/components/Common/ThemeToggle';
import { LanguageToggle } from '@/components/Common/LanguageToggle';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon,
  Palette,
  Globe,
  Bell,
  Shield,
  User,
  Database,
  Smartphone
} from 'lucide-react';

const Settings: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();

  const [notifications, setNotifications] = React.useState({
    email: true,
    push: false,
    sms: false,
    marketing: false
  });

  const [privacy, setPrivacy] = React.useState({
    analytics: true,
    cookies: true,
    dataSharing: false
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast({
      title: "Paramètres mis à jour",
      description: "Vos préférences de notification ont été sauvegardées.",
    });
  };

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast({
      title: "Paramètres mis à jour",
      description: "Vos préférences de confidentialité ont été sauvegardées.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export en cours",
      description: "Vos données sont en cours d'export. Vous recevrez un email.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Fonctionnalité non disponible",
      description: "La suppression de compte n'est pas encore implémentée.",
      variant: "destructive"
    });
  };

  return (
    <ResponsiveLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.nav.settings}</h1>
            <p className="text-muted-foreground">
              Gérez vos préférences et paramètres d'application
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Paramètres principaux */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Apparence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apparence
                </CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Thème</Label>
                    <div className="text-sm text-muted-foreground">
                      Choisissez entre le mode clair, sombre ou automatique
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Langue</Label>
                    <div className="text-sm text-muted-foreground">
                      Sélectionnez votre langue préférée
                    </div>
                  </div>
                  <LanguageToggle />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configurez vos préférences de notification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <div className="text-sm text-muted-foreground">
                      Recevez les mises à jour importantes par email
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationChange('email')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications push</Label>
                    <div className="text-sm text-muted-foreground">
                      Recevez des notifications dans votre navigateur
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={() => handleNotificationChange('push')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications SMS</Label>
                    <div className="text-sm text-muted-foreground">
                      Recevez des alertes importantes par SMS
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={() => handleNotificationChange('sms')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Communications marketing</Label>
                    <div className="text-sm text-muted-foreground">
                      Recevez des informations sur les nouveautés
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.marketing}
                    onCheckedChange={() => handleNotificationChange('marketing')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Confidentialité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Confidentialité et sécurité
                </CardTitle>
                <CardDescription>
                  Gérez vos paramètres de confidentialité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analyses d'utilisation</Label>
                    <div className="text-sm text-muted-foreground">
                      Aidez-nous à améliorer l'application
                    </div>
                  </div>
                  <Switch 
                    checked={privacy.analytics}
                    onCheckedChange={() => handlePrivacyChange('analytics')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cookies fonctionnels</Label>
                    <div className="text-sm text-muted-foreground">
                      Nécessaires au bon fonctionnement
                    </div>
                  </div>
                  <Switch 
                    checked={privacy.cookies}
                    onCheckedChange={() => handlePrivacyChange('cookies')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Partage de données</Label>
                    <div className="text-sm text-muted-foreground">
                      Partager des données anonymisées avec des partenaires
                    </div>
                  </div>
                  <Switch 
                    checked={privacy.dataSharing}
                    onCheckedChange={() => handlePrivacyChange('dataSharing')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Données */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Gestion des données
                </CardTitle>
                <CardDescription>
                  Exportez ou supprimez vos données
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Exporter mes données</Label>
                    <div className="text-sm text-muted-foreground">
                      Téléchargez une copie de toutes vos données
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    Exporter
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-destructive">Supprimer mon compte</Label>
                    <div className="text-sm text-muted-foreground">
                      Supprimez définitivement votre compte et toutes vos données
                    </div>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Paramètres rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Thème actuel:</span>
                    <span className="capitalize">{theme}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Langue:</span>
                    <span className="uppercase">{language}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Notifications:</span>
                    <span>{notifications.email ? 'Activées' : 'Désactivées'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Centre d'aide
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Contacter le support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Signaler un bug
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>À propos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Build:</span>
                  <span className="font-mono text-xs">2024.01.15</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Settings;