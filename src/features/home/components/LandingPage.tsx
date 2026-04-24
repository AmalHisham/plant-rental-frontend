import Navbar from '../../../components/Navbar';
import HeroSection from './HeroSection';
import TrustBar from './TrustBar';
import HowItWorks from './HowItWorks';
import FeaturedPlants from './FeaturedPlants';
import CategoryGrid from './CategoryGrid';
import WhyRentFromUs from './WhyRentFromUs';
import Testimonials from './Testimonials';
import CTABanner from './CTABanner';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustBar />
      <HowItWorks />
      <FeaturedPlants />
      <CategoryGrid />
      <WhyRentFromUs />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
}
