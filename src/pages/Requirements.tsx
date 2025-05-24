
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
import { FileText, PlusCircle, Bot, Upload, Filter, FolderOpen, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useRequirements, Requirement } from '@/contexts/RequirementsContext';
import { useProject } from '@/contexts/ProjectContext';
import FolderManagement from '@/components/requirements/FolderManagement';
import AiChatBox from '@/components/chat/AiChatBox';

const Requirements = () => {
  const { projects } = useProject();
  const { 
    requirements, 
    folders,
    isLoading, 
    selectedProjectId, 
    setSelectedProjectId, 
    loadProjectRequirements,
    createRequirement 
  } = useRequirements();
  
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCsvUploadOpen, setIsCsvUploadOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  const [newRequirement, setNewRequirement] = useState({
    title: '',
    description: '',
    status: 'draft' as Requirement['status'],
    priority: 'medium' as Requirement['priority'],
    project_id: '',
    folder_id: null as string | null,
  });

  // Load requirements when project is selected
  useEffect(() => {
    if (selectedProjectId) {
      loadProjectRequirements(selectedProjectId);
    }
  }, [selectedProjectId, loadProjectRequirements]);

  // Reset form when dialog opens
  useEffect(() => {
    if (isCreateDialogOpen) {
      setNewRequirement({
        title: '',
        description: '',
        status: 'draft',
        priority: 'medium',
        project_id: selectedProjectId || '',
        folder_id: null,
      });
    }
  }, [isCreateDialogOpen, selectedProjectId]);

  const handleCreateRequirement = async () => {
    if (!newRequirement.title || !newRequirement.description || !newRequirement.project_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including project selection.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createRequirement({
        ...newRequirement,
        folder_id: newRequirement.folder_id || null,
        created_by: 'Current User',
      });
      
      setNewRequirement({
        title: '',
        description: '',
        status: 'draft',
        priority: 'medium',
        project_id: '',
        folder_id: null,
      });
      
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create requirement:', error);
      toast({
        title: "Error",
        description: "Failed to create requirement. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file.",
        variant: "destructive"
      });
      return;
    }

    try {
      const text = await csvFile.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Validate CSV format
      const requiredFields = ['title', 'description', 'status', 'priority', 'project'];
      const missingFields = requiredFields.filter(field => !headers.includes(field));
      
      if (missingFields.length > 0) {
        toast({
          title: "Invalid CSV Format",
          description: `Missing required fields: ${missingFields.join(', ')}`,
          variant: "destructive"
        });
        return;
      }

      // Process CSV rows
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(cell => cell.trim());
        if (row.length === headers.length && row[0]) {
          const requirement: any = {};
          
          headers.forEach((header, index) => {
            requirement[header] = row[index];
          });

          // Find project by name
          const project = projects.find(p => p.name.toLowerCase() === requirement.project.toLowerCase());
          if (!project) {
            toast({
              title: "Error",
              description: `Project "${requirement.project}" not found. Please check project names in CSV.`,
              variant: "destructive"
            });
            continue;
          }

          // Map folder name to folder ID if provided
          let folderId = null;
          if (requirement.folder && folders.length > 0) {
            const folder = folders.find(f => f.name.toLowerCase() === requirement.folder.toLowerCase() && f.project_id === project.id);
            folderId = folder?.id || null;
          }

          await createRequirement({
            title: requirement.title,
            description: requirement.description || '',
            status: requirement.status as Requirement['status'] || 'draft',
            priority: requirement.priority as Requirement['priority'] || 'medium',
            project_id: project.id,
            folder_id: folderId,
            created_by: 'CSV Import',
          });
        }
      }

      toast({
        title: "Success",
        description: "Requirements imported successfully from CSV.",
      });
      
      setIsCsvUploadOpen(false);
      setCsvFile(null);
    } catch (error) {
      console.error('CSV upload error:', error);
      toast({
        title: "Error",
        description: "Failed to process CSV file. Please check the format.",
        variant: "destructive"
      });
    }
  };

  const downloadCsvTemplate = () => {
    const headers = ['title', 'description', 'status', 'priority', 'project', 'folder'];
    const exampleRows = [
      [
        'User Authentication',
        'Implement secure user login and registration system',
        'draft',
        'high',
        'API Integration',
        'Authentication'
      ],
      [
        'Password Reset',
        'Allow users to reset forgotten passwords',
        'review',
        'medium',
        'API Integration',
        'Authentication'
      ],
      [
        'Dashboard Overview',
        'Create main dashboard with key metrics',
        'development',
        'high',
        'API Integration',
        'Dashboard'
      ]
    ];
    
    const csvContent = [
      headers.join(','),
      ...exampleRows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'requirements_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
      
      toast({
        title: "Success",
        description: "AI generated requirement has been created successfully.",
      });
      
      // Close the AI chat after successful creation
      setIsAiChatOpen(false);
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

    return filtered;
  };

  const filteredRequirements = getFilteredRequirements();

  // Get available folders for the create form
  const getAvailableFolders = () => {
    const projectId = newRequirement.project_id || selectedProjectId;
    return folders.filter(folder => folder.project_id === projectId);
  };

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
              onClick={() => {
                if (!selectedProjectId) {
                  toast({
                    title: "Error",
                    description: "Please select a project first.",
                    variant: "destructive"
                  });
                  return;
                }
                setIsAiChatOpen(true);
              }}
            >
              <Bot className="h-4 w-4" />
              Generate with AI
            </Button>
            <Dialog open={isCsvUploadOpen} onOpenChange={setIsCsvUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Import Requirements from CSV</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file to bulk import requirements. Make sure your CSV includes the required fields.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="csv-file">CSV File</Label>
                    <Input 
                      id="csv-file" 
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <h4 className="font-medium">Required CSV Format:</h4>
                    <div className="text-sm space-y-2">
                      <p><strong>Required columns:</strong> title, description, status, priority, project</p>
                      <p><strong>Optional:</strong> folder (folder name - will be matched to existing folders)</p>
                      <p><strong>Status options:</strong> draft, review, approved, development, testing, complete</p>
                      <p><strong>Priority options:</strong> low, medium, high, critical</p>
                      <p><strong>Project:</strong> Use the exact project name as it appears in your projects list</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={downloadCsvTemplate}
                      className="w-full mt-3"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCsvUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCsvUpload} 
                    disabled={!csvFile || isLoading}
                  >
                    Import Requirements
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Requirement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create Requirement</DialogTitle>
                  <DialogDescription>
                    Define a new software requirement for your project.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project">Project *</Label>
                    <Select 
                      value={newRequirement.project_id}
                      onValueChange={(value) => setNewRequirement({...newRequirement, project_id: value, folder_id: null})}
                    >
                      <SelectTrigger id="project">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input 
                      id="title" 
                      value={newRequirement.title}
                      onChange={(e) => setNewRequirement({...newRequirement, title: e.target.value})}
                      placeholder="Requirement title"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea 
                      id="description"
                      value={newRequirement.description}
                      onChange={(e) => setNewRequirement({...newRequirement, description: e.target.value})}
                      placeholder="Describe the requirement in detail..."
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="folder">Folder (Optional)</Label>
                    <Select 
                      value={newRequirement.folder_id || "none"}
                      onValueChange={(value) => setNewRequirement({...newRequirement, folder_id: value === "none" ? null : value})}
                    >
                      <SelectTrigger id="folder">
                        <SelectValue placeholder="Select folder" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Folder</SelectItem>
                        {getAvailableFolders().map(folder => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                  {newRequirement.project_id && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Project:</strong> {projects.find(p => p.id === newRequirement.project_id)?.name}
                      </p>
                      {newRequirement.folder_id && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Folder:</strong> {folders.find(f => f.id === newRequirement.folder_id)?.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateRequirement} 
                    disabled={!newRequirement.title || !newRequirement.description || !newRequirement.project_id || isLoading}
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
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FolderOpen className="h-5 w-5" />
              Project Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={selectedProjectId || ""} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="w-80">
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
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
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
              <FolderManagement 
                onFolderSelect={setSelectedFolderId}
                selectedFolderId={selectedFolderId}
              />
            </div>

            {/* Requirements Library */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    Requirements Library
                    {selectedFolderId && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        {selectedFolderId === 'unorganized' ? 'Unorganized' : 'In Folder'}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">Loading requirements...</p>
                    </div>
                  ) : filteredRequirements.length > 0 ? (
                    <div className="space-y-4">
                      {filteredRequirements.map((requirement) => (
                        <Card key={requirement.id} className="hover:bg-muted/50 transition-colors border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  <span className="font-medium text-lg">{requirement.title}</span>
                                  <Badge variant="outline" className="capitalize bg-gray-50">
                                    {requirement.status}
                                  </Badge>
                                  {requirement.folder_id && (
                                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                      {folders.find(f => f.id === requirement.folder_id)?.name}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3 ml-7">
                                  {requirement.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 ml-4">
                                <Badge className={`
                                  ${requirement.priority === 'critical' && 'bg-red-500 hover:bg-red-600'} 
                                  ${requirement.priority === 'high' && 'bg-orange-500 hover:bg-orange-600'} 
                                  ${requirement.priority === 'medium' && 'bg-blue-500 hover:bg-blue-600'} 
                                  ${requirement.priority === 'low' && 'bg-green-500 hover:bg-green-600'} 
                                  text-white capitalize
                                `}>
                                  {requirement.priority}
                                </Badge>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="mb-6 flex justify-center">
                        <FileText className="h-20 w-20 text-gray-300" />
                      </div>
                      <h2 className="text-2xl font-semibold mb-3 text-gray-700">No Requirements Found</h2>
                      <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                        {selectedFolderId
                          ? "No requirements found in this folder. Create a new requirement or move existing ones here."
                          : "Start by creating your first requirement to define what needs to be built."}
                      </p>
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        size="lg"
                        className="bg-primary hover:bg-primary/90"
                      >
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Create Requirement
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="p-16 text-center">
            <div className="text-muted-foreground">
              <FolderOpen className="h-16 w-16 mx-auto mb-6 opacity-40" />
              <h3 className="text-2xl font-medium mb-4 text-gray-700">Select a Project</h3>
              <p className="text-lg">Choose a project from the dropdown above to view and manage its requirements</p>
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
