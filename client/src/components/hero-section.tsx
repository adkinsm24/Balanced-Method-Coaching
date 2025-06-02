import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

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
    <section 
      id="hero" 
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        className="hero-background"
        autoPlay
        muted
        loop
        playsInline
        onError={handleVideoError}
        poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080"
      >
        <source src="/coach_mark.mov" type="video/mp4" />
        <div 
          className="hero-background"
          style={{
            background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
          }}
        />
      </video>

      {/* Semi-transparent overlay */}
      <div className="hero-overlay" />

      {/* Centered content container */}
      <div className="hero-content text-center text-white px-4 max-w-4xl mx-auto fade-in">
        <h1 
          id="hero-headline" 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight slide-up"
        >
          {heroHeadline}
        </h1>
        
        <p 
          id="hero-subheading" 
          className="text-lg md:text-xl lg:text-2xl font-light mb-8 max-w-3xl mx-auto leading-relaxed opacity-90"
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
        
        {/* Scroll indicator */}
        <div 
          className="scroll-arrow text-4xl opacity-70 bounce-gentle cursor-pointer mt-8" 
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
      
      {/* Hidden transcript for SEO/accessibility */}
      <div id="full-transcript" className="sr-only">
        <h2>Video Transcript</h2>
        <pre>{videoTranscript}</pre>
      </div>
    </section>
  );
}
