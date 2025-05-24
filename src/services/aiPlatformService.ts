
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface AIGenerationRequest {
  type: 'test-case' | 'requirement' | 'design' | 'defect-analysis' | 'performance-script' | 'compatibility-test' | 'security-test' | 'automation-test';
  prompt: string;
  context?: any;
  parameters?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

export interface AIGenerationResponse {
  id: string;
  content: string;
  type: string;
  metadata?: any;
}

class AIPlatformService {
  private async makeRequest(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      console.log('Making AI platform request:', request);

      const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: request
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate AI content');
      }

      console.log('AI platform response:', data);
      return data;

    } catch (error) {
      console.error('AI platform request failed:', error);
      toast({
        title: "AI Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  }

  async generateTestCase(prompt: string, context?: any): Promise<AIGenerationResponse> {
    return this.makeRequest({
      type: 'test-case',
      prompt: `Generate a comprehensive test case based on: ${prompt}`,
      context,
      parameters: {
        model: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 1000
      }
    });
  }

  async generateRequirement(prompt: string, context?: any): Promise<AIGenerationResponse> {
    return this.makeRequest({
      type: 'requirement',
      prompt: `Generate a detailed requirement specification for: ${prompt}`,
      context,
      parameters: {
        model: 'gpt-4o-mini',
        temperature: 0.6,
        maxTokens: 800
      }
    });
  }

  async generateDesign(prompt: string, context?: any): Promise<AIGenerationResponse> {
    return this.makeRequest({
      type: 'design',
      prompt: `Generate a detailed design document for: ${prompt}`,
      context,
      parameters: {
        model: 'gpt-4o-mini',
        temperature: 0.6,
        maxTokens: 1200
      }
    });
  }

  async analyzeDefect(defectData: any): Promise<AIGenerationResponse> {
    return this.makeRequest({
      type: 'defect-analysis',
      prompt: `Analyze this defect and provide insights: ${JSON.stringify(defectData)}`,
      context: defectData,
      parameters: {
        model: 'gpt-4o',
        temperature: 0.5,
        maxTokens: 600
      }
    });
  }

  async generatePerformanceScript(requirements: string): Promise<AIGenerationResponse> {
    return this.makeRequest({
      type: 'performance-script',
      prompt: `Generate a performance test script for: ${requirements}`,
      parameters: {
        model: 'gpt-4o-mini',
        temperature: 0.4,
        maxTokens: 1200
      }
    });
  }

  async generateCompatibilityTest(platform: 'browser' | 'mobile', specs: string): Promise<AIGenerationResponse> {
    return this.makeRequest({
      type: 'compatibility-test',
      prompt: `Generate ${platform} compatibility tests for: ${specs}`,
      parameters: {
        model: 'gpt-4o-mini',
        temperature: 0.6,
        maxTokens: 800
      }
    });
  }

  async generateSecurityTest(requirements: string): Promise<AIGenerationResponse> {
    return this.makeRequest({
      type: 'security-test',
      prompt: `Generate comprehensive security test cases for: ${requirements}. Include tests for authentication, authorization, data protection, input validation, session management, and common vulnerabilities like SQL injection, XSS, and CSRF.`,
      parameters: {
        model: 'gpt-4o-mini',
        temperature: 0.5,
        maxTokens: 1200
      }
    });
  }

  async generateAutomationTest(requirements: string): Promise<AIGenerationResponse> {
    return this.makeRequest({
      type: 'automation-test',
      prompt: `Generate an automation test scenario for: ${requirements}`,
      parameters: {
        model: 'gpt-4o-mini',
        temperature: 0.5,
        maxTokens: 1000
      }
    });
  }

  // Method to check if service is available
  isConfigured(): boolean {
    return true; // Always available with Supabase edge functions
  }
}

// Export singleton instance
export const aiPlatformService = new AIPlatformService();
export default aiPlatformService;
