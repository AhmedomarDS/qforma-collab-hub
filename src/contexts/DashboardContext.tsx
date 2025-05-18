
import React, { createContext, useContext, useState } from 'react';

// Types for our data
interface DashboardData {
  projectStats: {
    activeProjects: number;
    completedProjects: number;
    totalRequirements: number;
    completedRequirements: number;
  };
  testingProgress: {
    totalTestCases: number;
    passedTests: number;
    failedTests: number;
    blockedTests: number;
  };
  recentActivity: {
    id: string;
    type: 'requirement' | 'test' | 'defect' | 'chat';
    user: string;
    action: string;
    timestamp: string;
    item: string;
  }[];
}

interface DashboardContextType {
  dashboardData: DashboardData;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

// Mock data
const MOCK_DASHBOARD_DATA: DashboardData = {
  projectStats: {
    activeProjects: 5,
    completedProjects: 12,
    totalRequirements: 243,
    completedRequirements: 178,
  },
  testingProgress: {
    totalTestCases: 456,
    passedTests: 312,
    failedTests: 28,
    blockedTests: 16,
  },
  recentActivity: [
    {
      id: 'act-1',
      type: 'requirement',
      user: 'Sarah QA Lead',
      action: 'created requirement',
      timestamp: '2025-05-18T10:23:00Z',
      item: 'User Authentication Flow',
    },
    {
      id: 'act-2',
      type: 'test',
      user: 'John Developer',
      action: 'executed test case',
      timestamp: '2025-05-18T09:45:00Z',
      item: 'Login Form Validation',
    },
    {
      id: 'act-3',
      type: 'defect',
      user: 'Mike Manager',
      action: 'assigned defect',
      timestamp: '2025-05-18T09:15:00Z',
      item: 'Password Reset Email Not Sending',
    },
    {
      id: 'act-4',
      type: 'chat',
      user: 'Sarah QA Lead',
      action: 'started group chat',
      timestamp: '2025-05-18T08:30:00Z',
      item: 'Authentication Team',
    },
    {
      id: 'act-5',
      type: 'requirement',
      user: 'Mike Manager',
      action: 'updated requirement',
      timestamp: '2025-05-17T16:45:00Z',
      item: 'User Profile Settings',
    },
  ],
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>(MOCK_DASHBOARD_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API
      await new Promise((resolve) => setTimeout(resolve, 800));
      // For now we just use the same mock data
      setDashboardData({ ...MOCK_DASHBOARD_DATA });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContext.Provider value={{ dashboardData, isLoading, refreshData }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
