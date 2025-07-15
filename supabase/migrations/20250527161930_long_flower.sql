/*
  # Fix Product Listings Refresh Function

  1. Changes
    - Update refresh_product_listings function to return trigger
    - Recreate triggers with proper function signature
    - Grant proper permissions

  2. Security
    - Maintain existing security policies
    - Grant execute permissions to authenticated and anon users
*/

-- First drop the dependent triggers
DROP TRIGGER IF EXISTS refresh_product_listings_on_product ON products;
DROP TRIGGER IF EXISTS refresh_product_listings_on_variant ON product_variants;
DROP TRIGGER IF EXISTS refresh_product_listings_on_inventory ON inventory;

-- Drop the existing function
DROP FUNCTION IF EXISTS public.refresh_product_listings();

-- Recreate the function with proper trigger return type
CREATE OR REPLACE FUNCTION public.refresh_product_listings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_listings;
  RETURN NULL;
END;
$$;

-- Recreate the triggers
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.refresh_product_listings() TO authenticated;

-- Grant execute permission to anon users for initial page load
GRANT EXECUTE ON FUNCTION public.refresh_product_listings() TO anon;