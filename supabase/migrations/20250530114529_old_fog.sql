/*
  # Add RLS Policies for Shipping Rates

  1. Changes
    - Add RLS policies for shipping_rates table
    - Grant necessary permissions
    - Fix related security settings
*/

-- Add RLS policies for shipping_rates
CREATE POLICY "Shipping rates are viewable by everyone"
  ON shipping_rates FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Shipping rates are insertable by authenticated users"
  ON shipping_rates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Shipping rates are updatable by authenticated users"
  ON shipping_rates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT ON shipping_rates TO public;
GRANT SELECT, INSERT, UPDATE ON shipping_rates TO authenticated;

-- Refresh materialized view to ensure it has proper permissions
REFRESH MATERIALIZED VIEW CONCURRENTLY product_listings;