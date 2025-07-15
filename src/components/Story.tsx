import React, { useEffect } from 'react';
import { Leaf, Crop as Drop, Sun } from 'lucide-react';

const Story: React.FC = () => {
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

    const elements = document.querySelectorAll('.story-animate');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="story" className="section-spacing bg-cream">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 opacity-0 translate-y-8 transition-all duration-700 story-animate">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Our <span className="text-green">Cultivation</span> Story
          </h2>
          <p className="text-gray-600 max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto text-sm sm:text-base">
            From orchard to table, we maintain the highest standards at every step to ensure you 
            experience the perfect mango.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 lg:mb-16">
          {[
            {
              icon: <Sun className="text-gold\" size={28} />,
              title: "Perfect Climate",
              description: "Our orchards are situated in regions with the ideal balance of sunshine, rainfall, and soil quality for growing the world's finest mangoes."
            },
            {
              icon: <Leaf className="text-green" size={28} />,
              title: "Sustainable Farming",
              description: "We use traditional and sustainable farming practices that have been perfected over generations, ensuring minimal environmental impact."
            },
            {
              icon: <Drop className="text-blue-500\" size={28} />,
              title: "Handpicked & Selected",
              description: "Each mango is handpicked at peak ripeness and carefully inspected to ensure only the finest fruits make it to your doorstep."
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-sm opacity-0 translate-y-8 transition-all duration-700 story-animate"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="mb-4 sm:mb-6">{item.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="opacity-0 translate-y-8 transition-all duration-700 delay-300 story-animate order-2 lg:order-1">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">From Our Orchards <br />To Your Table</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Our farm-to-table approach ensures that you receive mangoes at their absolute peak flavor. 
              Unlike store-bought mangoes that are picked early and ripened artificially, our mangoes 
              develop their full flavor profile naturally on the tree.
            </p>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Within 24 hours of harvesting, our mangoes are carefully packaged and shipped directly to you 
              in temperature-controlled containers, preserving their perfect ripeness and exceptional flavor.
            </p>
            <button className="btn-secondary">
              Learn More About Our Process
            </button>
          </div>
          
          <div className="relative opacity-0 translate-y-8 transition-all duration-700 delay-500 story-animate order-1 lg:order-2">
            <img 
              src="https://images.pexels.com/photos/5945799/pexels-photo-5945799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Mango farming" 
              className="w-full h-auto rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl"
              loading="lazy"
            />
            <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 w-8 sm:w-12 h-8 sm:h-12 bg-gold rounded-full"></div>
            <div className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 w-8 sm:w-12 h-8 sm:h-12 bg-green rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;