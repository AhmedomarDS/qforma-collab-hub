import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ShieldCheck, ShieldAlert, ShieldX, Zap, AlertCircle, Bot } from "lucide-react";
import AppLayout from "@/components/layouts/AppLayout";
import { toast } from "@/components/ui/use-toast";
import { aiPlatformService } from "@/services/aiPlatformService";
import AiChatBox from "@/components/chat/AiChatBox";

const SecurityTesting = () => {
  const { t } = useTranslation();
  const [testName, setTestName] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const securityCategories = [
    { name: 'Authentication', icon: Shield, tests: ['Login Security', 'Password Policy', 'Multi-Factor Auth'] },
    { name: 'Authorization', icon: ShieldCheck, tests: ['Role-based Access', 'Privilege Escalation', 'Data Access'] },
    { name: 'Data Protection', icon: ShieldAlert, tests: ['Encryption', 'Data Leakage', 'Input Validation'] },
    { name: 'Network Security', icon: ShieldX, tests: ['SSL/TLS', 'API Security', 'Session Management'] }
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

    setIsGenerating(true);
    
    try {
      const response = await aiPlatformService.generateSecurityTest(
        `Test Name: ${testName}\nDescription: ${testDescription}`
      );

      toast({
        title: "AI Security Test Generated",
        description: "Security test has been generated successfully",
      });

      console.log('Generated security test:', response);
      
    } catch (error) {
      console.error('Failed to generate AI security test:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAiContent = (content: string) => {
    console.log('Saving AI generated security test:', content);
    toast({
      title: "Security Test Saved",
      description: "AI-generated security test has been saved",
    });
  };

  const generatePrompt = (userPrompt: string) => {
    return `Generate comprehensive security test cases for: ${userPrompt}. Include tests for authentication, authorization, data protection, input validation, session management, and common vulnerabilities.`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security Testing</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive security testing to identify vulnerabilities and ensure application security.
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
              {securityCategories.map((category) => (
                <Card key={category.name}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <category.icon className="h-6 w-6" />
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.tests.map((test) => (
                        <Badge key={test} variant="outline" className="mr-1 mb-1">
                          {test}
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
                  <span>Recent Security Test Results</span>
                </CardTitle>
                <CardDescription>
                  Latest security vulnerability assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No security test results available. Create your first security test to see results here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Security Test</CardTitle>
                <CardDescription>
                  Set up a new security vulnerability assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Test Name</label>
                  <Input
                    placeholder="Enter security test name"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Test Description</label>
                  <Textarea
                    placeholder="Describe the security aspects you want to test..."
                    value={testDescription}
                    onChange={(e) => setTestDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleGenerateAITest} disabled={isGenerating}>
                    <Zap className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate AI Security Test'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAiChatOpen(true)}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    AI Chat Assistant
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
                <CardTitle>Security Test Results</CardTitle>
                <CardDescription>
                  View and analyze security vulnerability assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No security test results available. Run some tests to see results here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AiChatBox
        title="Security Test Generator"
        placeholder="Describe the security test you need..."
        onSaveContent={handleSaveAiContent}
        generatePrompt={generatePrompt}
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        contentType="security-test"
      />
    </AppLayout>
  );
};

export default SecurityTesting;
