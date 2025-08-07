import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { RolePermissionProvider } from "@/contexts/RolePermissionContext";
import { ThemeProvider } from "@/components/Common/ThemeProvider";
import { ProtectedRoute } from "@/components/Common/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/Common/RoleProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreditApplication from "./pages/CreditApplication";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import AllApplications from "./pages/AllApplications";
import ClientsList from "./pages/ClientsList";
import { ClientDetails } from "./pages/ClientDetails";
import NotFound from "./pages/NotFound";
import { ChatBot } from "@/components/ChatBot/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="fintech-app-theme">
      <AuthProvider>
        <RolePermissionProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/credit-application" 
              element={
                <ProtectedRoute>
                  <CreditApplication />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <AdvancedAnalytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clients" 
              element={
                <ProtectedRoute>
                  <ClientsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clients/:clientId" 
              element={
                <ProtectedRoute>
                  <ClientDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/client-details" 
              element={
                <ProtectedRoute>
                  <ClientDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clients-list" 
              element={
                <ProtectedRoute>
                  <AllApplications />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
         </BrowserRouter>
            </TooltipProvider>
          </NotificationProvider>
        </RolePermissionProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
