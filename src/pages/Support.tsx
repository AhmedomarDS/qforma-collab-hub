import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LifeBuoy, Plus, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general';
  created_at: string;
  updated_at: string;
}

const Support = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium' as const,
    category: 'general' as const
  });

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SupportTicket[];
    },
    enabled: !!user
  });

  const createTicketMutation = useMutation({
    mutationFn: async (ticketData: typeof newTicket) => {
      if (!user) throw new Error('User not authenticated');
      
      // Insert without ticket_number - it will be auto-generated by the trigger
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: ticketData.subject,
          description: ticketData.description,
          priority: ticketData.priority,
          category: ticketData.category,
          ticket_number: '' // Will be overwritten by the database trigger
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      setNewTicket({
        subject: '',
        description: '',
        priority: 'medium',
        category: 'general'
      });
      setShowCreateForm(false);
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleCreateTicket = (subject: string, description: string) => {
    setNewTicket({
      subject,
      description,
      priority: 'medium',
      category: 'general'
    });
    setShowCreateForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    createTicketMutation.mutate(newTicket);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'waiting_for_customer': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600 mt-2">Get help and manage your support tickets</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="chatbot" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" />
              My Tickets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chatbot">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  QForma AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>AI Assistant is temporarily unavailable while we work on improvements.</p>
                  <p className="text-sm mt-2">Please use the ticket system for support in the meantime.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <div className="space-y-6">
              {showCreateForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Create Support Ticket</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <Input
                          value={newTicket.subject}
                          onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          value={newTicket.description}
                          onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Detailed description of your issue"
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Priority</label>
                          <Select value={newTicket.priority} onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Category</label>
                          <Select value={newTicket.category} onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technical">Technical</SelectItem>
                              <SelectItem value="billing">Billing</SelectItem>
                              <SelectItem value="feature_request">Feature Request</SelectItem>
                              <SelectItem value="bug_report">Bug Report</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button type="submit" disabled={createTicketMutation.isPending}>
                          {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6">
                {isLoading ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-gray-500">Loading tickets...</div>
                    </CardContent>
                  </Card>
                ) : tickets.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <LifeBuoy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
                      <p className="text-gray-500 mb-4">You haven't created any support tickets yet.</p>
                      <Button onClick={() => setShowCreateForm(true)}>
                        Create Your First Ticket
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  tickets.map((ticket) => (
                    <Card key={ticket.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                            <p className="text-sm text-gray-500">Ticket #{ticket.ticket_number}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{ticket.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Created {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                          <span>Category: {ticket.category.replace('_', ' ')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Support;
