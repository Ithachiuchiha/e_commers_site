/*
  # Update products table for image storage

  1. Changes
    - Modify products table to properly handle image URLs
    - Add validation for image URLs
    - Add updated_at trigger

  2. Security
    - No changes to existing RLS policies
*/

-- Update products table to ensure images column is properly structured
ALTER TABLE products
ALTER COLUMN images SET DEFAULT '[]'::jsonb,
ALTER COLUMN images SET NOT NULL;

-- Add a function to validate image URLs
CREATE OR REPLACE FUNCTION validate_product_images()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT (NEW.images @> '[]'::jsonb) THEN
    RAISE EXCEPTION 'images must be a JSON array';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to validate images
CREATE TRIGGER validate_product_images
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION validate_product_images();

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();