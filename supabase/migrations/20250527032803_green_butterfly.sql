/*
  # E-commerce Database Schema

  1. New Tables
    - `products`
      - Product details including name, description, price, images
    - `categories`
      - Product categories
    - `inventory`
      - Stock management
    - `orders`
      - Customer orders
    - `order_items`
      - Items in each order
    - `shipments`
      - Shipping information
    
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Categories Table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products Table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  category_id uuid REFERENCES categories(id),
  images jsonb DEFAULT '[]'::jsonb,
  features text[] DEFAULT '{}',
  badge text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inventory Table
CREATE TABLE inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 0,
  low_stock_threshold integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id)
);

-- Orders Table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'pending',
  total_amount decimal(10,2) NOT NULL,
  shipping_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items Table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Shipments Table
CREATE TABLE shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  tracking_number text,
  carrier text,
  status text NOT NULL DEFAULT 'pending',
  estimated_delivery timestamptz,
  actual_delivery timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Products Policies
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Products are manageable by authenticated users"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inventory Policies
CREATE POLICY "Inventory is viewable by authenticated users"
  ON inventory FOR SELECT
  TO authenticated
  USING (true);

-- Orders Policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order Items Policies
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Shipments Policies
CREATE POLICY "Users can view their own shipments"
  ON shipments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = shipments.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Insert initial categories
INSERT INTO categories (name, description) VALUES
  ('Organic', 'Naturally grown mangoes without pesticides'),
  ('Conventional', 'Traditional farming methods');

-- Insert sample products from CSV
INSERT INTO products (name, description, price, images, category_id, is_active)
SELECT 
  p.name,
  p.description,
  REPLACE(p.price, '$', '')::decimal,
  jsonb_build_array(p.image),
  c.id as category_id,
  true
FROM (
  VALUES 
    ('Alphonso', 'Sweet, juicy mango from India with rich flavor and creamy texture', '$5.00', 'alphonso_mango.jpg', 'Organic'),
    ('Tommy Atkins', 'Large, red-skinned mango with mild sweet flavor', '$3.50', 'tommy_atkins.jpg', 'Conventional'),
    ('Kent', 'Sweet and juicy with minimal fiber, excellent for eating fresh', '$4.25', 'kent_mango.jpg', 'Organic'),
    ('Keitt', 'Large, green-skinned mango with sweet flesh', '$4.00', 'keitt_mango.jpg', 'Conventional'),
    ('Ataulfo', 'Small, golden mango with buttery texture and rich flavor', '$6.00', 'ataulfo_mango.jpg', 'Organic')
) as p(name, description, price, image, category)
JOIN categories c ON c.name = p.category;

-- Initialize inventory for products
INSERT INTO inventory (product_id, quantity)
SELECT id, 100 FROM products;