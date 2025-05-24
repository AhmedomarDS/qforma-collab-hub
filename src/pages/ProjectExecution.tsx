
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
import { useProject, Project } from '@/contexts/ProjectContext';
import { useRequirements } from '@/contexts/RequirementsContext';
import { toast } from '@/components/ui/use-toast';

const ProjectExecution = () => {
  const navigate = useNavigate();
  const { projects, createProject, updateProject, deleteProject } = useProject();
  const { requirements } = useRequirements();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as const,
    startDate: '',
    endDate: '',
    members: [] as string[]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active',
      startDate: '',
      endDate: '',
      members: []
    });
    setEditingProject(null);
  };

  const handleCreateProject = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required.",
        variant: "destructive"
      });
      return;
    }

    createProject(formData);
    setIsCreateDialogOpen(false);
    resetForm();
    toast({
      title: "Success",
      description: "Project created successfully.",
    });
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      status: project.status,
      startDate: project.startDate.split('T')[0],
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      members: project.members
    });
    setIsCreateDialogOpen(true);
  };

  const handleUpdateProject = () => {
    if (!editingProject || !formData.name.trim()) return;

    updateProject(editingProject.id, {
      ...formData,
      startDate: formData.startDate + 'T00:00:00Z',
      endDate: formData.endDate ? formData.endDate + 'T00:00:00Z' : undefined
    });
    setIsCreateDialogOpen(false);
    resetForm();
    toast({
      title: "Success",
      description: "Project updated successfully.",
    });
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(projectId);
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
    }
  };

  const getProjectRequirements = (projectId: string) => {
    return requirements.filter(req => req.tags.some(tag => 
      tag.toLowerCase().includes('project') || tag.toLowerCase().includes(projectId)
    ));
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={editingProject ? handleUpdateProject : handleCreateProject}>
                  {editingProject ? 'Update Project' : 'Create Project'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const projectReqs = getProjectRequirements(project.id);
            
            return (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {project.description || 'No description provided'}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {project.status}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-3 w-3" />
                      {project.members.length}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(project.startDate).toLocaleDateString()} - 
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">Linked Requirements: </span>
                      <span className="text-muted-foreground">{projectReqs.length}</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex w-full gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate('/requirements')}
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      Requirements
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate('/design-management')}
                    >
                      <Layers3 className="mr-1 h-3 w-3" />
                      Design
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate('/test-cases')}
                    >
                      <CheckSquare className="mr-1 h-3 w-3" />
                      Tests
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
