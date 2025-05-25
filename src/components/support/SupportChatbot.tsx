/*
// Temporarily commented out due to syntax issues - will fix later

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
  // Component implementation temporarily commented out
  return <div>Support Chatbot temporarily unavailable</div>;
};
*/

// Temporary placeholder component
import React from 'react';

interface SupportChatbotProps {
  onCreateTicket?: (subject: string, description: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isFloating?: boolean;
}

export const SupportChatbot: React.FC<SupportChatbotProps> = () => {
  return (
    <div className="p-8 text-center text-gray-500">
      <p>Support Chatbot is temporarily unavailable while we work on improvements.</p>
    </div>
  );
};
