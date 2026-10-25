# VedaPavitra — Pure Vedic Samagri & Bambooless Agarbatti

Official production web application for **VedaPavitra**, an artisan spiritual wellness and Gandhashastra heritage commerce platform. Handcrafting 100% bambooless agarbatti, organic Desi cow dung & ghee havan cups, and pure botanical attar fragrances.

---

## Architecture & Technology Stack

- **Frontend:** React 19 + JSX (Pure JavaScript, Zero TypeScript in app code)
- **Styling:** Custom Handcrafted Vanilla CSS Design System (`src/app/globals.css`)
- **Framework:** Next.js App Router (Turbopack, Server Components & Dynamic Route Handlers)
- **State Architecture:** React Context API (Cart, Customer Wishlist, Notifications)
- **Commerce Database Engine:** File-persisted atomic store (`src/lib/db.js`) with server-side inventory locking and automatic gift thresholds
- **Payments & Gateway:** Razorpay PCI-DSS compliant checkout integration with 256-bit TLS encryption

---

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build
```

---

## Key Modules

- **Storefront PDP & Collections:** Multi-facet fragrance & pack filters, real-time Indian PIN code delivery estimation, and cross-sell bundles.
- **Cart & Rewards Engine:** Live Free Shipping threshold tracker (₹499) and automatic tiered trial gift injector (₹599+).
- **Administrative Operations Suite:** Full-sized management portal for orders fulfillment, Delhivery tracking, inventory stock adjustments, banners & posters customizer, and transaction auditing.

© 2026 VedaPavitra Vedic Wellness LLP. All Rights Reserved.
