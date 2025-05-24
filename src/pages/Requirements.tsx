
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, PlusCircle, Bot, Upload, Filter, FolderOpen } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useRequirements, Requirement } from '@/contexts/RequirementsContext';
import { useProject } from '@/contexts/ProjectContext';
import FolderManagement from '@/components/requirements/FolderManagement';
import AiChatBox from '@/components/chat/AiChatBox';

const Requirements = () => {
  const { projects } = useProject();
  const { 
    requirements, 
    isLoading, 
    selectedProjectId, 
    setSelectedProjectId, 
    loadProjectRequirements,
    createRequirement 
  } = useRequirements();
  
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
  });
  
  const [newRequirement, setNewRequirement] = useState({
    title: '',
    description: '',
    status: 'draft' as Requirement['status'],
    priority: 'medium' as Requirement['priority'],
    folder_id: null as string | null,
  });

  // Load requirements when project is selected
  useEffect(() => {
    if (selectedProjectId) {
      loadProjectRequirements(selectedProjectId);
    }
  }, [selectedProjectId, loadProjectRequirements]);

  const handleCreateRequirement = async () => {
    if (!newRequirement.title || !newRequirement.description || !selectedProjectId) return;
    
    try {
      await createRequirement({
        ...newRequirement,
        project_id: selectedProjectId,
        folder_id: selectedFolderId && selectedFolderId !== 'unorganized' ? selectedFolderId : null,
        created_by: 'Current User', // In a real app, this would be the logged in user
      });
      
      setNewRequirement({
        title: '',
        description: '',
        status: 'draft',
        priority: 'medium',
        folder_id: null,
      });
    } catch (error) {
      console.error('Failed to create requirement:', error);
      toast({
        title: "Error",
        description: "Failed to create requirement. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveAiContent = async (content: string) => {
    if (!selectedProjectId) {
      toast({
        title: "Error",
        description: "Please select a project first.",
        variant: "destructive"
      });
      return;
    }

    // Extract a title from the content (first line or first heading)
    let title = '';
    const titleMatch = content.match(/^#*\s*(.+?)$|^\s*(.+?)$/m);
    if (titleMatch) {
      title = (titleMatch[1] || titleMatch[2]).trim();
    }
    
    try {
      await createRequirement({
        title: title || 'AI Generated Requirement',
        description: content,
        status: 'draft',
        priority: 'medium',
        project_id: selectedProjectId,
        folder_id: selectedFolderId && selectedFolderId !== 'unorganized' ? selectedFolderId : null,
        created_by: 'AI Assistant',
      });
    } catch (error) {
      console.error('Failed to create AI requirement:', error);
      toast({
        title: "Error",
        description: "Failed to create requirement from AI content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generatePrompt = (userPrompt: string) => {
    return `Generate detailed software requirements for: ${userPrompt}. 
    Include functional requirements, acceptance criteria, and any business rules.`;
  };

  // Filter requirements based on current filters and selected folder
  const getFilteredRequirements = () => {
    let filtered = requirements;

    // Filter by folder
    if (selectedFolderId === 'unorganized') {
      filtered = filtered.filter(req => !req.folder_id);
    } else if (selectedFolderId) {
      filtered = filtered.filter(req => req.folder_id === selectedFolderId);
    }

    // Filter by status and priority
    if (filters.status.length > 0) {
      filtered = filtered.filter(req => filters.status.includes(req.status));
    }
    if (filters.priority.length > 0) {
      filtered = filtered.filter(req => filters.priority.includes(req.priority));
    }

    return filtered;
  };

  const filteredRequirements = getFilteredRequirements();

  return (
    <AppLayout>
      <div className="animate-fadeIn space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Requirements</h1>
            <p className="text-muted-foreground">Manage software requirements and specifications</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsAiChatOpen(true)}
              disabled={!selectedProjectId}
            >
              <Bot className="h-4 w-4" />
              Generate with AI
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  disabled={!selectedProjectId}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Requirement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create Requirement</DialogTitle>
                  <DialogDescription>
                    Define a new software requirement for your project.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={newRequirement.title}
                      onChange={(e) => setNewRequirement({...newRequirement, title: e.target.value})}
                      placeholder="Requirement title"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={newRequirement.description}
                      onChange={(e) => setNewRequirement({...newRequirement, description: e.target.value})}
                      placeholder="Describe the requirement in detail..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={newRequirement.status}
                        onValueChange={(value) => setNewRequirement({...newRequirement, status: value as any})}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="review">In Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="development">In Development</SelectItem>
                          <SelectItem value="testing">In Testing</SelectItem>
                          <SelectItem value="complete">Complete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={newRequirement.priority}
                        onValueChange={(value) => setNewRequirement({...newRequirement, priority: value as any})}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateRequirement} 
                    disabled={!newRequirement.title || !newRequirement.description || isLoading}
                  >
                    Create Requirement
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Project Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Project Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={selectedProjectId || ""} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProjectId && (
                <Badge variant="outline">
                  {requirements.length} requirement{requirements.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedProjectId ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Folder Management Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <FolderManagement 
                    onFolderSelect={setSelectedFolderId}
                    selectedFolderId={selectedFolderId}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Requirements List */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>
                    Requirements Library
                    {selectedFolderId && (
                      <Badge variant="outline" className="ml-2">
                        {selectedFolderId === 'unorganized' ? 'Unorganized' : 'In Folder'}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">Loading requirements...</p>
                    </div>
                  ) : filteredRequirements.length > 0 ? (
                    <div className="space-y-4">
                      {filteredRequirements.map((requirement) => (
                        <Card key={requirement.id} className="hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <FileText className="h-4 w-4 text-primary" />
                                  <span className="font-medium">{requirement.title}</span>
                                  <Badge variant="outline" className="capitalize">
                                    {requirement.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-2">
                                  {requirement.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`
                                  ${requirement.priority === 'critical' && 'bg-red-500'} 
                                  ${requirement.priority === 'high' && 'bg-orange-500'} 
                                  ${requirement.priority === 'medium' && 'bg-blue-500'} 
                                  ${requirement.priority === 'low' && 'bg-green-500'} 
                                  text-white
                                `}>
                                  {requirement.priority}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mb-4 flex justify-center">
                        <FileText className="h-16 w-16 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">No Requirements Found</h2>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        {selectedFolderId
                          ? "No requirements found in this folder. Create a new requirement or move existing ones here."
                          : "Start by creating your first requirement to define what needs to be built."}
                      </p>
                      <Button disabled={!selectedProjectId}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Requirement
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Select a Project</h3>
              <p>Choose a project from the dropdown above to view and manage its requirements</p>
            </div>
          </Card>
        )}
      </div>
      
      <AiChatBox
        title="AI Requirement Generator"
        placeholder="Describe the feature or functionality you need..."
        onSaveContent={handleSaveAiContent}
        generatePrompt={generatePrompt}
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        contentType="requirement"
      />
    </AppLayout>
  );
};

export default Requirements;
