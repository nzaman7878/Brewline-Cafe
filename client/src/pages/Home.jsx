import { SEO } from '../components/home/SEO';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedItems } from '../components/home/FeaturedItems';
import { HowItWorks } from '../components/home/HowItWorks';
import { Testimonials } from '../components/home/Testimonials';
import { LocationHours } from '../components/home/LocationHours';

export const Home = () => {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Brewline Cafe",
    "image": `${window.location.origin}/images/hero-bg.png`,
    "description": "Premium artisan coffee and fresh pastries. Order ahead and skip the line.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Artisan Ave",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    "servesCuisine": "Coffee Shop",
    "priceRange": "$$",
    "telephone": "+15551234567",
    "url": window.location.origin,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "06:30",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "menu": `${window.location.origin}/menu`,
    "acceptsReservations": "False"
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEO schema={restaurantSchema} />
      
      <HeroSection />
      <FeaturedItems />
      <HowItWorks />
      <Testimonials />
      <LocationHours />
      
      {/* Small Footer just for home if needed, or let global layout handle it */}
      <footer className="py-8 text-center text-on-surface-variant text-sm border-t border-outline bg-background">
        <p>© {new Date().getFullYear()} Brewline Cafe. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
