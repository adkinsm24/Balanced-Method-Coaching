import HeroSection from "@/components/hero-section";
import SignupSection from "@/components/signup-section";
import Footer from "@/components/footer";

import Orangetheory_Fitness_1 from "@assets/Orangetheory-Fitness_1.jpg";

import thumbnail_PSP04110_1030x687_1 from "@assets/thumbnail_PSP04110-1030x687-1.jpg";

import _2 from "@assets/2.png";

export default function Home() {
  return (
    <main className="min-h-screen pt-20">
      {/* YouTube Video Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-secondary mb-8">
            Meet Coach Mark
          </h2>
          
          <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg mb-6">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/JR0B_mNGqAw"
              title="Coach Mark Introduction Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0"
            ></iframe>
          </div>
          
          <p className="text-center text-gray-600 italic">
            Watch Coach Mark share his approach to fitness and nutrition coaching
          </p>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img 
                src={Orangetheory_Fitness_1}
                alt="Person exercising with weights in modern gym"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Strength Training</h3>
                <p className="text-gray-600">Build lean muscle and boost metabolism with personalized strength programs.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img 
                src={thumbnail_PSP04110_1030x687_1}
                alt="Person doing cardio workout in professional fitness setting"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Cardio Excellence</h3>
                <p className="text-gray-600">Improve endurance and burn fat with effective cardiovascular training.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=90"
                alt="Person in yoga pose demonstrating flexibility and mindfulness"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Flexibility & Recovery</h3>
                <p className="text-gray-600">Enhance mobility and prevent injury with targeted flexibility work.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Training Methods Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-orange-200/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-red-200/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-amber-200/30 to-transparent rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center text-secondary mb-16">
            Proven Training Methods
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src={_2}
                alt="Professional trainer working with client in modern gym facility"
                className="w-full h-96 object-cover rounded-lg shadow-lg pl-[-6px] pr-[-6px] ml-[0px] mr-[0px] mt-[0px] mb-[0px] pt-[24px] pb-[24px]"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-secondary mb-6">
                Personalized Approach
              </h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Every program is tailored to your unique goals, fitness level, and lifestyle. No cookie-cutter solutions—just proven strategies that work for you.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                With nearly 100 successful client transformations, Coach Mark's methods focus on sustainable changes that create lasting results.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <img 
                src="https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=90"
                alt="Group fitness class with diverse participants exercising together"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="lg:order-1">
              <h3 className="text-3xl font-bold text-secondary mb-6">
                Comprehensive Support
              </h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Nutrition guidance, workout planning, and ongoing accountability—all designed to help you achieve real, lasting fat loss and better health.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Weekly check-ins and plan adjustments ensure you stay on track and continue making progress toward your goals.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Transformation Gallery */}
      <section className="py-20 bg-gradient-to-tr from-red-50 via-orange-50 to-amber-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-orange-200/30 to-yellow-200/30 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center text-secondary mb-16">
            Transformation Gallery
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=90"
                alt="Fit person demonstrating proper form during strength exercise"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-white p-4 font-semibold">Strength & Power</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=90"
                alt="Person performing dynamic movement in professional training environment"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-white p-4 font-semibold">Dynamic Training</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=90"
                alt="Athletic person in peak physical condition demonstrating exercise technique"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-white p-4 font-semibold">Peak Performance</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=90"
                alt="Person showing results of consistent fitness training and nutrition"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-white p-4 font-semibold">Lasting Results</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SignupSection />
      <Footer />
    </main>
  );
}
