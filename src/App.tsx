import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import LimitedDrop from './components/LimitedDrop';
import Testimonials from './components/Testimonials';
import Story from './components/Story';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import AdminLogin from './components/admin/AdminLogin';
import AdminSignup from './components/admin/AdminSignup';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="bg-cream text-gray-900 overflow-x-hidden">
            <Routes>
              {/* Main Website Routes */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <main>
                    <Hero />
                    <ProductShowcase />
                    <LimitedDrop />
                    <Story />
                    <Testimonials />
                    <Contact />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/checkout" element={
                <>
                  <Navbar />
                  <Checkout />
                  <Footer />
                </>
              } />
              <Route path="/order-confirmation/:orderId" element={
                <>
                  <Navbar />
                  <OrderConfirmation />
                  <Footer />
                </>
              } />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<div>Orders Management</div>} />
                <Route path="products" element={<div>Products Management</div>} />
                <Route path="customers" element={<div>Customers Management</div>} />
                <Route path="settings" element={<div>Settings</div>} />
              </Route>
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;