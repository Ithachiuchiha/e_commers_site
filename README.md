# Jaya Farms E-commerce Website

A premium mango e-commerce platform built with modern web technologies, featuring a beautiful UI, robust authentication, cart management, and admin dashboard.

## 🌟 Overview

Jaya Farms is a full-stack e-commerce application specializing in premium mangoes. The platform offers a seamless shopping experience with features like user authentication, shopping cart persistence, order management, and an admin dashboard for business operations.

## 🛠 Tech Stack

### **Frontend Framework & Core**
- **React** `18.3.1` - Modern UI library with hooks and context
- **TypeScript** `5.5.3` - Type-safe JavaScript development
- **Vite** `5.1.4` - Fast build tool and development server

### **Styling & UI**
- **Tailwind CSS** `3.4.1` - Utility-first CSS framework
- **PostCSS** `8.4.35` - CSS processing tool
- **Autoprefixer** `10.4.18` - CSS vendor prefixing
- **Lucide React** `0.344.0` - Beautiful icon library
- **Swiper** `11.0.7` - Touch slider component

### **Routing & Navigation**
- **React Router DOM** `6.22.3` - Client-side routing

### **Backend & Database**
- **Supabase** `2.39.7` - Backend-as-a-Service platform
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication system
  - Row Level Security (RLS)
- **Supabase Auth Helpers** `0.9.0` - Authentication utilities
- **Supabase SSR** `0.1.0` - Server-side rendering support

### **State Management**
- **React Context API** - Global state management
- **React Hooks** - Local state and side effects

### **Form Validation & Data**
- **Zod** `3.22.4` - TypeScript-first schema validation
- **Date-fns** `3.3.1` - Date utility library

### **Development Tools**
- **ESLint** `9.9.1` - Code linting and quality
- **TypeScript ESLint** - TypeScript-specific linting rules
- **React Hooks ESLint Plugin** - React hooks linting
- **React Refresh ESLint Plugin** - Fast refresh support

### **Build & Deployment**
- **Vite Plugin React** `4.2.1` - React support for Vite
- **Node Types** `20.11.24` - Node.js type definitions

### **Additional Libraries**
- **Sass** `1.3.0` - CSS preprocessor
- **OpenTelemetry API** `1.1.0` - Observability framework

## 📁 Project Structure

```
jaya-farms/
├── public/                     # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── admin/            # Admin dashboard components
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminSignup.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── AuthModal.tsx     # Authentication modal
│   │   ├── Cart.tsx          # Shopping cart component
│   │   ├── Checkout.tsx      # Checkout process
│   │   ├── Contact.tsx       # Contact form
│   │   ├── Footer.tsx        # Site footer
│   │   ├── Hero.tsx          # Hero section
│   │   ├── LimitedDrop.tsx   # Limited edition products
│   │   ├── Navbar.tsx        # Navigation header
│   │   ├── OrderConfirmation.tsx # Order success page
│   │   ├── ProductCard.tsx   # Individual product display
│   │   ├── ProductShowcase.tsx # Products grid
│   │   ├── Story.tsx         # Company story section
│   │   └── Testimonials.tsx  # Customer reviews
│   ├── context/              # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state
│   │   └── CartContext.tsx   # Shopping cart state
│   ├── data/                 # Static data and types
│   │   ├── products.ts       # Product data structure
│   │   └── testimonials.ts   # Customer testimonials
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuthenticatedData.ts # Data fetching with auth
│   │   └── useScrollAnimation.ts   # Scroll-based animations
│   ├── lib/                  # Utility functions
│   │   ├── api.ts           # API functions
│   │   ├── orders.ts        # Order management
│   │   └── supabase.ts      # Supabase client configuration
│   ├── types/               # TypeScript type definitions
│   │   ├── cart.ts          # Cart-related types
│   │   ├── database.ts      # Database schema types
│   │   ├── order.ts         # Order-related types
│   │   └── product.ts       # Product-related types
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles and Tailwind imports
│   └── vite-env.d.ts        # Vite environment types
├── supabase/
│   └── migrations/          # Database migration files
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json       # App-specific TypeScript config
├── tsconfig.node.json      # Node-specific TypeScript config
└── vite.config.ts          # Vite configuration
```

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase account** (for backend services)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jaya-farms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the migrations in order (they're already provided in `supabase/migrations/`):
   - Database schema setup
   - Product categories and sample data
   - User authentication and profiles
   - Order management system
   - Admin role support
   - Session management for cart persistence

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🗄️ Database Schema

### **Core Tables**

- **`categories`** - Product categories with hierarchical support
- **`products`** - Product catalog with metadata and SEO
- **`product_variants`** - Size/weight variants for products
- **`inventory`** - Real-time stock management
- **`customers`** - User profiles with role-based access
- **`orders`** - Order management with status tracking
- **`order_items`** - Individual items within orders
- **`reviews`** - Product reviews and ratings
- **`user_sessions`** - Cart persistence across sessions
- **`shipping_zones`** - Geographic shipping areas
- **`shipping_rates`** - Shipping costs by zone and weight

### **Key Features**

- **Row Level Security (RLS)** for data protection
- **Materialized views** for optimized product queries
- **Triggers** for automatic data updates
- **Indexes** for performance optimization
- **Constraints** for data integrity

## 🎨 Design System

### **Color Palette**
```javascript
colors: {
  gold: '#E6A817',        // Primary accent
  'gold-light': '#F5CB6A', // Light accent
  'gold-dark': '#B78412',  // Dark accent
  green: '#1C6E43',       // Primary brand
  'green-light': '#4D936E', // Light brand
  'green-dark': '#0F4E2C',  // Dark brand
  cream: '#FFF8E7',       // Background
  'cream-dark': '#F5EDD6'  // Alt background
}
```

### **Typography**
- **Primary Font**: Inter (system fallback)
- **Headings**: Bold, tracking-tight
- **Body**: Regular, leading-relaxed

### **Responsive Breakpoints**
```javascript
screens: {
  'xs': '480px',   // Extra small devices
  'sm': '640px',   // Small devices
  'md': '768px',   // Medium devices
  'lg': '1024px',  // Large devices
  'xl': '1280px'   // Extra large devices
}
```

## 🔐 Authentication & Authorization

### **Authentication Flow**
1. **Email/Password** authentication via Supabase Auth
2. **Session management** with automatic refresh
3. **Profile creation** in customers table
4. **Role-based access** (customer/admin)

### **Session Strategy**
- **Fresh sessions** on page refresh (prevents corruption)
- **Cart persistence** in backend before session clearing
- **Automatic restoration** after login
- **Clean logout** with proper data backup

### **Security Features**
- Row Level Security (RLS) policies
- JWT token validation
- Role-based route protection
- Secure admin operations

## 🛒 E-commerce Features

### **Shopping Cart**
- **Persistent storage** in localStorage and backend
- **Real-time updates** with quantity management
- **Cross-session continuity** via user_sessions table
- **Automatic cleanup** on logout

### **Order Management**
- **Multi-step checkout** process
- **Address management** with validation
- **Payment integration** ready (Cash on Delivery implemented)
- **Order tracking** and status updates
- **Email notifications** (configurable)

### **Product Catalog**
- **Dynamic product loading** from database
- **Image galleries** with lazy loading
- **Variant support** (sizes, weights)
- **Inventory tracking** with low-stock alerts
- **Search and filtering** capabilities

### **Admin Dashboard**
- **Order management** interface
- **Customer management** tools
- **Product catalog** administration
- **Inventory monitoring** dashboard
- **Analytics and reporting** (extensible)

## 🎭 UI/UX Features

### **Animations & Interactions**
- **Scroll-triggered animations** using Intersection Observer
- **Parallax effects** for hero sections
- **Smooth transitions** throughout the interface
- **Loading states** for better user feedback
- **Micro-interactions** for enhanced engagement

### **Responsive Design**
- **Mobile-first** approach
- **Touch-friendly** interface elements
- **Optimized layouts** for all screen sizes
- **Progressive enhancement** for better performance

### **Accessibility**
- **Semantic HTML** structure
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Color contrast** compliance
- **Focus management** for modals and forms

## 📱 Performance Optimizations

### **Frontend Optimizations**
- **Code splitting** with dynamic imports
- **Image lazy loading** for better performance
- **Optimized bundle size** with tree shaking
- **Caching strategies** for static assets

### **Database Optimizations**
- **Materialized views** for complex queries
- **Strategic indexes** for fast lookups
- **Connection pooling** via Supabase
- **Query optimization** with proper joins

## 🚀 Deployment

### **Build Process**
```bash
npm run build    # Create production build
npm run preview  # Preview production build locally
```

### **Environment Setup**
- Configure environment variables for production
- Set up Supabase project with proper RLS policies
- Configure domain and SSL certificates
- Set up monitoring and analytics

### **Deployment Platforms**
- **Netlify** (recommended for static hosting)
- **Vercel** (alternative with edge functions)
- **AWS S3 + CloudFront** (enterprise solution)

## 🧪 Development Workflow

### **Available Scripts**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### **Code Quality**
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting (configurable)
- **Husky** for git hooks (optional)

### **Testing Strategy**
- **Unit tests** for utility functions
- **Component tests** for UI components
- **Integration tests** for user flows
- **E2E tests** for critical paths

## 🔧 Configuration Files

### **Key Configuration**
- **`vite.config.ts`** - Build tool configuration
- **`tailwind.config.js`** - Styling system setup
- **`tsconfig.json`** - TypeScript compiler options
- **`eslint.config.js`** - Code quality rules
- **`postcss.config.js`** - CSS processing setup

## 🐛 Troubleshooting

### **Common Issues**

1. **Supabase Connection Errors**
   - Verify environment variables
   - Check Supabase project status
   - Validate API keys and URLs

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify import paths

3. **Authentication Issues**
   - Check RLS policies in Supabase
   - Verify user roles and permissions
   - Clear browser storage if needed

### **Development Tips**
- Use browser dev tools for debugging
- Check Supabase logs for backend issues
- Monitor network requests for API problems
- Use React Developer Tools for component debugging

## 📚 Additional Resources

### **Documentation Links**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### **Learning Resources**
- React patterns and best practices
- TypeScript advanced features
- Supabase authentication flows
- E-commerce development patterns
- Performance optimization techniques

## 🤝 Contributing

### **Development Guidelines**
1. Follow TypeScript best practices
2. Use semantic commit messages
3. Write comprehensive tests
4. Update documentation for new features
5. Follow the established code style

### **Pull Request Process**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with detailed description

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Pexels** for high-quality stock images
- **Lucide** for beautiful icons
- **Tailwind CSS** for the utility-first approach
- **Supabase** for the excellent backend platform
- **React community** for continuous innovation

---

**Built with ❤️ for premium mango enthusiasts worldwide**