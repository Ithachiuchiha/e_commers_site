import React, { useState, useEffect } from 'react';
import { Timer, Package } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { fetchProducts } from '../lib/api';
import 'swiper/css';
import 'swiper/css/effect-fade';

const LimitedDrop: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [images, setImages] = useState<string[]>([
    "https://images.pexels.com/photos/2363345/pexels-photo-2363345.jpeg",
    "https://images.pexels.com/photos/8105063/pexels-photo-8105063.jpeg",
    "https://images.pexels.com/photos/7531556/pexels-photo-7531556.jpeg"
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
        console.error('Error loading limited drop images:', error);
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(interval);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

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

    const elements = document.querySelectorAll('.limited-drop-animate');
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white text-gray-900 rounded-lg h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold shadow-md">
        {value < 10 ? `0${value}` : value}
      </div>
      <span className="text-white text-xs mt-1 sm:mt-2">{label}</span>
    </div>
  );

  return (
    <section id="limited-drops" className="section-spacing bg-green text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gold opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gold opacity-10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto container-padding relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 sm:gap-12 lg:gap-24">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="opacity-0 translate-y-8 transition-all duration-700 limited-drop-animate">
                <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
                  <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    loop={true}
                    slidesPerView={1}
                    className="w-full h-full"
                  >
                    {images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img 
                          src={image} 
                          alt={`Limited Edition Mango ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                
                <div className="absolute -bottom-3 sm:-bottom-4 -right-3 sm:-right-4 bg-gold text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg transform rotate-3 sm:rotate-6 z-20">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Package size={16} className="hidden xs:block" />
                    <span className="font-semibold text-sm sm:text-base">Limited Edition</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="opacity-0 translate-y-8 transition-all duration-700 delay-300 limited-drop-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Honey Gold <br />
                <span className="text-gold">Limited Drop</span>
              </h2>
              
              <p className="text-green-light text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-lg">
                Our rarest mango variety, harvested only once a year. Each mango is carefully selected, 
                hand-wrapped, and delivered in our signature wooden box. Only 100 boxes available.
              </p>
              
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 text-gold mb-3 sm:mb-4">
                  <Timer size={18} className="hidden xs:block" />
                  <span className="font-medium text-sm sm:text-base">Limited Time Remaining</span>
                </div>
                
                <div className="flex gap-2 sm:gap-4">
                  <CountdownUnit value={timeLeft.days} label="Days" />
                  <CountdownUnit value={timeLeft.hours} label="Hours" />
                  <CountdownUnit value={timeLeft.minutes} label="Mins" />
                  <CountdownUnit value={timeLeft.seconds} label="Secs" />
                </div>
              </div>
              
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button className="bg-gold hover:bg-gold-light text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base">
                  Reserve Now
                </button>
                <button className="border border-white text-white hover:bg-white hover:text-green px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LimitedDrop;