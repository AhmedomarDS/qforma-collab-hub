
import { toast } from "@/components/ui/use-toast";

export interface AIGenerationRequest {
  type: 'test-case' | 'requirement' | 'defect-analysis' | 'performance-script' | 'compatibility-test';
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
  timestamp: string;
}

class AIPlatformService {
  private apiKey: string | null = null;
  private baseUrl: string = 'https://api.openai.com/v1'; // Default to OpenAI, can be configured

  constructor() {
    // Try to get API key from localStorage or environment
    this.apiKey = localStorage.getItem('ai_platform_api_key');
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('ai_platform_api_key', apiKey);
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
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

  private async makeRequest(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.apiKey) {
      throw new Error('AI Platform API key not configured. Please set your API key first.');
    }

    try {
      console.log('Making AI platform request:', request);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.parameters?.model || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant specialized in QA and software testing. Generate ${request.type} content that is professional, detailed, and actionable.`
            },
            {
              role: 'user',
              content: request.prompt
            }
          ],
          temperature: request.parameters?.temperature || 0.7,
          max_tokens: request.parameters?.maxTokens || 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const aiResponse: AIGenerationResponse = {
        id: crypto.randomUUID(),
        content: data.choices[0]?.message?.content || 'No content generated',
        type: request.type,
        metadata: {
          model: request.parameters?.model,
          usage: data.usage,
          context: request.context
        },
        timestamp: new Date().toISOString()
      };

      console.log('AI platform response:', aiResponse);
      return aiResponse;

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

  // Method to check if API key is configured
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  // Method to clear API key
  clearApiKey(): void {
    this.apiKey = null;
    localStorage.removeItem('ai_platform_api_key');
  }
}

// Export singleton instance
export const aiPlatformService = new AIPlatformService();
export default aiPlatformService;
