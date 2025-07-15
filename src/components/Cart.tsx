import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (id: number, change: number) => {
    const item = state.items.find(item => item.id === id);
    if (!item) return;
    
    const newQuantity = Math.max(1, item.quantity + change);
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity: newQuantity }
    });
  };

  const handleRemoveItem = (id: number) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id }
    });
  };

  const handleCheckout = () => {
    if (!user) {
      // Close cart and redirect to sign in
      onClose();
      navigate('/signin');
      return;
    }
    
    // Proceed to checkout
    onClose();
    navigate('/checkout');
  };

  return (
    <div 
      className={`fixed inset-0 z-50 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}
    >
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 shadow-xl`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingBag size={24} />
              Your Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X size={24} />
            </button>
          </div>
          
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {state.items.map(item => (
                  <div 
                    key={item.id}
                    className="flex gap-4 p-4 border-b last:border-b-0"
                  >
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="p-1 hover:bg-gray-100 transition-colors rounded-l-lg"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="p-1 hover:bg-gray-100 transition-colors rounded-r-lg"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-xl font-semibold">${state.total.toFixed(2)}</span>
                </div>
                
                <button 
                  className="w-full btn-primary mb-2"
                  onClick={handleCheckout}
                >
                  {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                </button>
                <button 
                  onClick={onClose}
                  className="w-full btn-secondary"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;