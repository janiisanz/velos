// Layout.js: layout global del storefront.
import CartSidebar from './CartSidebar';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main>{children}</main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
