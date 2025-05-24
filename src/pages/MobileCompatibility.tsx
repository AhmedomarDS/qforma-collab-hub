
import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Tablet,
  Monitor,
  Apple,
  Globe,
  AlertCircle,
  CheckCircle,
  Clock,
  Play,
  Download,
  Plus,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { aiPlatformService } from '@/services/aiPlatformService';
import AiChatBox from '@/components/chat/AiChatBox';

interface MobileTest {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  devices: string[];
  status: 'scheduled' | 'running' | 'passed' | 'failed' | 'blocked';
  results: { [device: string]: 'passed' | 'failed' | 'blocked' | 'running' };
  lastRun: Date | null;
  issuesFound: number;
  createdAt: Date;
  priority: 'high' | 'medium' | 'low';
}

const mockMobileTests: MobileTest[] = [
  {
    id: 'mt1',
    name: 'Basic Functionality Test - iOS',
    description: 'Verify core app features on iOS devices',
    platforms: ['ios'],
    devices: ['iPhone 15', 'iPad Pro'],
    status: 'passed',
    results: {
      'iPhone 15': 'passed',
      'iPad Pro': 'passed',
    },
    lastRun: new Date(),
    issuesFound: 0,
    createdAt: new Date(),
    priority: 'high',
  },
  {
    id: 'mt2',
    name: 'UI/UX Test - Android',
    description: 'Check UI elements and user experience on Android devices',
    platforms: ['android'],
    devices: ['Samsung Galaxy S24', 'Google Pixel 8'],
    status: 'failed',
    results: {
      'Samsung Galaxy S24': 'failed',
      'Google Pixel 8': 'passed',
    },
    lastRun: new Date(),
    issuesFound: 2,
    createdAt: new Date(),
    priority: 'medium',
  },
  {
    id: 'mt3',
    name: 'Network Connectivity Test',
    description: 'Test app behavior with different network conditions',
    platforms: ['ios', 'android'],
    devices: ['iPhone 15', 'Samsung Galaxy S24'],
    status: 'running',
    results: {
      'iPhone 15': 'passed',
      'Samsung Galaxy S24': 'running',
    },
    lastRun: new Date(),
    issuesFound: 0,
    createdAt: new Date(),
    priority: 'medium',
  },
];

const MobileCompatibility = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileTests, setMobileTests] = useState<MobileTest[]>(mockMobileTests);

  const getStatusColor = (status: MobileTest['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-gray-100 text-gray-800';
      case 'running':
        return 'bg-blue-100 text-blue-800 animate-pulse';
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'blocked':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTestSelection = (testId: string) => {
    setSelectedTest(testId);
  };

  const handleRunTest = (testId: string) => {
    toast({
      title: "Test Run Initiated",
      description: `Running test ${testId}...`,
    });
    // Implement test execution logic here
  };

  const handleDownloadReport = (testId: string) => {
    toast({
      title: "Report Download",
      description: `Downloading report for test ${testId}...`,
    });
    // Implement report download logic here
  };

  const handleOpenAiChat = () => {
    setIsAiChatOpen(true);
  };

  const handleGenerateWithAi = async (prompt: string) => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please provide a description for the mobile compatibility test",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await aiPlatformService.generateCompatibilityTest('mobile', prompt);
      
      // Parse the AI response and create a new test
      const newTest: MobileTest = {
        id: Math.random().toString(36).substring(7),
        name: `AI Generated: ${prompt.split(' ').slice(0, 3).join(' ')}`,
        description: response.content,
        platforms: ['ios', 'android'],
        devices: ['iPhone 15', 'Samsung Galaxy S24', 'iPad Pro'],
        status: 'scheduled',
        results: {},
        lastRun: null,
        issuesFound: 0,
        createdAt: new Date(),
        priority: 'medium'
      };
      
      setMobileTests(prev => [newTest, ...prev]);
      setIsAiChatOpen(false);
      
      toast({
        title: "Success",
        description: "Mobile compatibility test generated successfully!",
      });
    } catch (error) {
      console.error('Error generating test:', error);
      toast({
        title: "Error",
        description: "Failed to generate mobile compatibility test. Please try again.",
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
            <h1 className="text-3xl font-bold">Mobile Compatibility Testing</h1>
            <p className="text-muted-foreground">Ensure your app works flawlessly on various mobile devices</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleOpenAiChat}>
              <Plus className="h-4 w-4 mr-2" />
              Generate with AI
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Test
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview">
              <Smartphone className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="test-cases">
              <Tablet className="mr-2 h-4 w-4" />
              Test Cases
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Tests</CardTitle>
                  <CardDescription>Number of mobile compatibility tests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mobileTests.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Passed Tests</CardTitle>
                  <CardDescription>Tests that passed successfully</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">
                    {mobileTests.filter(test => test.status === 'passed').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Failed Tests</CardTitle>
                  <CardDescription>Tests that resulted in failures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">
                    {mobileTests.filter(test => test.status === 'failed').length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="test-cases" className="mt-6">
            <div className="grid gap-4">
              {mobileTests.map((test) => (
                <Card key={test.id} className="border">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {test.name}
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium">Platforms:</p>
                        <div className="flex items-center space-x-2">
                          {test.platforms.map((platform) => (
                            <Badge key={platform} variant="secondary">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Devices:</p>
                        <div className="flex items-center space-x-2">
                          {test.devices.map((device) => (
                            <Badge key={device} variant="secondary">
                              {device}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="flex justify-end space-x-2 p-4">
                    <Button variant="outline" size="sm" onClick={() => handleRunTest(test.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Run Test
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDownloadReport(test.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <AiChatBox
        title="Mobile Compatibility Test Generator"
        placeholder="Describe the mobile compatibility test you need..."
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onSaveContent={handleGenerateWithAi}
        generatePrompt={(prompt) => `Generate a comprehensive mobile compatibility test for: ${prompt}`}
        contentType="compatibility-test"
        isGenerating={isGenerating}
      />
    </AppLayout>
  );
};

export default MobileCompatibility;
