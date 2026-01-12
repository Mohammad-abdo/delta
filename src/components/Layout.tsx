import { ReactNode } from "react";
import TopHeader from "./TopHeader";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Layout Component
 * 
 * Component wrapper that provides consistent layout structure across all pages.
 * Includes the Navbar at the top and Footer at the bottom.
 * 
 * @param children - The page content to be rendered between Navbar and Footer
 */
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Subtle Pattern Background */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      <TopHeader />
      <Navbar />
      <main className="flex-1 pt-32 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

