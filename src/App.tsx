
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { ProjectProvider } from "./contexts/ProjectContext";
import { RequirementsProvider } from "./contexts/RequirementsContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import ContactSales from "./pages/ContactSales";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDashboard from "./pages/ProjectDashboard";
import Requirements from "./pages/Requirements";
import TestCases from "./pages/TestCases";
import TestPlans from "./pages/TestPlans";
import ProjectExecution from "./pages/ProjectExecution";
import Defects from "./pages/Defects";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import CompanySettings from "./pages/CompanySettings";
import CompanySettingsDetails from "./pages/CompanySettingsDetails";
import CompanySettingsInvitations from "./pages/CompanySettingsInvitations";
import PlanAndBilling from "./pages/PlanAndBilling";
import PlanSelection from "./pages/PlanSelection";
import Tasks from "./pages/Tasks";
import Support from "./pages/Support";
import AutomationTesting from "./pages/AutomationTesting";
import PerformanceTesting from "./pages/PerformanceTesting";
import SecurityTesting from "./pages/SecurityTesting";
import BrowserCompatibility from "./pages/BrowserCompatibility";
import MobileCompatibility from "./pages/MobileCompatibility";
import DesignManagement from "./pages/DesignManagement";
import TraceabilityMatrix from "./pages/TraceabilityMatrix";
import ReleaseManagement from "./pages/ReleaseManagement";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ChatProvider>
              <ProjectProvider>
                <RequirementsProvider>
                  <DashboardProvider>
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/contact-sales" element={<ContactSales />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/:id" element={<ProjectDashboard />} />
                      <Route path="/requirements" element={<Requirements />} />
                      <Route path="/test-cases" element={<TestCases />} />
                      <Route path="/test-plans" element={<TestPlans />} />
                      <Route path="/test-execution" element={<ProjectExecution />} />
                      <Route path="/defects" element={<Defects />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/company-settings" element={<CompanySettings />} />
                      <Route path="/company-settings/details" element={<CompanySettingsDetails />} />
                      <Route path="/company-settings/invitations" element={<CompanySettingsInvitations />} />
                      <Route path="/plan-billing" element={<PlanAndBilling />} />
                      <Route path="/plan-selection" element={<PlanSelection />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/automation-testing" element={<AutomationTesting />} />
                      <Route path="/performance-testing" element={<PerformanceTesting />} />
                      <Route path="/security-testing" element={<SecurityTesting />} />
                      <Route path="/browser-compatibility" element={<BrowserCompatibility />} />
                      <Route path="/mobile-compatibility" element={<MobileCompatibility />} />
                      <Route path="/design-management" element={<DesignManagement />} />
                      <Route path="/traceability-matrix" element={<TraceabilityMatrix />} />
                      <Route path="/release-management" element={<ReleaseManagement />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </DashboardProvider>
                </RequirementsProvider>
              </ProjectProvider>
            </ChatProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
