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
      {/* Additional Results Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center text-secondary mb-8">Full Testimonials</h2>
          
          {/* Testimonial Description */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Curious what it's like working with me?
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Hear directly from my clients as they answer the following questions:
            </p>
            <div className="text-left max-w-3xl mx-auto bg-white/50 backdrop-blur-sm rounded-lg p-8 shadow-sm">
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold text-secondary mr-3">1.</span>
                  <span>Why did you start working with me?</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-secondary mr-3">2.</span>
                  <span>How has your body, health, and/or mindset changed since working with me?</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-secondary mr-3">3.</span>
                  <span>What results have you achieved that you're most proud of?</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-secondary mr-3">4.</span>
                  <span>How did my coaching differ from other things you've tried before?</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-secondary mr-3">5.</span>
                  <span>What would you say to someone who's on the fence about working with me?</span>
                </li>
              </ol>
            </div>
          </div>
          
          {/* Video Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/videoseries?list=PLAsCiNVA0oC2MqA18wAj7IbRg5_fPmsyc&controls=1&rel=0&showinfo=0&modestbranding=1"
                title="Full Client Testimonials"
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

      {/* Call to Action */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let's get you stronger, more energized, leaner, and more confident through smarter and healthier eating.
          </p>
          <a
            href="/coaching-offers"
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Start Your Transformation
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
