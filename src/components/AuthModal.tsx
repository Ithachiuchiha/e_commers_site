import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password length for sign up
    if (isSignUp && formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const result = await signUp(formData.email, formData.password, {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        });

        if (!result.success) {
          setError(result.error);
        } else {
          onClose();
          // Reset form
          setFormData({
            email: '',
            password: '',
            name: '',
            phone: '',
            address: '',
          });
        }
      } else {
        await signIn(formData.email, formData.password);
        onClose();
        // Reset form
        setFormData({
          email: '',
          password: '',
          name: '',
          phone: '',
          address: '',
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        // Provide more user-friendly error messages
        if (err.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (err.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else if (err.message.includes('User already registered')) {
          setError('This email is already registered. Please sign in instead.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An error occurred during authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalToggle = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      address: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password {isSignUp && <span className="text-sm text-gray-500">(min. 6 characters)</span>}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green"
              required
              minLength={isSignUp ? 6 : undefined}
            />
          </div>

          {isSignUp && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <button
            onClick={handleModalToggle}
            className="text-green hover:text-green-dark"
            disabled={loading}
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>

        {!isSignUp && (
          <div className="mt-2 text-center text-xs text-gray-500">
            Note: If you just signed up, please check your email for a confirmation link before signing in.
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;