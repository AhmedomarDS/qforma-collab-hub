import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Mail, Users, Shield, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'technical_lead' | 'business_analyst' | 'tester' | 'automation_tester' | 'performance_tester' | 'security_tester' | 'developer';
  joined_at: string;
}

interface Invitation {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'technical_lead' | 'business_analyst' | 'tester' | 'automation_tester' | 'performance_tester' | 'security_tester' | 'developer';
  status: string;
  created_at: string;
  expires_at: string;
}

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'owner' | 'admin' | 'manager' | 'technical_lead' | 'business_analyst' | 'tester' | 'automation_tester' | 'performance_tester' | 'security_tester' | 'developer'>('tester');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const roles = [
    { value: 'owner' as const, label: 'Owner', description: 'Full access to everything' },
    { value: 'admin' as const, label: 'Admin', description: 'Manage team and settings' },
    { value: 'manager' as const, label: 'Manager', description: 'Manage projects and assignments' },
    { value: 'technical_lead' as const, label: 'Technical Lead', description: 'Lead technical decisions and architecture' },
    { value: 'business_analyst' as const, label: 'Business Analyst', description: 'Analyze business requirements and processes' },
    { value: 'tester' as const, label: 'Tester', description: 'Execute tests and report defects' },
    { value: 'automation_tester' as const, label: 'Automation Tester', description: 'Create and maintain automated tests' },
    { value: 'performance_tester' as const, label: 'Performance Tester', description: 'Execute performance and load testing' },
    { value: 'security_tester' as const, label: 'Security Tester', description: 'Execute security testing and assessments' },
    { value: 'developer' as const, label: 'Developer', description: 'View and fix defects' },
  ];

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      // Get current user's company
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_company_id')
        .eq('id', user?.id)
        .single();

      if (!profile?.current_company_id) return;

      // Fetch team members using separate queries to avoid join issues
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('id, role, created_at, user_id')
        .eq('company_id', profile.current_company_id);

      if (userRoles) {
        // Get user profiles for each user role
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

      // Fetch pending invitations
      const { data: invites } = await supabase
        .from('invitations')
        .select('*')
        .eq('company_id', profile.current_company_id)
        .eq('status', 'pending');

      if (invites) {
        setInvitations(invites);
      }
    } catch (error: any) {
      console.error('Error fetching team data:', error);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
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

      // Create invitation with proper typing
      const { error: inviteError } = await supabase
        .from('invitations')
        .insert({
          email: inviteEmail,
          company_id: profile.current_company_id,
          role: inviteRole,
          invited_by: user?.id || ''
        });

      if (inviteError) throw inviteError;

      toast({
        title: "Invitation Sent!",
        description: `Invitation sent to ${inviteEmail} with ${inviteRole} role.`,
      });

      setInviteEmail('');
      setInviteRole('tester');
      fetchTeamData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'owner' | 'admin' | 'manager' | 'technical_lead' | 'business_analyst' | 'tester' | 'automation_tester' | 'performance_tester' | 'security_tester' | 'developer') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: "Team member role has been updated successfully.",
      });

      fetchTeamData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Member Removed",
        description: "Team member has been removed successfully.",
      });

      fetchTeamData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation Cancelled",
        description: "Invitation has been cancelled successfully.",
      });

      fetchTeamData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cancel invitation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'technical_lead': return 'bg-green-100 text-green-800';
      case 'business_analyst': return 'bg-yellow-100 text-yellow-800';
      case 'tester': return 'bg-green-100 text-green-800';
      case 'automation_tester': return 'bg-orange-100 text-orange-800';
      case 'performance_tester': return 'bg-blue-100 text-blue-800';
      case 'security_tester': return 'bg-red-100 text-red-800';
      case 'developer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite New Member */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Invite Team Member
          </CardTitle>
          <CardDescription>
            Send an invitation to add a new team member to your company
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={(value: 'owner' | 'admin' | 'manager' | 'technical_lead' | 'business_analyst' | 'tester' | 'automation_tester' | 'performance_tester' | 'security_tester' | 'developer') => setInviteRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
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
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading}>
              <Mail className="w-4 h-4 mr-2" />
              {loading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{invitation.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getRoleBadgeColor(invitation.role)}>
                        {invitation.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Sent {new Date(invitation.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelInvitation(invitation.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members ({teamMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    value={member.role}
                    onValueChange={(newRole: 'owner' | 'admin' | 'manager' | 'technical_lead' | 'business_analyst' | 'tester' | 'automation_tester' | 'performance_tester' | 'security_tester' | 'developer') => handleRoleChange(member.id, newRole)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {member.role !== 'owner' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
