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

  // Placeholder content - to be replaced with actual transcript data
  const heroHeadline = "Transform Your Life With a Personalized Weight-Loss Program";
  const heroSubheading = "I'm Coach Mark, and I've helped thousands achieve lasting weight loss through customized programs that fit your lifestyle. No cookie-cutter solutions—just proven strategies tailored specifically for you.";
  const heroCTA = "Start Your Transformation Today";
  
  // Placeholder transcript - to be replaced with actual video transcript
  const videoTranscript = `[Placeholder for Coach Mark's video transcript]
[00:00:03] Mark: "Welcome, I'm Coach Mark. In this customized weight-loss program..."
[Note: This will be replaced with actual transcript from fb120053-91e4-4395-b879-20f12cdf3406.mov]`;

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
        {/* Note: Video source will be set to fb120053-91e4-4395-b879-20f12cdf3406.mov once available */}
        <source src="#" type="video/mp4" />
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
