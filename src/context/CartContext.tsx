import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '../data/products';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'RESTORE_CART'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.product.id);
      
      if (existingItem) {
        const newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          total: state.total + (action.payload.product.price * action.payload.quantity)
        };
        localStorage.setItem('cart-data', JSON.stringify(newState));
        return newState;
      }
      
      const newState = {
        ...state,
        items: [...state.items, { ...action.payload.product, quantity: action.payload.quantity }],
        total: state.total + (action.payload.product.price * action.payload.quantity)
      };
      localStorage.setItem('cart-data', JSON.stringify(newState));
      return newState;
    }
    
    case 'REMOVE_ITEM': {
      const item = state.items.find(item => item.id === action.payload.id);
      if (!item) return state;
      
      const newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
        total: state.total - (item.price * item.quantity)
      };
      localStorage.setItem('cart-data', JSON.stringify(newState));
      return newState;
    }
    
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id);
      if (!item) return state;
      
      const quantityDiff = action.payload.quantity - item.quantity;
      
      const newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff)
      };
      localStorage.setItem('cart-data', JSON.stringify(newState));
      return newState;
    }
    
    case 'CLEAR_CART':
      localStorage.removeItem('cart-data');
      return {
        items: [],
        total: 0
      };

    case 'RESTORE_CART':
      return action.payload;
      
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart-data');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'RESTORE_CART', payload: cartData });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Listen for cart restoration from backend
  useEffect(() => {
    const handleCartRestored = (event: CustomEvent) => {
      if (event.detail) {
        dispatch({ type: 'RESTORE_CART', payload: event.detail });
      }
    };

    const handleCartCleared = () => {
      dispatch({ type: 'CLEAR_CART' });
    };

    window.addEventListener('cart-restored', handleCartRestored as EventListener);
    window.addEventListener('cart-cleared', handleCartCleared);

    return () => {
      window.removeEventListener('cart-restored', handleCartRestored as EventListener);
      window.removeEventListener('cart-cleared', handleCartCleared);
    };
  }, []);
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};