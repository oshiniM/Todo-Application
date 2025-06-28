// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState({
    email: { valid: true, message: '' },
    password: { valid: true, message: '' },
  });
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Reset validation errors when inputs change
  useEffect(() => {
    if (email) {
      validateEmail(email);
    }
    if (password) {
      validatePassword(password);
    }
  }, [email, password]);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(value);
    setValidation(prev => ({
      ...prev,
      email: {
        valid,
        message: valid ? '' : 'Please enter a valid email address'
      }
    }));
    return valid;
  };

  const validatePassword = (value: string) => {
    const valid = value.length >= 6;
    setValidation(prev => ({
      ...prev,
      password: {
        valid,
        message: valid ? '' : 'Password must be at least 6 characters'
      }
    }));
    return valid;
  };

  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    return isEmailValid && isPasswordValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Client-side validation before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    if (field === 'email') {
      validateEmail(email);
    } else {
      validatePassword(password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full animate-fadeIn">
          <div className="card p-8 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="mt-2 text-gray-400">Sign in to your account</p>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`input w-full ${!validation.email.valid ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                  />
                  {!validation.email.valid && (
                    <p className="mt-1 text-sm text-red-500">{validation.email.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className={`input w-full ${!validation.password.valid ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                  />
                  {!validation.password.valid && (
                    <p className="mt-1 text-sm text-red-500">{validation.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary-dark border-gray-600 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-dark">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isLoading || !validation.email.valid || !validation.password.valid}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary-dark transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}