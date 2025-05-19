
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarTrigger, 
  SidebarFooter 
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  Bug, 
  BarChart, 
  Settings, 
  LogOut,
  Menu,
  FolderPlus,
  ListCheck,
  Layers3,
  TestTube,
  ChartLine
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Projects', icon: FolderPlus, path: '/projects' },
    { title: 'Tasks', icon: ListCheck, path: '/tasks' },
    { title: 'Requirements', icon: FileText, path: '/requirements' },
    { title: 'Design Management', icon: Layers3, path: '/design-management' }, // New item
    { title: 'Test Cases', icon: CheckSquare, path: '/test-cases' },
    { title: 'Automation Testing', icon: TestTube, path: '/automation-testing' }, // New item
    { title: 'Performance Testing', icon: ChartLine, path: '/performance-testing' }, // New item
    { title: 'Chat', icon: MessageSquare, path: '/chat' },
    { title: 'Defects', icon: Bug, path: '/defects' },
    { title: 'Reports', icon: BarChart, path: '/reports' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="bg-qforma-teal text-white rounded-lg h-8 w-8 flex items-center justify-center font-bold text-xl">Q</div>
              <span className="text-xl font-bold text-sidebar-foreground">QForma</span>
            </Link>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.path} className="flex items-center">
                          <item.icon className="mr-3 h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            {user && (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-sidebar-foreground">{user.name}</span>
                    <span className="text-xs text-sidebar-foreground/70">{user.role}</span>
                  </div>
                </div>
                <Separator />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="w-full bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center px-4 bg-card">
            <SidebarTrigger>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
            <div className="ml-4 font-medium">QForma Platform</div>
            <div className="flex-1"></div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
