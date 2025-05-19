
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
import { FileText, CheckSquare, PlusCircle } from 'lucide-react';

const TestCases = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTestCase, setNewTestCase] = useState({
    title: '',
    description: '',
    type: 'functional',
    status: 'draft',
    priority: 'medium',
  });

  const handleCreateTestCase = () => {
    // This would normally submit the test case to an API
    console.log('Creating new test case:', newTestCase);
    setNewTestCase({
      title: '',
      description: '',
      type: 'functional',
      status: 'draft',
      priority: 'medium',
    });
    setIsDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Test Cases</h1>
            <p className="text-muted-foreground">Manage your test cases and executions</p>
          </div>
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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Test Case Library</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
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
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TestCases;
