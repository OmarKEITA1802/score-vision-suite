import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastMessageAt: Date;
}

interface ChatBotResponse {
  content: string;
  suggestions?: string[];
  confidence?: number;
  category?: string;
}

export function useChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTypingIndicator, setIsTypingIndicator] = useState(false);
  const { user } = useAuth();

  // Charger les conversations sauvegardées au démarrage
  useEffect(() => {
    loadConversations();
  }, []);

  const getBotResponse = useCallback(async (userMessage: string): Promise<ChatBotResponse> => {
    // Simulation d'une API - En production, vous intégreriez un vrai service IA
    const normalizedMessage = userMessage.toLowerCase();
    
    // Réponses contextuelles selon le rôle de l'utilisateur avec émojis et confidence
    const roleBasedResponses = {
      admin: {
        'tableau de bord': { 
          content: '📊 En tant qu\'administrateur, vous avez accès à tous les tableaux de bord. Vous pouvez consulter les statistiques globales, gérer les utilisateurs et configurer le système depuis votre panel d\'administration.',
          confidence: 0.95,
          category: 'navigation'
        },
        'utilisateurs': { 
          content: '👥 Vous pouvez gérer tous les utilisateurs depuis la section Administration. Cela inclut la création, modification et suppression de comptes utilisateurs, ainsi que la gestion des rôles et permissions.',
          confidence: 0.98,
          category: 'gestion'
        },
        'rapports': { 
          content: '📈 Vous avez accès à tous les rapports système : analyses de performance, rapports d\'audit, statistiques d\'utilisation et métriques de sécurité. Exportables en PDF ou Excel.',
          confidence: 0.92,
          category: 'reporting'
        },
      },
      agent: {
        'demande': { 
          content: '📝 Pour traiter une nouvelle demande de crédit, rendez-vous dans "Nouvelle Demande" et suivez le processus d\'évaluation étape par étape. L\'IA vous assistera dans l\'analyse du profil de risque.',
          confidence: 0.94,
          category: 'workflow'
        },
        'client': { 
          content: '👤 Consultez les informations client dans "Liste des Clients" pour accéder à leur historique complet, scores précédents et documents. Filtres avancés disponibles.',
          confidence: 0.96,
          category: 'gestion'
        },
        'évaluation': { 
          content: '🎯 L\'outil d\'évaluation automatique analyse le profil de risque avec l\'IA. Vous pouvez compléter par une évaluation manuelle si nécessaire et ajouter vos commentaires.',
          confidence: 0.93,
          category: 'evaluation'
        },
      },
      client: {
        'demande': { 
          content: '🚀 Pour faire une nouvelle demande de crédit, cliquez sur "Nouvelle Demande" et remplissez le formulaire avec vos informations financières. Le processus prend environ 5-10 minutes.',
          confidence: 0.97,
          category: 'process'
        },
        'statut': { 
          content: '📋 Suivez le statut de vos demandes dans votre tableau de bord. Vous recevrez des notifications en temps réel pour chaque mise à jour du traitement de votre dossier.',
          confidence: 0.99,
          category: 'suivi'
        },
        'documents': { 
          content: '📄 Téléchargez vos justificatifs dans la section Documents : pièce d\'identité, justificatifs de revenus, relevés bancaires. Formats acceptés : PDF, JPG, PNG (max 10MB).',
          confidence: 0.91,
          category: 'documentation'
        },
      }
    };

    // Réponses générales avec émojis et confidence
    const generalResponses = {
      'bonjour': { 
        content: `🌟 Bonjour ${user?.firstName || 'Utilisateur'} ! Comment puis-je vous accompagner aujourd'hui ? Je suis là pour répondre à toutes vos questions !`,
        confidence: 1.0,
        category: 'greeting'
      },
      'aide': { 
        content: '🆘 Je peux vous aider avec la navigation, expliquer les fonctionnalités, vous guider dans le processus de crédit, ou répondre à vos questions techniques. N\'hésitez pas !',
        confidence: 0.98,
        category: 'support'
      },
      'fonctionnalités': { 
        content: '⚡ Cette plateforme offre : évaluation automatique de crédit par IA, gestion complète des demandes, analyse de risque avancée, suivi en temps réel et reporting détaillé.',
        confidence: 0.95,
        category: 'features'
      },
      'contact': { 
        content: '📞 Pour contacter le support : Section "Paramètres" > "Support", email support@scorevision.com, ou chat en direct. Disponible 24h/24 !',
        confidence: 0.92,
        category: 'contact'
      },
      'score': { 
        content: '🎯 Le score de crédit est calculé par notre IA en analysant : historique financier, revenus, dépenses, ratio d\'endettement et plus de 50 autres facteurs de risque.',
        confidence: 0.89,
        category: 'scoring'
      },
      'délai': { 
        content: '⏱️ Délais de traitement : Pré-qualification instantanée, évaluation complète 24-48h ouvrables, décision finale sous 3 jours maximum.',
        confidence: 0.94,
        category: 'timing'
      },
      'documents': { 
        content: '📋 Documents requis : Pièce d\'identité valide, 3 derniers bulletins de salaire, relevés bancaires 3 mois, avis d\'imposition, justificatif de domicile récent.',
        confidence: 0.96,
        category: 'requirements'
      },
    };

    // Logique de matching des réponses
    const userRole = (user?.role as 'admin' | 'agent' | 'client') || 'client';
    const roleResponses = roleBasedResponses[userRole] || {};
    
    // Chercher dans les réponses spécifiques au rôle
    for (const [keyword, response] of Object.entries(roleResponses)) {
      if (normalizedMessage.includes(keyword)) {
        return response as ChatBotResponse;
      }
    }
    
    // Chercher dans les réponses générales
    for (const [keyword, response] of Object.entries(generalResponses)) {
      if (normalizedMessage.includes(keyword)) {
        return response as ChatBotResponse;
      }
    }

    // Réponses par défaut avec suggestions contextuelles
    const defaultResponses = [
      { 
        content: '🤔 Je comprends votre question. Pouvez-vous être plus précis pour que je puisse mieux vous aider ? Ou choisissez parmi les suggestions ci-dessous.',
        confidence: 0.7,
        category: 'clarification'
      },
      { 
        content: '💡 Cette information n\'est pas dans ma base de connaissances actuelle. Puis-je vous orienter vers une autre question ou vous mettre en contact avec le support ?',
        confidence: 0.6,
        category: 'unknown'
      },
      { 
        content: '🔍 Je vais vous rediriger vers les ressources appropriées. En attendant, voici quelques sujets sur lesquels je peux vous aider efficacement...',
        confidence: 0.65,
        category: 'redirect'
      },
    ];

    const selectedResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    return {
      ...selectedResponse,
      suggestions: getContextualSuggestions(userRole)
    };
  }, [user]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTypingIndicator(true);

    try {
      // Simuler un délai de réponse plus réaliste
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 2000));
      
      const response = await getBotResponse(content);
      
      setIsTypingIndicator(false);
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          confidence: response.confidence,
          category: response.category,
          helpful: undefined
        }
      };
      
      setMessages(prev => [...prev, botMessage]);
      return botMessage;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setIsTypingIndicator(false);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: '😔 Désolé, une erreur s\'est produite. Veuillez réessayer dans quelques instants.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        metadata: { confidence: 0, category: 'error' }
      };
      
      setMessages(prev => [...prev, errorMessage]);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getBotResponse]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setIsTypingIndicator(false);
  }, []);

  const saveConversation = useCallback(() => {
    if (messages.length === 0) return;
    
    const conversation: Conversation = {
      id: Date.now().toString(),
      title: messages[0]?.content.slice(0, 50) + (messages[0]?.content.length > 50 ? '...' : '') || 'Conversation sans titre',
      messages: [...messages],
      createdAt: new Date(),
      lastMessageAt: messages[messages.length - 1]?.timestamp || new Date()
    };
    
    setConversations(prev => [conversation, ...prev.slice(0, 9)]); // Garde seulement les 10 dernières
    
    // Sauvegarder dans localStorage
    const savedConversations = JSON.parse(localStorage.getItem('chatbot-conversations') || '[]');
    const newConversations = [conversation, ...savedConversations.slice(0, 9)];
    localStorage.setItem('chatbot-conversations', JSON.stringify(newConversations));
  }, [messages]);

  const loadConversations = useCallback(() => {
    try {
      const saved = localStorage.getItem('chatbot-conversations');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConversations(parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          lastMessageAt: new Date(conv.lastMessageAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    }
  }, []);

  const markAsHelpful = useCallback((messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, metadata: { ...msg.metadata, helpful } }
        : msg
    ));
  }, []);

  const getContextualSuggestions = useCallback((role: string): string[] => {
    const suggestions = {
      admin: [
        '👥 Comment gérer les utilisateurs ?',
        '📊 Voir les rapports système',
        '⚙️ Configuration de la plateforme',
        '🔍 Audit et logs système',
      ],
      agent: [
        '📝 Comment traiter une demande ?',
        '🎯 Évaluer un profil client',
        '📈 Accéder aux outils d\'analyse',
        '📋 Gérer mon portefeuille',
      ],
      client: [
        '🚀 Comment faire une demande ?',
        '📋 Suivre ma demande en cours',
        '📄 Quels documents fournir ?',
        '🎯 Comprendre mon score crédit',
      ],
    };

    return suggestions[role as keyof typeof suggestions] || suggestions.client;
  }, []);

  return {
    messages,
    conversations,
    isLoading,
    isTypingIndicator,
    sendMessage,
    clearHistory,
    getContextualSuggestions,
    saveConversation,
    loadConversations,
    markAsHelpful,
  };
}