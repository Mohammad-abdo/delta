import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VisionMissionSection from "@/components/VisionMissionSection";
import StrategySection from "@/components/StrategySection";
import QualityPolicySection from "@/components/QualityPolicySection";
import CEOMessageSection from "@/components/CEOMessageSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <VisionMissionSection />
      <StrategySection />
      <QualityPolicySection />
      <CEOMessageSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
