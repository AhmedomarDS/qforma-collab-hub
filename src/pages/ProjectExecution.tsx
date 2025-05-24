import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Plus, 
  FileText, 
  Layers3, 
  CheckSquare, 
  Calendar,
  Users,
  MoreHorizontal,
  Pencil,
  Trash,
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjects } from '@/hooks/useProjects';
import { useRequirements } from '@/contexts/RequirementsContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const ProjectExecution = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, loading, refetch } = useProjects();
  const { requirements } = useRequirements();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'completed' | 'archived'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active'
    });
    setEditingProject(null);
  };

  const handleCreateProject = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a project.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .insert([{
          name: formData.name,
          description: formData.description,
          status: formData.status,
          created_by: user.id
        }]);

      if (error) throw error;

      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
      toast({
        title: "Success",
        description: "Project created successfully.",
      });
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      status: project.status
    });
    setIsCreateDialogOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!editingProject || !formData.name.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: formData.name,
          description: formData.description,
          status: formData.status
        })
        .eq('id', editingProject.id);

      if (error) throw error;

      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
      toast({
        title: "Success",
        description: "Project updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      refetch();
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectRequirements = (projectId: string) => {
    return requirements.filter(req => req.project_id === projectId);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading projects...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Project Execution</h1>
            <p className="text-muted-foreground">Create and manage your projects with linked components</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Update project details' : 'Add a new project to your workspace'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter project description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={editingProject ? handleUpdateProject : handleCreateProject}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const projectReqs = getProjectRequirements(project.id);
            
            return (
              <Card key={project.id} className="flex flex-col h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                      <CardDescription className="mt-1 text-sm">
                        {project.description || 'No description provided'}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditProject(project)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant={getStatusBadgeVariant(project.status || 'active')}>
                      {project.status || 'active'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 pb-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <span className="font-medium">Linked Requirements:</span>
                      <span className="ml-2 text-muted-foreground">{projectReqs.length}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center justify-center text-xs px-2"
                      onClick={() => navigate('/requirements')}
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      <span className="hidden sm:inline">Requirements</span>
                      <span className="sm:hidden">Req</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center justify-center text-xs px-2"
                      onClick={() => navigate('/design-management')}
                    >
                      <Layers3 className="mr-1 h-3 w-3" />
                      <span className="hidden sm:inline">Design</span>
                      <span className="sm:hidden">Des</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center justify-center text-xs px-2"
                      onClick={() => navigate('/test-cases')}
                    >
                      <CheckSquare className="mr-1 h-3 w-3" />
                      <span className="hidden sm:inline">Tests</span>
                      <span className="sm:hidden">Test</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to start managing your development lifecycle
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProjectExecution;
