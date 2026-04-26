import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  UserPlus,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  GraduationCap,
  Settings as SettingsIcon,
  User as UserIcon
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const role = user?.role || 'student';

  const menuItems = {
    admin: [
      { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/add-student', label: 'Add Student', icon: UserPlus },
      { path: '/admin/add-teacher', label: 'Add Teacher', icon: UserPlus },
      { path: '/admin/assign-subject', label: 'Assign Subject', icon: BookOpen },
      { path: '/admin/manage-students', label: 'Manage Students', icon: Users },
      // { path: '/admin/manage-teachers', label: 'Manage Teachers', icon: Users },
    ],
    teacher: [
      { path: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/teacher/enter-marks', label: 'Enter Marks', icon: ClipboardList },
      // { path: '/teacher/performance', label: 'Performance Analysis', icon: BarChart3 },
      { path: '/teacher/settings', label: 'Settings', icon: SettingsIcon },
    ],
    student: [
      { path: '/student', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/student/results', label: 'My Results', icon: GraduationCap },
      { path: '/student/settings', label: 'Settings', icon: SettingsIcon },
    ],
  };

  const navLinks = menuItems[role];

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
  {/* Mobile sidebar backdrop */}
  {sidebarOpen && (
    <div
      className="fixed inset-0 z-20 bg-black bg-opacity-70 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    ></div>
  )}

  {/* Sidebar */}
  <aside
    className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
  >
    <div className="flex items-center justify-center h-16 border-b border-gray-700 px-6">
      <span className="text-xl font-bold text-primary-500 truncate">Result Portal</span>
    </div>

    <div className="flex-1 overflow-y-auto py-4">
      <nav className="space-y-1 px-3">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/${role}`}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-primary-400'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>

    <div className="p-4 border-t border-gray-700">
      <div className="flex items-center px-3 py-2 mb-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 overflow-hidden shadow-sm border border-gray-600 bg-gray-700">
          {user?.photo ? (
            <img src={user.photo} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary-400 font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <div className="truncate text-sm flex-1">
          <p className="font-medium text-gray-100 truncate">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize">{role}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-900 transition-colors"
      >
        <LogOut className="mr-3 h-5 w-5" />
        Logout
      </button>
    </div>
  </aside>

  {/* Main Content */}
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Top Navbar */}
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 lg:px-8">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700 focus:outline-none"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex-1 flex justify-end items-center">
        <span className="text-sm font-medium text-gray-300 hidden sm:block">
          Academic Year 2026-2027
        </span>
      </div>
    </header>

    {/* Page Content */}
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 lg:p-8">
      <Outlet />
    </main>
  </div>
</div>
  );
};

export default DashboardLayout;
