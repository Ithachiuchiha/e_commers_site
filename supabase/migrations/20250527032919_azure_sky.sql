/*
  # Fix Products and Categories Relationship

  1. Changes
    - Add foreign key constraint between products and categories tables
    - Update products table to ensure category_id references categories table
    - Add index on category_id for better query performance

  2. Security
    - Maintain existing RLS policies
*/

-- First ensure the foreign key constraint exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'products_category_id_fkey'
  ) THEN
    ALTER TABLE products
    ADD CONSTRAINT products_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES categories(id);
  END IF;
END $$;

-- Add index on category_id if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE tablename = 'products' 
    AND indexname = 'products_category_id_idx'
  ) THEN
    CREATE INDEX products_category_id_idx ON products(category_id);
  END IF;
END $$;