/*
  # Add Admin Role Support

  1. New Changes
    - Add role column to customers table
    - Create admin user functionality
    - Add role-based RLS policies
    - Create admin dashboard access

  2. Security
    - Role-based access control
    - Secure admin operations
    - Admin-only policies for sensitive data
*/

-- Add role column to customers table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'role'
  ) THEN
    ALTER TABLE customers ADD COLUMN role text DEFAULT 'customer';
  END IF;
END $$;

-- Add check constraint for valid roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'valid_role'
  ) THEN
    ALTER TABLE customers
    ADD CONSTRAINT valid_role CHECK (role IN ('customer', 'admin'));
  END IF;
END $$;

-- Create index on role column for performance
CREATE INDEX IF NOT EXISTS idx_customers_role ON customers(role);

-- Update RLS policies for customers table
DROP POLICY IF EXISTS "Users can view own profile" ON customers;
DROP POLICY IF EXISTS "Users can update own profile" ON customers;

-- New policies with role support
CREATE POLICY "Users can view own profile"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON customers FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
  ON customers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add admin policies for orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add admin policies for order items
CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add admin policies for products
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add admin policies for categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add admin policies for inventory
CREATE POLICY "Admins can manage inventory"
  ON inventory FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM customers
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on is_admin function
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;