import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Layers, Layers3 } from 'lucide-react';
import AiChatBox from '@/components/chat/AiChatBox';

type DesignType = 'high-level' | 'low-level';

interface Design {
  id: string;
  title: string;
  description: string;
  type: DesignType;
  createdAt: Date;
  author: string;
}

const DesignManagement = () => {
  const navigate = useNavigate();
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [designs, setDesigns] = useState<Design[]>([
    {
      id: '1',
      title: 'System Architecture Overview',
      description: 'High-level architecture of the entire system showing major components and their interactions.',
      type: 'high-level',
      createdAt: new Date(2025, 4, 15),
      author: 'Alex Johnson'
    },
    {
      id: '2',
      title: 'User Authentication Flow',
      description: 'Detailed design of the authentication service and user login process.',
      type: 'low-level',
      createdAt: new Date(2025, 4, 17),
      author: 'Sam Wilson'
    }
  ]);

  const handleSaveContent = (content: string) => {
    const designType: DesignType = content.toLowerCase().includes('high') ? 'high-level' : 'low-level';
    
    const newDesign: Design = {
      id: Math.random().toString(36).substring(7),
      title: content.split('\n')[0].replace(/^#+\s*/, '').substring(0, 50),
      description: content.split('\n').slice(1).join(' ').substring(0, 200),
      type: designType,
      createdAt: new Date(),
      author: 'Current User'
    };
    
    setDesigns([...designs, newDesign]);
  };
  
  const generatePrompt = (userPrompt: string) => {
    return `Create a detailed ${userPrompt.toLowerCase().includes('high') ? 'high-level' : 'low-level'} design document based on: ${userPrompt}`;
  };

  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Design Management</h1>
            <p className="text-muted-foreground">Create and manage system design documents</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsAiChatOpen(true)}
            >
              Generate Design with AI
            </Button>
            <Button>Create New Design</Button>
          </div>
        </div>

        <Tabs defaultValue="high-level" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="high-level" className="flex items-center">
              <Layers3 className="mr-2 h-4 w-4" />
              High-Level Design
            </TabsTrigger>
            <TabsTrigger value="low-level" className="flex items-center">
              <Layers className="mr-2 h-4 w-4" />
              Low-Level Design
            </TabsTrigger>
          </TabsList>
          
          {['high-level', 'low-level'].map((designType) => (
            <TabsContent key={designType} value={designType} className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {designs
                  .filter(design => design.type === designType)
                  .map(design => (
                    <Card key={design.id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle>{design.title}</CardTitle>
                        <CardDescription className="flex justify-between">
                          <span>By {design.author}</span>
                          <span>{design.createdAt.toLocaleDateString()}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {design.description}
                        </p>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <AiChatBox 
        title="Design Document Generator" 
        placeholder="Describe the design document you need..." 
        isOpen={isAiChatOpen} 
        onClose={() => setIsAiChatOpen(false)}
        onSaveContent={handleSaveContent}
        generatePrompt={generatePrompt}
      />
    </AppLayout>
  );
};

export default DesignManagement;
