import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Minimize2, 
  Maximize2, 
  X,
  Bot,
  User,
  RefreshCw,
  Settings,
  History,
  HelpCircle,
  Zap,
  Clock,
  Star,
  ChevronDown,
  Mic,
  Paperclip,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatBot } from '@/hooks/useChatBot';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'options' | 'loading' | 'quickActions';
  actions?: QuickAction[];
  metadata?: {
    confidence?: number;
    category?: string;
    helpful?: boolean;
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon?: string;
  action: string;
}

interface ChatBotProps {
  className?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    clearHistory,
    getContextualSuggestions,
    saveConversation,
    loadConversations,
    conversations,
    markAsHelpful,
    isTypingIndicator
  } = useChatBot();

  const suggestions = getContextualSuggestions(user?.role || 'client');

  const quickActions = [
    { id: 'help', label: 'Centre d\'aide', icon: '❓', action: 'Comment puis-je vous aider ?' },
    { id: 'status', label: 'État des demandes', icon: '📋', action: 'Quel est le statut de mes demandes ?' },
    { id: 'docs', label: 'Documents requis', icon: '📄', action: 'Quels documents dois-je fournir ?' },
    { id: 'contact', label: 'Contact support', icon: '📞', action: 'Comment contacter le support ?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTypingIndicator]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    setIsTyping(true);
    
    try {
      await sendMessage(userMessage);
      setShowQuickActions(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action: QuickAction) => {
    setMessage(action.action);
    await handleSendMessage();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setShowQuickActions(true);
    toast({
      title: "Historique effacé",
      description: "La conversation a été réinitialisée.",
    });
  };

  const handleMarkHelpful = (messageId: string, helpful: boolean) => {
    markAsHelpful(messageId, helpful);
    toast({
      title: helpful ? "Merci !" : "Commentaire enregistré",
      description: helpful ? "Votre retour nous aide à améliorer l'assistant." : "Nous prenons note de votre retour.",
    });
  };

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary animate-pulse hover:animate-none group"
            size="icon"
          >
            <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
          </Button>
          
          {/* Badge de notification */}
          <div className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
            !
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-card text-card-foreground text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            💬 Besoin d'aide ? Cliquez ici !
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-500 transform",
      isMinimized ? "w-80 h-14" : "w-80 sm:w-96 h-[36rem]",
      isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0",
      className
    )}>
      <Card className="h-full flex flex-col shadow-2xl border-0 bg-card/98 backdrop-blur-md rounded-2xl overflow-hidden">
        {/* Header amélioré */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary via-primary-glow to-primary text-primary-foreground relative">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-primary-foreground/20">
                <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base">🤖 Assistant IA</h3>
              <p className="text-xs text-primary-foreground/90 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                En ligne 24/7
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => saveConversation()}>
                  <History className="mr-2 h-4 w-4" />
                  Sauvegarder la conversation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres du chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClearHistory}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Nouveau chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setIsOpen(false)}
                  className="text-destructive focus:text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Quitter le chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20 rounded-full transition-all duration-200"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-primary-foreground hover:bg-destructive/20 rounded-full transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Effet de particules dans le header */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-2 left-20 w-1 h-1 bg-primary-foreground/30 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
            <div className="absolute top-4 right-20 w-1 h-1 bg-primary-foreground/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-3 left-32 w-1 h-1 bg-primary-foreground/30 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages avec animations améliorées */}
            <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-background/50 to-background/80">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8 animate-fade-in">
                    <div className="relative mb-6">
                      <div className="h-20 w-20 mx-auto bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center animate-bounce">
                        <Bot className="h-10 w-10 text-primary-foreground" />
                      </div>
                      <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
                    </div>
                    
                    <h4 className="font-bold text-lg mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                      Salut {user?.firstName || 'Utilisateur'} ! 👋
                    </h4>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      Je suis votre assistant IA intelligent. <br />
                      Prêt à vous accompagner dans toutes vos démarches ! 🚀
                    </p>
                    
                    {/* Actions rapides améliorées */}
                    {showQuickActions && (
                      <div className="space-y-3 animate-slide-up">
                        <p className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-2">
                          <Zap className="h-3 w-3" />
                          Actions rapides
                        </p>
                        <div className="grid gap-2">
                          {quickActions.map((action, index) => (
                            <Button
                              key={action.id}
                              variant="outline"
                              size="sm"
                              className="text-left justify-start h-auto p-3 border-dashed hover:border-solid hover:bg-primary/5 transition-all duration-300 group"
                              onClick={() => handleQuickAction(action)}
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <span className="text-lg mr-3 group-hover:scale-110 transition-transform">
                                {action.icon}
                              </span>
                              <span className="text-sm">{action.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Suggestions contextuelles */}
                    <div className="mt-6 space-y-2 animate-fade-in" style={{ animationDelay: '500ms' }}>
                      <p className="text-xs font-medium text-muted-foreground">Ou demandez-moi :</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {suggestions.slice(0, 3).map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 text-xs py-1 px-2"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3 animate-fade-in group",
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {msg.sender === 'bot' && (
                      <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="flex flex-col max-w-[80%]">
                      <div
                        className={cn(
                          "rounded-2xl p-4 shadow-sm transition-all duration-200 group-hover:shadow-md",
                          msg.sender === 'user'
                            ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-br-md"
                            : "bg-card border border-border rounded-bl-md hover:bg-muted/50"
                        )}
                      >
                        {msg.type === 'loading' ? (
                          <div className="flex items-center gap-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-sm text-muted-foreground">L'assistant réfléchit...</span>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            
                            {/* Actions de feedback pour les messages du bot */}
                            {msg.sender === 'bot' && (!msg.type || msg.type === 'text') && (
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {msg.timestamp.toLocaleTimeString()}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 hover:bg-success/20 hover:text-success"
                                    onClick={() => handleMarkHelpful(msg.id, true)}
                                  >
                                    👍
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive"
                                    onClick={() => handleMarkHelpful(msg.id, false)}
                                  >
                                    👎
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            {/* Timestamp pour les messages utilisateur */}
                            {msg.sender === 'user' && (
                              <div className="mt-2 text-xs text-primary-foreground/80 text-right">
                                {msg.timestamp.toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Confidence badge pour les réponses du bot */}
                      {msg.sender === 'bot' && msg.metadata?.confidence && (
                        <div className="mt-1 flex justify-start">
                          <Badge variant="outline" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Confiance: {Math.round(msg.metadata.confidence * 100)}%
                          </Badge>
                        </div>
                      )}
                    </div>

                    {msg.sender === 'user' && (
                      <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-secondary/20">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {/* Indicateur de frappe */}
                {isTypingIndicator && (
                  <div className="flex items-center gap-3 animate-fade-in">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-card border border-border rounded-2xl rounded-bl-md p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm">En train d'écrire...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Statistiques et actions rapides */}
            {messages.length > 0 && (
              <div className="px-4 py-3 border-t border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="text-xs flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {messages.length} message{messages.length > 1 ? 's' : ''}
                    </Badge>
                    {conversations.length > 0 && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <History className="h-3 w-3" />
                        {conversations.length} conversation{conversations.length > 1 ? 's' : ''} sauvée{conversations.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearHistory}
                    className="text-xs h-7 px-3 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Nouveau
                  </Button>
                </div>
              </div>
            )}

            {/* Zone de saisie moderne et élégante */}
            <div className="p-4 bg-gradient-to-t from-background via-background/95 to-background/80 backdrop-blur-xl border-t border-border/20">
              <div className="relative">
                {/* Conteneur principal de saisie */}
                <div className="relative flex items-center gap-3 p-2 bg-muted/30 rounded-3xl border border-border/30 shadow-inner transition-all duration-300 hover:bg-muted/40 focus-within:bg-background/90 focus-within:border-primary/50 focus-within:shadow-lg">
                  {/* Input principal */}
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Écrivez votre message..."
                      className="border-0 bg-transparent pl-4 pr-20 py-3 text-base placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[2.5rem]"
                      disabled={isLoading}
                      maxLength={500}
                    />
                    
                    {/* Outils intégrés à droite */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {/* Compteur de caractères */}
                      {message.length > 400 && (
                        <div className="text-xs text-muted-foreground/80 bg-background/80 px-2 py-1 rounded-full">
                          {message.length}/500
                        </div>
                      )}
                      
                      {/* Bouton microphone */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-primary/10 transition-all duration-200"
                        disabled
                        title="Enregistrement vocal (bientôt disponible)"
                      >
                        <Mic className="h-4 w-4 text-muted-foreground/50" />
                      </Button>
                      
                      {/* Bouton pièce jointe */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-primary/10 transition-all duration-200"
                        disabled
                        title="Ajouter une pièce jointe (bientôt disponible)"
                      >
                        <Paperclip className="h-4 w-4 text-muted-foreground/50" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Bouton d'envoi intégré */}
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    className={cn(
                      "h-10 w-10 rounded-full transition-all duration-300 group shrink-0",
                      message.trim() && !isLoading
                        ? "bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-md hover:shadow-lg scale-100 hover:scale-110"
                        : "bg-muted text-muted-foreground/50 shadow-none"
                    )}
                    size="icon"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    )}
                  </Button>
                </div>
                
                {/* Suggestions rapides */}
                {!message && !isLoading && messages.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
                    {['👍 Merci !', '❓ Autre question', '📋 Résumé'].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 border border-border/30 hover:border-primary/30 transition-all duration-200"
                        onClick={() => setMessage(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Indicateur de statut */}
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground/60">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span>IA connectée</span>
                    </div>
                    {isLoading && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span>Réflexion en cours...</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs">
                    Appuyez sur Entrée pour envoyer
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};