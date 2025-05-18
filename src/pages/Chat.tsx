
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Send,
  Plus,
  Users,
  MessageSquare,
  PlusCircle,
} from 'lucide-react';
import AppLayout from '@/components/layouts/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChat, Chat as ChatType } from '@/contexts/ChatContext';
import { Card, CardContent } from '@/components/ui/card';

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { chats, activeChat, setActiveChat, sendMessage } = useChat();
  
  const [messageContent, setMessageContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewGroupDialogOpen, setIsNewGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Filter chats based on search term
  const filteredChats = chats.filter(chat => {
    // For direct chats, search in participant names
    if (chat.type === 'direct') {
      const otherParticipant = chat.participants.find(p => p.id !== 'user-1'); // Assuming current user id is 'user-1'
      return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase());
    } 
    // For group chats, search in the group name
    return chat.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handleSendMessage = () => {
    if (!activeChat || !messageContent.trim()) return;
    
    sendMessage(activeChat.id, messageContent);
    setMessageContent('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const getChatDisplayName = (chat: ChatType) => {
    if (chat.type === 'group') {
      return chat.name;
    }
    
    // For direct chats, show the other person's name
    const otherParticipant = chat.participants.find(p => p.id !== 'user-1'); // Assuming current user id is 'user-1'
    return otherParticipant?.name || 'Unknown User';
  };
  
  const getChatAvatar = (chat: ChatType) => {
    if (chat.type === 'group') {
      return <Users className="h-5 w-5" />;
    }
    
    // For direct chats, use the first letter of the other person's name
    const otherParticipant = chat.participants.find(p => p.id !== 'user-1');
    return otherParticipant?.name.charAt(0) || 'U';
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-144px)] overflow-hidden bg-background rounded-lg border">
        {/* Chat Sidebar */}
        <div className="w-full max-w-xs border-r flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-2">Messages</h2>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search chats..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isNewGroupDialogOpen} onOpenChange={setIsNewGroupDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Chat</DialogTitle>
                    <DialogDescription>
                      Start a conversation with a team member or create a group chat.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="chat-type">Chat Type</Label>
                      <Select defaultValue="direct">
                        <SelectTrigger id="chat-type">
                          <SelectValue placeholder="Select chat type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direct">Direct Message</SelectItem>
                          <SelectItem value="group">Group Chat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="group-name">Group Name</Label>
                      <Input 
                        id="group-name" 
                        placeholder="Enter group name" 
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Select Members</Label>
                      <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                        {['Sarah QA Lead', 'Mike Manager', 'Bob Engineer', 'Alice Designer'].map((name, idx) => (
                          <div key={idx} className="flex items-center space-x-2 py-2">
                            <input type="checkbox" id={`user-${idx}`} className="h-4 w-4" />
                            <label htmlFor={`user-${idx}`} className="text-sm">{name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewGroupDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-qforma-teal hover:bg-qforma-teal/90">
                      Create Chat
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    className={`w-full text-left p-2 rounded-md hover:bg-muted flex items-start space-x-3 ${
                      activeChat?.id === chat.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setActiveChat(chat.id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={chat.type === 'group' ? 'bg-qforma-teal text-white' : ''}>
                        {getChatAvatar(chat)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium truncate">
                          {getChatDisplayName(chat)}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(chat.lastActivity)}
                        </span>
                      </div>
                      {chat.messages.length > 0 ? (
                        <p className="text-xs text-muted-foreground truncate">
                          {chat.messages[chat.messages.length - 1].content}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          No messages yet
                        </p>
                      )}
                      <div className="flex justify-between mt-1">
                        {chat.type === 'group' && (
                          <Badge variant="outline" className="text-xs">
                            Group
                          </Badge>
                        )}
                        {chat.unreadCount > 0 && (
                          <Badge className="bg-qforma-teal ml-auto">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p>No chats found</p>
                  <p className="text-sm">
                    {searchTerm ? "Try a different search term" : "Start a new conversation"}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Chat Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className={activeChat.type === 'group' ? 'bg-qforma-teal text-white' : ''}>
                      {getChatAvatar(activeChat)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{getChatDisplayName(activeChat)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {activeChat.type === 'group' ? (
                        `${activeChat.participants.length} members`
                      ) : (
                        'Direct message'
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    View Info
                  </Button>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeChat.messages.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2" />
                      <h3 className="text-lg font-medium">No messages yet</h3>
                      <p>Start the conversation by sending a message</p>
                    </div>
                  ) : (
                    activeChat.messages.map((message) => {
                      const isCurrentUser = message.sender.id === 'user-1'; // Assuming current user id is 'user-1'
                      
                      return (
                        <div 
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
                            {!isCurrentUser && (
                              <Avatar className="h-8 w-8 mt-0.5">
                                <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              {!isCurrentUser && (
                                <p className="text-xs text-muted-foreground mb-1">{message.sender.name}</p>
                              )}
                              <div className={`rounded-lg px-4 py-2 text-sm ${
                                isCurrentUser 
                                  ? 'bg-qforma-teal text-white' 
                                  : 'bg-muted'
                              }`}>
                                {message.content}
                                <div className="text-xs opacity-70 text-right mt-1">
                                  {formatTime(message.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messageEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!messageContent.trim()}
                    className="bg-qforma-teal hover:bg-qforma-teal/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Welcome to Chat</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Select a conversation from the sidebar or start a new chat to begin messaging.
              </p>
              <Button onClick={() => setIsNewGroupDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Start New Conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Chat;
