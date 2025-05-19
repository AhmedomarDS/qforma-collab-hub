
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
import { FileText, CheckSquare, PlusCircle, Bot } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import AiChatBox from '@/components/chat/AiChatBox';

const TestCases = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [testCases, setTestCases] = useState<Array<any>>([]);
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
      </div>
      
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

export default TestCases;
