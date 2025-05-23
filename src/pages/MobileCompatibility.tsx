
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Tablet, Monitor, Zap, AlertCircle } from "lucide-react";
import AppLayout from "@/components/layouts/AppLayout";
import { toast } from "@/components/ui/use-toast";
import { aiPlatformService } from "@/services/aiPlatformService";

const MobileCompatibility = () => {
  const { t } = useTranslation();
  const [testName, setTestName] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const devices = [
    { 
      category: 'iOS', 
      icon: Smartphone, 
      devices: ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14', 'iPad Pro', 'iPad Air'] 
    },
    { 
      category: 'Android', 
      icon: Smartphone, 
      devices: ['Samsung Galaxy S24', 'Google Pixel 8', 'OnePlus 12', 'Samsung Galaxy Tab'] 
    },
    { 
      category: 'Tablets', 
      icon: Tablet, 
      devices: ['iPad Pro 12.9"', 'Samsung Galaxy Tab S9', 'Surface Pro', 'Kindle Fire'] 
    }
  ];

  const handleGenerateAITest = async () => {
    if (!testDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a test description",
        variant: "destructive"
      });
      return;
    }

    if (!aiPlatformService.isConfigured() && !apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your AI Platform API key",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      if (apiKey.trim()) {
        aiPlatformService.setApiKey(apiKey);
      }

      const response = await aiPlatformService.generateCompatibilityTest(
        'mobile',
        `Test Name: ${testName}\nDescription: ${testDescription}`
      );

      toast({
        title: "AI Test Generated",
        description: "Mobile compatibility test has been generated successfully",
      });

      console.log('Generated test:', response);
      
    } catch (error) {
      console.error('Failed to generate AI test:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mobile Compatibility Testing</h1>
          <p className="text-muted-foreground mt-2">
            Ensure your mobile applications work flawlessly across different devices and operating systems.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="create-test">Create Test</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {devices.map((category) => (
                <Card key={category.category}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <category.icon className="h-6 w-6" />
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.devices.map((device) => (
                        <Badge key={device} variant="outline" className="mr-1 mb-1">
                          {device}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Recent Test Results</span>
                </CardTitle>
                <CardDescription>
                  Latest mobile compatibility test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No test results available. Create your first mobile compatibility test to see results here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Mobile Compatibility Test</CardTitle>
                <CardDescription>
                  Set up a new compatibility test for mobile devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Test Name</label>
                  <Input
                    placeholder="Enter test name"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Test Description</label>
                  <Textarea
                    placeholder="Describe what you want to test across mobile devices..."
                    value={testDescription}
                    onChange={(e) => setTestDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                {!aiPlatformService.isConfigured() && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">AI Platform API Key</label>
                    <Input
                      type="password"
                      placeholder="Enter your AI platform API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Required for AI-powered test generation
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button onClick={handleGenerateAITest} disabled={isGenerating}>
                    <Zap className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate AI Test'}
                  </Button>
                  <Button variant="outline">
                    Create Manual Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  View and analyze mobile compatibility test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No test results available. Run some tests to see results here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MobileCompatibility;
