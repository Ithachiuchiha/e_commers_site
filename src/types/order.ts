export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export interface OrderSummary {
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

export interface OrderDetails {
  id: string;
  customer_id: string;
  items: {
    product_id: string;
    variant_id?: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }[];
  shipping_address: ShippingAddress;
  payment_method: 'cash_on_delivery' | 'online';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed';
  order_summary: OrderSummary;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  customers?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}