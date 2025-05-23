
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import { RequirementsProvider } from "./contexts/RequirementsContext";
import { ChatProvider } from "./contexts/ChatContext";
import { ProjectProvider } from "./contexts/ProjectContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Requirements from "./pages/Requirements";
import TestCases from "./pages/TestCases";
import TestPlans from "./pages/TestPlans";
import TraceabilityMatrix from "./pages/TraceabilityMatrix";
import Chat from "./pages/Chat";
import Defects from "./pages/Defects";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import DesignManagement from "./pages/DesignManagement";
import AutomationTesting from "./pages/AutomationTesting";
import PerformanceTesting from "./pages/PerformanceTesting";
import BrowserCompatibility from "./pages/BrowserCompatibility";
import MobileCompatibility from "./pages/MobileCompatibility";
import SecurityTesting from "./pages/SecurityTesting";

const queryClient = new QueryClient();

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DashboardProvider>
        <RequirementsProvider>
          <ProjectProvider>
            <ChatProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/" element={<Navigate to="/landing" replace />} />
                    
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/requirements" element={
                      <ProtectedRoute>
                        <Requirements />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/test-cases" element={
                      <ProtectedRoute>
                        <TestCases />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/test-plans" element={
                      <ProtectedRoute>
                        <TestPlans />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/traceability-matrix" element={
                      <ProtectedRoute>
                        <TraceabilityMatrix />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/chat" element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/defects" element={
                      <ProtectedRoute>
                        <Defects />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/reports" element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/projects" element={
                      <ProtectedRoute>
                        <Projects />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/tasks" element={
                      <ProtectedRoute>
                        <Tasks />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/design-management" element={
                      <ProtectedRoute>
                        <DesignManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/automation-testing" element={
                      <ProtectedRoute>
                        <AutomationTesting />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/performance-testing" element={
                      <ProtectedRoute>
                        <PerformanceTesting />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/browser-compatibility" element={
                      <ProtectedRoute>
                        <BrowserCompatibility />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/mobile-compatibility" element={
                      <ProtectedRoute>
                        <MobileCompatibility />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/security-testing" element={
                      <ProtectedRoute>
                        <SecurityTesting />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </ChatProvider>
          </ProjectProvider>
        </RequirementsProvider>
      </DashboardProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
