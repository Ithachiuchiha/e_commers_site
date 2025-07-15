import { Product } from './product';

export interface CartItem extends Product {
  quantity: number;
  variant?: {
    id: string;
    name: string;
    price_adjustment: number;
  };
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; variant?: CartItem['variant'] } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };