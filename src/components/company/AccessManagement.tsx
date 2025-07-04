
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Edit3, Save, X, Settings, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import RolePermissionsMatrix from './RolePermissionsMatrix';

type UserRoleType = 'owner' | 'admin' | 'manager' | 'technical_lead' | 'business_analyst' | 'tester' | 'automation_tester' | 'performance_tester' | 'security_tester' | 'developer';

interface UserRole {
  id: string;
  user_id: string;
  role: UserRoleType;
  name: string;
  email: string;
  joined_at: string;
}

const AccessManagement = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserRoleType | null>(null);
  const [error, setError] = useState('');
  const [companyId, setCompanyId] = useState<string | null>(null);
  
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
    if (user) {
      fetchUserRoles();
    }
  }, [user]);

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      setError('');
      
      // First, try to get the user's current company
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_company_id')
        .eq('id', user?.id)
        .single();

      let currentCompanyId = profile?.current_company_id;

      // If no current company is set, try to find any company the user belongs to
      if (!currentCompanyId) {
        console.log('No current company set, looking for any company association...');
        
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('company_id')
          .eq('user_id', user?.id)
          .limit(1)
          .single();

        if (userRole?.company_id) {
          currentCompanyId = userRole.company_id;
          
          // Update the user's profile to set this as their current company
          await supabase
            .from('profiles')
            .update({ current_company_id: currentCompanyId })
            .eq('id', user?.id);
            
          console.log('Set current company to:', currentCompanyId);
        }
      }

      if (!currentCompanyId) {
        setError('You are not associated with any company. Please contact your administrator.');
        return;
      }

      setCompanyId(currentCompanyId);

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
        .eq('company_id', currentCompanyId);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        setError('Failed to fetch user roles');
        return;
      }

      const formattedRoles = roles?.map(roleItem => ({
        id: roleItem.id,
        user_id: roleItem.user_id,
        role: roleItem.role as UserRoleType,
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

  const handleUpdateRole = async (userRoleId: string, newRoleValue: UserRoleType) => {
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
      setNewRole(null);
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

  const startEditing = (userRoleId: string, currentRole: UserRoleType) => {
    setEditingUser(userRoleId);
    setNewRole(currentRole);
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setNewRole(null);
  };

  const handleRoleChange = (value: string) => {
    const roleValue = value as UserRoleType;
    setNewRole(roleValue);
  };

  const isValidRole = (role: UserRoleType | null): role is UserRoleType => {
    return role !== null && roles.some(r => r.value === role);
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
          <Building className="h-4 w-4" />
          <AlertDescription>
            {error}
            {error.includes('not associated with any company') && (
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.href = '/company-settings'}
                >
                  Go to Company Settings
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {!error && (
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Roles
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Role Matrix & Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
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
                              <Select value={newRole || undefined} onValueChange={handleRoleChange}>
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
                                onClick={() => isValidRole(newRole) && handleUpdateRole(userRole.id, newRole)}
                                disabled={!isValidRole(newRole) || newRole === userRole.role}
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
                                disabled={userRole.user_id === user?.id}
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
          </TabsContent>

          <TabsContent value="permissions">
            <RolePermissionsMatrix />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AccessManagement;
