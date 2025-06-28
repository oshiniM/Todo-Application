// src/components/Layout.tsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">TaskMaster</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Welcome, <span className="font-medium">{user?.name}</span>
            </div>
            <ThemeToggle />
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm hidden md:block">
          <nav className="px-4 py-6 space-y-1">
            <Link 
              to="/dashboard" 
              className={`px-4 py-2.5 rounded-md flex items-center text-sm font-medium transition-colors ${isActive('/dashboard')}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/profile" 
              className={`px-4 py-2.5 rounded-md flex items-center text-sm font-medium transition-colors ${isActive('/profile')}`}
            >
              Profile
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}