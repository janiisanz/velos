// Layout.js: layout global del storefront.
import CartSidebar from './CartSidebar';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#151515]">
      <Header />
      <main>{children}</main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
