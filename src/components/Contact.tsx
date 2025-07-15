import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    submitted: false,
    loading: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ ...formState, loading: true });
    
    // Simulate form submission
    setTimeout(() => {
      setFormState({
        name: '',
        email: '',
        message: '',
        submitted: true,
        loading: false
      });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <section id="contact" className="section-spacing bg-gray-50">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Get in <span className="text-gold">Touch</span>
          </h2>
          <p className="text-gray-600 max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto text-sm sm:text-base">
            Have questions about our mangoes or want to place a custom order? 
            We're here to help you experience the finest mangoes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8">
            {formState.submitted ? (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-green-light mb-4 sm:mb-6">
                  <Send className="text-white\" size={20} />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Thank You!</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  Your message has been received. We'll get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setFormState({ ...formState, submitted: false })}
                  className="btn-primary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Send Us a Message</h3>
                
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="name" className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green transition-all text-sm sm:text-base"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="email" className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green transition-all text-sm sm:text-base"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green focus:border-green transition-all text-sm sm:text-base"
                    placeholder="I'd like to know more about your premium mangoes..."
                    rows={4}
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center"
                  disabled={formState.loading}
                >
                  {formState.loading ? (
                    <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  ) : (
                    <Send size={16} className="mr-2" />
                  )}
                  {formState.loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
          
          <div>
            <div className="bg-green text-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Contact Information</h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <Mail className="mr-3 sm:mr-4 text-gold flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Email Us</p>
                    <a href="mailto:info@jayafarms.com" className="text-green-light hover:text-white transition-colors text-sm sm:text-base">
                      info@jayafarms.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="mr-3 sm:mr-4 text-gold flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Call Us</p>
                    <a href="tel:+1234567890" className="text-green-light hover:text-white transition-colors text-sm sm:text-base">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="mr-3 sm:mr-4 text-gold flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Visit Our Orchard</p>
                    <address className="not-italic text-green-light text-sm sm:text-base">
                      123 Mango Grove Lane<br />
                      Tropical Paradise, TP 56789
                    </address>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-cream rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Shipping Information</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                We ship nationwide via overnight express to ensure your mangoes arrive at peak freshness.
              </p>
              <ul className="text-gray-600 space-y-2 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-gold mt-1.5 mr-2 flex-shrink-0"></span>
                  Free shipping on orders over $100
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-gold mt-1.5 mr-2 flex-shrink-0"></span>
                  Express delivery in temperature-controlled packaging
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-gold mt-1.5 mr-2 flex-shrink-0"></span>
                  Guaranteed fresh arrival or your money back
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;