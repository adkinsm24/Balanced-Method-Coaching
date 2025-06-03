import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import SocialMedia from "@/components/social-media";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollIndicator = document.querySelector('.scroll-arrow');
      if (scrollIndicator) {
        const scrollTop = window.pageYOffset;
        const opacity = Math.max(0, 1 - scrollTop / 300);
        (scrollIndicator as HTMLElement).style.opacity = opacity.toString();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVideoError = () => {
    // Video fallback is handled by CSS background
    console.log('Video failed to load, using background image fallback');
  };

  const handleCTAClick = () => {
    const signupSection = document.getElementById('signup');
    if (signupSection) {
      signupSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollIndicatorClick = () => {
    const signupSection = document.getElementById('signup');
    if (signupSection) {
      signupSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Authentic messaging extracted from Coach Mark's video
  const heroHeadline = "Find a Way of Eating That Actually Fits Your Lifestyle";
  const heroSubheading = "I'm Coach Mark, and I don't rely on cookie-cutter meal plans. I take the time to understand your current eating habits and guide you through small, meaningful changes that build real momentum—changes that actually stick. I'll be with you every step of the way to provide guidance and accountability.";
  const heroCTA = "Are You Ready? Let's Get Started";
  
  // Full authentic transcript from Coach Mark's video
  const videoTranscript = `[00:00:00] Mark: "Hey there, I'm Coach Mark."
[00:00:03] Mark: "If you're looking for a way to improve your health through nutrition, lose body fat, and"
[00:00:07] Mark: "find a way of eating that actually fits your lifestyle, you're at the right place."
[00:00:12] Mark: "I've been passionate about health and fitness since earning my bachelor's degree at Cal"
[00:00:16] Mark: "State University Forton in 2016."
[00:00:20] Mark: "Since then, I've had the privilege to work with hundreds of people, both in group and"
[00:00:24] Mark: "personal training."
[00:00:25] Mark: "I've also continued expanding my knowledge base through advanced education courses and"
[00:00:30] Mark: "by following top leaders in the field."
[00:00:33] Mark: "In 2018, I earned my Level 1 Precision Nutrition certification, which gave me the tools to"
[00:00:38] Mark: "launch my one-on-one nutrition coaching business."
[00:00:42] Mark: "Since then, I've helped nearly 100 clients transform their nutrition, improve their relationship"
[00:00:47] Mark: "with food, and achieve real, lasting results."
[00:00:50] Mark: "What sets my coaching apart is that I don't rely on cookie-cutter meal plans."
[00:00:55] Mark: "I take the time to understand your current eating habits and then guide you through"
[00:00:59] Mark: "small, meaningful changes that build real momentum, changes that actually stick."
[00:01:05] Mark: "And I'll be with you every step of the way to provide you guidance and accountability."
[00:01:09] Mark: "I'm also excited to introduce my brand new Self-Paced Nutrition course."
[00:01:13] Mark: "It's built on the exact framework I use with my private clients and designed for those"
[00:01:17] Mark: "who want results but don't necessarily need the one-on-one support."
[00:01:21] Mark: "Whether it's about affordability, independence, or convenience, this course gives more people"
[00:01:26] Mark: "access to a proven system that works."
[00:01:29] Mark: "My ultimate mission is simple, help as many people as possible find a sustainable way"
[00:01:34] Mark: "of eating that leads to lasting fat loss, better health, without any gimmicks, shortcuts,"
[00:01:41] Mark: "or unnecessary restrictions."
[00:01:43] Mark: "Are you ready?"
[00:01:44] Mark: "Let's get you stronger, more energized, leaner, and more confident through smarter and healthier"
[00:01:51] Mark: "eating."`;

  return (
    <>
      {/* Full-screen video section */}
      <section className="relative w-full" style={{ height: 'calc(100vh + 80px)' }}>
        <video
          ref={videoRef}
          className="hero-background"
          autoPlay
          muted
          loop
          playsInline
          onError={handleVideoError}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover'
          }}
          
        >
          <source src="/coach_mark.mov" type="video/mp4" />
          <div 
            className="hero-background"
            style={{
              background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
            }}
          />
        </video>

        {/* Minimal overlay for better video visibility */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Simple scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div 
            className="scroll-arrow text-4xl text-white opacity-70 bounce-gentle cursor-pointer" 
            aria-hidden="true"
            onClick={handleScrollIndicatorClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleScrollIndicatorClick();
              }
            }}
          >
            ↓
          </div>
        </div>
      </section>
      {/* Content section below video */}
      <section id="hero" className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            id="hero-headline" 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-secondary slide-up"
          >
            {heroHeadline}
          </h1>
          
          <p 
            id="hero-subheading" 
            className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
            style={{ animationDelay: '0.2s' }}
          >
            {heroSubheading}
          </p>
          
          <div style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={handleCTAClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-lg px-8 py-6 h-auto rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg mb-8"
              size="lg"
              aria-label={heroCTA}
            >
              {heroCTA}
            </Button>
          </div>
          
          {/* Social Media Follow */}
          <div className="mt-8" style={{ animationDelay: '0.6s' }}>
            <p className="text-gray-600 mb-4 text-lg">Follow Coach Mark's Journey</p>
            <SocialMedia variant="default" />
          </div>
        </div>
        
        {/* Hidden transcript for SEO/accessibility */}
        <div id="full-transcript" className="sr-only">
          <h2>Video Transcript</h2>
          <pre>{videoTranscript}</pre>
        </div>
      </section>
    </>
  );
}
