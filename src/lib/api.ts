import { supabase } from './supabase';
import { Product } from '../types/product';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching products...');
    
    // First try to get products from the materialized view
    const { data: viewData, error: viewError } = await supabase
      .from('product_listings')
      .select('*')
      .order('rating_avg', { ascending: false });

    if (!viewError && viewData && viewData.length > 0) {
      console.log('Products fetched from materialized view:', viewData.length);
      return viewData.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.is_on_sale ? product.sale_price : product.base_price,
        images: product.images || [],
        image: Array.isArray(product.images) && product.images.length > 0 
          ? product.images[0] 
          : 'https://images.pexels.com/photos/2363347/pexels-photo-2363347.jpeg',
        features: [],
        badge: product.badge,
        category: product.category_name,
        variants: product.variants || []
      }));
    }

    console.log('Falling back to direct products query');

    // Fallback to direct products query if view fails or is empty
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    if (!productsData || productsData.length === 0) {
      console.log('No products found in database');
      throw new Error('No products found in the database. Please check if products are marked as active.');
    }

    console.log('Products fetched from direct query:', productsData.length);
    
    return productsData.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.is_on_sale ? product.sale_price : product.base_price,
      images: product.images || [],
      image: Array.isArray(product.images) && product.images.length > 0 
        ? product.images[0] 
        : 'https://images.pexels.com/photos/2363347/pexels-photo-2363347.jpeg',
      features: product.features || [],
      badge: product.badge,
      category: product.categories?.name,
      variants: []
    }));

  } catch (error) {
    console.error('Error in fetchProducts:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch products');
  }
};

// Authenticated data fetching functions with enhanced error handling
export const fetchUserOrders = async (userId: string) => {
  try {
    console.log('Fetching orders for user:', userId);
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product_variants (
            *,
            products (
              name,
              images
            )
          )
        )
      `)
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
    
    console.log('Orders fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error in fetchUserOrders:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch orders');
  }
};

export const fetchAdminDashboardData = async () => {
  try {
    console.log('Fetching admin dashboard data...');
    
    // Fetch multiple admin data sources with individual error handling
    const [ordersResult, customersResult, productsResult] = await Promise.allSettled([
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('customers').select('id, first_name, last_name, email, created_at').limit(10),
      supabase.from('products').select('id, name, is_active').limit(10)
    ]);

    const orders = ordersResult.status === 'fulfilled' && !ordersResult.value.error 
      ? ordersResult.value.data 
      : [];
      
    const customers = customersResult.status === 'fulfilled' && !customersResult.value.error 
      ? customersResult.value.data 
      : [];
      
    const products = productsResult.status === 'fulfilled' && !productsResult.value.error 
      ? productsResult.value.data 
      : [];

    // Log any errors from individual queries
    if (ordersResult.status === 'rejected') {
      console.warn('Failed to fetch orders for dashboard:', ordersResult.reason);
    }
    if (customersResult.status === 'rejected') {
      console.warn('Failed to fetch customers for dashboard:', customersResult.reason);
    }
    if (productsResult.status === 'rejected') {
      console.warn('Failed to fetch products for dashboard:', productsResult.reason);
    }

    const dashboardData = {
      orders: orders || [],
      customers: customers || [],
      products: products || [],
      stats: {
        totalOrders: orders?.length || 0,
        totalCustomers: customers?.length || 0,
        totalProducts: products?.length || 0
      }
    };
    
    console.log('Admin dashboard data fetched successfully');
    return dashboardData;
  } catch (error) {
    console.error('Error in fetchAdminDashboardData:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
  }
};