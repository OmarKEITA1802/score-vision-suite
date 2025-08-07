import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'options' | 'loading';
}

interface ChatBotResponse {
  content: string;
  suggestions?: string[];
}

export function useChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getBotResponse = useCallback(async (userMessage: string): Promise<ChatBotResponse> => {
    // Simulation d'une API - En production, vous intégreriez un vrai service IA
    const normalizedMessage = userMessage.toLowerCase();
    
    // Réponses contextuelles selon le rôle de l'utilisateur
    const roleBasedResponses = {
      admin: {
        'tableau de bord': 'En tant qu\'administrateur, vous avez accès à tous les tableaux de bord. Vous pouvez consulter les statistiques globales, gérer les utilisateurs et configurer le système.',
        'utilisateurs': 'Vous pouvez gérer tous les utilisateurs depuis la section Administration. Cela inclut la création, modification et suppression de comptes utilisateurs.',
        'rapports': 'Vous avez accès à tous les rapports système, y compris les analyses de performance et les rapports d\'audit.',
      },
      agent: {
        'demande': 'Pour traiter une nouvelle demande de crédit, rendez-vous dans la section "Nouvelle Demande" et suivez le processus d\'évaluation étape par étape.',
        'client': 'Vous pouvez consulter les informations client dans la section "Liste des Clients" et accéder à leur historique complet.',
        'évaluation': 'L\'outil d\'évaluation automatique vous aide à analyser le profil de risque. Vous pouvez également effectuer une évaluation manuelle si nécessaire.',
      },
      client: {
        'demande': 'Pour faire une nouvelle demande de crédit, cliquez sur "Nouvelle Demande" et remplissez le formulaire avec vos informations financières.',
        'statut': 'Vous pouvez suivre le statut de vos demandes dans votre tableau de bord. Les notifications vous tiennent informé des mises à jour.',
        'documents': 'Téléchargez vos documents justificatifs dans la section Documents. Formats acceptés : PDF, JPG, PNG.',
      }
    };

    // Réponses générales
    const generalResponses = {
      'bonjour': `Bonjour ${user?.firstName || 'Utilisateur'} ! Comment puis-je vous aider aujourd'hui ?`,
      'aide': 'Je peux vous aider avec la navigation dans l\'application, l\'explication des fonctionnalités, ou répondre à vos questions sur le processus de crédit.',
      'fonctionnalités': 'Cette plateforme offre l\'évaluation automatique de crédit, la gestion des demandes, l\'analyse de risque, et le suivi en temps réel.',
      'contact': 'Pour contacter le support technique, utilisez la section "Paramètres" > "Support" ou envoyez un email à support@scorevision.com',
      'score': 'Le score de crédit est calculé en analysant votre historique financier, vos revenus, vos dépenses et d\'autres facteurs de risque.',
      'délai': 'Les demandes de crédit sont généralement traitées dans un délai de 24 à 48 heures ouvrables.',
      'documents': 'Les documents requis incluent : pièce d\'identité, justificatifs de revenus, relevés bancaires des 3 derniers mois.',
    };

    // Logique de matching des réponses
    const userRole = (user?.role as 'admin' | 'agent' | 'client') || 'client';
    const roleResponses = roleBasedResponses[userRole] || {};
    
    // Chercher dans les réponses spécifiques au rôle
    for (const [keyword, response] of Object.entries(roleResponses)) {
      if (normalizedMessage.includes(keyword)) {
        return { content: response as string };
      }
    }
    
    // Chercher dans les réponses générales
    for (const [keyword, response] of Object.entries(generalResponses)) {
      if (normalizedMessage.includes(keyword)) {
        return { content: response as string };
      }
    }

    // Réponses par défaut avec suggestions contextuelles
    const defaultResponses = [
      'Je comprends votre question. Pouvez-vous être plus précis pour que je puisse mieux vous aider ?',
      'Cette information n\'est pas dans ma base de connaissances actuelle. Puis-je vous orienter vers une autre question ?',
      'Je vais vous rediriger vers les ressources appropriées. En attendant, voici quelques sujets sur lesquels je peux vous aider...',
    ];

    return {
      content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
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

    // Ajouter un message de chargement
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      type: 'loading'
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Simuler un délai de réponse
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const response = await getBotResponse(content);
      
      // Remplacer le message de chargement par la réponse
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => msg.type !== 'loading');
        const botMessage: Message = {
          id: Date.now().toString(),
          content: response.content,
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        };
        return [...filteredMessages, botMessage];
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => msg.type !== 'loading');
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        };
        return [...filteredMessages, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  }, [getBotResponse]);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  const getContextualSuggestions = useCallback((role: string): string[] => {
    const suggestions = {
      admin: [
        'Comment gérer les utilisateurs ?',
        'Voir les rapports système',
        'Configuration de la plateforme',
        'Audit et logs',
      ],
      agent: [
        'Comment traiter une demande ?',
        'Évaluer un client',
        'Accéder aux outils d\'analyse',
        'Gérer mon portefeuille',
      ],
      client: [
        'Comment faire une demande ?',
        'Suivre ma demande',
        'Quels documents fournir ?',
        'Comprendre mon score',
      ],
    };

    return suggestions[role as keyof typeof suggestions] || suggestions.client;
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearHistory,
    getContextualSuggestions,
  };
}