/*
  # Fix Product Listings Refresh Function

  1. Changes
    - Drop existing triggers and function
    - Create new refresh function that works with materialized views
    - Add proper permissions and security
    - Fix trigger return type issues

  2. Security
    - Maintain existing RLS policies
    - Add proper function permissions
*/

-- First drop existing triggers
DROP TRIGGER IF EXISTS refresh_product_listings_on_product ON products;
DROP TRIGGER IF EXISTS refresh_product_listings_on_variant ON product_variants;
DROP TRIGGER IF EXISTS refresh_product_listings_on_inventory ON inventory;

-- Drop existing function
DROP FUNCTION IF EXISTS public.refresh_product_listings();

-- Create new refresh function
CREATE OR REPLACE FUNCTION public.refresh_product_listings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  concurrent boolean;
BEGIN
  -- Check if we can do a concurrent refresh
  SELECT EXISTS (
    SELECT 1 
    FROM pg_locks l 
    JOIN pg_class c ON l.relation = c.oid 
    WHERE c.relname = 'product_listings'
  ) INTO concurrent;

  IF concurrent THEN
    REFRESH MATERIALIZED VIEW product_listings;
  ELSE
    REFRESH MATERIALIZED VIEW CONCURRENTLY product_listings;
  END IF;

  RETURN NULL;
END;
$$;

-- Recreate triggers
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

-- Grant permissions
GRANT SELECT ON product_listings TO public;
GRANT EXECUTE ON FUNCTION public.refresh_product_listings() TO authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_product_listings() TO anon;

-- Do initial refresh
REFRESH MATERIALIZED VIEW CONCURRENTLY product_listings;