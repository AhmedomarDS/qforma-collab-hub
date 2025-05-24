
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface TestPlan {
  id: string;
  name: string;
  description: string | null;
  status: string | null;
  progress: number | null;
  project_id: string;
  start_date: string | null;
  end_date: string | null;
  testing_scope: string | null;
  assigned_to: string[] | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  projects?: {
    name: string;
  };
}

interface CreateTestPlanData {
  name: string;
  description: string;
  project_id: string;
  start_date: string;
  end_date: string;
  testing_scope: string;
}

export const useTestPlans = () => {
  const [testPlans, setTestPlans] = useState<TestPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTestPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('test_plans')
        .select(`
          *,
          projects (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestPlans(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch test plans",
        variant: "destructive",
      });
      console.error('Error fetching test plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTestPlan = async (testPlanData: CreateTestPlanData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('test_plans')
        .insert([
          {
            ...testPlanData,
            created_by: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test plan created successfully!",
      });

      fetchTestPlans(); // Refresh the list
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create test plan",
        variant: "destructive",
      });
      console.error('Error creating test plan:', error);
    }
  };

  const updateTestPlan = async (id: string, updates: Partial<TestPlan>) => {
    try {
      const { error } = await supabase
        .from('test_plans')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test plan updated successfully!",
      });

      fetchTestPlans(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update test plan",
        variant: "destructive",
      });
      console.error('Error updating test plan:', error);
    }
  };

  const deleteTestPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('test_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test plan deleted successfully!",
      });

      fetchTestPlans(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete test plan",
        variant: "destructive",
      });
      console.error('Error deleting test plan:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTestPlans();
    }
  }, [user]);

  return {
    testPlans,
    loading,
    createTestPlan,
    updateTestPlan,
    deleteTestPlan,
    refetch: fetchTestPlans,
  };
};
