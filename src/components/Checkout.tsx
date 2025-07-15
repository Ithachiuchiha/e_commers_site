import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, CreditCard, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/orders';
import { ShippingAddress } from '../types/order';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { state, dispatch } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'online'>('cash_on_delivery');
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: profile?.name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: profile?.phone || '',
  });

  const shippingCost = state.total > 1000 ? 0 : 99;
  const tax = state.total * 0.18; // 18% GST
  const orderTotal = state.total + shippingCost + tax;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in to place an order');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createOrder(
      user.id,
      state.items,
      shippingAddress,
      {
        subtotal: state.total,
        shippingCost,
        tax,
        total: orderTotal,
      },
      paymentMethod
    );

    if (result.success) {
      dispatch({ type: 'CLEAR_CART' });
      navigate(`/order-confirmation/${result.orderId}`);
    } else {
      setError(result.error || 'Failed to place order');
    }
    setLoading(false);
  };

  if (!user) {
    navigate('/signin');
    return null;
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some items to your cart to proceed with checkout.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-green" />
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleAddressChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green focus:border-green"
                      required
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={handleAddressChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green focus:border-green"
                      required
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={shippingAddress.addressLine2}
                      onChange={handleAddressChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green focus:border-green"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green focus:border-green"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green focus:border-green"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleAddressChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green focus:border-green"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green focus:border-green"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="text-green" />
                <h2 className="text-xl font-semibold">Shipping Method</h2>
              </div>
              
              <div className="p-4 border rounded-lg bg-cream">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Standard Delivery</p>
                    <p className="text-sm text-gray-600">2-4 Business Days</p>
                  </div>
                  <p className="font-medium">
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="text-green" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              
              <div className="space-y-4">
                <div 
                  className={`p-4 border rounded-lg ${paymentMethod === 'cash_on_delivery' ? 'bg-cream border-green' : 'bg-white'} cursor-pointer`}
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive</p>
                    </div>
                    <input
                      type="radio"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={() => setPaymentMethod('cash_on_delivery')}
                      className="h-4 w-4 text-green focus:ring-green border-gray-300"
                    />
                  </div>
                </div>

                <div 
                  className={`p-4 border rounded-lg ${paymentMethod === 'online' ? 'bg-cream border-green' : 'bg-white'} cursor-pointer opacity-50`}
                  onClick={() => alert('Online payment is coming soon!')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Online Payment</p>
                      <p className="text-sm text-gray-600">Coming soon!</p>
                    </div>
                    <input
                      type="radio"
                      checked={paymentMethod === 'online'}
                      disabled
                      className="h-4 w-4 text-gray-400 border-gray-300 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Package className="text-green" />
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              
              <div className="space-y-4">
                {state.items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹{orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || state.items.length === 0}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;