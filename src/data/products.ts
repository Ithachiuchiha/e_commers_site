export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  badge?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Royal Alphonso",
    description: "The king of mangoes, known for its rich, creamy, saffron-colored flesh and intense sweetness with notes of honey.",
    price: 79.99,
    image: "https://images.pexels.com/photos/2363347/pexels-photo-2363347.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Premium", "Direct from Maharashtra", "Limited Season"],
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Golden Kesar",
    description: "Aromatic and sweet with a deep golden flesh and distinctive flavor profile. Perfect for desserts and smoothies.",
    price: 59.99,
    image: "https://images.pexels.com/photos/8105063/pexels-photo-8105063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["All-Natural", "Hand-Picked", "Sweet & Juicy"]
  },
  {
    id: 3,
    name: "Honey Chaunsa",
    description: "Exceptionally sweet with fragrant, fiber-free flesh. A delicacy with a perfect balance of sweetness and acidity.",
    price: 64.99,
    image: "https://images.pexels.com/photos/7656553/pexels-photo-7656553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Fragrant", "Fiber-Free", "Premium"]
  },
  {
    id: 4,
    name: "Badami Select",
    description: "Medium-sized fruits with thin, yellowish-red skin and sweet, fiber-free pulp. A true connoisseur's choice.",
    price: 49.99,
    image: "https://images.pexels.com/photos/6157058/pexels-photo-6157058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Fiber-Free", "Aromatic", "Dessert Quality"],
    badge: "New Arrival"
  },
  {
    id: 5,
    name: "Majestic Langra",
    description: "Distinctive aroma with a taste that combines sweetness with a subtle tanginess. Green skin with pale yellow flesh.",
    price: 54.99,
    image: "https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Aromatic", "Distinctive", "Premium Quality"]
  },
  {
    id: 6,
    name: "Mallika Fusion",
    description: "A hybrid variety with rich, sweet flesh and a complex flavor profile that combines the best of Neelam and Dasheri.",
    price: 69.99,
    image: "https://images.pexels.com/photos/7531556/pexels-photo-7531556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: ["Hybrid", "Complex Flavor", "Fiber-Free"],
    badge: "Limited Stock"
  }
];