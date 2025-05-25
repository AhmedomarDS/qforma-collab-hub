
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, Mail, Trash2, Clock, RefreshCw, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Invitation {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'technical_lead' | 'business_analyst' | 'tester' | 'automation_tester' | 'performance_tester' | 'security_tester' | 'developer';
  status: string;
  created_at: string;
  expires_at: string;
  invited_by: string;
  company_id: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'technical_lead' | 'business_analyst' | 'tester' | 'automation_tester' | 'performance_tester' | 'security_tester' | 'developer';
  joined_at: string;
}

const CompanySettingsInvitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'owner' | 'admin' | 'manager' | 'technical_lead' | 'business_analyst' | 'tester' | 'automation_tester' | 'performance_tester' | 'security_tester' | 'developer'>('tester');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const { toast } = useToast();

  const roles = [
    { value: 'owner', label: 'Owner', description: 'Full access to everything' },
    { value: 'admin', label: 'Admin', description: 'Manage team and settings' },
    { value: 'manager', label: 'Manager', description: 'Manage projects and assignments' },
    { value: 'technical_lead', label: 'Technical Lead', description: 'Lead technical decisions and architecture' },
    { value: 'business_analyst', label: 'Business Analyst', description: 'Analyze business requirements and processes' },
    { value: 'tester', label: 'Tester', description: 'Execute tests and report defects' },
    { value: 'automation_tester', label: 'Automation Tester', description: 'Create and maintain automated tests' },
    { value: 'performance_tester', label: 'Performance Tester', description: 'Execute performance and load testing' },
    { value: 'security_tester', label: 'Security Tester', description: 'Execute security testing and assessments' },
    { value: 'developer', label: 'Developer', description: 'View and fix defects' },
  ];

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setFetchLoading(true);
      
      // Get current user's company
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_company_id')
        .eq('id', user?.id)
        .single();

      if (!profile?.current_company_id) {
        setError('No company found for current user');
        return;
      }

      // Fetch pending invitations
      const { data: inviteData, error: inviteError } = await supabase
        .from('invitations')
        .select('*')
        .eq('company_id', profile.current_company_id)
        .eq('status', 'pending');

      if (inviteError) {
        console.error('Error fetching invitations:', inviteError);
        setError('Failed to fetch invitations');
      } else {
        setInvitations(inviteData || []);
      }

      // Fetch team members
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('id, role, created_at, user_id')
        .eq('company_id', profile.current_company_id);

      if (userRoles) {
        const userIds = userRoles.map(role => role.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', userIds);

        if (profiles) {
          const formattedMembers = userRoles.map(userRole => {
            const userProfile = profiles.find(profile => profile.id === userRole.user_id);
            return {
              id: userRole.id,
              name: userProfile?.name || 'Unknown',
              email: userProfile?.email || '',
              role: userRole.role,
              joined_at: userRole.created_at
            };
          });
          setTeamMembers(formattedMembers);
        }
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail || !inviteRole) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get current user's company
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_company_id')
        .eq('id', user?.id)
        .single();

      if (!profile?.current_company_id) {
        throw new Error('No company found');
      }

      // Check if user is already invited or is a team member
      const { data: existingInvite } = await supabase
        .from('invitations')
        .select('id')
        .eq('email', inviteEmail)
        .eq('company_id', profile.current_company_id)
        .eq('status', 'pending')
        .single();

      if (existingInvite) {
        setError('This email already has a pending invitation');
        return;
      }

      // Create invitation with proper typing
      const { error: inviteError } = await supabase
        .from('invitations')
        .insert({
          email: inviteEmail,
          company_id: profile.current_company_id,
          role: inviteRole as any, // Type assertion to handle the enum
          invited_by: user?.id || ''
        });

      if (inviteError) throw inviteError;

      // Call the send invitation edge function
      try {
        const { data: companyData } = await supabase
          .from('companies')
          .select('company_name')
          .eq('id', profile.current_company_id)
          .single();

        const { data: inviterData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user?.id)
          .single();

        await supabase.functions.invoke('send-team-invitation', {
          body: {
            email: inviteEmail,
            company_name: companyData?.company_name || 'Your Company',
            invited_by_name: inviterData?.name || 'A team member',
            role: inviteRole,
            invitation_token: 'temp-token',
            invitation_url: `${window.location.origin}/accept-invitation?token=temp-token`
          }
        });
      } catch (emailError) {
        console.error('Error sending invitation email:', emailError);
      }

      toast({
        title: "Invitation Sent!",
        description: `Invitation sent to ${inviteEmail} with ${inviteRole} role.`,
      });

      setInviteEmail('');
      setInviteRole('tester');
      fetchData();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      setError(error.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvitation = async (invitationId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ 
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation Resent",
        description: `Invitation resent to ${email}`,
      });

      fetchData();
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to resend invitation",
        variant: "destructive"
      });
    }
  };

  const handleCancelInvitation = async (invitationId: string, email: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) return;

    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation Cancelled",
        description: `Invitation to ${email} has been cancelled`,
      });

      fetchData();
    } catch (error: any) {
      console.error('Error cancelling invitation:', error);
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'technical_lead': return 'bg-indigo-100 text-indigo-800';
      case 'business_analyst': return 'bg-cyan-100 text-cyan-800';
      case 'tester': return 'bg-green-100 text-green-800';
      case 'automation_tester': return 'bg-emerald-100 text-emerald-800';
      case 'performance_tester': return 'bg-lime-100 text-lime-800';
      case 'security_tester': return 'bg-rose-100 text-rose-800';
      case 'developer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (fetchLoading) {
    return (
      <AppLayout>
        <div className="animate-fadeIn space-y-6">
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fadeIn space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Team Invitations</h1>
            <p className="text-muted-foreground">Invite team members and manage access</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Send Invitation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Invitation
              </CardTitle>
              <CardDescription>Invite new team members to join your workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendInvitation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={inviteRole} onValueChange={(value) => setInviteRole(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div>
                              <div className="font-medium">{role.label}</div>
                              <div className="text-xs text-muted-foreground">{role.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" className="w-full" disabled={loading}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      {loading ? 'Sending...' : 'Send Invitation'}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Invitations ({invitations.length})
              </CardTitle>
              <CardDescription>Invitations waiting for response</CardDescription>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No pending invitations</p>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Invited on {new Date(invitation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getRoleBadgeColor(invitation.role)}>
                          {roles.find(r => r.value === invitation.role)?.label || invitation.role}
                        </Badge>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {invitation.status}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleResendInvitation(invitation.id, invitation.email)}
                        >
                          Resend
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelInvitation(invitation.id, invitation.email)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Team Members ({teamMembers.length})
              </CardTitle>
              <CardDescription>Active members in your workspace</CardDescription>
            </CardHeader>
            <CardContent>
              {teamMembers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No team members found</p>
              ) : (
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getRoleBadgeColor(member.role)}>
                          {roles.find(r => r.value === member.role)?.label || member.role}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Joined {new Date(member.joined_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CompanySettingsInvitations;
