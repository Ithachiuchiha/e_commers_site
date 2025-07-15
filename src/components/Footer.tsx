import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="container mx-auto container-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 sm:mb-12">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              JAYA<span className="text-gold">FARMS</span>
            </h3>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Experience the world's finest mangoes, delivered directly 
              from our orchards to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {['Products', 'Our Story', 'Limited Drops', 'Reviews', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-gray-400 hover:text-gold transition-colors text-sm sm:text-base"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Information</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {['Shipping & Delivery', 'Returns Policy', 'Privacy Policy', 'Terms & Conditions', 'FAQs'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-gold transition-colors text-sm sm:text-base"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
              Subscribe to our newsletter for seasonal updates and exclusive offers.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-800 text-white p-2 sm:p-3 rounded-l-lg w-full focus:outline-none focus:ring-1 focus:ring-gold text-sm sm:text-base"
                aria-label="Email for newsletter"
              />
              <button 
                className="bg-gold hover:bg-gold-light text-white p-2 sm:p-3 rounded-r-lg transition-colors text-sm sm:text-base"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-500 text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} Jaya Farms. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;