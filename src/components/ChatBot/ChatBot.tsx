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
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatBot } from '@/hooks/useChatBot';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'options' | 'loading';
}

interface ChatBotProps {
  className?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    clearHistory,
    getContextualSuggestions 
  } = useChatBot();

  const suggestions = getContextualSuggestions(user?.role || 'client');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    await sendMessage(userMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 w-80 sm:w-96 transition-all duration-300",
      isMinimized ? "h-14" : "h-[32rem]",
      className
    )}>
      <Card className="h-full flex flex-col shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary-glow text-primary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">Assistant IA</h3>
              <p className="text-xs text-primary-foreground/80">
                Toujours là pour vous aider
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h4 className="font-medium mb-2">Bonjour {user?.firstName || 'Utilisateur'} !</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?
                    </p>
                    
                    {/* Suggestions */}
                    <div className="grid gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-auto p-2 text-left justify-start"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2",
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.sender === 'bot' && (
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3 text-sm",
                        msg.sender === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {msg.type === 'loading' ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          <span className="text-xs">L'assistant réfléchit...</span>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            {messages.length > 0 && (
              <div className="px-4 py-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {messages.length} message(s)
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-xs h-6 px-2"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Nouveau chat
                  </Button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1 text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  size="icon"
                  className="flex-shrink-0"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};