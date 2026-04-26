import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddStudent from './pages/admin/AddStudent';
import AddTeacher from './pages/admin/AddTeacher';
import AssignSubject from './pages/admin/AssignSubject';
import ManageStudents from './pages/admin/ManageStudents';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import EnterMarks from './pages/teacher/EnterMarks';
import PerformanceAnalysis from './pages/teacher/PerformanceAnalysis';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyResults from './pages/student/MyResults';

// Shared Pages
import Settings from './pages/shared/Settings';

// Placeholder standard List pages
const ManageUsersPlaceholder = ({ type }) => (
  <div className="card p-8 text-center text-gray-500">
    <h2 className="text-xl font-semibold mb-2">Manage {type}s</h2>
    <p>This is a placeholder for the searchable {type.toLowerCase()} list table.</p>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Default redirect logic based on login state
  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    switch (user?.role) {
      case 'admin': return '/admin';
      case 'teacher': return '/teacher';
      case 'student': return '/student';
      default: return '/login';
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-student" element={<AddStudent />} />
          <Route path="/admin/add-teacher" element={<AddTeacher />} />
          <Route path="/admin/assign-subject" element={<AssignSubject />} />
          <Route path="/admin/manage-students" element={<ManageStudents />} />
          <Route path="/admin/manage-teachers" element={<ManageUsersPlaceholder type="Teacher" />} />
        </Route>
      </Route>

      {/* Teacher Routes */}
      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/enter-marks" element={<EnterMarks />} />
          {/* <Route path="/teacher/performance" element={<PerformanceAnalysis />} /> */}
          <Route path="/teacher/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/results" element={<MyResults />} />
          <Route path="/student/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
};

export default AppRoutes;
