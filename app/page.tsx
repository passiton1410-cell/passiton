import HeroSection from "@/components/LandingPage/HeroSection";
import ProductCategorySection from "@/components/LandingPage/ProductCategorySection";
import OpportunitySection from "@/components/LandingPage/OpportunitySection";
import HowItWorks from "@/components/LandingPage/HowItWorks";
import Testimonials from "@/components/LandingPage/Testimonials";
import WishlistForm from "@/components/LandingPage/WishlistForm";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf7ed] flex flex-col items-center w-full">
      <HeroSection />
      <ProductCategorySection />
      <OpportunitySection />
      <HowItWorks />
      <Testimonials />
      <WishlistForm />
      <div className="h-10"></div>
      <a
        href="/feedback"
        className="text-sm font-semibold tracking-wide underline underline-offset-4 text-transparent bg-clip-text bg-gradient-to-r from-[#02afa5] via-[#5B3DF6] to-[#755FF5] hover:brightness-125 hover:scale-105 transition-all duration-200 ease-in-out"
      >
        Feedback?
      </a>
      <div className="h-10"></div>
    </div>
  );
}
