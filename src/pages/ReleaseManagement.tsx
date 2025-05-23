
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useRequirements } from '@/contexts/RequirementsContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GitBranch, Calendar, FileText, CheckSquare, Bug, Plus, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ReleaseStatus = 'planning' | 'development' | 'testing' | 'ready' | 'released';

interface Requirement {
  id: string;
  title: string;
  priority: string;
}

interface TestCase {
  id: string;
  title: string;
  status: string;
  requirementId?: string;
}

interface Defect {
  id: string;
  title: string;
  severity: string;
  testCaseId?: string;
}

interface Release {
  id: string;
  name: string;
  description: string;
  version: string;
  status: ReleaseStatus;
  targetDate: Date;
  requirements: Requirement[];
  testCases: TestCase[];
  defects: Defect[];
  createdBy: string;
  createdAt: Date;
}

const ReleaseManagement = () => {
  const { requirements } = useRequirements();
  
  const [releases, setReleases] = useState<Release[]>([
    {
      id: '1',
      name: 'Mobile App v2.0',
      description: 'Major release with new mobile features and UI improvements',
      version: '2.0.0',
      status: 'development',
      targetDate: new Date(2025, 5, 15),
      requirements: [
        { id: 'req1', title: 'User Authentication System', priority: 'high' },
        { id: 'req2', title: 'Responsive Design Implementation', priority: 'medium' }
      ],
      testCases: [
        { id: 'tc1', title: 'Login Flow Test', status: 'passed', requirementId: 'req1' },
        { id: 'tc2', title: 'Mobile Layout Test', status: 'running', requirementId: 'req2' }
      ],
      defects: [
        { id: 'def1', title: 'Login button not responsive', severity: 'medium', testCaseId: 'tc2' }
      ],
      createdBy: 'Release Manager',
      createdAt: new Date(2025, 4, 1)
    }
  ]);

  const [newRelease, setNewRelease] = useState({
    name: '',
    description: '',
    version: '',
    targetDate: ''
  });
  
  const [isCreateReleaseOpen, setIsCreateReleaseOpen] = useState(false);
  const [isAddRequirementsOpen, setIsAddRequirementsOpen] = useState(false);
  const [isAddTestCasesOpen, setIsAddTestCasesOpen] = useState(false);
  const [currentReleaseId, setCurrentReleaseId] = useState<string | null>(null);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  
  // Mock test cases for demonstration
  const availableTestCases: TestCase[] = [
    { id: 'tc-1', title: 'User Login Test Case', status: 'ready' },
    { id: 'tc-2', title: 'User Registration Validation', status: 'ready' },
    { id: 'tc-3', title: 'Password Reset Flow', status: 'ready' },
    { id: 'tc-4', title: 'Dashboard Loading Test', status: 'ready' },
  ];

  const getStatusColor = (status: ReleaseStatus) => {
    switch (status) {
      case 'planning': return 'bg-gray-500';
      case 'development': return 'bg-blue-500';
      case 'testing': return 'bg-yellow-500';
      case 'ready': return 'bg-green-500';
      case 'released': return 'bg-purple-500';
    }
  };

  const getStatusText = (status: ReleaseStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const createRelease = () => {
    if (!newRelease.name || !newRelease.version || !newRelease.targetDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const release: Release = {
      id: `release-${Date.now()}`,
      name: newRelease.name,
      description: newRelease.description,
      version: newRelease.version,
      status: 'planning',
      targetDate: new Date(newRelease.targetDate),
      requirements: [],
      testCases: [],
      defects: [],
      createdBy: 'Current User',
      createdAt: new Date()
    };

    setReleases([...releases, release]);
    setNewRelease({ name: '', description: '', version: '', targetDate: '' });
    setIsCreateReleaseOpen(false);
    
    toast({
      title: "Release Created",
      description: `${release.name} v${release.version} has been created successfully.`,
    });
  };

  const addRequirementsToRelease = () => {
    if (!currentReleaseId || selectedRequirements.length === 0) return;
    
    setReleases(prevReleases => {
      return prevReleases.map(release => {
        if (release.id === currentReleaseId) {
          const selectedReqs = requirements
            .filter(req => selectedRequirements.includes(req.id))
            .map(req => ({
              id: req.id,
              title: req.title,
              priority: req.priority
            }));
          
          // Filter out duplicates
          const existingReqIds = release.requirements.map(r => r.id);
          const newReqs = selectedReqs.filter(r => !existingReqIds.includes(r.id));
          
          return {
            ...release,
            requirements: [...release.requirements, ...newReqs]
          };
        }
        return release;
      });
    });
    
    setIsAddRequirementsOpen(false);
    setSelectedRequirements([]);
    
    toast({
      title: "Requirements Added",
      description: `${selectedRequirements.length} requirements were added to the release.`,
    });
  };

  const addTestCasesToRelease = () => {
    if (!currentReleaseId || selectedTestCases.length === 0) return;
    
    setReleases(prevReleases => {
      return prevReleases.map(release => {
        if (release.id === currentReleaseId) {
          const selectedTests = availableTestCases
            .filter(tc => selectedTestCases.includes(tc.id))
            .map(tc => ({
              id: tc.id,
              title: tc.title,
              status: tc.status
            }));
          
          // Filter out duplicates
          const existingTestIds = release.testCases.map(t => t.id);
          const newTests = selectedTests.filter(t => !existingTestIds.includes(t.id));
          
          return {
            ...release,
            testCases: [...release.testCases, ...newTests]
          };
        }
        return release;
      });
    });
    
    setIsAddTestCasesOpen(false);
    setSelectedTestCases([]);
    
    toast({
      title: "Test Cases Added",
      description: `${selectedTestCases.length} test cases were added to the release.`,
    });
  };

  const promoteRelease = (releaseId: string) => {
    setReleases(prevReleases => {
      return prevReleases.map(release => {
        if (release.id === releaseId) {
          let newStatus: ReleaseStatus = 'planning';
          
          switch (release.status) {
            case 'planning':
              newStatus = 'development';
              break;
            case 'development':
              newStatus = 'testing';
              break;
            case 'testing':
              newStatus = 'ready';
              break;
            case 'ready':
              newStatus = 'released';
              break;
            default:
              newStatus = release.status;
          }
          
          return {
            ...release,
            status: newStatus
          };
        }
        return release;
      });
    });
    
    toast({
      title: "Release Status Updated",
      description: `The release has been promoted to the next stage.`,
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Release Management</h1>
            <p className="text-muted-foreground">Plan, track, and manage software releases with linked requirements and test cases</p>
          </div>
          <Button onClick={() => setIsCreateReleaseOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Release
          </Button>
        </div>

        {/* Releases List */}
        <div className="grid gap-6">
          {releases.map(release => (
            <Card key={release.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GitBranch className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <CardTitle>{release.name} v{release.version}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Target: {release.targetDate.toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(release.status)} text-white`}>
                    {getStatusText(release.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{release.description}</p>
                
                <Tabs defaultValue="requirements">
                  <TabsList className="mb-4">
                    <TabsTrigger value="requirements" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Requirements ({release.requirements.length})
                    </TabsTrigger>
                    <TabsTrigger value="testcases" className="flex items-center">
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Test Cases ({release.testCases.length})
                    </TabsTrigger>
                    <TabsTrigger value="defects" className="flex items-center">
                      <Bug className="h-4 w-4 mr-2" />
                      Defects ({release.defects.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="requirements" className="space-y-4">
                    {release.requirements.length > 0 ? (
                      <div className="space-y-2">
                        {release.requirements.map(req => (
                          <div key={req.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span>{req.title}</span>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {req.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No requirements linked to this release yet.
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setCurrentReleaseId(release.id);
                          setIsAddRequirementsOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Requirements
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="testcases" className="space-y-4">
                    {release.testCases.length > 0 ? (
                      <div className="space-y-2">
                        {release.testCases.map(tc => (
                          <div key={tc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4 text-primary" />
                              <span>{tc.title}</span>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {tc.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No test cases linked to this release yet.
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setCurrentReleaseId(release.id);
                          setIsAddTestCasesOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Test Cases
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="defects" className="space-y-4">
                    {release.defects.length > 0 ? (
                      <div className="space-y-2">
                        {release.defects.map(defect => (
                          <div key={defect.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                              <Bug className="h-4 w-4 text-destructive" />
                              <span>{defect.title}</span>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {defect.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No defects reported for this release yet. Defects are reported from the Test Execution module.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="border-t pt-4 bg-muted/50 flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Edit Release</Button>
                  <Button variant="outline" size="sm">Generate Report</Button>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => promoteRelease(release.id)}
                  disabled={release.status === 'released'}
                  className="flex items-center gap-2"
                >
                  {release.status !== 'released' && (
                    <>
                      <span>
                        {release.status === 'planning' && 'Start Development'}
                        {release.status === 'development' && 'Move to Testing'}
                        {release.status === 'testing' && 'Mark as Ready'}
                        {release.status === 'ready' && 'Release'}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                  {release.status === 'released' && 'Released'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {releases.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mb-4 flex justify-center">
                <GitBranch className="h-16 w-16 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Releases Yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Create your first release to plan and track software delivery. Link requirements, test cases, and monitor defects.
              </p>
              <Button onClick={() => setIsCreateReleaseOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Release
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Create Release Dialog */}
      <Dialog open={isCreateReleaseOpen} onOpenChange={setIsCreateReleaseOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Release</DialogTitle>
            <DialogDescription>
              Define a new release and set its basic details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="release-name">Release Name</Label>
              <Input 
                id="release-name" 
                value={newRelease.name}
                onChange={(e) => setNewRelease({...newRelease, name: e.target.value})}
                placeholder="e.g., Mobile App Redesign"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="release-version">Version</Label>
                <Input 
                  id="release-version" 
                  value={newRelease.version}
                  onChange={(e) => setNewRelease({...newRelease, version: e.target.value})}
                  placeholder="e.g., 1.0.0"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="release-date">Target Date</Label>
                <Input 
                  id="release-date" 
                  type="date"
                  value={newRelease.targetDate}
                  onChange={(e) => setNewRelease({...newRelease, targetDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="release-description">Description</Label>
              <Textarea 
                id="release-description" 
                value={newRelease.description}
                onChange={(e) => setNewRelease({...newRelease, description: e.target.value})}
                placeholder="Describe the purpose and scope of this release..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateReleaseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createRelease}>
              Create Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Requirements Dialog */}
      <Dialog open={isAddRequirementsOpen} onOpenChange={setIsAddRequirementsOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Add Requirements to Release</DialogTitle>
            <DialogDescription>
              Select requirements to include in the release.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[400px] overflow-y-auto py-4">
            {requirements.length > 0 ? (
              <div className="space-y-3">
                {requirements.map(req => (
                  <div 
                    key={req.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRequirements.includes(req.id) ? 
                      'border-primary bg-primary/5' : 
                      'border-muted-foreground/20'
                    }`}
                    onClick={() => {
                      if (selectedRequirements.includes(req.id)) {
                        setSelectedRequirements(prev => prev.filter(id => id !== req.id));
                      } else {
                        setSelectedRequirements(prev => [...prev, req.id]);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={selectedRequirements.includes(req.id)} 
                        onChange={() => {}} // Handled by div click
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4"
                      />
                      <div>
                        <p className="font-medium">{req.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {req.description?.substring(0, 100) || 'No description'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {req.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No requirements available. Create requirements first.
              </div>
            )}
          </div>
          
          <DialogFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedRequirements.length} requirement(s) selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAddRequirementsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addRequirementsToRelease} disabled={selectedRequirements.length === 0}>
                Add Selected Requirements
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Test Cases Dialog */}
      <Dialog open={isAddTestCasesOpen} onOpenChange={setIsAddTestCasesOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Add Test Cases to Release</DialogTitle>
            <DialogDescription>
              Select test cases to include in the release.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[400px] overflow-y-auto py-4">
            {availableTestCases.length > 0 ? (
              <div className="space-y-3">
                {availableTestCases.map(tc => (
                  <div 
                    key={tc.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTestCases.includes(tc.id) ? 
                      'border-primary bg-primary/5' : 
                      'border-muted-foreground/20'
                    }`}
                    onClick={() => {
                      if (selectedTestCases.includes(tc.id)) {
                        setSelectedTestCases(prev => prev.filter(id => id !== tc.id));
                      } else {
                        setSelectedTestCases(prev => [...prev, tc.id]);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={selectedTestCases.includes(tc.id)} 
                        onChange={() => {}} // Handled by div click
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4"
                      />
                      <div>
                        <p className="font-medium">{tc.title}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {tc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No test cases available. Create test cases first.
              </div>
            )}
          </div>
          
          <DialogFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedTestCases.length} test case(s) selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAddTestCasesOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addTestCasesToRelease} disabled={selectedTestCases.length === 0}>
                Add Selected Test Cases
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ReleaseManagement;
