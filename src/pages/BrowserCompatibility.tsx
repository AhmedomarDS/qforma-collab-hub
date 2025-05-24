import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, 
  Chrome, 
  Firefox, 
  Safari, 
  Edge,
  Smartphone,
  Globe,
  AlertCircle,
  CheckCircle,
  Clock,
  Play,
  Download,
  Plus
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { aiPlatformService } from '@/services/aiPlatformService';
import AiChatBox from '@/components/chat/AiChatBox';

interface CompatibilityTest {
  id: string;
  name: string;
  description: string;
  browsers: string[];
  versions: string[];
  status: 'passed' | 'failed' | 'pending' | 'scheduled';
  results: { [browser: string]: 'passed' | 'failed' | 'pending' };
  lastRun: Date | null;
  issuesFound: number;
  createdAt: Date;
  priority: 'high' | 'medium' | 'low';
}

const mockCompatibilityTests: CompatibilityTest[] = [
  {
    id: '1',
    name: 'Basic Rendering Test',
    description: 'Checks if the basic layout and styles are rendered correctly across different browsers.',
    browsers: ['chrome', 'firefox', 'safari'],
    versions: ['latest'],
    status: 'passed',
    results: {
      chrome: 'passed',
      firefox: 'passed',
      safari: 'passed',
    },
    lastRun: new Date(),
    issuesFound: 0,
    createdAt: new Date(),
    priority: 'high',
  },
  {
    id: '2',
    name: 'JavaScript Execution Test',
    description: 'Verifies JavaScript code executes without errors on various browsers.',
    browsers: ['chrome', 'firefox', 'edge'],
    versions: ['latest'],
    status: 'failed',
    results: {
      chrome: 'passed',
      firefox: 'failed',
      edge: 'passed',
    },
    lastRun: new Date(),
    issuesFound: 2,
    createdAt: new Date(),
    priority: 'medium',
  },
  {
    id: '3',
    name: 'Responsive Design Test',
    description: 'Ensures the website adapts correctly to different screen sizes on mobile browsers.',
    browsers: ['chrome', 'safari'],
    versions: ['latest'],
    status: 'pending',
    results: {
      chrome: 'pending',
      safari: 'pending',
    },
    lastRun: null,
    issuesFound: 0,
    createdAt: new Date(),
    priority: 'low',
  },
];

const BrowserCompatibility = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [compatibilityTests, setCompatibilityTests] = useState<CompatibilityTest[]>(mockCompatibilityTests);

  const handleTestSelect = (testId: string) => {
    setSelectedTest(testId);
  };

  const handleRunTest = (testId: string) => {
    toast({
      title: "Test Run Initiated",
      description: `Running compatibility test ${testId}...`,
    });
    // Implement test execution logic here
  };

  const handleScheduleTest = (testId: string) => {
    toast({
      title: "Test Scheduled",
      description: `Compatibility test ${testId} scheduled for future execution.`,
    });
    // Implement test scheduling logic here
  };

  const handleDownloadReport = (testId: string) => {
    toast({
      title: "Report Download",
      description: `Downloading report for compatibility test ${testId}...`,
    });
    // Implement report download logic here
  };

  const getStatusColor = (status: CompatibilityTest['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateWithAi = async (prompt: string) => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please provide a description for the compatibility test",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await aiPlatformService.generateCompatibilityTest('browser', prompt);
      
      // Parse the AI response and create a new test
      const newTest: CompatibilityTest = {
        id: Math.random().toString(36).substring(7),
        name: `AI Generated: ${prompt.split(' ').slice(0, 3).join(' ')}`,
        description: response.content,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        versions: ['latest'],
        status: 'scheduled',
        results: {},
        lastRun: null,
        issuesFound: 0,
        createdAt: new Date(),
        priority: 'medium'
      };
      
      setCompatibilityTests(prev => [newTest, ...prev]);
      setIsAiChatOpen(false);
      
      toast({
        title: "Success",
        description: "Browser compatibility test generated successfully!",
      });
    } catch (error) {
      console.error('Error generating test:', error);
      toast({
        title: "Error",
        description: "Failed to generate browser compatibility test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Browser Compatibility Testing</h1>
            <p className="text-muted-foreground">Ensure your website works seamlessly across all browsers</p>
          </div>
          <Button onClick={() => setIsAiChatOpen(true)} disabled={isGenerating}>
            <Plus className="h-4 w-4 mr-2" />
            Generate with AI
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Tests</CardTitle>
                  <CardDescription>Number of compatibility tests defined</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{compatibilityTests.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tests Passed</CardTitle>
                  <CardDescription>Number of tests that passed successfully</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {compatibilityTests.filter(test => test.status === 'passed').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tests Failed</CardTitle>
                  <CardDescription>Number of tests that resulted in failure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {compatibilityTests.filter(test => test.status === 'failed').length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="tests" className="mt-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Compatibility Tests</h2>
                <Input placeholder="Search tests..." className="max-w-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compatibilityTests.map((test) => (
                  <Card key={test.id} className={selectedTest === test.id ? "border-2 border-primary" : ""}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {test.name}
                        <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>{test.browsers.join(', ')}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{test.description}</p>
                      <div className="mt-4 flex items-center space-x-3">
                        {test.status === 'failed' && (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {test.issuesFound} issues
                          </div>
                        )}
                        {test.status === 'passed' && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Passed
                          </div>
                        )}
                        {test.lastRun && (
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {test.lastRun.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <div className="flex justify-between p-4">
                      <Button variant="outline" size="sm" onClick={() => handleTestSelect(test.id)}>
                        View Details
                      </Button>
                      <div>
                        <Button variant="secondary" size="sm" onClick={() => handleRunTest(test.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Run Test
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="mt-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Reports</h2>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Compatibility Test Report</CardTitle>
                  <CardDescription>Download detailed reports for each test run</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Download comprehensive reports to analyze test results and identify compatibility issues.
                  </p>
                </CardContent>
                <div className="p-4">
                  <Button onClick={() => handleDownloadReport('all')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download All Reports
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      
      </div>
      
      <AiChatBox
        title="Browser Compatibility Test Generator"
        placeholder="Describe the browser compatibility test you need..."
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onSaveContent={handleGenerateWithAi}
        generatePrompt={(prompt) => `Generate a comprehensive browser compatibility test for: ${prompt}`}
        contentType="compatibility-test"
        isGenerating={isGenerating}
      />
    </AppLayout>
  );
};

export default BrowserCompatibility;
