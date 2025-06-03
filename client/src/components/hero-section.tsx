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
  const heroHeadline = "Ditch the Diets. Discover Eating That Finally Works for You.";
  const heroSubheading = "Forget generic meal plans that leave you hungry, frustrated, and back at square one. We'll start by uncovering your real-life habits—no judgment, no fads—so you can make small, powerful tweaks that build unstoppable momentum. With personalized guidance and hands-on accountability, you'll feel energized, confident, and in control—every single day.";
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
      {/* 3 Quadrants Section */}
      <section id="hero" className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-secondary mb-12">Transform Your Health Today</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Quadrant 1 - One-on-One Coaching */}
            <a 
              href="/coaching-offers" 
              className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="h-64 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-6xl mb-4 text-primary">🎯</div>
                  <h3 className="text-2xl font-bold text-secondary mb-2">1-on-1 Nutrition Coaching</h3>
                  <p className="text-gray-700">Personalized guidance, real-time accountability, and expert coaching </p>
                </div>
              </div>
              <div className="p-6 bg-white">
                <p className="text-primary font-semibold group-hover:text-primary/80 transition-colors">
                  Learn More →
                </p>
              </div>
            </a>

            {/* Quadrant 2 - Self-Paced Course */}
            <a 
              href="/coaching-offers" 
              className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-6xl mb-4 text-primary">📚</div>
                  <h3 className="text-2xl font-bold text-secondary mb-2">Self-Paced Nutrition Course</h3>
                  <p className="text-gray-700">My nutrition coaching methodology at your own pace</p>
                </div>
              </div>
              <div className="p-6 bg-white">
                <p className="text-primary font-semibold group-hover:text-primary/80 transition-colors">
                  Get Started →
                </p>
              </div>
            </a>

            {/* Quadrant 3 - Online Training */}
            <a 
              href="/coaching-offers" 
              className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="h-64 bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-6xl mb-4 text-primary">💪</div>
                  <h3 className="text-2xl font-bold text-secondary mb-2">Coaching Calls</h3>
                  <p className="text-gray-700">Book a call with me to answer any questions about nutrition, food tracking, or exercise</p>
                </div>
              </div>
              <div className="p-6 bg-white">
                <p className="text-primary font-semibold group-hover:text-primary/80 transition-colors">
                  View Program →
                </p>
              </div>
            </a>
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
