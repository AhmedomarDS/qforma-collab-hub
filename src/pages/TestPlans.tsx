
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, PlusCircle, FileText, PlayCircle, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface TestCase {
  id: string;
  title: string;
  requirement: string;
  status: 'not-run' | 'passed' | 'failed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface TestPlan {
  id: string;
  name: string;
  description: string;
  project: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  progress: number;
  testCases: TestCase[];
  startDate: string;
  endDate: string;
  assignedTo: string[];
}

const TestPlans = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTestPlan, setSelectedTestPlan] = useState<TestPlan | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: 'tc1',
      title: 'User Login Test',
      requirement: 'REQ-001: User Authentication',
      status: 'not-run',
      priority: 'high',
    },
    {
      id: 'tc2',
      title: 'Password Reset Test',
      requirement: 'REQ-002: Password Recovery',
      status: 'not-run',
      priority: 'medium',
    },
    {
      id: 'tc3',
      title: 'Profile Update Test',
      requirement: 'REQ-003: User Profile Management',
      status: 'not-run',
      priority: 'medium',
    },
  ]);

  const [testPlans] = useState<TestPlan[]>([
    {
      id: 'tp1',
      name: 'User Authentication Module',
      description: 'Test plan for user authentication and authorization features',
      project: 'E-commerce Platform',
      status: 'active',
      progress: 65,
      testCases: [],
      startDate: '2025-05-20',
      endDate: '2025-06-15',
      assignedTo: ['John Doe', 'Jane Smith'],
    },
    {
      id: 'tp2',
      name: 'Payment Integration Testing',
      description: 'Comprehensive testing of payment gateway integration',
      project: 'E-commerce Platform',
      status: 'draft',
      progress: 0,
      testCases: [],
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      assignedTo: ['Mike Johnson'],
    },
  ]);

  const [newTestPlan, setNewTestPlan] = useState({
    name: '',
    description: '',
    project: '',
    startDate: '',
    endDate: '',
  });

  const handleCreateTestPlan = () => {
    console.log('Creating new test plan:', newTestPlan);
    setNewTestPlan({
      name: '',
      description: '',
      project: '',
      startDate: '',
      endDate: '',
    });
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: "Test plan created successfully!",
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(testCases);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTestCases(items);
    toast({
      title: "Test Cases Reordered",
      description: "Test case execution order updated successfully!",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'blocked':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Test Plans</h1>
            <p className="text-muted-foreground">Manage and execute test plans for your projects</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Test Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Test Plan</DialogTitle>
                <DialogDescription>
                  Create a comprehensive test plan and organize test cases for execution.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Test Plan Name</Label>
                  <Input 
                    id="name" 
                    value={newTestPlan.name}
                    onChange={(e) => setNewTestPlan({...newTestPlan, name: e.target.value})}
                    placeholder="Enter test plan name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={newTestPlan.description}
                    onChange={(e) => setNewTestPlan({...newTestPlan, description: e.target.value})}
                    placeholder="Describe the scope and objectives of this test plan"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="project">Project</Label>
                  <Select 
                    value={newTestPlan.project}
                    onValueChange={(value) => setNewTestPlan({...newTestPlan, project: value})}
                  >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project1">E-commerce Platform</SelectItem>
                      <SelectItem value="project2">Mobile App</SelectItem>
                      <SelectItem value="project3">API Integration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input 
                      id="startDate" 
                      type="date"
                      value={newTestPlan.startDate}
                      onChange={(e) => setNewTestPlan({...newTestPlan, startDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input 
                      id="endDate" 
                      type="date"
                      value={newTestPlan.endDate}
                      onChange={(e) => setNewTestPlan({...newTestPlan, endDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button 
                  onClick={handleCreateTestPlan} 
                  disabled={!newTestPlan.name || !newTestPlan.project}
                >
                  Create Test Plan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {testPlans.map((plan) => (
                <Card key={plan.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedTestPlan(plan)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {plan.project}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {plan.startDate} - {plan.endDate}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {plan.assignedTo.length} assigned
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Test Cases Pool
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Drag and drop test cases to organize execution order
                </p>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="testCases">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {testCases.map((testCase, index) => (
                          <Draggable key={testCase.id} draggableId={testCase.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-3 border rounded-lg bg-white hover:shadow-sm transition-shadow"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-sm">{testCase.title}</span>
                                  {getTestStatusIcon(testCase.status)}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{testCase.requirement}</p>
                                <Badge variant={testCase.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                                  {testCase.priority}
                                </Badge>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                
                <Button className="w-full mt-4" variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Test Cases
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TestPlans;
