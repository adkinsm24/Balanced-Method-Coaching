import HeroSection from "@/components/hero-section";
import SignupSection from "@/components/signup-section";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

import Orangetheory_Fitness_1 from "@assets/Orangetheory-Fitness_1.jpg";

import thumbnail_PSP04110_1030x687_1 from "@assets/thumbnail_PSP04110-1030x687-1.jpg";

import _2 from "@assets/2.png";

export default function Home() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Video Section */}
      <section className="relative w-full h-screen bg-gradient-to-r from-orange-50 to-red-50 overflow-hidden">
        <div className="flex h-full">
          {/* Left side - Text content */}
          <div className="w-1/2 flex items-center justify-center px-8 lg:px-16">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-secondary">
                Improve Your Nutrition
                <span className="block text-primary">With Coach Mark</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-700 leading-relaxed">Discover a sustainable approach to eating that helps you lose body fat and improve your health—without restrictive diets</p>
            </div>
          </div>
          
          {/* Right side - Video */}
          <div className="w-1/2 relative flex items-center justify-center">
            <div className="w-4/5 aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/JR0B_mNGqAw?controls=1&rel=0&showinfo=0&modestbranding=1"
                title="Coach Mark Introduction Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-2xl"
              ></iframe>
            </div>
          </div>
        </div>

      </section>
      <HeroSection />
      {/* Success Stories Section with High-Res Images */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center text-secondary mb-16">
            Real Results from Real People
          </h2>
          
          {/* Video Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/h1V4GeHr-Ek?controls=1&rel=0&showinfo=0&modestbranding=1"
                title="Real Results from Real People"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
