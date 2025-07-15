import React from 'react';
import { BarChart, TrendingUp, TrendingDown, Package, ShoppingBag, Users, AlertCircle } from 'lucide-react';
import { useAuthenticatedData } from '../../hooks/useAuthenticatedData';
import { fetchAdminDashboardData } from '../../lib/api';

const Dashboard: React.FC = () => {
  const { data: dashboardData, loading, error } = useAuthenticatedData(
    fetchAdminDashboardData,
    { requireAuth: true, requireAdmin: true }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-green border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0
  };

  const recentOrders = dashboardData?.orders || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green/10 p-2 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-green" />
            </div>
            <span className={`text-sm font-medium ${stats.totalOrders > 0 ? 'text-green' : 'text-red-500'}`}>
              {stats.totalOrders > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </span>
          </div>
          <h3 className="text-sm text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-green">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-sm text-gray-500">Total Customers</h3>
          <p className="text-2xl font-bold">{stats.totalCustomers}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gold/10 p-2 rounded-lg">
              <Package className="w-6 h-6 text-gold" />
            </div>
            <span className="text-sm font-medium text-green">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-sm text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3 text-sm font-medium text-gray-500">Order ID</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Total</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b last:border-b-0">
                    <td className="py-3 text-sm">#{order.id.slice(0, 8)}</td>
                    <td className="py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                        ${order.status === 'delivered' ? 'bg-green-50 text-green' :
                          order.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                          'bg-gray-50 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm">₹{order.total?.toFixed(2) || '0.00'}</td>
                    <td className="py-3 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;