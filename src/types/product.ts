export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  weight: number;
  weight_unit: string;
  price_adjustment: number;
  inventory?: {
    quantity: number;
  };
}

export interface ProductReview {
  rating: number;
  title: string;
  review: string;
  created_at: string;
  customers: {
    first_name: string;
    last_name: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  image: string;
  features: string[];
  badge?: string;
  category?: string;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
}