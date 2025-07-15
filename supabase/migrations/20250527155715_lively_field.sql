/*
  # Add Sample Products

  1. Changes
    - Add initial product categories if not exist
    - Add sample products with images
    - Create variants for each product
    - Initialize inventory levels
    - Refresh product listings view
*/

-- Insert Categories if they don't exist
INSERT INTO categories (name, slug, description, is_active)
SELECT 'Premium Mangoes', 'premium-mangoes', 'Our finest selection of premium mangoes', true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'premium-mangoes');

INSERT INTO categories (name, slug, description, is_active)
SELECT 'Organic Mangoes', 'organic-mangoes', 'Naturally grown without pesticides', true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'organic-mangoes');

INSERT INTO categories (name, slug, description, is_active)
SELECT 'Gift Boxes', 'gift-boxes', 'Special mango gift collections', true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'gift-boxes');

-- Insert Products
INSERT INTO products (
  name, 
  slug, 
  description, 
  category_id,
  base_price,
  images,
  features,
  badge,
  is_active
)
SELECT
  p.name,
  p.slug,
  p.description,
  c.id as category_id,
  p.base_price,
  p.images::jsonb,
  p.features,
  p.badge,
  true
FROM (
  VALUES
    (
      'Royal Alphonso',
      'royal-alphonso',
      'The king of mangoes, known for its rich, creamy, saffron-colored flesh and intense sweetness with notes of honey.',
      'premium-mangoes',
      79.99,
      '["https://images.pexels.com/photos/2363347/pexels-photo-2363347.jpeg"]',
      ARRAY['Premium', 'Direct from Maharashtra', 'Limited Season'],
      'Best Seller'
    ),
    (
      'Golden Kesar',
      'golden-kesar',
      'Aromatic and sweet with a deep golden flesh and distinctive flavor profile. Perfect for desserts and smoothies.',
      'premium-mangoes',
      59.99,
      '["https://images.pexels.com/photos/8105063/pexels-photo-8105063.jpeg"]',
      ARRAY['All-Natural', 'Hand-Picked', 'Sweet & Juicy'],
      NULL
    ),
    (
      'Honey Chaunsa',
      'honey-chaunsa',
      'Exceptionally sweet with fragrant, fiber-free flesh. A delicacy with a perfect balance of sweetness and acidity.',
      'organic-mangoes',
      64.99,
      '["https://images.pexels.com/photos/7656553/pexels-photo-7656553.jpeg"]',
      ARRAY['Fragrant', 'Fiber-Free', 'Premium'],
      NULL
    ),
    (
      'Premium Gift Box',
      'premium-gift-box',
      'A curated selection of our finest mangoes, beautifully presented in a signature wooden box.',
      'gift-boxes',
      149.99,
      '["https://images.pexels.com/photos/6157058/pexels-photo-6157058.jpeg"]',
      ARRAY['Handcrafted Box', 'Premium Selection', 'Perfect Gift'],
      'Limited Edition'
    ),
    (
      'Organic Basket',
      'organic-basket',
      'A selection of our best organic mangoes, perfect for health-conscious mango lovers.',
      'organic-mangoes',
      89.99,
      '["https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg"]',
      ARRAY['100% Organic', 'Pesticide-Free', 'Eco-Friendly'],
      'Organic'
    )
) as p(name, slug, description, category_slug, base_price, images, features, badge)
JOIN categories c ON c.slug = p.category_slug
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE slug = p.slug
);

-- Insert Product Variants
INSERT INTO product_variants (
  product_id,
  name,
  sku,
  weight,
  weight_unit,
  is_active
)
SELECT 
  p.id,
  'Standard Pack',
  CONCAT(SUBSTRING(p.id::text, 1, 8), '-STD'),
  1.0,
  'kg',
  true
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM product_variants WHERE product_id = p.id
);

-- Initialize Inventory
INSERT INTO inventory (
  variant_id,
  quantity,
  low_stock_threshold
)
SELECT 
  pv.id,
  100, -- Initial stock of 100 units
  10   -- Low stock alert at 10 units
FROM product_variants pv
WHERE NOT EXISTS (
  SELECT 1 FROM inventory WHERE variant_id = pv.id
);

-- Refresh materialized view
REFRESH MATERIALIZED VIEW product_listings;