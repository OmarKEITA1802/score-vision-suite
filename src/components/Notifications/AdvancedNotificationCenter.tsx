import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Bell,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Send,
  Search,
  MoreVertical,
  Pin,
  Archive,
  Trash2,
  Clock,
  Users
} from 'lucide-react';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  timestamp: Date;
  type: 'text' | 'system' | 'file';
  isRead: boolean;
}

interface ChatConversation {
  id: string;
  title: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
    isOnline: boolean;
  }>;
  lastMessage: ChatMessage;
  unreadCount: number;
  messages: ChatMessage[];
  isGroup: boolean;
}

// Données simulées pour le chat
const mockConversations: ChatConversation[] = [
  {
    id: '1',
    title: 'Équipe Crédit',
    isGroup: true,
    participants: [
      { id: '1', name: 'Marie Dupont', role: 'Agent', isOnline: true },
      { id: '2', name: 'Jean Martin', role: 'Manager', isOnline: false },
      { id: '3', name: 'Sophie Bernard', role: 'Agent Senior', isOnline: true },
    ],
    unreadCount: 3,
    lastMessage: {
      id: '1',
      content: 'Le dossier #12345 nécessite une révision',
      sender: { id: '1', name: 'Marie Dupont', role: 'Agent' },
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
      isRead: false,
    },
    messages: [],
  },
  {
    id: '2',
    title: 'Discussion avec Pierre Moreau',
    isGroup: false,
    participants: [
      { id: '4', name: 'Pierre Moreau', role: 'Client', isOnline: false },
    ],
    unreadCount: 1,
    lastMessage: {
      id: '2',
      content: 'Merci pour votre aide avec ma demande',
      sender: { id: '4', name: 'Pierre Moreau', role: 'Client' },
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text',
      isRead: false,
    },
    messages: [],
  },
];

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  const iconClass = "h-4 w-4";
  
  switch (type) {
    case 'success':
      return <CheckCircle2 className={`${iconClass} text-success`} />;
    case 'error':
      return <AlertCircle className={`${iconClass} text-destructive`} />;
    case 'warning':
      return <AlertCircle className={`${iconClass} text-warning`} />;
    default:
      return <Info className={`${iconClass} text-primary`} />;
  }
};

const PriorityBadge = ({ priority }: { priority: Notification['priority'] }) => {
  const variants = {
    low: 'secondary',
    medium: 'outline',
    high: 'default',
    urgent: 'destructive'
  } as const;

  return (
    <Badge variant={variants[priority]} className="text-xs">
      {priority === 'urgent' ? 'Urgent' : 
       priority === 'high' ? 'Élevé' :
       priority === 'medium' ? 'Moyen' : 'Bas'}
    </Badge>
  );
};

export const AdvancedNotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('notifications');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnreadCount = unreadCount + conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageInput,
      sender: {
        id: 'current-user',
        name: 'Vous',
        role: 'Agent'
      },
      timestamp: new Date(),
      type: 'text',
      isRead: true,
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: newMessage,
        };
      }
      return conv;
    }));

    setMessageInput('');
    scrollToBottom();
  };

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {totalUnreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:w-[480px] lg:w-[600px] p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Centre de notifications
          </SheetTitle>
          <SheetDescription>
            Gérez vos notifications et conversations
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat
                {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0) > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                    {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="notifications" className="flex-1 px-6 mt-4">
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher dans les notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Tout marquer lu
                </Button>
              </div>

              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-2">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Aucune notification</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <Card key={notification.id} className={`transition-all cursor-pointer hover:shadow-md ${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <NotificationIcon type={notification.type} />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm leading-tight">
                                    {notification.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <PriorityBadge priority={notification.priority} />
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Marquer comme lu
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Pin className="h-4 w-4 mr-2" />
                                        Épingler
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archiver
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        onClick={() => removeNotification(notification.id)}
                                        className="text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Supprimer
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(notification.timestamp, { 
                                  addSuffix: true, 
                                  locale: fr 
                                })}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 mt-4">
            <div className="flex h-full">
              {/* Liste des conversations */}
              <div className="w-1/3 border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher conversations..."
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="space-y-1 p-2">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedConversation === conversation.id ? 'bg-primary/10 border border-primary/20' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {conversation.isGroup ? (
                                  <Users className="h-5 w-5" />
                                ) : (
                                  conversation.participants[0]?.name.split(' ').map(n => n[0]).join('')
                                )}
                              </AvatarFallback>
                            </Avatar>
                            {!conversation.isGroup && conversation.participants[0]?.isOnline && (
                              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-success rounded-full border-2 border-background" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm truncate">
                                {conversation.title}
                              </h4>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {conversation.lastMessage.content}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(conversation.lastMessage.timestamp, { 
                                addSuffix: true, 
                                locale: fr 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Zone de conversation */}
              <div className="flex-1 flex flex-col">
                {selectedConv ? (
                  <>
                    {/* En-tête de conversation */}
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {selectedConv.isGroup ? (
                              <Users className="h-5 w-5" />
                            ) : (
                              selectedConv.participants[0]?.name.split(' ').map(n => n[0]).join('')
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{selectedConv.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedConv.isGroup 
                              ? `${selectedConv.participants.length} participants`
                              : selectedConv.participants[0]?.isOnline ? 'En ligne' : 'Hors ligne'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {selectedConv.messages.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Commencez une nouvelle conversation</p>
                          </div>
                        ) : (
                          selectedConv.messages.map((message) => (
                            <div key={message.id} className={`flex ${message.sender.id === 'current-user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[70%] ${message.sender.id === 'current-user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                                {message.sender.id !== 'current-user' && (
                                  <p className="text-xs font-medium mb-1">{message.sender.name}</p>
                                )}
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${message.sender.id === 'current-user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                  {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: fr })}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Zone de saisie */}
                    <div className="p-4 border-t border-border">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Tapez votre message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Sélectionnez une conversation</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};