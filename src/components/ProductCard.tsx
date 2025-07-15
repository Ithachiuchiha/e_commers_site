import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity }
    });
    setQuantity(1);
  };

  return (
    <div className="bg-cream rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
      <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <div className="absolute top-3 right-3 bg-gold text-white text-xs px-2 sm:px-3 py-1 rounded-full">
            {product.badge}
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <h3 className="text-lg sm:text-xl font-semibold">{product.name}</h3>
          <span className="text-gold text-base sm:text-lg font-bold">${product.price.toFixed(2)}/kg</span>
        </div>
        
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-grow">{product.description}</p>
        
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {product.features?.map((feature, idx) => (
            <span 
              key={idx}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 sm:py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
          {product.category && (
            <span className="bg-green/10 text-green text-xs px-2 py-0.5 sm:py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-4 py-1 font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          <span className="text-gray-600 text-sm">
            Total: ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
        
        <button 
          className="w-full bg-green text-white py-2 sm:py-2.5 rounded-lg transition-all hover:bg-green-dark text-sm sm:text-base flex items-center justify-center gap-2"
          onClick={handleAddToCart}
        >
          <ShoppingBag size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;