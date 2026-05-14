import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

import DashboardPage from '../pages/student/DashboardPage';
import ProfileBuilderPage from '../pages/student/ProfileBuilderPage';
import UniversitiesPage from '../pages/student/UniversitiesPage';
import ScholarshipsPage from '../pages/student/ScholarshipsPage';
import ShortlistPage from '../pages/student/ShortlistPage';
import HowToApplyPage from '../pages/student/HowToApplyPage';
import WritingAssistantPage from '../pages/student/WritingAssistantPage';
import TemplatesPage from '../pages/student/TemplatesPage';
import RoadmapPage from '../pages/student/RoadmapPage';

import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ManageUniversitiesPage from '../pages/admin/ManageUniversitiesPage';
import ManageScholarshipsPage from '../pages/admin/ManageScholarshipsPage';
import ManageStudentsPage from '../pages/admin/ManageStudentsPage';
import NotFoundPage from '../pages/admin/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student Routes (Protected) */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileBuilderPage /></ProtectedRoute>} />
      <Route path="/universities" element={<ProtectedRoute><UniversitiesPage /></ProtectedRoute>} />
      <Route path="/scholarships" element={<ProtectedRoute><ScholarshipsPage /></ProtectedRoute>} />
      <Route path="/shortlist" element={<ProtectedRoute><ShortlistPage /></ProtectedRoute>} />
      <Route path="/how-to-apply/:type/:id" element={<ProtectedRoute><HowToApplyPage /></ProtectedRoute>} />
      <Route path="/writing-assistant" element={<ProtectedRoute><WritingAssistantPage /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/admin/universities" element={<ProtectedRoute requireAdmin><ManageUniversitiesPage /></ProtectedRoute>} />
      <Route path="/admin/scholarships" element={<ProtectedRoute requireAdmin><ManageScholarshipsPage /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute requireAdmin><ManageStudentsPage /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
