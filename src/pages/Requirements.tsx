import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  X, 
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Code,
  CheckSquare,
  Bot,
} from 'lucide-react';
import AppLayout from '@/components/layouts/AppLayout';
import { useRequirements, Requirement } from '@/contexts/RequirementsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import AiChatBox from '@/components/chat/AiChatBox';

const Requirements = () => {
  const { requirements, isLoading, createRequirement } = useRequirements();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [newRequirement, setNewRequirement] = useState({
    title: '',
    description: '',
    status: 'draft',
    priority: 'medium',
    tags: '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handleSaveAiContent = (content: string) => {
    // Extract a title from the content
    let title = '';
    let tags: string[] = [];
    
    const titleMatch = content.match(/\*\*Title\*\*:\s*(.*?)(?:\n|$)/);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    }
    
    // Extract any keywords to use as tags
    const keywordMatches = content.match(/\b(authentication|user-management|security|frontend|backend|api|database|ui|ux)\b/gi);
    if (keywordMatches) {
      tags = Array.from(new Set(keywordMatches.map(tag => tag.toLowerCase())));
    }
    
    // Create the requirement
    createRequirement({
      title: title || 'AI Generated Requirement',
      description: content,
      status: 'draft',
      priority: 'medium',
      tags: tags,
      createdBy: user.name,
    });
  };
  
  const generateRequirementPrompt = (userPrompt: string) => {
    return `Create a detailed software requirement specification for: ${userPrompt}. 
    Include title, description, acceptance criteria, and any other relevant details.`;
  };

  // Filter and sort requirements
  const filteredRequirements = requirements
    .filter(req => {
      const matchesSearch = searchTerm === '' || 
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        req.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filterStatus || req.status === filterStatus;
      const matchesPriority = !filterPriority || req.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortDirection === 'desc' 
          ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          : new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return sortDirection === 'desc' 
          ? priorityOrder[b.priority] - priorityOrder[a.priority]
          : priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        return sortDirection === 'desc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
    });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus(undefined);
    setFilterPriority(undefined);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleCreateRequirement = async () => {
    if (!newRequirement.title || !newRequirement.description) return;
    
    await createRequirement({
      title: newRequirement.title,
      description: newRequirement.description,
      status: newRequirement.status as Requirement['status'],
      priority: newRequirement.priority as Requirement['priority'],
      tags: newRequirement.tags.split(',').map(tag => tag.trim()),
      createdBy: user.name,
    });
    
    setNewRequirement({
      title: '',
      description: '',
      status: 'draft',
      priority: 'medium',
      tags: '',
    });
    setIsCreateDialogOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'review':
        return <AlertCircle className="h-4 w-4 text-qforma-warning" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-qforma-success" />;
      case 'development':
        return <Code className="h-4 w-4 text-qforma-teal" />;
      case 'testing':
        return <CheckSquare className="h-4 w-4 text-qforma-blue" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-qforma-success" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="default" className="bg-qforma-warning">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-qforma-teal text-qforma-teal">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-qforma-midGray text-qforma-midGray">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Requirements</h1>
            <p className="text-muted-foreground">Manage your project requirements</p>
          </div>
          
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsAiChatOpen(true)}
            >
              <Bot className="h-4 w-4" />
              Generate with AI
            </Button>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-qforma-blue hover:bg-qforma-blue/90">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Requirement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create New Requirement</DialogTitle>
                  <DialogDescription>
                    Add a new requirement to the project. Fill in the details below.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={newRequirement.title}
                      onChange={(e) => setNewRequirement({...newRequirement, title: e.target.value})}
                      placeholder="Enter requirement title"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={newRequirement.description}
                      onChange={(e) => setNewRequirement({...newRequirement, description: e.target.value})}
                      placeholder="Describe this requirement in detail"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={newRequirement.status}
                        onValueChange={(value) => setNewRequirement({...newRequirement, status: value})}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="testing">Testing</SelectItem>
                          <SelectItem value="complete">Complete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={newRequirement.priority}
                        onValueChange={(value) => setNewRequirement({...newRequirement, priority: value})}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input 
                      id="tags" 
                      value={newRequirement.tags}
                      onChange={(e) => setNewRequirement({...newRequirement, tags: e.target.value})}
                      placeholder="Enter tags separated by commas"
                    />
                    <p className="text-xs text-muted-foreground">Example: authentication, user-management, frontend</p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateRequirement} 
                    disabled={!newRequirement.title || !newRequirement.description || isLoading}
                    className="bg-qforma-blue hover:bg-qforma-blue/90"
                  >
                    {isLoading ? "Creating..." : "Create Requirement"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>{filterStatus || "Status"}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-statuses">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>{filterPriority || "Priority"}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-priorities">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center">
                      {sortDirection === 'asc' ? (
                        <SortAsc className="h-4 w-4 mr-2" />
                      ) : (
                        <SortDesc className="h-4 w-4 mr-2" />
                      )}
                      <span>Sort: {sortBy}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" onClick={toggleSortDirection}>
                  {sortDirection === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
                
                {(searchTerm || filterStatus || filterPriority) && (
                  <Button variant="outline" size="icon" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {filteredRequirements.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No requirements found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterStatus || filterPriority 
                      ? "Try adjusting your search or filters" 
                      : "Start by creating a new requirement"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRequirements.map((requirement) => (
              <Card key={requirement.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(requirement.status)}
                            <span className="text-sm capitalize">{requirement.status}</span>
                          </span>
                          <Separator orientation="vertical" className="h-4" />
                          {getPriorityBadge(requirement.priority)}
                        </div>
                        <h3 className="text-xl font-semibold mt-2">{requirement.title}</h3>
                        <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
                          {requirement.description}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-2">
                        View Details
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1">
                        {requirement.tags.map((tag) => (
                          <Badge variant="secondary" key={tag} className="bg-accent text-accent-foreground">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-3 flex justify-between text-xs text-muted-foreground">
                    <div>Created by: {requirement.createdBy}</div>
                    <div>Updated: {formatDate(requirement.updatedAt)}</div>
                    {requirement.assignedTo && (
                      <div>Assigned to: {requirement.assignedTo}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <AiChatBox
        title="AI Requirements Generator"
        placeholder="Describe the feature or requirement you need..."
        onSaveContent={handleSaveAiContent}
        generatePrompt={generateRequirementPrompt}
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />
    </AppLayout>
  );
};

export default Requirements;
