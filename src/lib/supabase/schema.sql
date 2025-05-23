
-- Users Table
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create Policy for Users
CREATE POLICY "Users can view and edit their own data" ON users
  FOR ALL USING (auth.uid() = id);

-- Projects Table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their projects" ON projects
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can insert projects" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = created_by);
  
-- Tasks Table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'to-do',
  priority TEXT DEFAULT 'medium',
  project_id UUID REFERENCES projects(id),
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all tasks" ON tasks
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can insert tasks" ON tasks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update tasks assigned to them" ON tasks
  FOR UPDATE USING (auth.uid() = assigned_to OR auth.uid() = created_by);

-- Requirements Table (linked to projects)
CREATE TABLE requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  priority TEXT DEFAULT 'medium',
  project_id UUID REFERENCES projects(id) NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all requirements" ON requirements
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can insert requirements" ON requirements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their requirements" ON requirements
  FOR UPDATE USING (auth.uid() = created_by);

-- Design Documents Table (linked to projects and requirements)
CREATE TABLE design_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL, -- 'high-level' or 'low-level'
  status TEXT DEFAULT 'draft',
  project_id UUID REFERENCES projects(id) NOT NULL,
  requirement_id UUID REFERENCES requirements(id),
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE design_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all designs" ON design_documents
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can insert designs" ON design_documents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their designs" ON design_documents
  FOR UPDATE USING (auth.uid() = created_by);

-- Test Plans Table (NEW - linked to projects)
CREATE TABLE test_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'active', 'completed', 'archived'
  project_id UUID REFERENCES projects(id) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE test_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all test plans" ON test_plans
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can insert test plans" ON test_plans
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their test plans" ON test_plans
  FOR UPDATE USING (auth.uid() = created_by);

-- Test Cases Table (linked to requirements and test plans)
CREATE TABLE test_cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'not-run',
  steps JSONB,
  expected_result TEXT,
  actual_result TEXT,
  requirement_id UUID REFERENCES requirements(id) NOT NULL,
  test_plan_id UUID REFERENCES test_plans(id),
  execution_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all test cases" ON test_cases
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can insert test cases" ON test_cases
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their test cases" ON test_cases
  FOR UPDATE USING (auth.uid() = created_by);

-- Test Executions Table (NEW - tracks test case execution)
CREATE TABLE test_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_case_id UUID REFERENCES test_cases(id) NOT NULL,
  test_plan_id UUID REFERENCES test_plans(id) NOT NULL,
  status TEXT DEFAULT 'not-executed', -- 'not-executed', 'passed', 'failed', 'blocked', 'skipped'
  executed_by UUID REFERENCES users(id),
  execution_date TIMESTAMP WITH TIME ZONE,
  actual_result TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE test_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all test executions" ON test_executions
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can insert test executions" ON test_executions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update test executions" ON test_executions
  FOR UPDATE USING (auth.uid() = executed_by OR auth.uid() IN (SELECT created_by FROM test_plans WHERE id = test_plan_id));

-- Defects Table (linked to test executions and projects)
CREATE TABLE defects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  severity TEXT DEFAULT 'medium',
  priority TEXT DEFAULT 'medium',
  test_execution_id UUID REFERENCES test_executions(id),
  project_id UUID REFERENCES projects(id) NOT NULL,
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE defects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all defects" ON defects
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can insert defects" ON defects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update defects assigned to them" ON defects
  FOR UPDATE USING (auth.uid() = assigned_to OR auth.uid() = created_by);

-- Automation Tests Table (linked to projects and test cases)
CREATE TABLE automation_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'not-run',
  steps JSONB,
  recorded_actions JSONB,
  last_run TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  test_case_id UUID REFERENCES test_cases(id),
  project_id UUID REFERENCES projects(id) NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE automation_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all automation tests" ON automation_tests
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can insert automation tests" ON automation_tests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their automation tests" ON automation_tests
  FOR UPDATE USING (auth.uid() = created_by);

-- Performance Tests Table (linked to projects)
CREATE TABLE performance_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'load', 'stress', 'endurance'
  status TEXT DEFAULT 'scheduled',
  scenario_config JSONB, -- test parameters
  results JSONB,
  last_run TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  avg_response_time FLOAT,
  max_users INTEGER,
  project_id UUID REFERENCES projects(id) NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE performance_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all performance tests" ON performance_tests
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can insert performance tests" ON performance_tests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their performance tests" ON performance_tests
  FOR UPDATE USING (auth.uid() = created_by);

-- Security Tests Table (NEW - linked to projects)
CREATE TABLE security_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'vulnerability', 'penetration', 'authentication', 'authorization', 'data-protection'
  status TEXT DEFAULT 'scheduled',
  severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  findings JSONB,
  recommendations TEXT,
  last_run TIMESTAMP WITH TIME ZONE,
  project_id UUID REFERENCES projects(id) NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE security_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all security tests" ON security_tests
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can insert security tests" ON security_tests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their security tests" ON security_tests
  FOR UPDATE USING (auth.uid() = created_by);

-- Compatibility Tests Table (NEW - linked to projects)
CREATE TABLE compatibility_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'browser', 'mobile', 'os', 'device'
  platform TEXT NOT NULL, -- specific browser/device/os
  version TEXT,
  status TEXT DEFAULT 'scheduled',
  results JSONB,
  issues_found INTEGER DEFAULT 0,
  last_run TIMESTAMP WITH TIME ZONE,
  project_id UUID REFERENCES projects(id) NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE compatibility_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all compatibility tests" ON compatibility_tests
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can insert compatibility tests" ON compatibility_tests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their compatibility tests" ON compatibility_tests
  FOR UPDATE USING (auth.uid() = created_by);

-- Traceability Matrix View (NEW - for coverage tracking)
CREATE OR REPLACE VIEW traceability_matrix AS
SELECT 
  p.id as project_id,
  p.name as project_name,
  r.id as requirement_id,
  r.title as requirement_title,
  r.status as requirement_status,
  COUNT(DISTINCT tc.id) as test_cases_count,
  COUNT(DISTINCT te.id) as test_executions_count,
  COUNT(DISTINCT CASE WHEN te.status = 'passed' THEN te.id END) as passed_tests,
  COUNT(DISTINCT CASE WHEN te.status = 'failed' THEN te.id END) as failed_tests,
  COUNT(DISTINCT d.id) as defects_count,
  COUNT(DISTINCT dd.id) as design_documents_count,
  COUNT(DISTINCT at.id) as automation_tests_count,
  COUNT(DISTINCT pt.id) as performance_tests_count,
  COUNT(DISTINCT st.id) as security_tests_count,
  COUNT(DISTINCT ct.id) as compatibility_tests_count,
  CASE 
    WHEN COUNT(DISTINCT tc.id) = 0 THEN 0
    ELSE ROUND((COUNT(DISTINCT CASE WHEN te.status = 'passed' THEN te.id END)::FLOAT / COUNT(DISTINCT tc.id)) * 100, 2)
  END as test_coverage_percentage
FROM projects p
LEFT JOIN requirements r ON p.id = r.project_id
LEFT JOIN test_cases tc ON r.id = tc.requirement_id
LEFT JOIN test_executions te ON tc.id = te.test_case_id
LEFT JOIN defects d ON te.id = d.test_execution_id
LEFT JOIN design_documents dd ON (r.id = dd.requirement_id OR p.id = dd.project_id)
LEFT JOIN automation_tests at ON (tc.id = at.test_case_id OR p.id = at.project_id)
LEFT JOIN performance_tests pt ON p.id = pt.project_id
LEFT JOIN security_tests st ON p.id = st.project_id
LEFT JOIN compatibility_tests ct ON p.id = ct.project_id
GROUP BY p.id, p.name, r.id, r.title, r.status;

-- Notification Settings Table
CREATE TABLE notification_settings (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  email_enabled BOOLEAN DEFAULT true,
  whatsapp_enabled BOOLEAN DEFAULT false,
  telegram_enabled BOOLEAN DEFAULT false,
  email_address TEXT,
  whatsapp_number TEXT,
  telegram_username TEXT,
  notify_task_assignments BOOLEAN DEFAULT true,
  notify_requirement_changes BOOLEAN DEFAULT true,
  notify_test_results BOOLEAN DEFAULT true,
  notify_defect_updates BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and edit their own notification settings" ON notification_settings
  FOR ALL USING (auth.uid() = user_id);

-- Function to create notification settings for new users
CREATE OR REPLACE FUNCTION create_notification_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_settings (user_id, email_address)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification settings when a new user is created
CREATE TRIGGER create_user_notification_settings
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_notification_settings();
