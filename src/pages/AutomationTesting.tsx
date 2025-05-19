
import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TestTube,
  TestTubes,
  Play,
  Square,
  Code
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AiChatBox from '@/components/chat/AiChatBox';

const AutomationTesting = () => {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [testScenarios, setTestScenarios] = useState([
    {
      id: '1',
      name: 'User Registration Flow',
      description: 'Verifies the entire user registration process including form validation and email verification.',
      status: 'passed',
      lastRun: '2025-05-18',
      duration: '45s',
      steps: 12,
    },
    {
      id: '2',
      name: 'Product Search Functionality',
      description: 'Tests the search algorithm with various inputs and filters.',
      status: 'failed',
      lastRun: '2025-05-17',
      duration: '32s',
      steps: 8,
    },
    {
      id: '3',
      name: 'Payment Processing',
      description: 'End-to-end test of the payment processing flow with different payment methods.',
      status: 'not-run',
      lastRun: '-',
      duration: '-',
      steps: 15,
    }
  ]);
  
  const [activeTest, setActiveTest] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSaveContent = (content: string) => {
    const newScenario = {
      id: Math.random().toString(36).substring(7),
      name: content.split('\n')[0].replace(/^#+\s*/, '').substring(0, 50),
      description: content.split('\n').slice(1).join(' ').substring(0, 200),
      status: 'not-run',
      lastRun: '-',
      duration: '-',
      steps: Math.floor(Math.random() * 10) + 5,
    };
    
    setTestScenarios([...testScenarios, newScenario]);
  };
  
  const generatePrompt = (userPrompt: string) => {
    return `Generate an automation test scenario for: ${userPrompt}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // In a real implementation, this would start recording user actions
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    // In a real implementation, this would stop recording and save actions
    
    const newScenario = {
      id: Math.random().toString(36).substring(7),
      name: `Recorded Scenario ${new Date().toLocaleTimeString()}`,
      description: 'Test scenario created through action recording.',
      status: 'not-run',
      lastRun: '-',
      duration: '-',
      steps: Math.floor(Math.random() * 10) + 3,
    };
    
    setTestScenarios([...testScenarios, newScenario]);
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'passed':
        return <Badge className="bg-green-500">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Not Run</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Automation Testing</h1>
            <p className="text-muted-foreground">Create, manage and execute automated test scenarios</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAiChatOpen(true)}
              className="flex items-center"
            >
              <TestTube className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
            
            {isRecording ? (
              <Button 
                variant="destructive" 
                onClick={handleStopRecording}
                className="flex items-center"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            ) : (
              <Button 
                onClick={handleStartRecording}
                className="flex items-center"
              >
                <Play className="mr-2 h-4 w-4" />
                Record Test Scenario
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="passed">Passed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
            <TabsTrigger value="not-run">Not Run</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testScenarios.map(scenario => (
                <Card key={scenario.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      {getStatusBadge(scenario.status)}
                    </div>
                    <CardDescription>
                      Last run: {scenario.lastRun} • {scenario.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4">
                      {scenario.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {scenario.steps} steps
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">Run Test</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {['passed', 'failed', 'not-run'].map(status => (
            <TabsContent key={status} value={status} className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testScenarios
                  .filter(scenario => scenario.status === status)
                  .map(scenario => (
                    <Card key={scenario.id} className="flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{scenario.name}</CardTitle>
                          {getStatusBadge(scenario.status)}
                        </div>
                        <CardDescription>
                          Last run: {scenario.lastRun} • {scenario.duration}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground mb-4">
                          {scenario.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {scenario.steps} steps
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm">Run Test</Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <AiChatBox 
        title="Test Scenario Generator" 
        placeholder="Describe the test scenario you need..." 
        isOpen={isAiChatOpen} 
        onClose={() => setIsAiChatOpen(false)}
        onSaveContent={handleSaveContent}
        generatePrompt={generatePrompt}
      />
    </AppLayout>
  );
};

export default AutomationTesting;
