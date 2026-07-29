# Veloura E-Commerce Platform

Veloura is a premium, minimalist, and state-of-the-art e-commerce platform inspired by modern Scandinavian clarity and Japanese longevity. It features a curated, high-impact aesthetic utilizing dark mode support, glassmorphism, fluid micro-animations, and instant searches.

 ---

## Tech Stack
- **Frontend**: Next.js (App Router), React 19, Tailwind CSS v4, Redux Toolkit (State Management), Framer Motion (Animations), Lucide-react (Icons), React Hot Toast (Notifications).
- **Backend**: Node.js, Express, MongoDB (Mongoose schemas), JWT (Security & Auth), Stripe & Razorpay SDKs.

---

## Implemented Features & Routing Layouts
The frontend contains 18 comprehensive routing pages and key components:

1. **Homepage (`/`)**: High-impact video-like hero banners, interactive featured collection grids, tabbed trending catalog tabs (New Arrivals, Best Sellers, and Clearance Sale items), customer testimonials, and an Instagram gallery grid.
2. **Category/Collection Page (`/collections/[category]`)**: Dynamic navigation for Men, Women, Kids, and seasonal sales. Integrated with an advanced multi-faceted filter sidebar (brand, colors, size tags, pricing sliders) and sorting select box.
3. **Product Detail Page (`/product/[id]`)**: Minimalist layout featuring:
   - High-fidelity image gallery with magnifying cursor hover-zoom utility.
   - Size tags and interactive color swatch selectors.
   - Embedded video preview support.
   - Dynamic inventory stock alerts.
   - Customer review submission panel with static calculations and rating averages.
4. **Wishlist (`/wishlist`)**: Personal favorite list for authenticated customers. Real-time wishlist icon sync across cards.
5. **Interactive Search Overlay**: Accessible globally inside header options. Facilitates Instant debounced database search and **Web Speech API** recognition for hands-free voice searches.
6. **Detailed Search Page (`/search?q=...`)**: Full search results page inside dynamic Suspense boundaries.
7. **Shopping Bag (`/cart`)**: Detailed subtotal, flat rate sales tax (8%), shipping fee, and active promo coupon code validator.
8. **Checkout Gateway (`/checkout`)**:
   - Guest checkouts with default primary address picker for returned customers.
   - Multiple payment gateways: Stripe checkout redirects, Razorpay frame triggers, and Cash on Delivery (COD) processing.
   - Automatic fallback to mock gateways when API keys are not supplied.
9. **Order Confirmation (`/order-success?id=...`)**: Visual tick banner and estimated arrival dates calculation.
10. **Order History (`/orders`)**: Purchase logs table detailing transaction ID, dates, total payments, paid statuses, and delivery states.
11. **User Profile Settings (`/profile`)**: Address book, default addresses toggling, account details form, and security credentials update.
12. **Sign In (`/login`)** & **Sign Up (`/register`)**: JWT auth flow matching session redirect rules.
13. **Security Recovery (`/forgot-password`)**: Recovery instructions simulator form.
14. **Help Desk (`/faq`)**: Toggle accordion for client shipping, payments, returns, and organic fabrics details.
15. **Philosophy (`/about`)**: Studio history, material metrics (100% GOTS organic cotton), boutique storefront locations (New York, Copenhagen, Tokyo).
16. **Contact (`/contact`)**: Message feedbacks form and direct hotline schedules.
17. **Data Policies (`/privacy`)** & **User Terms (`/terms`)**: Standard e-commerce agreement copies.

---

## Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or Atlas cloud connection string

### 2. Running the application
To launch both the backend Node server and the Next.js frontend local server:

Using the agent helper workflow:
```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm run dev
```

The Web App will run on `http://localhost:3000` with the Backend API running on `http://localhost:5000/api`.

---

## Mock & Sandbox Mode
To support offline environment testing:
- If MongoDB is unreachable, backend api falls back to sandboxed data mocks.
- Payment gateway endpoints automatically fall back to mock checkout sessions when keys are missing, generating successful order outputs with transaction codes.
