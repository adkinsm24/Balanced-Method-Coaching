import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function CoachingOffers() {
  useEffect(() => {
    // Check if there's a hash in the URL and scroll to that element
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, []);
  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-secondary mb-8">
            Coaching Offers
          </h1>
        </div>
      </section>
      {/* Coaching Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* One-on-One Coaching */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-8 shadow-lg border border-orange-200">
              <h3 className="text-2xl font-bold text-secondary mb-4 text-center">1-on-1 Nutrition Coaching</h3>
              
              {/* Video Section */}
              <div className="mb-6">
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-md">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/OVbm_NaemiE?controls=1&rel=0&showinfo=0&modestbranding=1"
                    title="1-on-1 Nutrition Coaching Overview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Get completely personalized nutrition coaching based on your individual needs and goals. I take the time to understand your current eating habits and guide you through meaningful changes that stick.
              </p>
              <ul className="text-gray-700 mb-6 space-y-2">
                <li>• Personalized meal planning</li>
                <li>• Weekly check-ins and adjustments</li>
                <li>• Direct access to me</li>
                <li>• Ongoing support and accountability</li>
                <li>• Lifetime access to my Self-Paced Nutrition Course</li>
              </ul>
              <a href="/book-call">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">Book Your Free Introductory Call</Button>
              </a>
            </div>

            {/* Self-Paced Course */}
            <div id="self-paced-course" className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 shadow-lg border border-blue-200">
              <h3 className="text-2xl font-bold text-secondary mb-4 text-center">Self-Paced Nutrition Course</h3>
              
              {/* Video Section */}
              <div className="mb-6">
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-md">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/BxGcECnGUjQ?controls=1&rel=0&showinfo=0&modestbranding=1"
                    title="Self-Paced Nutrition Course Overview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Built on the exact framework used with private clients. Perfect for those who want proven results but prefer independence and convenience in their learning journey.
              </p>
              <ul className="text-gray-700 mb-6 space-y-2">
                <li>• Complete nutrition framework</li>
                <li>• Learn at your own pace</li>
                <li>• Affordable option</li>
                <li>• Proven system that works</li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Get Started
              </Button>
            </div>

            {/* Coaching Calls */}
            <div id="coaching-calls" className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-8 shadow-lg border border-green-200">
              <h3 className="text-2xl font-bold text-secondary mb-4 text-center">Coaching Calls</h3>
              
              {/* Video Section */}
              <div className="mb-6">
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-md">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/FauWJpzmsus?controls=1&rel=0&showinfo=0&modestbranding=1"
                    title="Coaching Calls Overview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Book a personalized call with Coach Mark to get answers to your specific questions about nutrition, food tracking, exercise, or any health-related concerns.
              </p>
              <ul className="text-gray-700 mb-6 space-y-2">
                <li>• Direct access to me</li>
                <li>• Personalized guidance and advice</li>
                <li>• Flexible scheduling options</li>
                <li>• Nutrition and exercise expertise</li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Book a Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}