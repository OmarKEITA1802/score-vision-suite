import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { Draggable, Droppable } from '@/components/ui/drag-and-drop';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  RotateCcw,
  Star,
  FileText,
  Users,
  BarChart3,
  Settings,
  Mail
} from 'lucide-react';

interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'stats' | 'list' | 'notification';
  icon: React.ComponentType<any>;
  color: string;
  size: 'small' | 'medium' | 'large';
}

const defaultWidgets: DashboardWidget[] = [
  { id: '1', title: 'Métriques Principales', type: 'stats', icon: BarChart3, color: 'primary', size: 'large' },
  { id: '2', title: 'Graphique Performance', type: 'chart', icon: BarChart3, color: 'success', size: 'medium' },
  { id: '3', title: 'Demandes Récentes', type: 'list', icon: FileText, color: 'warning', size: 'medium' },
  { id: '4', title: 'Utilisateurs Actifs', type: 'stats', icon: Users, color: 'destructive', size: 'small' },
  { id: '5', title: 'Notifications', type: 'notification', icon: Mail, color: 'secondary', size: 'small' },
  { id: '6', title: 'Paramètres Système', type: 'stats', icon: Settings, color: 'primary', size: 'small' }
];

export const DragDropDemo: React.FC = () => {
  const { items: widgets, moveItem, setItems } = useDragAndDrop(defaultWidgets);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);

  const addWidget = () => {
    const newWidget: DashboardWidget = {
      id: Date.now().toString(),
      title: `Nouveau Widget ${widgets.length + 1}`,
      type: 'stats',
      icon: Star,
      color: 'primary',
      size: 'medium'
    };
    setItems([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setItems(widgets.filter(w => w.id !== id));
    setSelectedWidgets(prev => prev.filter(wId => wId !== id));
  };

  const resetLayout = () => {
    setItems(defaultWidgets);
    setSelectedWidgets([]);
  };

  const toggleSelection = (id: string) => {
    setSelectedWidgets(prev => 
      prev.includes(id) 
        ? prev.filter(wId => wId !== id)
        : [...prev, id]
    );
  };

  const getWidgetSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-1 md:col-span-2';
      case 'large': return 'col-span-1 md:col-span-3 lg:col-span-4';
      default: return 'col-span-1';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <AnimatedContainer animation="fade-in-down">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-shimmer">Dashboard Personnalisable</h1>
            <p className="text-muted-foreground">
              Glissez-déposez les widgets pour personnaliser votre tableau de bord
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={addWidget} variant="outline" className="hover-glow">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Widget
            </Button>
            <Button onClick={resetLayout} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="fade-in-up" delay={200}>
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GripVertical className="h-5 w-5" />
              Widgets Disponibles ({widgets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Droppable className="min-h-[400px] p-4 rounded-lg bg-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {widgets.map((widget, index) => (
                  <Draggable
                    key={widget.id}
                    id={widget.id}
                    index={index}
                    onMove={moveItem}
                    className={`${getWidgetSizeClass(widget.size)} relative group`}
                  >
                    <Card 
                      className={`fintech-card interactive-card cursor-move h-full ${
                        selectedWidgets.includes(widget.id) ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => toggleSelection(widget.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg bg-${widget.color}/10`}>
                              <widget.icon className={`h-4 w-4 text-${widget.color}`} />
                            </div>
                            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeWidget(widget.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <h3 className="font-semibold text-sm mb-2">{widget.title}</h3>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {widget.type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {widget.size}
                          </Badge>
                        </div>

                        {/* Contenu du widget simulé */}
                        <div className="mt-3 pt-3 border-t border-border">
                          {widget.type === 'stats' && (
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">1,234</div>
                              <div className="text-xs text-muted-foreground">+12% ce mois</div>
                            </div>
                          )}
                          {widget.type === 'chart' && (
                            <div className="h-16 bg-gradient-to-r from-primary/20 to-success/20 rounded flex items-end justify-center">
                              <div className="text-xs text-muted-foreground">📊 Graphique</div>
                            </div>
                          )}
                          {widget.type === 'list' && (
                            <div className="space-y-1">
                              <div className="h-2 bg-muted rounded w-full"></div>
                              <div className="h-2 bg-muted rounded w-3/4"></div>
                              <div className="h-2 bg-muted rounded w-1/2"></div>
                            </div>
                          )}
                          {widget.type === 'notification' && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                              <span className="text-xs">3 nouvelles</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Draggable>
                ))}
              </div>
            </Droppable>
          </CardContent>
        </Card>
      </AnimatedContainer>

      {selectedWidgets.length > 0 && (
        <AnimatedContainer animation="slide-up">
          <Card className="fintech-card border-primary/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedWidgets.length} widget(s) sélectionné(s)
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedWidgets([])}
                  >
                    Désélectionner
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => {
                      selectedWidgets.forEach(removeWidget);
                      setSelectedWidgets([]);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedContainer>
      )}
    </div>
  );
};