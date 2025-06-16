import SocialMedia from "@/components/social-media";
import Footer from "@/components/footer";
import parkImage from "@assets/park.jpg";
import degreeImage from "@assets/Bachelor of Science - CSUF.jpg";

export default function About() {
  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero Section with Group Photo */}
      <section className="relative h-[500px] overflow-hidden">
        <img 
          src={parkImage}
          alt="Coach Mark with fitness community group in park setting"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 flex items-start justify-center pt-8">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl font-bold mb-3">
              About Coach Mark
            </h1>
            <p className="text-xl leading-relaxed">Hi, I'm Mark! I'm passionate about health and fitness, and my mission is to help as many people as possible live healthier, stronger lives.</p>
          </div>
        </div>
      </section>
      {/* Education & Background */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-secondary mb-8">Education & Background</h2>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="border-l-4 border-primary pl-6 flex-1">
                <h3 className="text-xl font-semibold mb-2">Bachelor's Degree in Kinesiology, Strength & Conditioning</h3>
                <p className="text-gray-700 mb-2">Cal State University Fullerton • 2016</p>
                <p className="text-gray-600">
                  I've been passionate about health and fitness since earning my bachelor's degree, which laid the foundation for my career in helping others achieve their fitness goals.
                </p>
              </div>
              <div className="flex-shrink-0">
                <img 
                  src={degreeImage}
                  alt="Bachelor of Science degree in Kinesiology from California State University, Fullerton"
                  className="w-96 h-auto rounded-lg shadow-lg border border-gray-200"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 border-l-4 border-primary pl-6">Professional Certifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-primary mb-1">USAW Level 1 Coach</h4>
                  <p className="text-sm text-gray-600">January 2017</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-primary mb-1">NSCA Certified Strength and Conditioning Specialist (CSCS)</h4>
                  <p className="text-sm text-gray-600">March 2017</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-primary mb-1">TRX Suspension Trainer Certified (Level 1)</h4>
                  <p className="text-sm text-gray-600">April 2017</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-primary mb-1">Orangetheory Group Training Certified</h4>
                  <p className="text-sm text-gray-600">June 2018</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-primary mb-1">Precision Nutrition Level 1</h4>
                  <p className="text-sm text-gray-600">November 2018</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-primary mb-1">XPT Level 1 Coach</h4>
                  <p className="text-sm text-gray-600">November 2018</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 md:col-span-2">
                  <h4 className="font-semibold text-primary mb-1">Conor Harris Biomechanics Course</h4>
                  <p className="text-sm text-gray-600">September 2022</p>
                </div>
              </div>
              <p className="text-gray-600 mt-4 text-center italic">I've continued to expand my knowledge through advanced education courses and by learning from top leaders in the field. This diverse background allows me to tailor coaching to your specific needs — whether you're new to fitness, training for performance, or simply want to feel better in your body.
</p>
            </div>
          </div>
        </div>
      </section>
      {/* Experience */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-to-br from-orange-200/40 to-red-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tl from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-secondary mb-8">Professional Experience</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
            <p className="text-gray-700 leading-relaxed">
              For the past 7+ years, I've coached in a wide range of settings — from private sessions with kids as young as 8 to older adults looking to stay active and strong. I've led group training classes, helped clients recover from injuries, and even ran outdoor workouts for a full year when gyms were closed during COVID. No matter the setting, my goal has always been the same: to meet people where they're at and help them build sustainable, healthy habits.
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Head Coach – Orangetheory Fitness (Claremont & Glendora)</h3>
              <p className="text-sm text-gray-500 mb-3">June 2018 – June 2024</p>
              <p className="text-gray-600 mb-4">Led thousands of group training sessions, coached diverse client populations, and helped members improve strength, endurance, and body composition through structured interval training. Additionally, oversaw the onboarding and development of new coaches.</p>
            </div>
            
            {/* Orangetheory Photos - Full Width */}
            <div className="-mx-4 lg:-mx-8 xl:-mx-16">
              <div className="grid md:grid-cols-3 gap-1 md:gap-2">
                <img 
                  src="/1otf.jpg"
                  alt="Coach Mark with Orangetheory Fitness class group photo"
                  className="w-full h-auto max-h-[500px] object-contain shadow-lg"
                />
                <img 
                  src="/2otf.jpg"
                  alt="Energetic Orangetheory Fitness class celebration with members"
                  className="w-full h-auto max-h-[500px] object-contain shadow-lg"
                />
                <img 
                  src="/3otf.jpg"
                  alt="Orangetheory Fitness team and members group photo"
                  className="w-full h-auto max-h-[500px] object-contain shadow-lg"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Mark in the Park</h3>
              <p className="text-sm text-gray-500 mb-3">February 2020 – April 2021</p>
              <p className="text-gray-600 mb-4">
                When gyms shut down in early 2020, I saw it as an opportunity to keep people connected and moving. From February 2020 to April 2021, I built a supportive community of motivated individuals by leading weekly outdoor workouts in local parks. What started small quickly grew — over 150 people came out to train, and I regularly coached groups of 15 to 30. During that time, I also began supporting people with their nutrition, which marked the true <strong>beginning of my nutrition coaching journey</strong>.
              </p>
            </div>
            
            {/* Mark in the Park Photos - Full Width */}
            <div className="-mx-4 lg:-mx-8 xl:-mx-16">
              <div className="grid md:grid-cols-3 gap-1 md:gap-2">
                <img 
                  src="/park1.jpg"
                  alt="Mark in the Park outdoor workout session with participants exercising on mats"
                  className="w-full h-auto max-h-[500px] object-contain shadow-lg"
                />
                <img 
                  src="/park2.jpg"
                  alt="Wide view of Mark in the Park outdoor fitness class in local park setting"
                  className="w-full h-auto max-h-[500px] object-contain shadow-lg"
                />
                <img 
                  src="/park3.jpg"
                  alt="Mark in the Park community group photo with participants wearing #24 shirts"
                  className="w-full h-auto max-h-[500px] object-contain shadow-lg"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Personal Trainer – WorkStrong & UCI ARC</h3>
                  <p className="text-sm text-gray-500 mb-3">April 2017 – Winter 2019</p>
                  <p className="text-gray-600 mb-4">
                    Worked with faculty and staff on preventative wellness and post-rehabilitation fitness programs. Delivered individualized training in both private and group formats at the University of California, Irvine's fitness center.
                  </p>
                </div>
                <div className="flex justify-center">
                  <img 
                    src="/uci.jpg"
                    alt="Mark at UCI ARC giving thumbs up next to Personal Training poster"
                    className="w-full max-w-sm h-auto object-contain rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="flex justify-center order-2 md:order-1">
                  <img 
                    src="/ufc.jpg"
                    alt="Mark with UFC Gym TRX class group photo showing participants and training equipment"
                    className="w-full max-w-sm h-auto object-contain rounded-lg shadow-lg"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-xl font-semibold mb-3">Personal Trainer – UFC Gym, La Mirada</h3>
                  <p className="text-sm text-gray-500 mb-3">April 2017 – July 2017</p>
                  <p className="text-gray-600 mb-4">Delivered one-on-one personal training while actively promoting training packages and DotFit supplements through direct outreach. Led multiple group classes each week, including TRX (up to 16 participants) and DUT high-intensity resistance training (20–40 participants), creating energetic, engaging sessions tailored to all fitness levels. This was my first role after graduating college and where I first developed my passion for fitness coaching.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Philosophy */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-secondary mb-8">My Coaching Philosophy</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <p className="text-gray-700 leading-relaxed text-lg">
              My coaching philosophy is rooted in personalization and balance. When it comes to exercise, I take the time to understand each client's history, goals, and preferences so I can tailor their training accordingly. My aim is to improve their overall health by applying progressive overload in a way that's sustainable and enjoyable. I recognize that everyone is different—there's no one-size-fits-all approach. I focus on selecting exercises that not only suit their body but also ones they enjoy, helping them stay motivated and consistent.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mt-4">
              On the nutrition side, I promote a balanced, realistic approach. I steer away from cookie-cutter meal plans, fad diets, and unnecessary restrictions. I believe true health comes from balance—not extremes—and I strive to help clients build habits that support long-term well-being while becoming the best version of themselves.
            </p>
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