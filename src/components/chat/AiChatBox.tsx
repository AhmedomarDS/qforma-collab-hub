
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, MessageSquare, Loader2, SaveAll, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { aiPlatformService } from '@/services/aiPlatformService';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AiChatBoxProps {
  title: string;
  placeholder?: string;
  onSaveContent: (content: string) => void;
  generatePrompt: (userPrompt: string) => string;
  isOpen: boolean;
  onClose: () => void;
  contentType?: 'test-case' | 'requirement' | 'design' | 'automation-test' | 'performance-script' | 'security-test' | 'compatibility-test';
}

const AiChatBox: React.FC<AiChatBoxProps> = ({
  title,
  placeholder = "Describe what you need...",
  onSaveContent,
  generatePrompt,
  isOpen,
  onClose,
  contentType = 'test-case'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue;
    setMessages(prevMessages => [...prevMessages, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const fullPrompt = generatePrompt(userMessage);
      
      let aiResponse;
      switch (contentType) {
        case 'requirement':
          aiResponse = await aiPlatformService.generateRequirement(fullPrompt);
          break;
        case 'design':
          aiResponse = await aiPlatformService.generateDesign(fullPrompt);
          break;
        case 'automation-test':
          aiResponse = await aiPlatformService.generateAutomationTest(fullPrompt);
          break;
        case 'performance-script':
          aiResponse = await aiPlatformService.generatePerformanceScript(fullPrompt);
          break;
        case 'security-test':
          aiResponse = await aiPlatformService.generateSecurityTest(fullPrompt);
          break;
        case 'compatibility-test':
          aiResponse = await aiPlatformService.generateCompatibilityTest('browser', fullPrompt);
          break;
        default:
          aiResponse = await aiPlatformService.generateTestCase(fullPrompt);
      }
      
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: aiResponse.content }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveContent = () => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    
    if (lastAssistantMessage) {
      onSaveContent(lastAssistantMessage.content);
      toast({
        title: "Content Saved",
        description: "The generated content has been saved successfully.",
      });
      onClose();
    } else {
      toast({
        title: "Nothing to Save",
        description: "No AI-generated content to save yet.",
        variant: "destructive"
      });
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <Card className="fixed inset-y-20 right-4 w-96 z-50 shadow-xl flex flex-col h-[70vh]">
      <CardContent className="flex flex-col h-full p-0">
        <div className="bg-primary p-3 text-primary-foreground flex items-center justify-between rounded-t-lg">
          <div className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            <h3 className="font-medium">{title}</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation to generate {title.toLowerCase()}</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 
                    ${message.role === 'user' 
                      ? 'bg-primary text-primary-foreground ml-4' 
                      : 'bg-card border mr-4'}`
                  }
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <Separator />
        
        <div className="p-3 flex items-end gap-2">
          <Textarea 
            placeholder={placeholder}
            className="resize-none min-h-[80px]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
            
            <Button 
              size="icon"
              variant="outline"
              onClick={handleSaveContent}
              disabled={!messages.some(m => m.role === 'assistant')}
              title="Save generated content"
            >
              <SaveAll className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiChatBox;
