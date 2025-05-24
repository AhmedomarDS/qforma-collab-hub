import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { LanguageSwitcher } from '@/components/ui/language-switcher';
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
  ChartLine,
  Cpu,
  Smartphone,
  Shield,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { title: t('navigation.dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { title: t('navigation.projects'), icon: FolderPlus, path: '/projects' },
    { title: t('navigation.tasks'), icon: ListCheck, path: '/tasks' },
    { title: t('navigation.requirements'), icon: FileText, path: '/requirements' },
    { title: t('navigation.designManagement'), icon: Layers3, path: '/design-management' },
    { title: t('navigation.testCases'), icon: CheckSquare, path: '/test-cases' },
    { title: t('navigation.testPlans'), icon: ClipboardList, path: '/test-plans' },
    { title: t('navigation.automationTesting'), icon: TestTube, path: '/automation-testing' },
    { title: t('navigation.performanceTesting'), icon: ChartLine, path: '/performance-testing' },
    { title: 'Security Testing', icon: Shield, path: '/security-testing' },
    { title: t('navigation.browserCompatibility'), icon: Cpu, path: '/browser-compatibility' },
    { title: t('navigation.mobileCompatibility'), icon: Smartphone, path: '/mobile-compatibility' },
    { title: t('navigation.chat'), icon: MessageSquare, path: '/chat' },
    { title: t('navigation.defects'), icon: Bug, path: '/defects' },
    { title: t('navigation.reports'), icon: BarChart, path: '/reports' },
    { title: t('navigation.settings'), icon: Settings, path: '/settings' },
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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl h-10 w-10 flex items-center justify-center font-bold text-2xl">
                Q
              </div>
              <div>
                <span className="text-lg font-bold text-sidebar-foreground">{t('app.title')}</span>
                <p className="text-xs text-sidebar-foreground/70">{t('app.subtitle')}</p>
              </div>
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
                  {t('common.logout')}
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
            <div className="ml-4 font-medium">{t('app.platformName')}</div>
            <div className="flex-1"></div>
            <LanguageSwitcher />
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
