import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function CoachingOffers() {
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
              <h3 className="text-2xl font-bold text-secondary mb-4">One-on-One Nutrition Coaching</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Get completely personalized nutrition coaching based on your individual needs and goals. I take the time to understand your current eating habits and guide you through meaningful changes that stick.
              </p>
              <ul className="text-gray-700 mb-6 space-y-2">
                <li>• Personalized meal planning</li>
                <li>• Weekly check-ins and adjustments</li>
                <li>• Direct access to Coach Mark</li>
                <li>• Ongoing support and accountability</li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Learn More
              </Button>
            </div>

            {/* Self-Paced Course */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 shadow-lg border border-blue-200">
              <h3 className="text-2xl font-bold text-secondary mb-4">Self-Paced Nutrition Course</h3>
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

            {/* Online Training Program */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-8 shadow-lg border border-green-200">
              <h3 className="text-2xl font-bold text-secondary mb-4">Online Training Program</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Comprehensive fitness and nutrition program combining personalized workouts with nutrition guidance. Get the complete package for total body transformation.
              </p>
              <ul className="text-gray-700 mb-6 space-y-2">
                <li>• Custom workout plans</li>
                <li>• Nutrition guidance included</li>
                <li>• Progress tracking</li>
                <li>• Complete lifestyle approach</li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                View Program
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-secondary mb-6">Ready to Start Your Transformation?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Choose the coaching option that best fits your needs and take the first step toward lasting results.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-4">
            Schedule a Consultation
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}