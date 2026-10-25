import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartProvider } from '@/context/CartContext';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import CartDrawer from '@/components/cart/CartDrawer';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';

export const metadata = {
  title: 'VedaPavitra | Pure Vedic Samagri & Bambooless Agarbatti',
  description:
    '100% Charcoal-Free Bambooless Incense Sticks, Organic Desi Cow Ghee Havan Cups, Pure Dhoop Cones and Alcohol-Free Puja Attars.',
  keywords:
    'bambooless incense, organic havan cups, charcoal free dhoop, chandan agarbatti, puja samagri, vedic worship',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>
              <AnnouncementBar />
              <SiteHeader />
              <main>{children}</main>
              <SiteFooter />
              <CartDrawer />
            </CartProvider>
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
