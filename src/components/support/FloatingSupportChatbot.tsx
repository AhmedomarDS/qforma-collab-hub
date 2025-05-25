
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { SupportChatbot } from './SupportChatbot';

export const FloatingSupportChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateTicket = (subject: string, description: string) => {
    // For the floating version, we'll just show a success message
    // In a real implementation, you might want to redirect to the support page
    console.log('Ticket creation requested:', { subject, description });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-xl border w-96 h-[500px]">
        <SupportChatbot 
          onCreateTicket={handleCreateTicket}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
};
