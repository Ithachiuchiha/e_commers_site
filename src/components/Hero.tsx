import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { fetchProducts } from '../lib/api';
import 'swiper/css';
import 'swiper/css/effect-fade';

const Hero: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = React.useState<string[]>([
    "https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg",
    "https://images.pexels.com/photos/2363347/pexels-photo-2363347.jpeg",
    "https://images.pexels.com/photos/8105063/pexels-photo-8105063.jpeg"
  ]);
  
  useEffect(() => {
    const loadImages = async () => {
      try {
        const products = await fetchProducts();
        const productImages = products
          .filter(product => Array.isArray(product.images) && product.images.length > 0)
          .map(product => product.images[0])
          .slice(0, 3);
        
        if (productImages.length > 0) {
          setImages(productImages);
        }
      } catch (error) {
        console.error('Error loading hero images:', error instanceof Error ? error.message : error);
      }
    };

    loadImages();
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && textRef.current) {
        const factor = window.innerWidth < 768 ? 0.05 : 0.1;
        textRef.current.style.transform = `translateY(${window.scrollY * factor}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-element');
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream to-cream-dark"></div>
      
      <div className="container mx-auto px-4 z-10 py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-8 sm:mb-12 lg:mb-0 px-0 sm:px-4" ref={textRef}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 opacity-0 transition-opacity duration-1000 fade-in-element">
              <span className="text-green">Premium</span> <br />
              <span className="text-gold">Mangoes</span> <br />
              <span className="text-gray-900">Redefined</span>
            </h1>
            
            <p className="text-gray-700 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-xl opacity-0 delay-300 transition-opacity duration-1000 fade-in-element">
              Experience the world's finest mangoes, delivered directly from our orchards to your doorstep. Handpicked at peak ripeness for unparalleled sweetness and flavor.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 opacity-0 delay-500 transition-opacity duration-1000 fade-in-element">
              <button className="btn-primary">
                Explore Collection
              </button>
              <button className="btn-secondary">
                Our Story
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative flex justify-center px-4 sm:px-8">
            <div className="relative w-full aspect-square max-w-md">
              <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={true}
                slidesPerView={1}
                className="w-full h-full rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl opacity-0 transition-opacity duration-1000 fade-in-element"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={image} 
                      alt={`Premium Mango ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              
              <div className="absolute -top-8 sm:-top-12 -right-8 sm:-right-12 w-16 sm:w-24 h-16 sm:h-24 bg-gold rounded-full opacity-60 blur-xl"></div>
              <div className="absolute -bottom-6 sm:-bottom-8 -left-6 sm:-left-8 w-24 sm:w-32 h-24 sm:h-32 bg-green rounded-full opacity-50 blur-xl"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0 delay-700 transition-opacity duration-1000 fade-in-element hidden xs:flex">
          <p className="text-gray-600 mb-2 text-xs sm:text-sm">Scroll to discover</p>
          <ChevronDown className="text-gold animate-bounce" size={20} />
        </div>
      </div>
    </section>
  );
};

export default Hero;