import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="glass-effect shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold gradient-text">
          TaskMaster
        </Link>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link 
              to="/profile" 
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              title="View Profile"
            >
              <UserCircleIcon className="h-8 w-8" />
            </Link>
            <button
              onClick={() => logout()}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}