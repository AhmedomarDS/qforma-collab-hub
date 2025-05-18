
import React, { createContext, useContext, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'review' | 'approved' | 'development' | 'testing' | 'complete';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

interface RequirementsContextType {
  requirements: Requirement[];
  isLoading: boolean;
  createRequirement: (req: Omit<Requirement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRequirement: (id: string, updates: Partial<Requirement>) => Promise<void>;
  deleteRequirement: (id: string) => Promise<void>;
  getRequirementById: (id: string) => Requirement | undefined;
}

// Mock data
const MOCK_REQUIREMENTS: Requirement[] = [
  {
    id: 'req-001',
    title: 'User Registration Flow',
    description: 'Users should be able to register with email, password, and basic details.',
    status: 'approved',
    priority: 'high',
    tags: ['authentication', 'user-management', 'onboarding'],
    createdBy: 'Sarah QA Lead',
    createdAt: '2025-05-10T14:30:00Z',
    updatedAt: '2025-05-12T09:15:00Z',
    assignedTo: 'John Developer',
  },
  {
    id: 'req-002',
    title: 'Password Reset Functionality',
    description: 'Users should be able to reset their passwords via email recovery.',
    status: 'development',
    priority: 'medium',
    tags: ['authentication', 'email', 'security'],
    createdBy: 'Mike Manager',
    createdAt: '2025-05-11T10:20:00Z',
    updatedAt: '2025-05-13T11:45:00Z',
    assignedTo: 'John Developer',
  },
  {
    id: 'req-003',
    title: 'User Profile Management',
    description: 'Users should be able to view and edit their profile information.',
    status: 'testing',
    priority: 'medium',
    tags: ['user-management', 'profile', 'settings'],
    createdBy: 'Sarah QA Lead',
    createdAt: '2025-05-12T15:40:00Z',
    updatedAt: '2025-05-15T14:20:00Z',
    assignedTo: 'Sarah QA Lead',
  },
  {
    id: 'req-004',
    title: 'Project Dashboard Overview',
    description: 'Dashboard should display key metrics and recent activity.',
    status: 'review',
    priority: 'high',
    tags: ['dashboard', 'UI', 'reporting'],
    createdBy: 'Mike Manager',
    createdAt: '2025-05-14T09:10:00Z',
    updatedAt: '2025-05-14T09:10:00Z',
  },
  {
    id: 'req-005',
    title: 'Test Case Management',
    description: 'QA engineers should be able to create, edit, and execute test cases.',
    status: 'draft',
    priority: 'critical',
    tags: ['testing', 'QA', 'automation'],
    createdBy: 'Sarah QA Lead',
    createdAt: '2025-05-15T11:25:00Z',
    updatedAt: '2025-05-15T11:25:00Z',
  },
];

const RequirementsContext = createContext<RequirementsContextType | undefined>(undefined);

export const RequirementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requirements, setRequirements] = useState<Requirement[]>(MOCK_REQUIREMENTS);
  const [isLoading, setIsLoading] = useState(false);

  const createRequirement = async (req: Omit<Requirement, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const now = new Date().toISOString();
      const newRequirement: Requirement = {
        ...req,
        id: `req-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        createdAt: now,
        updatedAt: now,
      };
      
      setRequirements(prev => [...prev, newRequirement]);
      toast({
        title: "Requirement created",
        description: `${newRequirement.title} has been created successfully.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequirement = async (id: string, updates: Partial<Requirement>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setRequirements(prev => 
        prev.map(req => 
          req.id === id 
            ? { ...req, ...updates, updatedAt: new Date().toISOString() } 
            : req
        )
      );
      
      toast({
        title: "Requirement updated",
        description: `The requirement has been updated successfully.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRequirement = async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setRequirements(prev => prev.filter(req => req.id !== id));
      
      toast({
        title: "Requirement deleted",
        description: `The requirement has been deleted successfully.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRequirementById = (id: string) => {
    return requirements.find(req => req.id === id);
  };

  return (
    <RequirementsContext.Provider value={{ 
      requirements, 
      isLoading, 
      createRequirement, 
      updateRequirement, 
      deleteRequirement, 
      getRequirementById,
    }}>
      {children}
    </RequirementsContext.Provider>
  );
};

export const useRequirements = () => {
  const context = useContext(RequirementsContext);
  if (context === undefined) {
    throw new Error('useRequirements must be used within a RequirementsProvider');
  }
  return context;
};
