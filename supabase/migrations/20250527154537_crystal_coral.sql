/*
  # Complete E-commerce Schema Restructure

  1. New Tables
    - `categories` - Product categories with hierarchical support
    - `products` - Products with improved metadata and SEO fields
    - `product_variants` - Size/weight variants for products
    - `inventory` - Real-time stock management
    - `orders` - Enhanced order management
    - `order_items` - Order line items with variant support
    - `shipping_zones` - Geographic shipping zones
    - `shipping_rates` - Rates per zone and weight
    - `customers` - Extended customer profiles
    - `reviews` - Product reviews and ratings
    
  2. Improvements
    - Optimized indexes for faster queries
    - Materialized views for popular queries
    - Better constraint management
    - Enhanced RLS policies
*/

-- Drop existing tables and types
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

-- Create enhanced order status enum
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

-- Categories table with hierarchical support
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  parent_id uuid REFERENCES categories(id),
  image_url text,
  meta_title text,
  meta_description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_parent CHECK (id != parent_id)
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Products table with enhanced metadata
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  features text[] DEFAULT '{}',
  images jsonb DEFAULT '[]'::jsonb NOT NULL,
  base_price decimal(10,2) NOT NULL,
  sale_price decimal(10,2),
  is_on_sale boolean DEFAULT false,
  sale_starts_at timestamptz,
  sale_ends_at timestamptz,
  meta_title text,
  meta_description text,
  seo_keywords text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  badge text,
  rating_avg decimal(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_price CHECK (base_price > 0),
  CONSTRAINT valid_sale_price CHECK (sale_price IS NULL OR (sale_price > 0 AND sale_price < base_price))
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active_price ON products(is_active, base_price);
CREATE INDEX idx_products_rating ON products(rating_avg DESC, rating_count DESC);

-- Product variants for different sizes/weights
CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text UNIQUE,
  weight decimal(10,2),
  weight_unit text DEFAULT 'kg',
  price_adjustment decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);

-- Enhanced inventory management
CREATE TABLE inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0,
  reserved_quantity integer NOT NULL DEFAULT 0,
  low_stock_threshold integer DEFAULT 10,
  last_restock_at timestamptz,
  next_restock_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT positive_quantity CHECK (quantity >= 0),
  CONSTRAINT positive_reserved CHECK (reserved_quantity >= 0),
  CONSTRAINT valid_threshold CHECK (low_stock_threshold > 0)
);

CREATE UNIQUE INDEX idx_inventory_variant ON inventory(variant_id);
CREATE INDEX idx_inventory_low_stock ON inventory(quantity) WHERE quantity <= low_stock_threshold;

-- Customer profiles with enhanced details
CREATE TABLE customers (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text NOT NULL UNIQUE,
  phone text,
  default_shipping_address jsonb,
  saved_addresses jsonb[] DEFAULT '{}',
  preferences jsonb DEFAULT '{}'::jsonb,
  marketing_consent boolean DEFAULT false,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_customers_email ON customers(email);

-- Shipping zones for delivery management
CREATE TABLE shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  countries text[] NOT NULL,
  regions text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shipping rates per zone
CREATE TABLE shipping_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid REFERENCES shipping_zones(id) ON DELETE CASCADE,
  name text NOT NULL,
  min_weight decimal(10,2) DEFAULT 0,
  max_weight decimal(10,2),
  base_cost decimal(10,2) NOT NULL,
  per_kg_cost decimal(10,2) DEFAULT 0,
  estimated_days_min integer,
  estimated_days_max integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_weight_range CHECK (min_weight < max_weight),
  CONSTRAINT valid_base_cost CHECK (base_cost >= 0),
  CONSTRAINT valid_per_kg_cost CHECK (per_kg_cost >= 0)
);

CREATE INDEX idx_shipping_rates_zone ON shipping_rates(zone_id);
CREATE INDEX idx_shipping_rates_weight ON shipping_rates(min_weight, max_weight);

-- Enhanced orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  status order_status DEFAULT 'pending',
  subtotal decimal(10,2) NOT NULL,
  shipping_cost decimal(10,2) NOT NULL,
  tax decimal(10,2) NOT NULL,
  total decimal(10,2) NOT NULL,
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  shipping_rate_id uuid REFERENCES shipping_rates(id),
  tracking_number text,
  carrier text,
  notes text,
  payment_intent_id text,
  payment_status text,
  estimated_delivery timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_total CHECK (total = subtotal + shipping_cost + tax)
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Order items with variant support
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id),
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT valid_subtotal CHECK (subtotal = quantity * unit_price)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(variant_id);

-- Product reviews
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id),
  rating integer NOT NULL,
  title text,
  review text,
  is_verified_purchase boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_rating CHECK (rating BETWEEN 1 AND 5)
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Create materialized view for product listings
CREATE MATERIALIZED VIEW product_listings AS
SELECT 
  p.id,
  p.name,
  p.slug,
  p.description,
  p.images,
  p.base_price,
  p.sale_price,
  p.is_on_sale,
  p.badge,
  p.rating_avg,
  p.rating_count,
  c.name as category_name,
  c.slug as category_slug,
  COALESCE(
    (SELECT jsonb_agg(
      jsonb_build_object(
        'id', pv.id,
        'name', pv.name,
        'price', (p.base_price + pv.price_adjustment),
        'stock', i.quantity
      )
    )
    FROM product_variants pv
    LEFT JOIN inventory i ON i.variant_id = pv.id
    WHERE pv.product_id = p.id AND pv.is_active = true
    ), '[]'::jsonb
  ) as variants
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE p.is_active = true AND c.is_active = true;

CREATE UNIQUE INDEX idx_product_listings_id ON product_listings(id);
CREATE INDEX idx_product_listings_category ON product_listings(category_slug);

-- Function to refresh product listings
CREATE OR REPLACE FUNCTION refresh_product_listings()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_listings;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to refresh product listings
CREATE TRIGGER refresh_product_listings_on_product
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_product_listings();

CREATE TRIGGER refresh_product_listings_on_variant
AFTER INSERT OR UPDATE OR DELETE ON product_variants
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_product_listings();

CREATE TRIGGER refresh_product_listings_on_inventory
AFTER UPDATE OF quantity ON inventory
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_product_listings();

-- Function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE products
  SET 
    rating_avg = (
      SELECT AVG(rating)::decimal(3,2)
      FROM reviews
      WHERE product_id = NEW.product_id
      AND is_approved = true
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE product_id = NEW.product_id
      AND is_approved = true
    )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating product rating
CREATE TRIGGER update_product_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (is_active = true);

-- Products
CREATE POLICY "Active products are viewable by everyone"
  ON products FOR SELECT
  TO public
  USING (is_active = true);

-- Product Variants
CREATE POLICY "Active variants are viewable by everyone"
  ON product_variants FOR SELECT
  TO public
  USING (is_active = true);

-- Inventory
CREATE POLICY "Inventory is viewable by everyone"
  ON inventory FOR SELECT
  TO public
  USING (true);

-- Customers
CREATE POLICY "Users can view own profile"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON customers FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- Order Items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.customer_id = auth.uid()
  ));

-- Reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  TO public
  USING (is_approved = true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- Initial Data
INSERT INTO categories (name, slug, description) VALUES
  ('Premium Mangoes', 'premium-mangoes', 'Our finest selection of premium mangoes'),
  ('Organic Mangoes', 'organic-mangoes', 'Naturally grown without pesticides'),
  ('Gift Boxes', 'gift-boxes', 'Special mango gift collections');

-- Sample shipping zones
INSERT INTO shipping_zones (name, countries) VALUES
  ('Domestic', '{India}'),
  ('International Zone 1', '{United States,Canada,United Kingdom}');