
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  LifeBuoy, 
  MessageSquare,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Eye,
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  assigned_to?: string;
}

interface TicketComment {
  id: string;
  comment: string;
  is_internal: boolean;
  created_at: string;
  user_id: string;
}

export const SupportTicketManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['admin-support-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SupportTicket[];
    }
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['support-ticket-comments', selectedTicket?.id],
    queryFn: async () => {
      if (!selectedTicket) return [];
      
      const { data, error } = await supabase
        .from('support_ticket_comments')
        .select('*')
        .eq('ticket_id', selectedTicket.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as TicketComment[];
    },
    enabled: !!selectedTicket
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ ticketId, updates }: { ticketId: string, updates: Partial<SupportTicket> }) => {
      const { error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', ticketId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
      toast({
        title: "Success",
        description: "Ticket updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket.",
        variant: "destructive"
      });
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ ticketId, comment, isInternal }: { ticketId: string, comment: string, isInternal: boolean }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('support_ticket_comments')
        .insert({
          ticket_id: ticketId,
          user_id: user.id,
          comment,
          is_internal: isInternal
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-ticket-comments', selectedTicket?.id] });
      setNewComment('');
      toast({
        title: "Success",
        description: "Comment added successfully.",
      });
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive"
      });
    }
  });

  const handleUpdateTicketStatus = (ticketId: string, newStatus: string) => {
    updateTicketMutation.mutate({ ticketId, updates: { status: newStatus } });
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  const handleAddComment = () => {
    if (!selectedTicket || !newComment.trim()) return;
    addCommentMutation.mutate({
      ticketId: selectedTicket.id,
      comment: newComment,
      isInternal
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'default';
      case 'waiting_for_customer': return 'secondary';
      case 'resolved': return 'outline';
      case 'closed': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    statusFilter === 'all' || ticket.status === statusFilter
  );

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading support tickets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <LifeBuoy className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium">Total Tickets</p>
                <p className="text-2xl font-bold">{ticketStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div className="ml-2">
                <p className="text-sm font-medium">Open</p>
                <p className="text-2xl font-bold">{ticketStats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-500" />
              <div className="ml-2">
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold">{ticketStats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="ml-2">
                <p className="text-sm font-medium">Resolved</p>
                <p className="text-2xl font-bold">{ticketStats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="waiting_for_customer">Waiting for Customer</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <Card 
                    key={ticket.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedTicket?.id === ticket.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium line-clamp-1">{ticket.subject}</h4>
                          <div className="flex gap-1">
                            <Badge variant={getStatusBadgeVariant(ticket.status)} className="text-xs">
                              {ticket.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant={getPriorityBadgeVariant(ticket.priority)} className="text-xs">
                              {ticket.priority.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {ticket.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>#{ticket.ticket_number}</span>
                          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Ticket Details */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTicket ? (
              <div className="space-y-6">
                {/* Ticket Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">{selectedTicket.subject}</h3>
                    <p className="text-sm text-muted-foreground">#{selectedTicket.ticket_number}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge variant={getStatusBadgeVariant(selectedTicket.status)}>
                      {selectedTicket.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant={getPriorityBadgeVariant(selectedTicket.priority)}>
                      {selectedTicket.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{selectedTicket.category.replace('_', ' ')}</Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Description:</p>
                    <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Select
                      value={selectedTicket.status}
                      onValueChange={(value) => handleUpdateTicketStatus(selectedTicket.id, value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="waiting_for_customer">Waiting for Customer</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Comments */}
                <div className="space-y-4">
                  <h4 className="font-medium">Comments</h4>
                  
                  <ScrollArea className="h-64 border rounded p-3">
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div key={comment.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span className="text-xs font-medium">Support Agent</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleString()}
                            </span>
                            {comment.is_internal && (
                              <Badge variant="secondary" className="text-xs">Internal</Badge>
                            )}
                          </div>
                          <p className="text-sm pl-5">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Add Comment */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="internal"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="internal" className="text-sm">Internal comment (not visible to customer)</Label>
                    </div>
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                    />
                    <Button 
                      onClick={handleAddComment} 
                      disabled={!newComment.trim() || addCommentMutation.isPending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a ticket to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
