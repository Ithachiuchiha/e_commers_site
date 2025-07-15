/*
  # Enhanced Order Management System

  1. Changes
    - Add order status enum type
    - Add order validation
    - Add inventory management
    - Create order history view
    - Add stock status function

  2. Security
    - Add RLS policies for order history
    - Add inventory constraints
*/

-- Create order status enum
CREATE TYPE order_status AS ENUM (
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

-- Update orders table to use enum
ALTER TABLE orders 
ALTER COLUMN status DROP DEFAULT;

ALTER TABLE orders 
ALTER COLUMN status TYPE order_status USING status::order_status;

ALTER TABLE orders 
ALTER COLUMN status SET DEFAULT 'pending'::order_status;

-- Add order validation function
CREATE OR REPLACE FUNCTION validate_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if all products are in stock
  IF EXISTS (
    SELECT 1
    FROM order_items oi
    JOIN inventory inv ON inv.product_id = oi.product_id
    WHERE oi.order_id = NEW.id
    AND inv.quantity < oi.quantity
  ) THEN
    RAISE EXCEPTION 'One or more products are out of stock';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for order validation
CREATE TRIGGER validate_order_trigger
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION validate_order();

-- Add function to update inventory
CREATE OR REPLACE FUNCTION update_inventory()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease inventory when order is placed
  IF (TG_OP = 'INSERT') THEN
    UPDATE inventory
    SET quantity = quantity - NEW.quantity
    WHERE product_id = NEW.product_id;
  -- Restore inventory when order is cancelled
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE inventory
    SET quantity = quantity + OLD.quantity
    WHERE product_id = OLD.product_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for inventory updates
CREATE TRIGGER update_inventory_trigger
  AFTER INSERT OR DELETE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory();

-- Create view for order history
CREATE OR REPLACE VIEW order_history AS
SELECT 
  o.id as order_id,
  o.user_id,
  o.status,
  o.total_amount,
  o.shipping_address,
  o.created_at,
  json_agg(json_build_object(
    'product_id', oi.product_id,
    'product_name', p.name,
    'quantity', oi.quantity,
    'unit_price', oi.unit_price
  )) as items,
  s.tracking_number,
  s.carrier,
  s.status as shipping_status,
  s.estimated_delivery
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
LEFT JOIN shipments s ON o.id = s.order_id
GROUP BY o.id, s.id;

-- Add RLS policies for order history
CREATE POLICY "Users can view their order history"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add check constraint for inventory
ALTER TABLE inventory
ADD CONSTRAINT positive_quantity
CHECK (quantity >= 0);

-- Add function to check stock status
CREATE OR REPLACE FUNCTION get_stock_status(product_id uuid)
RETURNS text AS $$
DECLARE
  stock_quantity integer;
  threshold integer;
BEGIN
  SELECT quantity, low_stock_threshold 
  INTO stock_quantity, threshold
  FROM inventory
  WHERE product_id = $1;
  
  IF stock_quantity IS NULL THEN
    RETURN 'unavailable';
  ELSIF stock_quantity = 0 THEN
    RETURN 'out_of_stock';
  ELSIF stock_quantity <= threshold THEN
    RETURN 'low_stock';
  ELSE
    RETURN 'in_stock';
  END IF;
END;
$$ LANGUAGE plpgsql;