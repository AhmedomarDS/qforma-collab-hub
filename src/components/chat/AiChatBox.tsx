
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, MessageSquare, Loader2, SaveAll, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

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
}

const AiChatBox: React.FC<AiChatBoxProps> = ({
  title,
  placeholder = "Describe what you need...",
  onSaveContent,
  generatePrompt,
  isOpen,
  onClose
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
    
    // Add user message
    const userMessage = inputValue;
    setMessages(prevMessages => [...prevMessages, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an API with the AI model
      // For now, we'll simulate a response after a delay
      const fullPrompt = generatePrompt(userMessage);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock response based on the prompt type
      let aiResponse = "I've analyzed your request. ";
      if (title.toLowerCase().includes('requirement')) {
        aiResponse += "Here's a draft requirement based on your input:\n\n" +
          "**Title**: Enhanced " + userMessage.slice(0, 20) + "...\n\n" +
          "**Description**: This requirement involves implementing " + userMessage + "\n\n" +
          "**Acceptance Criteria**:\n" +
          "1. System should allow users to perform the requested action\n" +
          "2. All user interactions should be logged for audit purposes\n" +
          "3. The functionality should be accessible across all supported devices";
      } else {
        aiResponse += "Here's a test case based on your requirements:\n\n" +
          "**Test Case**: TC-" + Math.floor(Math.random() * 1000) + "\n\n" +
          "**Title**: Verify " + userMessage.slice(0, 20) + "\n\n" +
          "**Steps**:\n" +
          "1. Navigate to the relevant screen\n" +
          "2. Attempt to " + userMessage + "\n" +
          "3. Verify the expected behavior\n\n" +
          "**Expected Results**: The system should successfully process the action and display a confirmation message";
      }
      
      // Add AI response to chat
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: aiResponse }]);
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
    // Find the last assistant message
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
