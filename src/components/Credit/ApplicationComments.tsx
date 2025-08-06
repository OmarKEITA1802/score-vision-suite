import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Clock, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  applicationId: string;
  authorId: string;
  authorName: string;
  authorRole: 'agent' | 'admin' | 'system';
  content: string;
  type: 'note' | 'justification' | 'contest' | 'system';
  createdAt: Date;
  attachments?: string[];
  isInternal: boolean;
}

interface ApplicationCommentsProps {
  applicationId: string;
  readonly?: boolean;
}

export const ApplicationComments: React.FC<ApplicationCommentsProps> = ({
  applicationId,
  readonly = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'note' | 'justification'>('note');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data pour les commentaires
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      applicationId,
      authorId: 'agent_001',
      authorName: 'Marie Agent',
      authorRole: 'agent',
      content: 'Client fidèle depuis 5 ans. Revenus stables malgré la période de transition professionnelle récente.',
      type: 'justification',
      createdAt: new Date('2024-01-15T14:30:00'),
      isInternal: true
    },
    {
      id: '2',
      applicationId,
      authorId: 'system',
      authorName: 'Système',
      authorRole: 'system',
      content: 'Score automatique calculé : 72%. Facteurs principaux : ratio endettement (25%), ancienneté emploi (3 ans).',
      type: 'system',
      createdAt: new Date('2024-01-15T10:15:00'),
      isInternal: true
    }
  ]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // Ici on enverrait le commentaire à l'API
      console.log('Ajout commentaire:', {
        applicationId,
        content: newComment,
        type: commentType,
        authorId: user?.id
      });

      toast({
        title: 'Commentaire ajouté',
        description: 'Le commentaire a été enregistré avec succès',
      });

      setNewComment('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'ajouter le commentaire',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: Comment['type']) => {
    switch (type) {
      case 'justification':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'contest':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'system':
        return <User className="h-4 w-4 text-muted-foreground" />;
      default:
        return <MessageSquare className="h-4 w-4 text-primary" />;
    }
  };

  const getTypeBadge = (type: Comment['type']) => {
    switch (type) {
      case 'justification':
        return <Badge variant="outline" className="text-warning border-warning">Justification</Badge>;
      case 'contest':
        return <Badge variant="destructive">Contestation</Badge>;
      case 'system':
        return <Badge variant="secondary">Système</Badge>;
      default:
        return <Badge variant="outline">Note</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
          Commentaires et Justifications
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Liste des commentaires */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun commentaire pour cette demande</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {comment.authorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{comment.authorName}</span>
                        {getTypeBadge(comment.type)}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {getTypeIcon(comment.type)}
                </div>
                
                <p className="text-sm leading-relaxed">{comment.content}</p>
                
                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {comment.attachments.map((attachment, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        📎 {attachment}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Formulaire d'ajout de commentaire */}
        {!readonly && user && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex space-x-2">
              <Button
                variant={commentType === 'note' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCommentType('note')}
              >
                Note interne
              </Button>
              <Button
                variant={commentType === 'justification' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCommentType('justification')}
              >
                Justification
              </Button>
            </div>

            <div className="space-y-3">
              <Textarea
                placeholder={
                  commentType === 'justification'
                    ? 'Ajouter une justification pour cette décision...'
                    : 'Ajouter une note interne...'
                }
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {commentType === 'justification' 
                    ? 'Cette justification sera enregistrée et auditée'
                    : 'Note visible uniquement en interne'
                  }
                </span>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Envoi...' : 'Ajouter'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};