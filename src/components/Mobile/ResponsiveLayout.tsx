import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Home,
  FileText,
  Users,
  BarChart3,
  Shield,
  CreditCard,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { AdvancedNotificationCenter } from '@/components/Notifications/AdvancedNotificationCenter';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  showMobileNav?: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Tableau de bord',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Demandes de crédit',
    href: '/credit-application',
    icon: CreditCard,
  },
  {
    title: 'Applications',
    href: '/applications',
    icon: FileText,
    badge: 3,
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    title: 'Analyses',
    href: '/analytics',
    icon: BarChart3,
    children: [
      { title: 'Rapports', href: '/analytics/reports', icon: BarChart3 },
      { title: 'Graphiques', href: '/analytics/charts', icon: BarChart3 },
    ]
  },
  {
    title: 'Administration',
    href: '/admin',
    icon: Shield,
    children: [
      { title: 'Utilisateurs', href: '/admin/users', icon: Users },
      { title: 'Rôles', href: '/admin/roles', icon: Shield },
    ]
  },
];

const DeviceIndicator = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  const icons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
  };

  const Icon = icons[deviceType];

  return (
    <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span className="capitalize">{deviceType}</span>
    </div>
  );
};

const MobileNavigation = ({ items }: { items: NavItem[] }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (href: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(href)) {
      newExpanded.delete(href);
    } else {
      newExpanded.add(href);
    }
    setExpandedItems(newExpanded);
  };

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.href);

    return (
      <div>
        <div
          className={`flex items-center justify-between w-full p-3 text-left transition-colors hover:bg-muted/50 ${
            level > 0 ? 'pl-8' : ''
          }`}
          onClick={() => hasChildren && toggleExpanded(item.href)}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.title}</span>
            {item.badge && (
              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {hasChildren && (
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="bg-muted/20">
            {item.children!.map((child) => (
              <NavItemComponent key={child.href} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {items.map((item) => (
          <NavItemComponent key={item.href} item={item} />
        ))}
      </div>
    </ScrollArea>
  );
};

const UserMenu = () => {
  const { user, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <User className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              Rôle: {user?.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  title,
  showMobileNav = true 
}) => {
  const { unreadCount } = useNotifications();

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 lg:h-16 items-center justify-between px-4 lg:px-6">
          {/* Mobile: Menu + Title */}
          <div className="flex items-center gap-3 lg:hidden">
            {showMobileNav && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                  <div className="flex items-center h-14 px-6 border-b">
                    <h2 className="font-semibold">Navigation</h2>
                  </div>
                  <MobileNavigation items={navigationItems} />
                </SheetContent>
              </Sheet>
            )}
            
            {title && (
              <h1 className="text-lg font-semibold truncate">{title}</h1>
            )}
          </div>

          {/* Desktop: Logo + Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">ScoreVision</span>
            </div>
            
            {title && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold">{title}</h1>
              </>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            <DeviceIndicator />
            
            <AdvancedNotificationCenter />
            
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 lg:px-6 py-4 lg:py-6">
        {children}
      </main>

      {/* Mobile-specific enhancements */}
      <div className="lg:hidden">
        {/* Mobile bottom navigation could go here */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2">
          <div className="flex justify-center items-center gap-4">
            <Button variant="ghost" size="sm" className="flex-1 flex flex-col gap-1 h-12">
              <Home className="h-4 w-4" />
              <span className="text-xs">Accueil</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 flex flex-col gap-1 h-12">
              <FileText className="h-4 w-4" />
              <span className="text-xs">Demandes</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 flex flex-col gap-1 h-12">
              <Users className="h-4 w-4" />
              <span className="text-xs">Clients</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 flex flex-col gap-1 h-12 relative">
              <Bell className="h-4 w-4" />
              <span className="text-xs">Alertes</span>
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
        
        {/* Spacer for fixed bottom nav */}
        <div className="h-16" />
      </div>
    </div>
  );
};