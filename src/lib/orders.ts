import { supabase } from './supabase';
import { OrderDetails, ShippingAddress } from '../types/order';
import { CartItem } from '../types/cart';

export const createOrder = async (
  customerId: string,
  items: CartItem[],
  shippingAddress: ShippingAddress,
  orderSummary: {
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
  },
  paymentMethod: 'cash_on_delivery' | 'online'
): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  try {
    // Start a transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        status: 'pending',
        subtotal: orderSummary.subtotal,
        shipping_cost: orderSummary.shippingCost,
        tax: orderSummary.tax,
        total: orderSummary.total,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cash_on_delivery' ? 'pending' : 'processing',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items and update inventory
    const orderItems = items.map(item => ({
      order_id: order.id,
      variant_id: item.variant?.id || null,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update inventory (will be handled by database trigger)
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create order' };
  }
};

export const getOrder = async (orderId: string): Promise<OrderDetails | null> => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          product_id,
          variant_id,
          quantity,
          unit_price,
          subtotal
        ),
        customers (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};