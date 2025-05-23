
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, CheckSquare, PlusCircle, Bot, Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import AiChatBox from '@/components/chat/AiChatBox';
import { parseCSV } from '@/lib/utils/csvParser';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TestCase {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  createdAt: string;
  aiGenerated?: boolean;
}

const TestCases = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [newTestCase, setNewTestCase] = useState({
    title: '',
    description: '',
    type: 'functional',
    status: 'draft',
    priority: 'medium',
  });

  const handleCreateTestCase = () => {
    const createdTestCase = {
      ...newTestCase,
      id: `tc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setTestCases(prev => [...prev, createdTestCase]);
    
    toast({
      title: "Test Case Created",
      description: `"${newTestCase.title}" has been created successfully.`,
    });
    
    setNewTestCase({
      title: '',
      description: '',
      type: 'functional',
      status: 'draft',
      priority: 'medium',
    });
    setIsDialogOpen(false);
  };
  
  const handleSaveAiContent = (content: string) => {
    // Extract a title from the content
    let title = '';
    const titleMatch = content.match(/\*\*Title\*\*:\s*(.*?)(?:\n|$)/);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    }
    
    // Create new test case with AI generated content
    const aiGeneratedTestCase = {
      id: `tc-${Date.now()}`,
      title: title || 'AI Generated Test Case',
      description: content,
      type: 'functional',
      status: 'draft',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      aiGenerated: true,
    };
    
    setTestCases(prev => [...prev, aiGeneratedTestCase]);
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

      const results = await parseCSV<Partial<TestCase>>(csvFile);
      clearInterval(timer);
      setUploadProgress(100);

      // Validate and transform the CSV data
      const newTestCases = results.map(row => ({
        id: `tc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: row.title || 'Untitled',
        description: row.description || '',
        type: row.type || 'functional',
        status: row.status || 'draft',
        priority: row.priority || 'medium',
        createdAt: new Date().toISOString(),
      }));

      setTestCases(prev => [...prev, ...newTestCases]);
      
      toast({
        title: "Upload Complete",
        description: `Successfully imported ${newTestCases.length} test cases.`,
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
  
  const generateTestCasePrompt = (userPrompt: string) => {
    return `Generate a detailed test case for the following requirement: ${userPrompt}. 
    Include test steps, expected results, prerequisites, and any other necessary details.`;
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Test Cases</h1>
            <p className="text-muted-foreground">Manage your test cases and executions</p>
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-qforma-blue hover:bg-qforma-blue/90">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Test Case
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create Test Case</DialogTitle>
                  <DialogDescription>
                    Create a new test case to verify system functionality.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={newTestCase.title}
                      onChange={(e) => setNewTestCase({...newTestCase, title: e.target.value})}
                      placeholder="Test case title"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description & Steps</Label>
                    <Textarea 
                      id="description"
                      value={newTestCase.description}
                      onChange={(e) => setNewTestCase({...newTestCase, description: e.target.value})}
                      placeholder="Describe the test steps and expected results"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Test Type</Label>
                      <Select 
                        value={newTestCase.type}
                        onValueChange={(value) => setNewTestCase({...newTestCase, type: value})}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="functional">Functional</SelectItem>
                          <SelectItem value="integration">Integration</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="usability">Usability</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={newTestCase.status}
                        onValueChange={(value) => setNewTestCase({...newTestCase, status: value})}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="review">In Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={newTestCase.priority}
                        onValueChange={(value) => setNewTestCase({...newTestCase, priority: value})}
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateTestCase} 
                    disabled={!newTestCase.title || !newTestCase.description}
                    className="bg-qforma-blue hover:bg-qforma-blue/90"
                  >
                    Create Test Case
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="library" className="w-full">
          <TabsList>
            <TabsTrigger value="library">Test Library</TabsTrigger>
            <TabsTrigger value="execution">Test Execution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Test Case Library</CardTitle>
              </CardHeader>
              <CardContent>
                {testCases.length > 0 ? (
                  <div className="space-y-4">
                    {testCases.map((testCase) => (
                      <Card key={testCase.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <CheckSquare className="h-4 w-4 text-qforma-teal" />
                                <span className="font-medium">{testCase.title}</span>
                                {testCase.aiGenerated && (
                                  <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                    AI Generated
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{testCase.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-xs bg-muted rounded-full px-2 py-1">
                                {testCase.type}
                              </div>
                              <div className="text-xs bg-muted rounded-full px-2 py-1">
                                {testCase.priority}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-4 flex justify-center">
                      <CheckSquare className="h-16 w-16 text-qforma-teal" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No Test Cases Yet</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Create your first test case to start building your test library. Link test cases to requirements for full traceability.
                    </p>
                    <Button variant="outline" className="mx-auto">
                      <FileText className="h-4 w-4 mr-2" />
                      View Requirements
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="execution" className="mt-4">
            <TestExecution testCases={testCases} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* CSV Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Test Cases from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with test case data. The file should include columns for title, description, type, status, and priority.
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
                title,description,type,status,priority<br/>
                "Login Test","Verify user can login with valid credentials","functional","draft","high"<br/>
                "Search Feature","Test search functionality","integration","ready","medium"
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
        title="AI Test Case Generator"
        placeholder="Describe the functionality you want to test..."
        onSaveContent={handleSaveAiContent}
        generatePrompt={generateTestCasePrompt}
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />
    </AppLayout>
  );
};

interface TestExecutionProps {
  testCases: TestCase[];
}

const TestExecutionProps: React.FC<TestExecutionProps> = ({ testCases }) => {
  const [selectedRelease, setSelectedRelease] = useState<string>("");
  const [executionTests, setExecutionTests] = useState<Array<TestCase & { executionStatus?: string; comment?: string }>>([]);
  const [isDefectDialogOpen, setIsDefectDialogOpen] = useState(false);
  const [currentTestCase, setCurrentTestCase] = useState<TestCase | null>(null);
  const [defect, setDefect] = useState({
    title: '',
    description: '',
    severity: 'medium',
  });

  // Mock releases for demonstration
  const releases = [
    { id: 'r1', name: 'Release 2.0 - August 2025' },
    { id: 'r2', name: 'Release 1.5 - June 2025' },
  ];

  const handleSelectRelease = (releaseId: string) => {
    setSelectedRelease(releaseId);
    // In a real app, you would fetch test cases assigned to this release
    // For now, we'll just use the existing test cases as a demo
    setExecutionTests(testCases.map(tc => ({ 
      ...tc, 
      executionStatus: 'not-run' 
    })));
  };

  const updateTestStatus = (testId: string, status: string) => {
    setExecutionTests(prev => prev.map(test => 
      test.id === testId ? { ...test, executionStatus: status } : test
    ));
  };

  const openDefectDialog = (testCase: TestCase) => {
    setCurrentTestCase(testCase);
    setDefect({
      title: `Defect for ${testCase.title}`,
      description: '',
      severity: 'medium',
    });
    setIsDefectDialogOpen(true);
  };

  const submitDefect = () => {
    toast({
      title: "Defect Reported",
      description: `"${defect.title}" has been created successfully.`,
    });
    
    // Here you would actually save the defect to your database
    setIsDefectDialogOpen(false);
    
    // Update the test case status to failed since a defect was found
    if (currentTestCase) {
      updateTestStatus(currentTestCase.id, 'failed');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Test Execution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="release-select">Select Release</Label>
              <Select value={selectedRelease} onValueChange={handleSelectRelease}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a release..." />
                </SelectTrigger>
                <SelectContent>
                  {releases.map((release) => (
                    <SelectItem key={release.id} value={release.id}>{release.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedRelease && (
              <div className="space-y-4 mt-4">
                <h3 className="font-semibold">Test Cases for Execution</h3>
                
                {executionTests.length > 0 ? (
                  <div className="space-y-4">
                    {executionTests.map((testCase) => (
                      <Card key={testCase.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <CheckSquare className="h-4 w-4 text-qforma-teal" />
                                <span className="font-medium">{testCase.title}</span>
                                {testCase.executionStatus === 'passed' && (
                                  <div className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                    Passed
                                  </div>
                                )}
                                {testCase.executionStatus === 'failed' && (
                                  <div className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                                    Failed
                                  </div>
                                )}
                                {testCase.executionStatus === 'running' && (
                                  <div className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                                    Running
                                  </div>
                                )}
                                {testCase.executionStatus === 'blocked' && (
                                  <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                                    Blocked
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{testCase.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Select 
                                value={testCase.executionStatus} 
                                onValueChange={(value) => updateTestStatus(testCase.id, value)}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="not-run">Not Run</SelectItem>
                                  <SelectItem value="passed">Passed</SelectItem>
                                  <SelectItem value="failed">Failed</SelectItem>
                                  <SelectItem value="blocked">Blocked</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openDefectDialog(testCase)}
                              >
                                Report Defect
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No test cases assigned to this release yet.</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Defect Creation Dialog */}
      <Dialog open={isDefectDialogOpen} onOpenChange={setIsDefectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report Defect</DialogTitle>
            <DialogDescription>
              Report a defect found during test execution.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="defect-title">Title</Label>
              <Input 
                id="defect-title" 
                value={defect.title}
                onChange={(e) => setDefect({...defect, title: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="defect-description">Description</Label>
              <Textarea 
                id="defect-description" 
                rows={4}
                placeholder="Describe the defect, steps to reproduce, and expected vs actual results..."
                value={defect.description}
                onChange={(e) => setDefect({...defect, description: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="defect-severity">Severity</Label>
              <Select 
                value={defect.severity}
                onValueChange={(value) => setDefect({...defect, severity: value})}
              >
                <SelectTrigger id="defect-severity">
                  <SelectValue placeholder="Select severity" />
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
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDefectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitDefect} 
              disabled={!defect.title || !defect.description}
            >
              Submit Defect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const TestExecution = TestExecutionProps;

export default TestCases;
