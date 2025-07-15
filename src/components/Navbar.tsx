import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Cart from './Cart';
import AuthModal from './AuthModal';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { state } = useCart();
  const { user, profile, signOut, loading } = useAuth();

  const cartItemsCount = state.items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isOpen || isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isCartOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAuthClick = () => {
    if (user) {
      setShowUserMenu(!showUserMenu);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const getUserDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Account';
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-white bg-opacity-95 backdrop-blur-sm shadow-sm py-2 sm:py-3' 
            : 'bg-transparent py-3 sm:py-5'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <a href="#" className="text-green text-lg sm:text-xl font-bold tracking-tight z-10 flex-shrink-0">
            JAYA <span className="text-gold">FARMS</span>
          </a>
          
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 mx-4 flex-grow justify-center">
            {['Products', 'Story', 'Limited Drops', 'Reviews', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className={`${
                  scrolled ? 'text-gray-800' : 'text-gray-800'
                } hover:text-gold transition-colors font-medium text-sm lg:text-base whitespace-nowrap`}
              >
                {item}
              </a>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <div className="relative user-menu-container">
              <button 
                onClick={handleAuthClick}
                disabled={loading}
                className="flex items-center space-x-2 text-gray-800 hover:text-gold transition-colors disabled:opacity-50"
              >
                <User size={20} />
                <span className="text-sm font-medium whitespace-nowrap">
                  {loading ? 'Loading...' : (user ? getUserDisplayName() : 'Sign In')}
                </span>
              </button>

              {/* User Menu Dropdown */}
              {user && showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    {profile?.role === 'admin' && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-green text-white rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  
                  {profile?.role === 'admin' && (
                    <a
                      href="/admin"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} className="mr-2" />
                      Admin Dashboard
                    </a>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <button 
              className="relative p-2 text-gray-800 hover:text-gold transition-colors" 
              aria-label="View Cart"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button className="btn-primary text-sm py-2 px-4 whitespace-nowrap">
              Order Now
            </button>
          </div>
          
          <button 
            className="md:hidden text-gray-800 z-50 p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      
      {/* Mobile Sidebar */}
      <div 
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      
      <div 
        className={`md:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-green font-bold text-xl">
              JAYA <span className="text-gold">FARMS</span>
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-800"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col space-y-4">
            {['Products', 'Story', 'Limited Drops', 'Reviews', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-800 hover:text-gold transition-colors text-lg font-medium"
                onClick={handleNavLinkClick}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            {user ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{getUserDisplayName()}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {profile?.role === 'admin' && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-green text-white rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                {profile?.role === 'admin' && (
                  <a
                    href="/admin"
                    className="w-full flex items-center justify-center space-x-2 p-3 text-gray-800 hover:text-gold transition-colors border border-gray-200 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={20} />
                    <span className="font-medium">Admin Dashboard</span>
                  </a>
                )}

                <button 
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 hover:bg-red-50 transition-colors border border-red-200 rounded-lg disabled:opacity-50"
                >
                  <LogOut size={20} />
                  <span className="font-medium">
                    {loading ? 'Signing Out...' : 'Sign Out'}
                  </span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsAuthModalOpen(true);
                }}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 p-3 text-gray-800 hover:text-gold transition-colors border border-gray-200 rounded-lg disabled:opacity-50"
              >
                <User size={20} />
                <span className="font-medium">
                  {loading ? 'Loading...' : 'Sign In'}
                </span>
              </button>
            )}

            <button 
              onClick={() => {
                setIsOpen(false);
                setIsCartOpen(true);
              }}
              className="w-full flex items-center justify-center space-x-2 p-3 text-gray-800 hover:text-gold transition-colors border border-gray-200 rounded-lg relative"
            >
              <ShoppingBag size={20} />
              <span className="font-medium">Cart</span>
              {cartItemsCount > 0 && (
                <span className="absolute top-2 right-2 bg-gold text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button className="w-full btn-primary">
              Order Now
            </button>
          </div>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;