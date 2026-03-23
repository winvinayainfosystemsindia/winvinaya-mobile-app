import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import StudentLayout from '../layouts/StudentLayout';
import TeacherLayout from '../layouts/TeacherLayout';
import PublicLayout from '../layouts/PublicLayout';

// Auth & Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CourseDetail from '../pages/CourseDetail';
import CoursePlayer from '../pages/CoursePlayer';
import AdminGroups from '../pages/admin/AdminGroups';
import AdminEnrollments from '../pages/admin/AdminEnrollments';
import AdminCourseCreate from '../pages/AdminCourseCreate';
import AdminCourseEdit from '../pages/AdminCourseEdit';

// Dashboards
import StudentDashboard from '../pages/student/DashboardPage';
import TeacherDashboard from '../pages/teacher/DashboardPage';
import TeacherCoursesPage from '../pages/teacher/CoursesPage';
import CourseBuilderPage from '../pages/teacher/CourseBuilderPage';
import AdminDashboard from '../pages/admin/DashboardPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes - No Layout required for login/register usually or using PublicLayout later */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses/:coursePublicId" element={<CourseDetail />} />
      </Route>

      {/* Authenticated Routes */}
      <Route element={<ProtectedRoute />}>
        
        {/* Student Portal */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="learn/:coursePublicId" element={<CoursePlayer />} />
          <Route path="learn/:coursePublicId/:lessonPublicId" element={<CoursePlayer />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={['instructor', 'admin']} />}>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="courses" element={<TeacherCoursesPage />} />
            <Route path="courses/:coursePublicId/build" element={<CourseBuilderPage />} />
          </Route>
        </Route>

        {/* Admin Portal (Admin Only) */}
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="groups" element={<AdminGroups />} />
            <Route path="enrollments" element={<AdminEnrollments />} />
            <Route path="courses/create" element={<AdminCourseCreate />} />
            <Route path="courses/:courseId/edit" element={<AdminCourseEdit />} />
          </Route>
        </Route>

      </Route>

      {/* Catch-all redirects to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
