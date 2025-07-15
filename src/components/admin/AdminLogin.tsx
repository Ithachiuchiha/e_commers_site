import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, isSessionReady } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Wait for session to be ready
      if (!isSessionReady) {
        throw new Error('Session not ready. Please try again.');
      }

      await signIn(email, password);
      
      // The auth context will handle role checking
      // If successful and user is admin, they'll be redirected
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (err.message.includes('Access denied')) {
          setError('Access denied. You do not have admin privileges.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            JAYA <span className="text-gold">FARMS</span>
          </h2>
          <h3 className="mt-2 text-center text-xl text-gray-600">
            Admin Dashboard
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Sign in with your admin credentials
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green focus:border-green sm:text-sm"
                placeholder="admin@jayafarms.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green focus:border-green sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isSessionReady}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green hover:bg-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Signing in...
              </span>
            ) : (
              'Sign in to Admin Dashboard'
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Need admin access?</span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/admin/signup"
              className="w-full flex justify-center items-center py-2 px-4 border border-green text-green rounded-lg shadow-sm text-sm font-medium hover:bg-green hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create Admin Account
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-green transition-colors"
            >
              ← Back to Main Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;