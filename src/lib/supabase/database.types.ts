
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar: string | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: string | null
          priority: string | null
          project_id: string | null
          assigned_to: string | null
          created_by: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: string | null
          priority?: string | null
          project_id?: string | null
          assigned_to?: string | null
          created_by: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: string | null
          priority?: string | null
          project_id?: string | null
          assigned_to?: string | null
          created_by?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      requirements: {
        Row: {
          id: string
          title: string
          description: string | null
          status: string | null
          priority: string | null
          project_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: string | null
          priority?: string | null
          project_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: string | null
          priority?: string | null
          project_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      test_cases: {
        Row: {
          id: string
          title: string
          description: string | null
          status: string | null
          steps: Json | null
          expected_result: string | null
          actual_result: string | null
          requirement_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: string | null
          steps?: Json | null
          expected_result?: string | null
          actual_result?: string | null
          requirement_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: string | null
          steps?: Json | null
          expected_result?: string | null
          actual_result?: string | null
          requirement_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      defects: {
        Row: {
          id: string
          title: string
          description: string | null
          status: string | null
          severity: string | null
          priority: string | null
          test_case_id: string | null
          assigned_to: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: string | null
          severity?: string | null
          priority?: string | null
          test_case_id?: string | null
          assigned_to?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: string | null
          severity?: string | null
          priority?: string | null
          test_case_id?: string | null
          assigned_to?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      design_documents: {
        Row: {
          id: string
          title: string
          content: string | null
          type: string
          status: string | null
          project_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          type: string
          status?: string | null
          project_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          type?: string
          status?: string | null
          project_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      automation_tests: {
        Row: {
          id: string
          name: string
          description: string | null
          status: string | null
          steps: Json | null
          recorded_actions: Json | null
          last_run: string | null
          duration: number | null
          test_case_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: string | null
          steps?: Json | null
          recorded_actions?: Json | null
          last_run?: string | null
          duration?: number | null
          test_case_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: string | null
          steps?: Json | null
          recorded_actions?: Json | null
          last_run?: string | null
          duration?: number | null
          test_case_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      performance_tests: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          status: string | null
          scenario_config: Json | null
          results: Json | null
          last_run: string | null
          duration: number | null
          avg_response_time: number | null
          max_users: number | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          status?: string | null
          scenario_config?: Json | null
          results?: Json | null
          last_run?: string | null
          duration?: number | null
          avg_response_time?: number | null
          max_users?: number | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          status?: string | null
          scenario_config?: Json | null
          results?: Json | null
          last_run?: string | null
          duration?: number | null
          avg_response_time?: number | null
          max_users?: number | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      notification_settings: {
        Row: {
          user_id: string
          email_enabled: boolean | null
          whatsapp_enabled: boolean | null
          telegram_enabled: boolean | null
          email_address: string | null
          whatsapp_number: string | null
          telegram_username: string | null
          notify_task_assignments: boolean | null
          notify_requirement_changes: boolean | null
          notify_test_results: boolean | null
          notify_defect_updates: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          email_enabled?: boolean | null
          whatsapp_enabled?: boolean | null
          telegram_enabled?: boolean | null
          email_address?: string | null
          whatsapp_number?: string | null
          telegram_username?: string | null
          notify_task_assignments?: boolean | null
          notify_requirement_changes?: boolean | null
          notify_test_results?: boolean | null
          notify_defect_updates?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          email_enabled?: boolean | null
          whatsapp_enabled?: boolean | null
          telegram_enabled?: boolean | null
          email_address?: string | null
          whatsapp_number?: string | null
          telegram_username?: string | null
          notify_task_assignments?: boolean | null
          notify_requirement_changes?: boolean | null
          notify_test_results?: boolean | null
          notify_defect_updates?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}
