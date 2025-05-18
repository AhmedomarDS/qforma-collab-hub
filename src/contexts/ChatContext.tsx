
import React, { createContext, useContext, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name?: string; // For group chats
  participants: {
    id: string;
    name: string;
  }[];
  lastActivity: string;
  messages: ChatMessage[];
  unreadCount: number;
}

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  isLoading: boolean;
  setActiveChat: (chatId: string | null) => void;
  createDirectChat: (participantId: string, participantName: string) => Promise<string>;
  createGroupChat: (name: string, participantIds: string[]) => Promise<string>;
  sendMessage: (chatId: string, content: string, attachments?: File[]) => Promise<void>;
  markChatAsRead: (chatId: string) => void;
}

// Mock users for the chat system
const MOCK_CHAT_USERS = [
  { id: "user-1", name: "John Developer" },
  { id: "user-2", name: "Sarah QA Lead" },
  { id: "user-3", name: "Mike Manager" },
  { id: "user-4", name: "Alice Designer" },
  { id: "user-5", name: "Bob Engineer" },
];

// Mock messages for demonstration
const generateMockMessages = (chatId: string, count: number = 10): ChatMessage[] => {
  const messages: ChatMessage[] = [];
  const users = MOCK_CHAT_USERS;
  
  for (let i = 0; i < count; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    const date = new Date();
    date.setHours(date.getHours() - (count - i));
    
    messages.push({
      id: `msg-${chatId}-${i}`,
      content: `This is a sample message #${i + 1} in the conversation.`,
      sender,
      timestamp: date.toISOString(),
    });
  }
  
  return messages;
};

// Mock chat data
const MOCK_CHATS: Chat[] = [
  {
    id: 'chat-001',
    type: 'direct',
    participants: [MOCK_CHAT_USERS[0], MOCK_CHAT_USERS[1]], // John and Sarah
    lastActivity: new Date().toISOString(),
    messages: generateMockMessages('chat-001', 5),
    unreadCount: 2,
  },
  {
    id: 'chat-002',
    type: 'group',
    name: 'Authentication Team',
    participants: [MOCK_CHAT_USERS[0], MOCK_CHAT_USERS[1], MOCK_CHAT_USERS[2]], // John, Sarah, and Mike
    lastActivity: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    messages: generateMockMessages('chat-002', 8),
    unreadCount: 0,
  },
  {
    id: 'chat-003',
    type: 'direct',
    participants: [MOCK_CHAT_USERS[0], MOCK_CHAT_USERS[4]], // John and Bob
    lastActivity: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    messages: generateMockMessages('chat-003', 3),
    unreadCount: 0,
  },
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChat, setActiveChatState] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setActiveChat = (chatId: string | null) => {
    if (!chatId) {
      setActiveChatState(null);
      return;
    }

    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setActiveChatState(chat);
      markChatAsRead(chatId);
    }
  };

  const createDirectChat = async (participantId: string, participantName: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if chat already exists
      const currentUser = { id: 'user-1', name: 'John Developer' }; // Using a mock current user
      const existingChat = chats.find(c => 
        c.type === 'direct' && 
        c.participants.some(p => p.id === participantId) &&
        c.participants.some(p => p.id === currentUser.id)
      );
      
      if (existingChat) {
        setActiveChat(existingChat.id);
        return existingChat.id;
      }
      
      // Create new chat
      const newChatId = `chat-${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        type: 'direct',
        participants: [
          currentUser,
          { id: participantId, name: participantName }
        ],
        lastActivity: new Date().toISOString(),
        messages: [],
        unreadCount: 0,
      };
      
      setChats(prev => [...prev, newChat]);
      setActiveChat(newChatId);
      
      return newChatId;
    } finally {
      setIsLoading(false);
    }
  };

  const createGroupChat = async (name: string, participantIds: string[]): Promise<string> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock current user
      const currentUser = { id: 'user-1', name: 'John Developer' };
      
      // Get participants from IDs (would come from an API in a real app)
      const allParticipants = [
        currentUser,
        ...MOCK_CHAT_USERS.filter(u => participantIds.includes(u.id) && u.id !== currentUser.id)
      ];
      
      const newChatId = `chat-${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        type: 'group',
        name,
        participants: allParticipants,
        lastActivity: new Date().toISOString(),
        messages: [],
        unreadCount: 0,
      };
      
      setChats(prev => [...prev, newChat]);
      setActiveChat(newChatId);
      
      toast({
        title: "Group chat created",
        description: `The group "${name}" has been created with ${allParticipants.length} participants.`,
      });
      
      return newChatId;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (chatId: string, content: string, attachments?: File[]) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const currentUser = { id: 'user-1', name: 'John Developer' }; // Mock current user
      
      const newMessage: ChatMessage = {
        id: `msg-${chatId}-${Date.now()}`,
        content,
        sender: currentUser,
        timestamp: new Date().toISOString(),
        attachments: attachments?.map(file => ({
          id: `attachment-${Date.now()}-${file.name}`,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
        })),
      };
      
      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastActivity: newMessage.timestamp,
          };
        }
        return chat;
      }));
      
      // Update the active chat if it's the one we're sending to
      if (activeChat?.id === chatId) {
        setActiveChatState(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, newMessage],
            lastActivity: newMessage.timestamp,
          };
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const markChatAsRead = (chatId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, unreadCount: 0 };
      }
      return chat;
    }));
  };

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      isLoading,
      setActiveChat,
      createDirectChat,
      createGroupChat,
      sendMessage,
      markChatAsRead,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
