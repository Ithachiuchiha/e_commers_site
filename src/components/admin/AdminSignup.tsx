import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AlertCircle, CheckCircle } from 'lucide-react';

const AdminSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Create auth user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      if (!user) throw new Error('Failed to create user');

      // Create customer profile with admin role
      const { error: profileError } = await supabase
        .from('customers')
        .insert([
          {
            id: user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role: 'admin',
            default_shipping_address: null,
          },
        ]);

      if (profileError) throw profileError;

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);

    } catch (err) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        if (err.message.includes('User already registered')) {
          setError('This email is already registered. Please use a different email or sign in.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to create admin account');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green/10 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Admin Account Created!
            </h2>
            <p className="text-gray-600 mb-4">
              Your admin account has been successfully created. You will be redirected to the login page shortly.
            </p>
            <p className="text-sm text-gray-500">
              Please check your email for a confirmation link if required.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            JAYA <span className="text-gold">FARMS</span>
          </h2>
          <h3 className="mt-2 text-center text-xl text-gray-600">
            Create Admin Account
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Set up your administrator credentials
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green focus:border-green sm:text-sm"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green focus:border-green sm:text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

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
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green focus:border-green sm:text-sm"
                placeholder="admin@jayafarms.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green focus:border-green sm:text-sm"
                placeholder="+1 (555) 123-4567"
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green focus:border-green sm:text-sm"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green focus:border-green sm:text-sm"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green hover:bg-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Creating Account...
              </span>
            ) : (
              'Create Admin Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/admin/login"
            className="text-sm text-gray-600 hover:text-green transition-colors"
          >
            Already have an admin account? Sign in
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
  );
};

export default AdminSignup;