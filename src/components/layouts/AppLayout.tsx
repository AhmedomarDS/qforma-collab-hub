
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
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ContactForm } from '@/components/ui/contact-form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FloatingSupportChatbot } from '@/components/support/FloatingSupportChatbot';
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
  ClipboardList,
  GitBranch,
  ChevronRight,
  CreditCard,
  Building,
  Users,
  UserPlus,
  Workflow,
  Play,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AppLayoutProps {
  children: React.ReactNode;
}

const SidebarMenuItems = () => {
  const { t } = useTranslation();
  const { isMobile, setOpenMobile } = useSidebar();

  const mainMenuItems = [
    { title: t('navigation.dashboard'), icon: LayoutDashboard, path: '/dashboard' },
  ];

  const companySettingsSubItems = [
    { title: 'Team Invitations', icon: UserPlus, path: '/company-settings/invitations' },
    { title: 'Plan and Billing', icon: CreditCard, path: '/plan-billing' },
    { title: 'Company Details', icon: Building, path: '/company-settings/details' },
  ];

  const projectsSubItems = [
    { title: 'Project Execution', icon: Play, path: '/project-execution' },
    { title: 'Project Dashboard', icon: LayoutDashboard, path: '/project-dashboard' },
    { title: t('navigation.tasks'), icon: ListCheck, path: '/tasks' },
    { title: 'Requirements Library', icon: FileText, path: '/requirements' },
    { title: t('navigation.designManagement'), icon: Layers3, path: '/design-management' },
    { title: 'Test Cases Library', icon: CheckSquare, path: '/test-cases' },
  ];

  const testPlansSubItems = [
    { title: 'Test Plans', icon: ClipboardList, path: '/test-plans' },
    { title: 'Traceability Matrix', icon: GitBranch, path: '/traceability-matrix' },
    { title: t('navigation.automationTesting'), icon: TestTube, path: '/automation-testing' },
    { title: t('navigation.performanceTesting'), icon: ChartLine, path: '/performance-testing' },
    { title: 'Security Testing', icon: Shield, path: '/security-testing' },
    { title: t('navigation.browserCompatibility'), icon: Cpu, path: '/browser-compatibility' },
    { title: t('navigation.mobileCompatibility'), icon: Smartphone, path: '/mobile-compatibility' },
  ];

  const bottomMenuItems = [
    { title: 'Support', icon: LifeBuoy, path: '/support' },
    { title: t('navigation.chat'), icon: MessageSquare, path: '/chat' },
    { title: t('navigation.defects'), icon: Bug, path: '/defects' },
    { title: t('navigation.reports'), icon: BarChart, path: '/reports' },
    { title: 'Profile Settings', icon: Settings, path: '/settings' },
  ];

  const handleMainMenuClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Keep sidebar open for sub-menu navigation - don't close on mobile
  const handleSubMenuClick = () => {
    // Intentionally empty - we want to keep the sidebar open for sub-menu items
  };

  return (
    <SidebarMenu>
      {/* Main menu items */}
      {mainMenuItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link to={item.path} className="flex items-center" onClick={handleMainMenuClick}>
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      {/* Company Settings with sub-items - moved to second position */}
      <Collapsible>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="flex items-center w-full">
              <Building className="mr-3 h-5 w-5" />
              <span>Company Settings</span>
              <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {companySettingsSubItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
                    <Link to={subItem.path} className="flex items-center" onClick={handleSubMenuClick}>
                      <subItem.icon className="mr-2 h-4 w-4" />
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>

      {/* Projects with sub-items */}
      <Collapsible>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="flex items-center w-full">
              <FolderPlus className="mr-3 h-5 w-5" />
              <span>{t('navigation.projects')}</span>
              <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {projectsSubItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
                    <Link to={subItem.path} className="flex items-center" onClick={handleSubMenuClick}>
                      <subItem.icon className="mr-2 h-4 w-4" />
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>

      {/* Test Plans with sub-items */}
      <Collapsible>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="flex items-center w-full">
              <ClipboardList className="mr-3 h-5 w-5" />
              <span>Test Management</span>
              <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {testPlansSubItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
                    <Link to={subItem.path} className="flex items-center" onClick={handleSubMenuClick}>
                      <subItem.icon className="mr-2 h-4 w-4" />
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>

      {/* Bottom menu items */}
      {bottomMenuItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link to={item.path} className="flex items-center" onClick={handleMainMenuClick}>
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Top Header Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b flex items-center justify-between px-4">
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-4">
            <ContactForm>
              <Button variant="outline" size="sm">
                Request Demo
              </Button>
            </ContactForm>
            <LanguageSwitcher />
          </div>
        </div>

        <Sidebar className="border-r mt-14">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenuItems />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            {user && (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-sidebar-foreground">
                      {user.user_metadata?.name || user.email}
                    </span>
                    <span className="text-xs text-sidebar-foreground/70">Tester</span>
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
        
        <div className="flex-1 flex flex-col mt-14">
          <header className="h-16 border-b flex items-center px-4 bg-card">
            <div className="flex items-center space-x-4">
              <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
            </div>
            
            <div className="flex-1"></div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>

        {/* Floating Support Chatbot */}
        <FloatingSupportChatbot />
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
