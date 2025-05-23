
import React, { useState } from 'react';
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
import { FileText, PlusCircle, Bot, Upload, Filter } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useRequirements, Requirement } from '@/contexts/RequirementsContext';
import { parseCSV } from '@/lib/utils/csvParser';
import AiChatBox from '@/components/chat/AiChatBox';

const Requirements = () => {
  const { requirements, isLoading, createRequirement } = useRequirements();
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
  });
  
  const [newRequirement, setNewRequirement] = useState({
    title: '',
    description: '',
    status: 'draft',
    priority: 'medium',
    tags: [],
  });

  const handleCreateRequirement = async () => {
    if (!newRequirement.title || !newRequirement.description) return;
    
    try {
      await createRequirement({
        ...newRequirement,
        tags: Array.isArray(newRequirement.tags) ? newRequirement.tags : [],
        createdBy: 'Current User', // In a real app, this would be the logged in user
      });
      
      setNewRequirement({
        title: '',
        description: '',
        status: 'draft',
        priority: 'medium',
        tags: [],
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
        tags: ['ai-generated'],
        createdBy: 'AI Assistant',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      setCsvError(null);
    }
  };

  const uploadCsv = async () => {
    if (!csvFile) {
      setCsvError("Please select a CSV file");
      return;
    }

    try {
      setUploadProgress(10);
      // Simulate upload progress
      const timer = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const results = await parseCSV<Partial<Requirement>>(csvFile);
      clearInterval(timer);
      setUploadProgress(100);

      // Validate and transform the CSV data
      let successCount = 0;
      
      for (const row of results) {
        try {
          await createRequirement({
            title: row.title || 'Untitled Requirement',
            description: row.description || '',
            status: row.status as any || 'draft',
            priority: row.priority as any || 'medium',
            tags: row.tags || [],
            createdBy: 'CSV Import',
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to import row: ${JSON.stringify(row)}`, error);
        }
      }
      
      toast({
        title: "Upload Complete",
        description: `Successfully imported ${successCount} of ${results.length} requirements.`,
      });
      
      setIsUploadDialogOpen(false);
      setCsvFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      setCsvError("Error parsing CSV. Please check the format and try again.");
      setUploadProgress(0);
    }
  };
  
  const generatePrompt = (userPrompt: string) => {
    return `Generate detailed software requirements for: ${userPrompt}. 
    Include functional requirements, acceptance criteria, and any business rules.`;
  };

  // Filter requirements based on current filters
  const filteredRequirements = requirements.filter(req => {
    if (filters.status.length > 0 && !filters.status.includes(req.status)) {
      return false;
    }
    if (filters.priority.length > 0 && !filters.priority.includes(req.priority)) {
      return false;
    }
    return true;
  });

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
            >
              <Bot className="h-4 w-4" />
              Generate with AI
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
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

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Filter Requirements</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex flex-wrap gap-2">
                      {['draft', 'review', 'approved', 'development', 'testing', 'complete'].map(status => (
                        <Badge 
                          key={status}
                          variant={filters.status.includes(status) ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              status: prev.status.includes(status) 
                                ? prev.status.filter(s => s !== status)
                                : [...prev.status, status]
                            }))
                          }}
                        >
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <div className="flex flex-wrap gap-2">
                      {['critical', 'high', 'medium', 'low'].map(priority => (
                        <Badge 
                          key={priority}
                          variant={filters.priority.includes(priority) ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              priority: prev.priority.includes(priority) 
                                ? prev.priority.filter(p => p !== priority)
                                : [...prev.priority, priority]
                            }))
                          }}
                        >
                          {priority}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({ status: [], priority: [] })}
                  >
                    Reset Filters
                  </Button>
                  <Button onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Input 
              className="max-w-[300px]" 
              placeholder="Search requirements..." 
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            {filteredRequirements.length} requirement{filteredRequirements.length !== 1 ? 's' : ''}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Requirements Library</CardTitle>
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
                          {requirement.tags && requirement.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {requirement.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
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
                  {filters.status.length > 0 || filters.priority.length > 0
                    ? "No requirements match your current filters. Try adjusting your filter criteria."
                    : "Start by creating your first requirement to define what needs to be built."}
                </p>
                {filters.status.length > 0 || filters.priority.length > 0 ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({ status: [], priority: [] })}
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Button onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Create Requirement"]')?.click()}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Requirement
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* CSV Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Requirements from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with requirement data. The file should include columns for title, description, status, and priority.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input 
                id="csv-file" 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange} 
              />
              {csvFile && (
                <p className="text-sm text-muted-foreground">{csvFile.name}</p>
              )}
              {csvError && (
                <p className="text-sm text-destructive">{csvError}</p>
              )}
            </div>
            
            {uploadProgress > 0 && (
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {uploadProgress}% Uploaded
                </p>
              </div>
            )}
            
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">CSV Format Example:</p>
              <pre className="text-xs overflow-auto p-2 bg-background rounded mt-1">
                title,description,status,priority<br/>
                "User Login","Users should be able to login with email and password","approved","high"<br/>
                "Password Reset","System should provide password reset via email","draft","medium"
              </pre>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={uploadCsv} disabled={!csvFile || uploadProgress > 0}>
              Upload and Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AiChatBox
        title="AI Requirement Generator"
        placeholder="Describe the feature or functionality you need..."
        onSaveContent={handleSaveAiContent}
        generatePrompt={generatePrompt}
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />
    </AppLayout>
  );
};

export default Requirements;
