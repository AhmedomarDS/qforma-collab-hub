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
  LineChart,
  BarChart,
  ChartPie,
  Play,
  Square,
  Settings,
  ChartLine
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AiChatBox from '@/components/chat/AiChatBox';

const PerformanceTesting = () => {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [performanceTests, setPerformanceTests] = useState([
    {
      id: '1',
      name: 'API Response Time Test',
      description: 'Measures response time for critical API endpoints under varying loads.',
      status: 'completed',
      lastRun: '2025-05-18',
      duration: '2h 15m',
      avgResponseTime: '120ms',
      maxUsers: 1000,
      type: 'load'
    },
    {
      id: '2',
      name: 'Database Query Performance',
      description: 'Tests database performance with complex queries and high transaction volume.',
      status: 'scheduled',
      lastRun: '-',
      duration: '-',
      avgResponseTime: '-',
      maxUsers: 500,
      type: 'stress'
    },
    {
      id: '3',
      name: 'Frontend Rendering Speed',
      description: 'Measures rendering performance of complex UI components.',
      status: 'in-progress',
      lastRun: 'Now',
      duration: '32m (running)',
      avgResponseTime: '310ms (current)',
      maxUsers: 200,
      type: 'endurance'
    }
  ]);
  
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSaveContent = (content: string) => {
    const testTypes = ['load', 'stress', 'endurance'];
    const randomType = testTypes[Math.floor(Math.random() * testTypes.length)];
    
    const newTest = {
      id: Math.random().toString(36).substring(7),
      name: content.split('\n')[0].replace(/^#+\s*/, '').substring(0, 50),
      description: content.split('\n').slice(1).join(' ').substring(0, 200),
      status: 'scheduled',
      lastRun: '-',
      duration: '-',
      avgResponseTime: '-',
      maxUsers: Math.floor(Math.random() * 1000) + 100,
      type: randomType
    };
    
    setPerformanceTests([...performanceTests, newTest]);
  };
  
  const generatePrompt = (userPrompt: string) => {
    return `Generate a performance test scenario for: ${userPrompt}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // In a real implementation, this would start recording user actions
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    // In a real implementation, this would stop recording and save actions
    
    const testTypes = ['load', 'stress', 'endurance'];
    const randomType = testTypes[Math.floor(Math.random() * testTypes.length)];
    
    const newTest = {
      id: Math.random().toString(36).substring(7),
      name: `Recorded Performance Test ${new Date().toLocaleTimeString()}`,
      description: 'Performance test scenario created through action recording.',
      status: 'scheduled',
      lastRun: '-',
      duration: '-',
      avgResponseTime: '-',
      maxUsers: Math.floor(Math.random() * 1000) + 100,
      type: randomType
    };
    
    setPerformanceTests([...performanceTests, newTest]);
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      default:
        return <Badge variant="outline">Scheduled</Badge>;
    }
  };
  
  const getTypeIcon = (type) => {
    switch(type) {
      case 'load':
        return <BarChart className="h-4 w-4" />;
      case 'stress':
        return <ChartPie className="h-4 w-4" />;
      case 'endurance':
        return <ChartLine className="h-4 w-4" />;
      default:
        return <LineChart className="h-4 w-4" />;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Performance Testing</h1>
            <p className="text-muted-foreground">Measure and optimize application performance</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAiChatOpen(true)}
              className="flex items-center"
            >
              <Settings className="mr-2 h-4 w-4" />
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
                Record Scenario
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="load">Load Tests</TabsTrigger>
            <TabsTrigger value="stress">Stress Tests</TabsTrigger>
            <TabsTrigger value="endurance">Endurance Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {performanceTests.map(test => (
                <Card key={test.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {getTypeIcon(test.type)}
                        <CardTitle className="text-lg ml-2">{test.name}</CardTitle>
                      </div>
                      {getStatusBadge(test.status)}
                    </div>
                    <CardDescription>
                      Last run: {test.lastRun} • {test.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4">
                      {test.description}
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Avg Response: {test.avgResponseTime}</span>
                      <span>Max Users: {test.maxUsers}</span>
                    </div>
                    {test.status === 'in-progress' && (
                      <Progress value={45} className="mt-4" />
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                    <Button size="sm">
                      {test.status === 'in-progress' ? 'Stop Test' : 'Run Test'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {['load', 'stress', 'endurance'].map(type => (
            <TabsContent key={type} value={type} className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {performanceTests
                  .filter(test => test.type === type)
                  .map(test => (
                    <Card key={test.id} className="flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            {getTypeIcon(test.type)}
                            <CardTitle className="text-lg ml-2">{test.name}</CardTitle>
                          </div>
                          {getStatusBadge(test.status)}
                        </div>
                        <CardDescription>
                          Last run: {test.lastRun} • {test.duration}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground mb-4">
                          {test.description}
                        </p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Avg Response: {test.avgResponseTime}</span>
                          <span>Max Users: {test.maxUsers}</span>
                        </div>
                        {test.status === 'in-progress' && (
                          <Progress value={45} className="mt-4" />
                        )}
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                        <Button size="sm">
                          {test.status === 'in-progress' ? 'Stop Test' : 'Run Test'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <AiChatBox 
        title="Performance Test Generator" 
        placeholder="Describe the performance test scenario you need..." 
        isOpen={isAiChatOpen} 
        onClose={() => setIsAiChatOpen(false)}
        onSaveContent={handleSaveContent}
        generatePrompt={generatePrompt}
        contentType="performance-script"
      />
    </AppLayout>
  );
};

export default PerformanceTesting;
