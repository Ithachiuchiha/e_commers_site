import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: BarChart, label: 'Dashboard', path: '/admin' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Force navigation even if signOut fails
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold text-green">
            JAYA <span className="text-gold">FARMS</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">Admin Dashboard</p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'text-green bg-green-50 border-r-2 border-green' 
                    : 'text-gray-600 hover:text-green hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleSignOut}
          disabled={loading}
          className="absolute bottom-8 left-6 right-6 flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <LogOut size={20} />
          {loading ? 'Signing Out...' : 'Sign Out'}
        </button>
      </aside>

      {/* Main Content */}
      <main className={`
        transition-all duration-300
        ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
        min-h-screen bg-gray-50
      `}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;