import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AppShell from '../layouts/AppShell';
import PublicLayout from '../layouts/PublicLayout';

// Auth & Guards
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CourseDetail from '../pages/CourseDetail';
import CoursePlayer from '../pages/CoursePlayer';
import AdminGroups from '../pages/admin/AdminGroups';
import AdminEnrollments from '../pages/admin/AdminEnrollments';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCourseCreate from '../pages/AdminCourseCreate';
import AdminCourseEdit from '../pages/AdminCourseEdit';

// Unified Dashboard
import Dashboard from '../pages/dashboard/Dashboard';

// Catalog & Learning
import CourseCatalog from '../pages/catalog/CourseCatalog';
import MyLearning from '../pages/learning/MyLearning';

// Shared / Scaffolded Pages
import Reports from '../pages/Reports';
import Certificates from '../pages/Certificates';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';

// Dashboards (Legacy routing targets to be migrated or deleted)
import TeacherCoursesPage from '../pages/teacher/CoursesPage';
import CourseBuilderPage from '../pages/teacher/CourseBuilderPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<CourseCatalog />} />
        <Route path="/my-learning" element={<MyLearning />} />
        <Route path="/courses/:coursePublicId" element={<CourseDetail />} />
      </Route>

      {/* Authenticated Routes with Unified AppShell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          
          {/* Unified Role-Adaptive Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Shared Scaffolded Pages */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />

          {/* Student Portal (user) */}
          <Route element={<RoleGuard allowedRoles={['user', 'admin']} />}>
            <Route path="/student">
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="learn/:coursePublicId" element={<CoursePlayer />} />
              <Route path="learn/:coursePublicId/:lessonPublicId" element={<CoursePlayer />} />
            </Route>
          </Route>

          {/* Teacher Portal */}
          <Route element={<RoleGuard allowedRoles={['teacher', 'admin']} />}>
            <Route path="/teacher">
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="courses" element={<TeacherCoursesPage />} />
              <Route path="courses/:coursePublicId/build" element={<CourseBuilderPage />} />
            </Route>
          </Route>

          {/* Admin Portal */}
          <Route element={<RoleGuard allowedRoles={['admin', 'manager']} />}>
            <Route path="/admin">
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Navigate to="/dashboard" replace />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="groups" element={<AdminGroups />} />
              <Route path="enrollments" element={<AdminEnrollments />} />
              <Route path="courses/create" element={<AdminCourseCreate />} />
              <Route path="courses/:courseId/edit" element={<AdminCourseEdit />} />
            </Route>
          </Route>
          
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
