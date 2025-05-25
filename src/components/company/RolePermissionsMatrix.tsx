
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Shield, Check, X } from 'lucide-react';

type UserRoleType = 'owner' | 'admin' | 'manager' | 'technical_lead' | 'business_analyst' | 'tester' | 'automation_tester' | 'performance_tester' | 'security_tester' | 'developer';

interface Permission {
  key: string;
  label: string;
  description: string;
}

interface RoleDefinition {
  value: UserRoleType;
  label: string;
  description: string;
  permissions: string[];
}

interface RoleFormData {
  label: string;
  description: string;
  permissions: string[];
}

const RolePermissionsMatrix = () => {
  const [editingRole, setEditingRole] = useState<UserRoleType | null>(null);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [formData, setFormData] = useState<RoleFormData>({ label: '', description: '', permissions: [] });

  const permissions: Permission[] = [
    { key: 'view_dashboard', label: 'View Dashboard', description: 'Access to main dashboard and analytics' },
    { key: 'manage_company', label: 'Manage Company', description: 'Edit company settings and information' },
    { key: 'manage_users', label: 'Manage Users', description: 'Add, edit, and remove team members' },
    { key: 'manage_roles', label: 'Manage Roles', description: 'Create and edit user roles and permissions' },
    { key: 'create_projects', label: 'Create Projects', description: 'Create new projects and initiatives' },
    { key: 'manage_projects', label: 'Manage Projects', description: 'Edit and delete existing projects' },
    { key: 'view_projects', label: 'View Projects', description: 'Access to view project details' },
    { key: 'create_requirements', label: 'Create Requirements', description: 'Add new requirements to projects' },
    { key: 'edit_requirements', label: 'Edit Requirements', description: 'Modify existing requirements' },
    { key: 'view_requirements', label: 'View Requirements', description: 'Access to view requirements' },
    { key: 'create_test_cases', label: 'Create Test Cases', description: 'Add new test cases' },
    { key: 'edit_test_cases', label: 'Edit Test Cases', description: 'Modify existing test cases' },
    { key: 'execute_tests', label: 'Execute Tests', description: 'Run manual and automated tests' },
    { key: 'view_test_results', label: 'View Test Results', description: 'Access to test execution results' },
    { key: 'manage_defects', label: 'Manage Defects', description: 'Create, edit, and resolve defects' },
    { key: 'view_defects', label: 'View Defects', description: 'Access to view defect reports' },
    { key: 'create_automation', label: 'Create Automation', description: 'Develop automated test scripts' },
    { key: 'manage_automation', label: 'Manage Automation', description: 'Edit and maintain automation suites' },
    { key: 'performance_testing', label: 'Performance Testing', description: 'Execute performance and load tests' },
    { key: 'security_testing', label: 'Security Testing', description: 'Perform security assessments' },
    { key: 'view_reports', label: 'View Reports', description: 'Access to analytics and reports' },
    { key: 'export_data', label: 'Export Data', description: 'Export project data and reports' },
    { key: 'manage_integrations', label: 'Manage Integrations', description: 'Configure external tool integrations' }
  ];

  const roleDefinitions: RoleDefinition[] = [
    {
      value: 'owner',
      label: 'Owner',
      description: 'Full access to everything',
      permissions: permissions.map(p => p.key)
    },
    {
      value: 'admin',
      label: 'Admin',
      description: 'Manage team and settings',
      permissions: [
        'view_dashboard', 'manage_company', 'manage_users', 'manage_roles',
        'create_projects', 'manage_projects', 'view_projects',
        'create_requirements', 'edit_requirements', 'view_requirements',
        'create_test_cases', 'edit_test_cases', 'execute_tests', 'view_test_results',
        'manage_defects', 'view_defects', 'view_reports', 'export_data', 'manage_integrations'
      ]
    },
    {
      value: 'manager',
      label: 'Manager',
      description: 'Manage projects and assignments',
      permissions: [
        'view_dashboard', 'create_projects', 'manage_projects', 'view_projects',
        'create_requirements', 'edit_requirements', 'view_requirements',
        'create_test_cases', 'edit_test_cases', 'view_test_results',
        'manage_defects', 'view_defects', 'view_reports', 'export_data'
      ]
    },
    {
      value: 'technical_lead',
      label: 'Technical Lead',
      description: 'Lead technical decisions and architecture',
      permissions: [
        'view_dashboard', 'view_projects', 'create_requirements', 'edit_requirements', 'view_requirements',
        'create_test_cases', 'edit_test_cases', 'execute_tests', 'view_test_results',
        'manage_defects', 'view_defects', 'create_automation', 'manage_automation',
        'performance_testing', 'security_testing', 'view_reports'
      ]
    },
    {
      value: 'business_analyst',
      label: 'Business Analyst',
      description: 'Analyze business requirements and processes',
      permissions: [
        'view_dashboard', 'view_projects', 'create_requirements', 'edit_requirements', 'view_requirements',
        'view_test_results', 'view_defects', 'view_reports'
      ]
    },
    {
      value: 'tester',
      label: 'Tester',
      description: 'Execute tests and report defects',
      permissions: [
        'view_dashboard', 'view_projects', 'view_requirements',
        'create_test_cases', 'edit_test_cases', 'execute_tests', 'view_test_results',
        'manage_defects', 'view_defects'
      ]
    },
    {
      value: 'automation_tester',
      label: 'Automation Tester',
      description: 'Create and maintain automated tests',
      permissions: [
        'view_dashboard', 'view_projects', 'view_requirements',
        'create_test_cases', 'edit_test_cases', 'execute_tests', 'view_test_results',
        'manage_defects', 'view_defects', 'create_automation', 'manage_automation'
      ]
    },
    {
      value: 'performance_tester',
      label: 'Performance Tester',
      description: 'Execute performance and load testing',
      permissions: [
        'view_dashboard', 'view_projects', 'view_requirements',
        'execute_tests', 'view_test_results', 'view_defects', 'performance_testing'
      ]
    },
    {
      value: 'security_tester',
      label: 'Security Tester',
      description: 'Execute security testing and assessments',
      permissions: [
        'view_dashboard', 'view_projects', 'view_requirements',
        'execute_tests', 'view_test_results', 'view_defects', 'security_testing'
      ]
    },
    {
      value: 'developer',
      label: 'Developer',
      description: 'View and fix defects',
      permissions: [
        'view_dashboard', 'view_projects', 'view_requirements',
        'view_test_results', 'view_defects'
      ]
    }
  ];

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

  const hasPermission = (role: UserRoleType, permission: string) => {
    const roleDefinition = roleDefinitions.find(r => r.value === role);
    return roleDefinition?.permissions.includes(permission) || false;
  };

  const handleEditRole = (role: UserRoleType) => {
    const roleDefinition = roleDefinitions.find(r => r.value === role);
    if (roleDefinition) {
      setFormData({
        label: roleDefinition.label,
        description: roleDefinition.description,
        permissions: roleDefinition.permissions
      });
      setEditingRole(role);
    }
  };

  const handleAddRole = () => {
    setFormData({ label: '', description: '', permissions: [] });
    setIsAddingRole(true);
  };

  const handlePermissionToggle = (permissionKey: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }));
  };

  const handleSave = () => {
    // In a real implementation, this would save to the database
    console.log('Saving role:', editingRole || 'new', formData);
    setEditingRole(null);
    setIsAddingRole(false);
  };

  const handleCancel = () => {
    setEditingRole(null);
    setIsAddingRole(false);
    setFormData({ label: '', description: '', permissions: [] });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Permissions Matrix
              </CardTitle>
              <CardDescription>Overview of permissions for each role in the system</CardDescription>
            </div>
            <Button onClick={handleAddRole} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Role</TableHead>
                  {permissions.map(permission => (
                    <TableHead key={permission.key} className="text-center min-w-32">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium">{permission.label}</span>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roleDefinitions.map(role => (
                  <TableRow key={role.value}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={getRoleBadgeColor(role.value)}>
                          {role.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{role.description}</span>
                      </div>
                    </TableCell>
                    {permissions.map(permission => (
                      <TableCell key={permission.key} className="text-center">
                        {hasPermission(role.value, permission.key) ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-gray-300 mx-auto" />
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditRole(role.value)}
                        disabled={role.value === 'owner'} // Prevent editing owner role
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Role Dialog */}
      <Dialog open={editingRole !== null || isAddingRole} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? `Edit ${roleDefinitions.find(r => r.value === editingRole)?.label} Role` : 'Add New Role'}
            </DialogTitle>
            <DialogDescription>
              Configure the role details and permissions below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role-label">Role Name</Label>
                <Input
                  id="role-label"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this role's responsibilities"
                  rows={2}
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Permissions</Label>
              <div className="mt-3 space-y-4">
                {permissions.map(permission => (
                  <div key={permission.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{permission.label}</div>
                      <div className="text-sm text-muted-foreground">{permission.description}</div>
                    </div>
                    <Switch
                      checked={formData.permissions.includes(permission.key)}
                      onCheckedChange={() => handlePermissionToggle(permission.key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.label.trim()}>
              {editingRole ? 'Save Changes' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolePermissionsMatrix;
