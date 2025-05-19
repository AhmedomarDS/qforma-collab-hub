
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

-- Requirements Table
CREATE TABLE requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  priority TEXT DEFAULT 'medium',
  project_id UUID REFERENCES projects(id),
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

-- Test Cases Table
CREATE TABLE test_cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'not-run',
  steps JSONB,
  expected_result TEXT,
  actual_result TEXT,
  requirement_id UUID REFERENCES requirements(id),
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

-- Defects Table
CREATE TABLE defects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  severity TEXT DEFAULT 'medium',
  priority TEXT DEFAULT 'medium',
  test_case_id UUID REFERENCES test_cases(id),
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

-- Design Documents Table
CREATE TABLE design_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL, -- 'high-level' or 'low-level'
  status TEXT DEFAULT 'draft',
  project_id UUID REFERENCES projects(id),
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

-- Automation Test Scenarios Table
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

-- Performance Tests Table
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
