
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
import { Calendar, PlusCircle, FileText, Users, List } from 'lucide-react';
import { useTestPlans } from '@/hooks/useTestPlans';
import { useProjects } from '@/hooks/useProjects';

const TestPlans = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { testPlans, loading, createTestPlan } = useTestPlans();
  const { projects } = useProjects();

  const [newTestPlan, setNewTestPlan] = useState({
    name: '',
    description: '',
    project_id: '',
    start_date: '',
    end_date: '',
    testing_scope: '',
  });

  const handleCreateTestPlan = async () => {
    if (!newTestPlan.name || !newTestPlan.project_id || !newTestPlan.testing_scope) {
      return;
    }

    await createTestPlan(newTestPlan);
    
    setNewTestPlan({
      name: '',
      description: '',
      project_id: '',
      start_date: '',
      end_date: '',
      testing_scope: '',
    });
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string | null) => {
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

  const getScopeColor = (scope: string | null) => {
    if (!scope) return 'bg-gray-100 text-gray-800';
    if (scope.includes('functional')) return 'bg-blue-100 text-blue-800';
    if (scope.includes('integration')) return 'bg-purple-100 text-purple-800';
    if (scope.includes('security')) return 'bg-red-100 text-red-800';
    if (scope.includes('performance')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading test plans...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Test Plans</h1>
            <p className="text-muted-foreground">{t('testPlans.description')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Test Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Test Plan</DialogTitle>
                <DialogDescription>
                  Create a comprehensive test plan and organize test cases for execution within a specific testing scope.
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
                    value={newTestPlan.project_id}
                    onValueChange={(value) => setNewTestPlan({...newTestPlan, project_id: value})}
                  >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="testingScope">{t('testPlans.testingScope')}</Label>
                  <Select 
                    value={newTestPlan.testing_scope}
                    onValueChange={(value) => setNewTestPlan({...newTestPlan, testing_scope: value})}
                  >
                    <SelectTrigger id="testingScope">
                      <SelectValue placeholder="Select testing scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="functional">Functional Testing</SelectItem>
                      <SelectItem value="integration">Integration Testing</SelectItem>
                      <SelectItem value="security">Security Testing</SelectItem>
                      <SelectItem value="performance">Performance Testing</SelectItem>
                      <SelectItem value="automation">Automation Testing</SelectItem>
                      <SelectItem value="regression">Regression Testing</SelectItem>
                      <SelectItem value="smoke">Smoke Testing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input 
                      id="startDate" 
                      type="date"
                      value={newTestPlan.start_date}
                      onChange={(e) => setNewTestPlan({...newTestPlan, start_date: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input 
                      id="endDate" 
                      type="date"
                      value={newTestPlan.end_date}
                      onChange={(e) => setNewTestPlan({...newTestPlan, end_date: e.target.value})}
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
                  disabled={!newTestPlan.name || !newTestPlan.project_id || !newTestPlan.testing_scope}
                >
                  Create Test Plan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {testPlans.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <List className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No test plans yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first test plan to start organizing your testing activities.
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Test Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {testPlans.map((plan) => (
                <Card key={plan.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <div className="flex gap-2">
                        {plan.testing_scope && (
                          <Badge className={getScopeColor(plan.testing_scope)}>
                            {plan.testing_scope}
                          </Badge>
                        )}
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status || 'draft'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{plan.progress || 0}%</span>
                        </div>
                        <Progress value={plan.progress || 0} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {plan.projects?.name || 'No project'}
                        </div>
                        {plan.start_date && plan.end_date && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {plan.assigned_to?.length || 0} assigned
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default TestPlans;
