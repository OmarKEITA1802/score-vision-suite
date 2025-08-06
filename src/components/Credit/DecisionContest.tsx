import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Scale, FileText, Clock, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ContestReason {
  id: string;
  label: string;
  description: string;
  requiresEvidence: boolean;
}

interface DecisionContestProps {
  applicationId: string;
  currentDecision: 'approved' | 'rejected';
  currentScore: number;
  canContest?: boolean;
}

export const DecisionContest: React.FC<DecisionContestProps> = ({
  applicationId,
  currentDecision,
  currentScore,
  canContest = true
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [contestReason, setContestReason] = useState('');
  const [justification, setJustification] = useState('');
  const [scoreAdjustment, setScoreAdjustment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contestReasons: ContestReason[] = [
    {
      id: 'client_fidelity',
      label: 'Fidélité client exceptionnelle',
      description: 'Client fidèle depuis plus de 5 ans avec historique irréprochable',
      requiresEvidence: true
    },
    {
      id: 'income_improvement',
      label: 'Amélioration récente des revenus',
      description: 'Augmentation significative et documentée des revenus',
      requiresEvidence: true
    },
    {
      id: 'data_error',
      label: 'Erreur dans les données',
      description: 'Données incorrectes ou obsolètes utilisées pour le calcul',
      requiresEvidence: true
    },
    {
      id: 'special_circumstances',
      label: 'Circonstances exceptionnelles',
      description: 'Situation particulière non prise en compte par le modèle',
      requiresEvidence: false
    },
    {
      id: 'guarantee_additional',
      label: 'Garanties supplémentaires',
      description: 'Garanties additionnelles proposées par le client',
      requiresEvidence: true
    }
  ];

  const scoreAdjustments = [
    { value: '+5', label: '+5 points - Ajustement mineur' },
    { value: '+10', label: '+10 points - Ajustement modéré' },
    { value: '+15', label: '+15 points - Ajustement significatif' },
    { value: '-5', label: '-5 points - Réduction mineure' },
    { value: '-10', label: '-10 points - Réduction modérée' }
  ];

  const handleSubmitContest = async () => {
    if (!contestReason || !justification.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Ici on enverrait la contestation à l'API
      const contestData = {
        applicationId,
        reason: contestReason,
        justification: justification.trim(),
        scoreAdjustment: scoreAdjustment ? parseInt(scoreAdjustment) : null,
        agentId: user?.id,
        timestamp: new Date(),
        currentDecision,
        currentScore
      };

      console.log('Contestation soumise:', contestData);

      toast({
        title: 'Contestation enregistrée',
        description: 'La contestation a été soumise pour révision managériale',
      });

      // Reset form
      setContestReason('');
      setJustification('');
      setScoreAdjustment('');
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de soumettre la contestation',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDecisionColor = (decision: string) => {
    return decision === 'approved' ? 'success' : 'destructive';
  };

  const selectedReason = contestReasons.find(r => r.id === contestReason);

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Scale className="h-5 w-5 mr-2 text-primary" />
            Contestation de Décision
          </div>
          <Badge variant={getDecisionColor(currentDecision) as any}>
            {currentDecision === 'approved' ? 'Approuvée' : 'Rejetée'} - {currentScore}%
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            La contestation d'une décision automatique nécessite une justification détaillée 
            et sera soumise à une révision managériale. Cette action est enregistrée et auditée.
          </AlertDescription>
        </Alert>

        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Décision actuelle:</strong> {currentDecision === 'approved' ? 'Approuvée' : 'Rejetée'}</p>
          <p><strong>Score actuel:</strong> {currentScore}%</p>
          <p><strong>Demande:</strong> #{applicationId}</p>
        </div>
      </CardContent>

      <CardFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={!canContest}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Contester cette décision
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                Contester la décision automatique
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Raison de la contestation */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Motif de contestation *
                </label>
                <Select value={contestReason} onValueChange={setContestReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un motif..." />
                  </SelectTrigger>
                  <SelectContent>
                    {contestReasons.map((reason) => (
                      <SelectItem key={reason.id} value={reason.id}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedReason && (
                  <p className="text-xs text-muted-foreground">
                    {selectedReason.description}
                  </p>
                )}
              </div>

              {/* Ajustement de score proposé */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Ajustement de score proposé (optionnel)
                </label>
                <Select value={scoreAdjustment} onValueChange={setScoreAdjustment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Aucun ajustement" />
                  </SelectTrigger>
                  <SelectContent>
                    {scoreAdjustments.map((adj) => (
                      <SelectItem key={adj.value} value={adj.value}>
                        {adj.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {scoreAdjustment && (
                  <p className="text-xs text-muted-foreground">
                    Score proposé: {currentScore + parseInt(scoreAdjustment)}%
                  </p>
                )}
              </div>

              {/* Justification détaillée */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Justification détaillée *
                </label>
                <Textarea
                  placeholder="Expliquez en détail les raisons de cette contestation, les éléments nouveaux ou les circonstances particulières..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Cette justification sera transmise au manager pour révision.
                </p>
              </div>

              {/* Pièces justificatives requises */}
              {selectedReason?.requiresEvidence && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    Ce motif nécessite des pièces justificatives. 
                    Assurez-vous d'avoir les documents appropriés avant de soumettre.
                  </AlertDescription>
                </Alert>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmitContest}
                  disabled={isSubmitting || !contestReason || !justification.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Soumission...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Soumettre la contestation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};