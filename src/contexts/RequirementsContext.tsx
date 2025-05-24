import React, { createContext, useContext, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'review' | 'approved' | 'development' | 'testing' | 'complete';
  priority: 'low' | 'medium' | 'high' | 'critical';
  project_id: string;
  folder_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RequirementFolder {
  id: string;
  name: string;
  description?: string;
  project_id: string;
  parent_folder_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface RequirementsContextType {
  requirements: Requirement[];
  folders: RequirementFolder[];
  isLoading: boolean;
  selectedProjectId: string | null;
  createRequirement: (req: Omit<Requirement, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRequirement: (id: string, updates: Partial<Requirement>) => Promise<void>;
  deleteRequirement: (id: string) => Promise<void>;
  createFolder: (folder: Omit<RequirementFolder, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateFolder: (id: string, updates: Partial<RequirementFolder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  setSelectedProjectId: (projectId: string | null) => void;
  loadProjectRequirements: (projectId: string) => Promise<void>;
  getRequirementById: (id: string) => Requirement | undefined;
}

const RequirementsContext = createContext<RequirementsContextType | undefined>(undefined);

// Helper function to validate UUID format
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const RequirementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [folders, setFolders] = useState<RequirementFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const loadProjectRequirements = async (projectId: string) => {
    // Basic validation - just check if projectId exists and is not empty
    if (!projectId || projectId.trim() === '') {
      console.error('Empty or invalid project ID:', projectId);
      toast({
        title: "Error",
        description: "Please select a valid project.",
        variant: "destructive"
      });
      return;
    }

    // Skip UUID validation for now since projects might not have UUID IDs
    // If the project ID is not a UUID, we'll handle it gracefully
    if (!isValidUUID(projectId)) {
      console.warn('Project ID is not a UUID format, this might cause database issues:', projectId);
    }

    setIsLoading(true);
    try {
      console.log('Loading requirements for project:', projectId);
      
      // Load requirements for the project
      const { data: requirementsData, error: reqError } = await supabase
        .from('requirements')
        .select('*')
        .eq('project_id', projectId);

      if (reqError) {
        console.error('Requirements query error:', reqError);
        // If it's a UUID format error, show a more helpful message
        if (reqError.message?.includes('invalid input syntax for type uuid')) {
          toast({
            title: "Database Error",
            description: "This project was created with an incompatible ID format. Please contact support or create a new project.",
            variant: "destructive"
          });
          return;
        }
        throw reqError;
      }

      // Load folders for the project
      const { data: foldersData, error: folderError } = await supabase
        .from('requirement_folders')
        .select('*')
        .eq('project_id', projectId);

      if (folderError) {
        console.error('Folders query error:', folderError);
        // Handle UUID error gracefully for folders too
        if (folderError.message?.includes('invalid input syntax for type uuid')) {
          console.warn('Skipping folders due to project ID format incompatibility');
          // Continue without folders rather than failing completely
        } else {
          throw folderError;
        }
      }

      // Type assertion to ensure the data matches our interfaces
      const typedRequirements: Requirement[] = (requirementsData || []).map(req => ({
        ...req,
        status: req.status as Requirement['status'],
        priority: req.priority as Requirement['priority']
      }));

      const typedFolders: RequirementFolder[] = foldersData || [];

      console.log('Loaded requirements:', typedRequirements.length);
      console.log('Loaded folders:', typedFolders.length);

      setRequirements(typedRequirements);
      setFolders(typedFolders);
    } catch (error) {
      console.error('Error loading project requirements:', error);
      toast({
        title: "Error",
        description: "Failed to load requirements. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createRequirement = async (req: Omit<Requirement, 'id' | 'created_at' | 'updated_at'>) => {
    // Basic validation
    if (!req.project_id || req.project_id.trim() === '') {
      console.error('Empty project ID for requirement creation:', req.project_id);
      toast({
        title: "Error",
        description: "Please select a valid project.",
        variant: "destructive"
      });
      return;
    }

    // Check if project ID is UUID format
    if (!isValidUUID(req.project_id)) {
      console.error('Project ID is not UUID format, cannot create requirement:', req.project_id);
      toast({
        title: "Error",
        description: "This project was created with an incompatible ID format. Please create a new project with proper UUID format.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Creating requirement with data:', req);
      
      const { data, error } = await supabase
        .from('requirements')
        .insert([req])
        .select()
        .single();

      if (error) {
        console.error('Create requirement error:', error);
        throw error;
      }

      // Type assertion for the returned data
      const typedRequirement: Requirement = {
        ...data,
        status: data.status as Requirement['status'],
        priority: data.priority as Requirement['priority']
      };

      setRequirements(prev => [...prev, typedRequirement]);
      toast({
        title: "Requirement created",
        description: `${data.title} has been created successfully.`,
      });
    } catch (error) {
      console.error('Error creating requirement:', error);
      toast({
        title: "Error",
        description: "Failed to create requirement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequirement = async (id: string, updates: Partial<Requirement>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('requirements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Type assertion for the returned data
      const typedRequirement: Requirement = {
        ...data,
        status: data.status as Requirement['status'],
        priority: data.priority as Requirement['priority']
      };

      setRequirements(prev =>
        prev.map(req => req.id === id ? typedRequirement : req)
      );

      toast({
        title: "Requirement updated",
        description: "The requirement has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating requirement:', error);
      toast({
        title: "Error",
        description: "Failed to update requirement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRequirement = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('requirements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRequirements(prev => prev.filter(req => req.id !== id));

      toast({
        title: "Requirement deleted",
        description: "The requirement has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting requirement:', error);
      toast({
        title: "Error",
        description: "Failed to delete requirement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createFolder = async (folder: Omit<RequirementFolder, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('requirement_folders')
        .insert([folder])
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => [...prev, data]);
      toast({
        title: "Folder created",
        description: `${data.name} folder has been created successfully.`,
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFolder = async (id: string, updates: Partial<RequirementFolder>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('requirement_folders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFolders(prev =>
        prev.map(folder => folder.id === id ? data : folder)
      );

      toast({
        title: "Folder updated",
        description: "The folder has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating folder:', error);
      toast({
        title: "Error",
        description: "Failed to update folder. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFolder = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('requirement_folders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFolders(prev => prev.filter(folder => folder.id !== id));

      toast({
        title: "Folder deleted",
        description: "The folder has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "Failed to delete folder. Please try again.",
        variant: "destructive"
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
      folders,
      isLoading,
      selectedProjectId,
      createRequirement,
      updateRequirement,
      deleteRequirement,
      createFolder,
      updateFolder,
      deleteFolder,
      setSelectedProjectId,
      loadProjectRequirements,
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
