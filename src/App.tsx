import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute, RoleRoute, PublicOnlyRoute } from './components/layout/RouteGuards';

// Page components
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { InterventionsPage } from './pages/InterventionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AcademicPage } from './pages/AcademicPage';
import { AttendancePage } from './pages/AttendancePage';
import { LMSPage } from './pages/LMSPage';
import { EngagementPage } from './pages/EngagementPage';
import { PlacementPage } from './pages/PlacementPage';
import { SkillsPage } from './pages/SkillsPage';
import { STPointPage } from './pages/STPointPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { ProCodePage } from './pages/ProCodePage';
import { ProblemDetailsPage } from './pages/ProblemDetailsPage';
import { StartupDeskPage } from './pages/StartupDeskPage';
import { SettingsPage } from './pages/SettingsPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { LoginPage } from './pages/LoginPage';
import { FacultyDashboardPage } from './pages/FacultyDashboardPage';
import { MockInterviewHubPage } from './pages/mock-interview/MockInterviewHubPage';
import { MockInterviewSessionPage } from './pages/mock-interview/MockInterviewSessionPage';
import { MockInterviewReportPage } from './pages/mock-interview/MockInterviewReportPage';

/**
 * Root index route dispatcher:
 * If authenticated user has 'faculty' role, redirect to '/faculty'.
 * If student, render the canonical Student DashboardPage.
 */
const RootIndexRoute: React.FC = () => {
  const { userRole } = useApp();
  if (userRole === 'faculty') {
    return <Navigate to="/faculty" replace />;
  }
  return <DashboardPage />;
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public-only Authentication Portal */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />

          {/* Protected Application Layout and Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RootIndexRoute />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="interventions" element={<InterventionsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="academic" element={<AcademicPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="lms" element={<LMSPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="engagement" element={<EngagementPage />} />
            <Route path="placement" element={<PlacementPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="st-point" element={<STPointPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="pro-code" element={<ProCodePage />} />
            <Route path="pro-code/:problemId" element={<ProblemDetailsPage />} />
            <Route path="startup-desk" element={<StartupDeskPage />} />
            <Route path="mock-interview" element={<MockInterviewHubPage />} />
            <Route path="mock-interview/session/:id" element={<MockInterviewSessionPage />} />
            <Route path="mock-interview/report/:id" element={<MockInterviewReportPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* Dedicated Faculty Dashboard with strict Role-Based Access Control */}
            <Route
              path="faculty"
              element={
                <RoleRoute allowedRoles={['faculty', 'admin']}>
                  <FacultyDashboardPage />
                </RoleRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
