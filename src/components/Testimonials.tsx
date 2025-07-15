import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '../data/testimonials';

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const changeTestimonial = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (direction === 'next') {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    } else {
      setActiveIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [isAnimating]);

  const nextTestimonial = useCallback(() => changeTestimonial('next'), [changeTestimonial]);
  const prevTestimonial = useCallback(() => changeTestimonial('prev'), [changeTestimonial]);

  // Handle touch events for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left -> next
      nextTestimonial();
    }
    
    if (touchStart - touchEnd < -50) {
      // Swipe right -> previous
      prevTestimonial();
    }
  };

  // Auto rotate testimonials - slower on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, window.innerWidth < 768 ? 8000 : 6000);
    
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.testimonial-animate');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="reviews" className="section-spacing bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-gold opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-green opacity-10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto container-padding relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 opacity-0 translate-y-8 transition-all duration-700 testimonial-animate">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            What Our <span className="text-gold">Customers</span> Say
          </h2>
          <p className="text-gray-600 max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto text-sm sm:text-base">
            Don't just take our word for it. Here's what mango enthusiasts have to say about 
            our premium selections.
          </p>
        </div>

        <div 
          className="relative max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl mx-auto opacity-0 translate-y-8 transition-all duration-700 delay-300 testimonial-animate"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="overflow-hidden">
            <div 
              className={`transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            >
              <div className="bg-cream rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm">
                <div className="flex mb-4 sm:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < testimonials[activeIndex].rating ? "fill-gold text-gold" : "text-gray-300"} 
                    />
                  ))}
                </div>
                
                <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 mb-6 sm:mb-8 relative">
                  <span className="absolute -top-4 sm:-top-6 -left-1 sm:-left-2 text-4xl sm:text-6xl text-gold opacity-20">"</span>
                  {testimonials[activeIndex].quote}
                  <span className="absolute -bottom-4 sm:-bottom-6 -right-1 sm:-right-2 text-4xl sm:text-6xl text-gold opacity-20">"</span>
                </blockquote>
                
                <div className="flex items-center">
                  <img 
                    src={testimonials[activeIndex].avatar} 
                    alt={testimonials[activeIndex].name} 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">{testimonials[activeIndex].name}</p>
                    <p className="text-gray-500 text-xs sm:text-sm">{testimonials[activeIndex].location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-6 sm:mt-8 gap-3 sm:gap-4">
            <button 
              onClick={prevTestimonial}
              className="p-1.5 sm:p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gold hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex 
                      ? 'bg-gold w-3 sm:w-4' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-1.5 sm:p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gold hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;