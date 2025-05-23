
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chrome, Globe, Monitor, Smartphone, Zap, AlertCircle } from "lucide-react";
import AppLayout from "@/components/layouts/AppLayout";
import { toast } from "@/components/ui/use-toast";
import { aiPlatformService } from "@/services/aiPlatformService";

const BrowserCompatibility = () => {
  const { t } = useTranslation();
  const [testName, setTestName] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const browsers = [
    { name: 'Chrome', icon: Chrome, versions: ['Latest', '120', '119', '118'] },
    { name: 'Firefox', icon: Globe, versions: ['Latest', '120', '119', '118'] },
    { name: 'Safari', icon: Monitor, versions: ['Latest', '17', '16', '15'] },
    { name: 'Edge', icon: Smartphone, versions: ['Latest', '120', '119', '118'] }
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
        'browser',
        `Test Name: ${testName}\nDescription: ${testDescription}`
      );

      toast({
        title: "AI Test Generated",
        description: "Browser compatibility test has been generated successfully",
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
          <h1 className="text-3xl font-bold">Browser Compatibility Testing</h1>
          <p className="text-muted-foreground mt-2">
            Test your applications across different browsers and versions to ensure consistent user experience.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="create-test">Create Test</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {browsers.map((browser) => (
                <Card key={browser.name}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <browser.icon className="h-6 w-6" />
                      <CardTitle className="text-lg">{browser.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {browser.versions.map((version) => (
                        <Badge key={version} variant="outline" className="mr-1">
                          {version}
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
                  Latest browser compatibility test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No test results available. Create your first browser compatibility test to see results here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Browser Compatibility Test</CardTitle>
                <CardDescription>
                  Set up a new compatibility test for multiple browsers
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
                    placeholder="Describe what you want to test across browsers..."
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
                  View and analyze browser compatibility test results
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

export default BrowserCompatibility;
