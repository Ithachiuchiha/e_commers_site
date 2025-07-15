import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types/product';
import { fetchProducts } from '../lib/api';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAuthenticatedData } from '../hooks/useAuthenticatedData';
import { Loader2, AlertCircle } from 'lucide-react';

const ProductShowcase: React.FC = () => {
  const { data: products, loading, error, refetch } = useAuthenticatedData<Product[]>(
    fetchProducts,
    { requireAuth: false, enabled: true }
  );

  useScrollAnimation('.reveal', 'reveal-visible');

  if (loading) {
    return (
      <section className="section-spacing bg-white">
        <div className="container mx-auto container-padding">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-spacing bg-white">
        <div className="container mx-auto container-padding">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <div className="text-red-600 mb-4 text-lg text-center">{error.message || 'An error occurred while loading products'}</div>
            <button 
              onClick={refetch}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="section-spacing bg-white">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 reveal">
            Our <span className="text-gold">Premium</span> Selection
          </h2>
          <p className="text-gray-600 max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto text-sm sm:text-base reveal">
            Each mango variety is selected from the finest orchards and hand-picked at 
            optimal ripeness to ensure exceptional taste and quality.
          </p>
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;