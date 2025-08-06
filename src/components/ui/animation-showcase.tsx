import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedContainer } from './animated-container';
import { LoadingDots, Shimmer, PulseLoader, FloatingElement, WiggleElement } from './loading-animations';
import { EnhancedButton } from './enhanced-button';
import { 
  Sparkles, 
  Zap, 
  Target, 
  Rocket, 
  Star,
  Heart,
  Cpu,
  Lightbulb
} from 'lucide-react';

export const AnimationShowcase: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState<string>('entrance');

  const demos = [
    { id: 'entrance', label: 'Animations d\'entrée', icon: Rocket },
    { id: 'interactions', label: 'Interactions', icon: Target },
    { id: 'loading', label: 'Chargement', icon: Cpu },
    { id: 'buttons', label: 'Boutons animés', icon: Zap }
  ];

  const renderEntranceAnimations = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatedContainer animation="fade-in" delay={100}>
          <Card className="fintech-card interactive-card">
            <CardContent className="p-4 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Fade In</h3>
              <p className="text-sm text-muted-foreground">Animation fluide</p>
            </CardContent>
          </Card>
        </AnimatedContainer>

        <AnimatedContainer animation="slide-up" delay={200}>
          <Card className="fintech-card interactive-card">
            <CardContent className="p-4 text-center">
              <Rocket className="h-8 w-8 mx-auto mb-2 text-success" />
              <h3 className="font-semibold">Slide Up</h3>
              <p className="text-sm text-muted-foreground">Montée progressive</p>
            </CardContent>
          </Card>
        </AnimatedContainer>

        <AnimatedContainer animation="scale" delay={300}>
          <Card className="fintech-card interactive-card">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-warning" />
              <h3 className="font-semibold">Scale</h3>
              <p className="text-sm text-muted-foreground">Zoom élégant</p>
            </CardContent>
          </Card>
        </AnimatedContainer>

        <AnimatedContainer animation="bounce" delay={400}>
          <Card className="fintech-card interactive-card">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <h3 className="font-semibold">Bounce</h3>
              <p className="text-sm text-muted-foreground">Rebond dynamique</p>
            </CardContent>
          </Card>
        </AnimatedContainer>

        <AnimatedContainer animation="rotate" delay={500}>
          <Card className="fintech-card interactive-card">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Rotate</h3>
              <p className="text-sm text-muted-foreground">Rotation fluide</p>
            </CardContent>
          </Card>
        </AnimatedContainer>

        <AnimatedContainer animation="fade-in-left" delay={600}>
          <Card className="fintech-card interactive-card">
            <CardContent className="p-4 text-center">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 text-warning" />
              <h3 className="font-semibold">Slide Left</h3>
              <p className="text-sm text-muted-foreground">Entrée latérale</p>
            </CardContent>
          </Card>
        </AnimatedContainer>
      </div>
    </div>
  );

  const renderInteractionAnimations = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Effets de Survol</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="hover-lift p-4 border border-border rounded-lg cursor-pointer">
              <Heart className="h-6 w-6 text-destructive mb-2" />
              <p className="font-medium">Hover Lift</p>
              <p className="text-sm text-muted-foreground">Survolez pour voir l'effet</p>
            </div>
            
            <div className="hover-glow p-4 border border-border rounded-lg cursor-pointer">
              <Sparkles className="h-6 w-6 text-primary mb-2" />
              <p className="font-medium">Hover Glow</p>
              <p className="text-sm text-muted-foreground">Survolez pour voir la lueur</p>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Éléments Flottants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FloatingElement>
              <Badge className="bg-primary text-primary-foreground">
                <Star className="h-4 w-4 mr-1" />
                Flotte en continu
              </Badge>
            </FloatingElement>
            
            <WiggleElement trigger="hover">
              <Badge variant="outline" className="cursor-pointer">
                <Target className="h-4 w-4 mr-1" />
                Wiggle au survol
              </Badge>
            </WiggleElement>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderLoadingAnimations = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Loading Dots</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <LoadingDots size="sm" />
            <LoadingDots size="md" />
            <LoadingDots size="lg" />
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Shimmer Effects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Shimmer height="h-4" />
            <Shimmer height="h-6" width="w-3/4" />
            <Shimmer height="h-8" width="w-1/2" />
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardHeader>
            <CardTitle>Pulse Loaders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <PulseLoader size="sm" color="primary" />
            <PulseLoader size="md" color="success" />
            <PulseLoader size="lg" color="secondary" />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderButtonAnimations = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <EnhancedButton variant="default" animation="hover-lift">
          <Rocket className="h-4 w-4 mr-2" />
          Hover Lift
        </EnhancedButton>

        <EnhancedButton variant="premium" animation="glow">
          <Sparkles className="h-4 w-4 mr-2" />
          Glow Effect
        </EnhancedButton>

        <EnhancedButton variant="outline" animation="shimmer">
          <Zap className="h-4 w-4 mr-2" />
          Shimmer
        </EnhancedButton>

        <EnhancedButton variant="floating" animation="float">
          <Star className="h-4 w-4 mr-2" />
          Float
        </EnhancedButton>

        <EnhancedButton variant="secondary" animation="wiggle">
          <Target className="h-4 w-4 mr-2" />
          Wiggle
        </EnhancedButton>

        <EnhancedButton variant="default" ripple animation="hover-lift">
          <Heart className="h-4 w-4 mr-2" />
          Ripple Effect
        </EnhancedButton>
      </div>
    </div>
  );

  const renderCurrentDemo = () => {
    switch (currentDemo) {
      case 'entrance':
        return renderEntranceAnimations();
      case 'interactions':
        return renderInteractionAnimations();
      case 'loading':
        return renderLoadingAnimations();
      case 'buttons':
        return renderButtonAnimations();
      default:
        return renderEntranceAnimations();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <AnimatedContainer animation="fade-in-down">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-shimmer">Système d'Animations Avancées</h1>
          <p className="text-muted-foreground">
            Découvrez toutes les animations disponibles dans l'application
          </p>
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="fade-in-up" delay={200}>
        <div className="flex flex-wrap justify-center gap-2">
          {demos.map((demo, index) => {
            const Icon = demo.icon;
            return (
              <AnimatedContainer key={demo.id} animation="scale" delay={300 + index * 100}>
                <Button
                  variant={currentDemo === demo.id ? "default" : "outline"}
                  onClick={() => setCurrentDemo(demo.id)}
                  className="btn-animated"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {demo.label}
                </Button>
              </AnimatedContainer>
            );
          })}
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="fade-in" delay={500} trigger="scroll">
        {renderCurrentDemo()}
      </AnimatedContainer>
    </div>
  );
};