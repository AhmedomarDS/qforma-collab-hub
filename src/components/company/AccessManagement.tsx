
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, Edit3, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  name: string;
  email: string;
  joined_at: string;
}

const AccessManagement = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState('');
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
      fetchUserRoles();
    }
  }, [user]);

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      
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

      // Fetch user roles with profile information
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role,
          created_at,
          profiles (
            name,
            email
          )
        `)
        .eq('company_id', profile.current_company_id);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        setError('Failed to fetch user roles');
        return;
      }

      const formattedRoles = roles?.map(roleItem => ({
        id: roleItem.id,
        user_id: roleItem.user_id,
        role: roleItem.role,
        name: (roleItem.profiles as any)?.name || 'Unknown',
        email: (roleItem.profiles as any)?.email || '',
        joined_at: roleItem.created_at
      })) || [];

      setUserRoles(formattedRoles);
    } catch (error: any) {
      console.error('Error fetching user roles:', error);
      setError('Failed to fetch user roles');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userRoleId: string, newRoleValue: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRoleValue })
        .eq('id', userRoleId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: "User role has been updated successfully",
      });

      setEditingUser(null);
      setNewRole('');
      fetchUserRoles();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
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

  const startEditing = (userRoleId: string, currentRole: string) => {
    setEditingUser(userRoleId);
    setNewRole(currentRole);
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setNewRole('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Access Management</h2>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Roles ({userRoles.length})
          </CardTitle>
          <CardDescription>Manage roles and permissions for team members</CardDescription>
        </CardHeader>
        <CardContent>
          {userRoles.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No team members found</p>
          ) : (
            <div className="space-y-4">
              {userRoles.map((userRole) => (
                <div key={userRole.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {userRole.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{userRole.name}</p>
                      <p className="text-sm text-muted-foreground">{userRole.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(userRole.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {editingUser === userRole.id ? (
                      <div className="flex items-center gap-2">
                        <Select value={newRole} onValueChange={setNewRole}>
                          <SelectTrigger className="w-48">
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
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateRole(userRole.id, newRole)}
                          disabled={!newRole || newRole === userRole.role}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Badge className={getRoleBadgeColor(userRole.role)}>
                          {roles.find(r => r.value === userRole.role)?.label || userRole.role}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startEditing(userRole.id, userRole.role)}
                          disabled={userRole.user_id === user?.id} // Prevent self-editing
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Overview of permissions for each role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {roles.map((role) => (
              <div key={role.value} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={getRoleBadgeColor(role.value)}>
                    {role.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{role.description}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessManagement;
