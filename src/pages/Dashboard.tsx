
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, CheckSquare, XCircle, AlertTriangle, 
  Clock, FileText, CheckCircle, Folder, Crown
} from 'lucide-react';
import AppLayout from '@/components/layouts/AppLayout';
import { useDashboard } from '@/contexts/DashboardContext';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { dashboardData, refreshData, isLoading } = useDashboard();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth?tab=signin');
      return;
    }
    
    refreshData();
    
    // Load registration and trial data
    const regData = localStorage.getItem('registration-data');
    const plan = localStorage.getItem('selected-plan');
    const trialEnd = localStorage.getItem('trial-end-date');
    
    if (regData) {
      setRegistrationData(JSON.parse(regData));
    }
    if (plan) {
      setSelectedPlan(plan);
    }
    if (trialEnd) {
      setTrialEndDate(new Date(trialEnd));
    }
  }, [refreshData, user, navigate]);

  if (!user) {
    return null;
  }

  const { projectStats, testingProgress, recentActivity } = dashboardData;
  
  // Calculate completion percentages
  const requirementCompletion = Math.round(
    (projectStats.completedRequirements / projectStats.totalRequirements) * 100
  );
  
  const testPassRate = Math.round(
    (testingProgress.passedTests / testingProgress.totalTestCases) * 100
  );

  const getDaysLeft = () => {
    if (!trialEndDate) return 0;
    const now = new Date();
    const diffTime = trialEndDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysLeft = getDaysLeft();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'requirement':
        return <FileText className="h-5 w-5 text-qforma-blue" />;
      case 'test':
        return <CheckSquare className="h-5 w-5 text-qforma-teal" />;
      case 'defect':
        return <XCircle className="h-5 w-5 text-qforma-danger" />;
      case 'chat':
        return <Clock className="h-5 w-5 text-qforma-warning" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        {/* Subdomain and Trial Info Header */}
        {registrationData && (
          <div className="mb-6 p-4 bg-gradient-to-r from-qforma-blue/10 to-qforma-teal/10 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-qforma-blue">
                  {registrationData.subdomain}.qforma.app
                </h2>
                <p className="text-muted-foreground">
                  Welcome to your QForma SDLC Platform, {registrationData.companyName}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="h-4 w-4 text-qforma-teal" />
                  <Badge variant="secondary" className="bg-qforma-teal/10 text-qforma-teal">
                    {selectedPlan} Trial
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {daysLeft > 0 ? `${daysLeft} days left` : 'Trial expired'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">SDLC Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.user_metadata?.name || user.email}</p>
          </div>
          <Button 
            onClick={() => refreshData()}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <h3 className="text-2xl font-bold">{projectStats.activeProjects}</h3>
              </div>
              <div className="bg-qforma-blue/10 p-3 rounded-full">
                <Folder className="h-6 w-6 text-qforma-blue" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Requirements</p>
                <h3 className="text-2xl font-bold">{projectStats.totalRequirements}</h3>
                <p className="text-xs text-muted-foreground">{projectStats.completedRequirements} completed</p>
              </div>
              <div className="bg-qforma-blue/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-qforma-blue" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Test Cases</p>
                <h3 className="text-2xl font-bold">{testingProgress.totalTestCases}</h3>
                <p className="text-xs text-muted-foreground">{testingProgress.passedTests} passed</p>
              </div>
              <div className="bg-qforma-teal/10 p-3 rounded-full">
                <CheckSquare className="h-6 w-6 text-qforma-teal" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Defects</p>
                <h3 className="text-2xl font-bold">{testingProgress.failedTests}</h3>
                <p className="text-xs text-muted-foreground">{testingProgress.blockedTests} blocking</p>
              </div>
              <div className="bg-qforma-danger/10 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-qforma-danger" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
                <CardDescription>Overview of your current projects and testing status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Requirements Completion</span>
                      <span className="text-sm font-medium">{requirementCompletion}%</span>
                    </div>
                    <Progress value={requirementCompletion} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{projectStats.completedRequirements} completed</span>
                      <span>{projectStats.totalRequirements - projectStats.completedRequirements} remaining</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Test Pass Rate</span>
                      <span className="text-sm font-medium">{testPassRate}%</span>
                    </div>
                    <Progress value={testPassRate} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{testingProgress.passedTests} passed</span>
                      <span>{testingProgress.failedTests} failed</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between space-x-4 pt-4">
                    <div className="text-center flex-1">
                      <div className="flex justify-center">
                        <div className="bg-qforma-success/10 p-3 rounded-full">
                          <CheckCircle className="h-6 w-6 text-qforma-success" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mt-2">{testingProgress.passedTests}</h4>
                      <p className="text-sm text-muted-foreground">Passed Tests</p>
                    </div>
                    
                    <div className="text-center flex-1">
                      <div className="flex justify-center">
                        <div className="bg-qforma-danger/10 p-3 rounded-full">
                          <XCircle className="h-6 w-6 text-qforma-danger" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mt-2">{testingProgress.failedTests}</h4>
                      <p className="text-sm text-muted-foreground">Failed Tests</p>
                    </div>
                    
                    <div className="text-center flex-1">
                      <div className="flex justify-center">
                        <div className="bg-qforma-warning/10 p-3 rounded-full">
                          <AlertTriangle className="h-6 w-6 text-qforma-warning" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mt-2">{testingProgress.blockedTests}</h4>
                      <p className="text-sm text-muted-foreground">Blocked Tests</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                    <div>
                      <p className="text-sm font-medium">
                        {activity.user} {activity.action}
                      </p>
                      <p className="text-sm font-medium text-muted-foreground">
                        {activity.item}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.timestamp)}
                      </p>
                      {activity.id !== recentActivity[recentActivity.length - 1].id && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
