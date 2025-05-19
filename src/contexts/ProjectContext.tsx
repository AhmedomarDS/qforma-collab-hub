
import React, { createContext, useContext, useState } from 'react';

// Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  projectId: string;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  startDate: string;
  endDate?: string;
  members: string[];
  createdAt: string;
}

interface ProjectContextType {
  projects: Project[];
  tasks: Task[];
  isLoading: boolean;
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getProjectTasks: (projectId: string) => Task[];
  filterTasks: (filters: {
    status?: Task['status'][];
    priority?: Task['priority'][];
    projectId?: string;
    assignee?: string;
  }) => Task[];
}

// Mock data
const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'E-commerce Website Redesign',
    description: 'Revamp the user interface and experience of our online store',
    status: 'active',
    startDate: '2025-05-01T00:00:00Z',
    endDate: '2025-07-15T00:00:00Z',
    members: ['user1', 'user2', 'user3'],
    createdAt: '2025-04-20T10:30:00Z',
  },
  {
    id: 'p2',
    name: 'Mobile App Testing',
    description: 'Comprehensive testing of the new mobile application',
    status: 'active',
    startDate: '2025-05-05T00:00:00Z',
    endDate: '2025-06-20T00:00:00Z',
    members: ['user2', 'user4'],
    createdAt: '2025-04-25T14:45:00Z',
  },
  {
    id: 'p3',
    name: 'API Integration',
    description: 'Integrate third-party payment system APIs',
    status: 'completed',
    startDate: '2025-03-10T00:00:00Z',
    endDate: '2025-04-30T00:00:00Z',
    members: ['user1', 'user5'],
    createdAt: '2025-03-01T09:20:00Z',
  },
];

const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Design Homepage Mockup',
    description: 'Create mockups for the new homepage design',
    status: 'in-progress',
    priority: 'high',
    assignee: 'user2',
    dueDate: '2025-05-25T00:00:00Z',
    projectId: 'p1',
    createdAt: '2025-05-10T08:30:00Z',
    tags: ['design', 'ui/ux'],
  },
  {
    id: 't2',
    title: 'Implement Payment Gateway',
    description: 'Integrate Stripe payment processing',
    status: 'todo',
    priority: 'critical',
    assignee: 'user1',
    dueDate: '2025-06-05T00:00:00Z',
    projectId: 'p1',
    createdAt: '2025-05-12T11:45:00Z',
    tags: ['backend', 'payment'],
  },
  {
    id: 't3',
    title: 'Test Login Functionality',
    description: 'Verify the login process works across all platforms',
    status: 'done',
    priority: 'medium',
    assignee: 'user4',
    dueDate: '2025-05-15T00:00:00Z',
    projectId: 'p2',
    createdAt: '2025-05-08T14:20:00Z',
    tags: ['testing', 'security'],
  },
  {
    id: 't4',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure Jenkins for automated testing and deployment',
    status: 'review',
    priority: 'medium',
    assignee: 'user3',
    dueDate: '2025-05-30T00:00:00Z',
    projectId: 'p2',
    createdAt: '2025-05-14T16:10:00Z',
    tags: ['devops', 'automation'],
  },
  {
    id: 't5',
    title: 'Document API Endpoints',
    description: 'Create comprehensive documentation for all API endpoints',
    status: 'done',
    priority: 'low',
    assignee: 'user5',
    dueDate: '2025-04-20T00:00:00Z',
    projectId: 'p3',
    createdAt: '2025-03-25T09:30:00Z',
    tags: ['documentation', 'api'],
  },
];

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [isLoading, setIsLoading] = useState(false);

  // Project CRUD operations
  const createProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    // Delete associated tasks
    setTasks(tasks.filter((task) => task.projectId !== id));
  };

  // Task CRUD operations
  const createTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Helper functions
  const getProjectTasks = (projectId: string) => {
    return tasks.filter((task) => task.projectId === projectId);
  };

  const filterTasks = (filters: {
    status?: Task['status'][];
    priority?: Task['priority'][];
    projectId?: string;
    assignee?: string;
  }) => {
    return tasks.filter((task) => {
      if (filters.status && filters.status.length > 0 && !filters.status.includes(task.status)) {
        return false;
      }
      if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
        return false;
      }
      if (filters.projectId && task.projectId !== filters.projectId) {
        return false;
      }
      if (filters.assignee && task.assignee !== filters.assignee) {
        return false;
      }
      return true;
    });
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        tasks,
        isLoading,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        deleteTask,
        getProjectTasks,
        filterTasks,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
