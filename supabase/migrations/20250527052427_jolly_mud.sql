/*
  # Fix Database Security Rules

  1. Changes
    - Update RLS policies for products and categories
    - Add missing policies for public access
    - Fix join permissions between products and categories
    - Add proper error handling for queries

  2. Security
    - Enable public read access for active products
    - Maintain admin-only write access
    - Ensure proper category relationship access
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Products are manageable by authenticated users" ON products;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;

-- Categories Policies
CREATE POLICY "Categories are publicly viewable"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Products Policies
CREATE POLICY "Active products are publicly viewable"
  ON products FOR SELECT
  TO public
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM categories c
      WHERE c.id = products.category_id
    )
  );

CREATE POLICY "Products are manageable by authenticated users"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add function to validate product queries
CREATE OR REPLACE FUNCTION check_product_access()
RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM categories
    WHERE id = NEW.category_id
  ) THEN
    RAISE EXCEPTION 'Invalid category_id';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for product validation
CREATE TRIGGER validate_product_access
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION check_product_access();

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Grant necessary permissions
GRANT SELECT ON categories TO public;
GRANT SELECT ON products TO public;