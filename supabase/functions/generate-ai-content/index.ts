
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIGenerationRequest {
  type: 'test-case' | 'requirement' | 'design' | 'defect-analysis' | 'performance-script' | 'compatibility-test' | 'security-test' | 'automation-test';
  prompt: string;
  context?: any;
  parameters?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { type, prompt, context, parameters = {} } = await req.json() as AIGenerationRequest;

    // Generate system prompts based on content type
    const getSystemPrompt = (contentType: string) => {
      switch (contentType) {
        case 'test-case':
          return `You are an expert QA engineer. Generate comprehensive test cases that include:
- Clear test title
- Detailed test steps
- Expected results
- Prerequisites
- Test data requirements
Format the response in a structured, professional manner.`;

        case 'requirement':
          return `You are a business analyst expert. Generate detailed software requirements that include:
- Clear requirement title
- Functional description
- Acceptance criteria
- Business rules
- Dependencies
Format as a professional requirement specification.`;

        case 'design':
          return `You are a system architect. Generate detailed design documents that include:
- Architecture overview
- Component descriptions
- Data flow
- Integration points
- Technical specifications
Format as a comprehensive design document.`;

        case 'defect-analysis':
          return `You are a senior QA engineer analyzing defects. Provide:
- Root cause analysis
- Impact assessment
- Reproduction steps
- Recommended fixes
- Prevention strategies
Be thorough and analytical.`;

        case 'performance-script':
          return `You are a performance testing expert. Generate performance test scripts that include:
- Load scenarios
- Test parameters
- Success criteria
- Monitoring points
- Scalability considerations
Provide practical, executable test scenarios.`;

        case 'compatibility-test':
          return `You are a compatibility testing specialist. Generate comprehensive compatibility tests that include:
- Browser/platform specific tests
- Version compatibility checks
- Feature compatibility matrix
- Known issues and workarounds
- Testing environment setup`;

        case 'security-test':
          return `You are a security testing expert. Generate comprehensive security test cases that include:
- Authentication tests
- Authorization tests
- Data protection tests
- Input validation tests
- Session management tests
- Vulnerability assessments
Cover OWASP top 10 and industry best practices.`;

        case 'automation-test':
          return `You are an automation testing expert. Generate automation test scenarios that include:
- Test scenario description
- Step-by-step automation script outline
- Test data requirements
- Expected assertions
- Error handling
- Maintenance considerations
Focus on reliable, maintainable automation.`;

        default:
          return 'You are a helpful AI assistant specialized in software development and testing.';
      }
    };

    const systemPrompt = getSystemPrompt(type);
    const model = parameters.model || 'gpt-4o-mini';
    const temperature = parameters.temperature || 0.7;
    const maxTokens = parameters.maxTokens || 1000;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0]?.message?.content || 'No content generated';

    const result = {
      id: crypto.randomUUID(),
      content: generatedContent,
      type,
      metadata: {
        model,
        usage: data.usage,
        context,
        timestamp: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI generation:', error);
    return new Response(
      JSON.stringify({ 
        error: 'AI generation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
