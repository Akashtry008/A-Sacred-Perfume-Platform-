import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Core Layout Components
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import CartDrawer from '@/components/cart/CartDrawer';
import DevotionalRAGChatbot from '@/components/common/DevotionalRAGChatbot';

// Providers
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Primary Eager-Loaded Storefront Pages (Fast First Paint)
import HomePage from '@/app/page';
import CollectionsPage from '@/app/collections/page';
import CollectionDetailPage from '@/app/collections/[slug]/page';
import ProductDetailPage from '@/app/products/[slug]/page';
import CartPage from '@/app/cart/page';
import CheckoutPage from '@/app/checkout/page';
import OrderConfirmationPage from '@/app/checkout/confirmation/[orderNumber]/page';
import NotFoundPage from '@/app/not-found';

// Lazy-Loaded Secondary Pages (Code Splitting)
const SearchPage = lazy(() => import('@/app/search/page'));
const BlogsPage = lazy(() => import('@/app/blogs/page'));
const BlogPostPage = lazy(() => import('@/app/blogs/[slug]/page'));

// Account Pages
const AccountPage = lazy(() => import('@/app/account/page'));
const LoginPage = lazy(() => import('@/app/account/login/page'));
const RegisterPage = lazy(() => import('@/app/account/register/page'));
const OrdersPage = lazy(() => import('@/app/account/orders/page'));
const WishlistPage = lazy(() => import('@/app/account/wishlist/page'));
const ForgotPasswordPage = lazy(() => import('@/app/account/forgot-password/page'));

// Brand & Policies
const AboutUsPage = lazy(() => import('@/app/pages/about-us/page'));
const WholesalePage = lazy(() => import('@/app/pages/wholesale/page'));
const FAQPage = lazy(() => import('@/app/pages/faq/page'));
const ContactPage = lazy(() => import('@/app/pages/contact/page'));
const ShippingPolicyPage = lazy(() => import('@/app/pages/shipping-policy/page'));
const ReturnPolicyPage = lazy(() => import('@/app/pages/return-refund-policy/page'));
const PrivacyPolicyPage = lazy(() => import('@/app/pages/privacy-policy/page'));
const TermsPage = lazy(() => import('@/app/pages/terms-and-conditions/page'));
const TrackOrderPage = lazy(() => import('@/app/pages/track-order/page'));

// Admin Operations Portal (Lazy-loaded to keep customer bundle lightweight)
import AdminLayout from '@/app/admin/layout';
const AdminOverviewPage = lazy(() => import('@/app/admin/page'));
const AdminCustomizerPage = lazy(() => import('@/app/admin/customizer/page'));
const AdminCommunicationsPage = lazy(() => import('@/app/admin/communications/page'));
const AdminProductsPage = lazy(() => import('@/app/admin/products/page'));
const AdminCollectionsPage = lazy(() => import('@/app/admin/collections/page'));
const AdminOrdersPage = lazy(() => import('@/app/admin/orders/page'));
const AdminBannersPage = lazy(() => import('@/app/admin/banners/page'));
const AdminPaymentsPage = lazy(() => import('@/app/admin/payments/page'));
const AdminPromotionsPage = lazy(() => import('@/app/admin/promotions/page'));
const AdminFaqsPage = lazy(() => import('@/app/admin/faqs/page'));
const AdminTestimonialsPage = lazy(() => import('@/app/admin/testimonials/page'));
const AdminUsersPage = lazy(() => import('@/app/admin/users/page'));
const AdminBlogsPage = lazy(() => import('@/app/admin/blogs/page'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SacredLoader() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        gap: '14px',
        color: '#C8822A',
        fontFamily: 'Georgia, serif',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid #EAE3D6',
          borderTopColor: '#C8822A',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: '0.9rem', color: '#78716C', letterSpacing: '0.04em' }}>
        Loading Sacred Experience...
      </span>
    </div>
  );
}

function StorefrontLayout({ children }) {
  const [sections, setSections] = useState(null);

  useEffect(() => {
    fetch('/api/sections')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.sections) {
          setSections(data.sections);
        }
      })
      .catch(() => {});
  }, []);

  const isSectionActive = (key) => {
    if (!sections) return true;
    const sec = sections.find((s) => s.id === key || s.key === key);
    if (!sec) return true;
    return Boolean(sec.isEnabled && !sec.isDeleted);
  };

  return (
    <ErrorBoundary>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main-content">
        <Suspense fallback={<SacredLoader />}>{children}</Suspense>
      </main>
      <SiteFooter />
      {isSectionActive('floating_whatsapp') && <FloatingWhatsApp />}
      <CartDrawer />
      {isSectionActive('devotional_rag_chatbot') && <DevotionalRAGChatbot />}
    </ErrorBoundary>
  );
}

function AdminRouteWrapper({ Component }) {
  return (
    <AdminLayout>
      <Suspense fallback={<SacredLoader />}>
        <Component />
      </Suspense>
    </AdminLayout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            {/* Storefront Routes */}
            <Route path="/" element={<StorefrontLayout><HomePage /></StorefrontLayout>} />
            <Route path="/collections" element={<StorefrontLayout><CollectionsPage /></StorefrontLayout>} />
            <Route path="/collections/:slug" element={<StorefrontLayout><CollectionDetailPage /></StorefrontLayout>} />
            <Route path="/products/:slug" element={<StorefrontLayout><ProductDetailPage /></StorefrontLayout>} />
            <Route path="/cart" element={<StorefrontLayout><CartPage /></StorefrontLayout>} />
            <Route path="/checkout" element={<StorefrontLayout><CheckoutPage /></StorefrontLayout>} />
            <Route path="/checkout/confirmation/:orderNumber" element={<StorefrontLayout><OrderConfirmationPage /></StorefrontLayout>} />
            <Route path="/search" element={<StorefrontLayout><SearchPage /></StorefrontLayout>} />
            <Route path="/blogs" element={<StorefrontLayout><BlogsPage /></StorefrontLayout>} />
            <Route path="/blogs/:slug" element={<StorefrontLayout><BlogPostPage /></StorefrontLayout>} />

            {/* Account Routes */}
            <Route path="/account" element={<StorefrontLayout><AccountPage /></StorefrontLayout>} />
            <Route path="/account/login" element={<StorefrontLayout><LoginPage /></StorefrontLayout>} />
            <Route path="/account/register" element={<StorefrontLayout><RegisterPage /></StorefrontLayout>} />
            <Route path="/account/orders" element={<StorefrontLayout><OrdersPage /></StorefrontLayout>} />
            <Route path="/account/wishlist" element={<StorefrontLayout><WishlistPage /></StorefrontLayout>} />
            <Route path="/account/forgot-password" element={<StorefrontLayout><ForgotPasswordPage /></StorefrontLayout>} />

            {/* Brand & Policies */}
            <Route path="/pages/about-us" element={<StorefrontLayout><AboutUsPage /></StorefrontLayout>} />
            <Route path="/pages/wholesale" element={<StorefrontLayout><WholesalePage /></StorefrontLayout>} />
            <Route path="/pages/faq" element={<StorefrontLayout><FAQPage /></StorefrontLayout>} />
            <Route path="/pages/contact" element={<StorefrontLayout><ContactPage /></StorefrontLayout>} />
            <Route path="/pages/shipping-policy" element={<StorefrontLayout><ShippingPolicyPage /></StorefrontLayout>} />
            <Route path="/pages/return-refund-policy" element={<StorefrontLayout><ReturnPolicyPage /></StorefrontLayout>} />
            <Route path="/pages/privacy-policy" element={<StorefrontLayout><PrivacyPolicyPage /></StorefrontLayout>} />
            <Route path="/pages/terms-and-conditions" element={<StorefrontLayout><TermsPage /></StorefrontLayout>} />
            <Route path="/track-order" element={<StorefrontLayout><TrackOrderPage /></StorefrontLayout>} />
            <Route path="/track" element={<StorefrontLayout><TrackOrderPage /></StorefrontLayout>} />

            {/* Admin Operations Portal */}
            <Route path="/admin" element={<AdminRouteWrapper Component={AdminOverviewPage} />} />
            <Route path="/admin/customizer" element={<AdminRouteWrapper Component={AdminCustomizerPage} />} />
            <Route path="/admin/communications" element={<AdminRouteWrapper Component={AdminCommunicationsPage} />} />
            <Route path="/admin/settings" element={<AdminRouteWrapper Component={AdminCustomizerPage} />} />
            <Route path="/admin/products" element={<AdminRouteWrapper Component={AdminProductsPage} />} />
            <Route path="/admin/collections" element={<AdminRouteWrapper Component={AdminCollectionsPage} />} />
            <Route path="/admin/orders" element={<AdminRouteWrapper Component={AdminOrdersPage} />} />
            <Route path="/admin/banners" element={<AdminRouteWrapper Component={AdminBannersPage} />} />
            <Route path="/admin/blogs" element={<AdminRouteWrapper Component={AdminBlogsPage} />} />
            <Route path="/admin/payments" element={<AdminRouteWrapper Component={AdminPaymentsPage} />} />
            <Route path="/admin/promotions" element={<AdminRouteWrapper Component={AdminPromotionsPage} />} />
            <Route path="/admin/faqs" element={<AdminRouteWrapper Component={AdminFaqsPage} />} />
            <Route path="/admin/testimonials" element={<AdminRouteWrapper Component={AdminTestimonialsPage} />} />
            <Route path="/admin/users" element={<AdminRouteWrapper Component={AdminUsersPage} />} />

            {/* Fallback 404 Route */}
            <Route path="*" element={<StorefrontLayout><NotFoundPage /></StorefrontLayout>} />
          </Routes>
        </CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}
