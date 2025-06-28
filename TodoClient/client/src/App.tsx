// src/App.tsx
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { Routes, Route, Navigate } from 'react-router-dom';

const history = createBrowserHistory({ window });

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HistoryRouter 
          history={history}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes inside Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route 
                  path="/dashboard" 
                  element={
                    <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading dashboard</div>}>
                      <Dashboard />
                    </ErrorBoundary>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading profile</div>}>
                      <Profile />
                    </ErrorBoundary>
                  } 
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Route>
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </HistoryRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;