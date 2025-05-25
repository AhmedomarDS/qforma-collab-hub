
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  LifeBuoy,
  ExternalLink,
  Minimize2,
  Maximize2,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  showCreateTicket?: boolean;
}

interface SupportChatbotProps {
  onCreateTicket?: (subject: string, description: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isFloating?: boolean;
}

export const SupportChatbot: React.FC<SupportChatbotProps> = ({ 
  onCreateTicket, 
  isOpen = true, 
  onClose,
  isFloating = false 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your QForma support assistant. I can help you with questions about the application or create a support ticket if needed. How can I assist you today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const knowledgeBase = {
    'test cases': 'QForma allows you to create, manage, and execute test cases. You can link test cases to requirements and organize them in test plans. Navigate to Test Cases from the sidebar to get started.',
    'requirements': 'Requirements management in QForma helps you document and track project requirements. You can create folders, link requirements to projects, and trace them to test cases.',
    'projects': 'Project Execution allows you to create and manage projects with linked components like requirements, design documents, and test cases. Each project can track progress and status.',
    'automation': 'QForma supports automation testing where you can record test actions and execute automated test scenarios. Visit the Automation Testing section to set up your tests.',
    'reports': 'The Reports section provides analytics and insights about your testing activities, including test coverage, defect tracking, and performance metrics.',
    'defects': 'Defect management allows you to log, track, and resolve bugs found during testing. You can assign defects to team members and track their resolution status.',
    'team': 'Team management features allow you to invite team members, assign roles, and manage permissions within your company workspace.',
    'billing': 'For billing and subscription questions, visit Plan and Billing in Company Settings. You can upgrade plans, view usage, and manage payment methods.',
    'login': 'If you\'re having trouble logging in, ensure you\'re using the correct email and password. Check if email confirmation is required for your account.',
    'password': 'To reset your password, use the "Forgot Password" link on the login page. You\'ll receive an email with reset instructions.'
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Check for greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! I\'m here to help you with QForma. You can ask me about features like test cases, requirements, projects, automation testing, or any other questions you have.';
    }
    
    // Check for help or support requests
    if (message.includes('help') || message.includes('support') || message.includes('issue') || message.includes('problem')) {
      return 'I\'d be happy to help! Can you tell me more about what specific area you need assistance with? For example: test cases, requirements, projects, defects, automation, or billing.';
    }
    
    // Check knowledge base
    for (const [key, response] of Object.entries(knowledgeBase)) {
      if (message.includes(key)) {
        return response;
      }
    }
    
    // Check if user wants to create a ticket
    if (message.includes('ticket') || message.includes('contact support') || message.includes('escalate')) {
      return 'I can help you create a support ticket for more complex issues. Our support team will review your request and get back to you. Would you like me to help you create a ticket?';
    }
    
    // Default response for unrecognized queries
    return 'I understand you need help with that. While I have knowledge about QForma\'s main features (test cases, requirements, projects, automation, reports, defects, and team management), I might not have the specific information you\'re looking for. Would you like me to create a support ticket so our team can assist you directly?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const shouldShowCreateTicket = botResponse.includes('create a support ticket') || 
                                   inputMessage.toLowerCase().includes('ticket') ||
                                   inputMessage.toLowerCase().includes('contact support');

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isBot: true,
        timestamp: new Date(),
        showCreateTicket: shouldShowCreateTicket
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleCreateTicket = () => {
    const recentUserMessages = messages
      .filter(m => !m.isBot)
      .slice(-2)
      .map(m => m.content)
      .join(' ');
    
    const subject = `Support Request - ${recentUserMessages.slice(0, 50)}...`;
    const description = `User inquiry from chatbot:\n\n${recentUserMessages}`;
    
    if (onCreateTicket) {
      onCreateTicket(subject, description);
    }
  };

  // For floating version when minimized
  if (isFloating && isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  // Floating version
  if (isFloating) {
    return (
      <Card className="w-full h-full flex flex-col shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-primary" />
              QForma Support
              <Badge variant="secondary" className="text-xs">AI Assistant</Badge>
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isBot
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.isBot ? (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      ) : (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="space-y-2">
                        <p className="text-sm">{message.content}</p>
                        {message.showCreateTicket && (
                          <Button
                            size="sm"
                            variant={message.isBot ? "default" : "secondary"}
                            onClick={handleCreateTicket}
                            className="w-full"
                          >
                            <LifeBuoy className="h-3 w-3 mr-2" />
                            Create Support Ticket
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Embedded version (for support page)
  return (
    <div className="space-y-4">
      <div className="h-96 border rounded-lg overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isBot
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.isBot ? (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="space-y-2">
                      <p className="text-sm">{message.content}</p>
                      {message.showCreateTicket && (
                        <Button
                          size="sm"
                          variant={message.isBot ? "default" : "secondary"}
                          onClick={handleCreateTicket}
                          className="w-full"
                        >
                          <LifeBuoy className="h-3 w-3 mr-2" />
                          Create Support Ticket
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
      
      <div className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading || !inputMessage.trim()}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
