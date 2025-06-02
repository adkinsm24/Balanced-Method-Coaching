import Footer from "@/components/footer";

export default function OnlineTraining() {
  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-slate-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-secondary mb-8">
            Online Training Program
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Take your fitness journey to the next level with Coach Mark's comprehensive online training program. Get personalized workouts, nutrition guidance, and ongoing support from anywhere in the world.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-secondary mb-8 text-center">
            Discover the Program
          </h2>
          
          <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg mb-8">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/OVbm_NaemiE"
              title="Coach Mark Online Training Program"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0"
            ></iframe>
          </div>
          
          <p className="text-center text-gray-600 italic">
            Watch Coach Mark explain how the online training program can help you achieve your fitness goals
          </p>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-16 bg-gradient-to-tr from-slate-50 via-blue-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-secondary mb-12 text-center">
            What's Included
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Personalized Workouts</h3>
              <p className="text-gray-600">
                Custom training plans designed specifically for your fitness level, goals, and available equipment. No cookie-cutter routines.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Nutrition Guidance</h3>
              <p className="text-gray-600">
                Learn sustainable eating habits that fit your lifestyle. Small, meaningful changes that build real momentum.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Weekly Check-ins</h3>
              <p className="text-gray-600">
                Regular progress reviews and plan adjustments to ensure you stay on track and continue making progress.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Video Demonstrations</h3>
              <p className="text-gray-600">
                Clear exercise demonstrations and form corrections to ensure safe and effective training.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">24/7 Support</h3>
              <p className="text-gray-600">
                Direct access to Coach Mark for questions, motivation, and guidance throughout your journey.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Progress Tracking</h3>
              <p className="text-gray-600">
                Tools and methods to monitor your progress and celebrate your achievements along the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-secondary mb-12 text-center">
            Success Stories
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-700 mb-4 italic">
                "Coach Mark's online program gave me the flexibility I needed. The personalized approach made all the difference - I finally found a way of eating and training that fits my busy lifestyle."
              </p>
              <p className="font-semibold text-secondary">- Client Success Story</p>
            </div>
            
            <div className="bg-gradient-to-bl from-slate-50 to-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-gray-700 mb-4 italic">
                "The weekly check-ins and constant support kept me accountable. After years of trying different programs, this is the first one that actually stuck and delivered lasting results."
              </p>
              <p className="font-semibold text-secondary">- Program Graduate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Life?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the online training program and get the personalized support you need to achieve lasting results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Started Today
            </a>
            <a
              href="/about"
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-secondary font-medium text-lg px-8 py-4 rounded-lg transition-all duration-300"
            >
              Learn More About Coach Mark
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}