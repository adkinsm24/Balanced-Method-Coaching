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

            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold mb-2">Certifications</h3>
              <p className="text-gray-700 mb-2">NSCA Certified Strength and Conditioning Specialist (CSCS) – March 2017

              USAW Level 1 Coach – January 2017

              Precision Nutrition Level 1 – November 2018

              XPT Level 1 Coach – November 2018

              TRX Suspension Trainer Certified (Level 1) – April 2017

              Orangetheory Group Training Certified – June 2018

              Conor Harris Biomechanics Course – September 2022</p>
              <p className="text-gray-600">
                This certification gave me the tools to launch my one-on-one nutrition coaching business. It provided the scientific foundation and practical skills needed to help clients transform their relationship with food.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold mb-2">Continued Education</h3>
              <p className="text-gray-700 mb-2">Ongoing Professional Development</p>
              <p className="text-gray-600">
                I've continued expanding my knowledge base through advanced education courses and by following top leaders in the field, ensuring I stay current with the latest research and best practices.
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
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Personal & Group Training</h3>
              <p className="text-gray-600 mb-4">
                Since 2016, I've had the privilege to work with hundreds of people, both in group and personal training settings. This hands-on experience has taught me how to adapt my approach to meet each individual's unique needs and circumstances.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">One-on-One Nutrition Coaching</h3>
              <p className="text-gray-600 mb-4">
                Since launching my nutrition coaching business in 2018, I've helped nearly 100 clients transform their nutrition, improve their relationship with food, and achieve real, lasting results. Each client receives a completely personalized approach based on their individual needs and goals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Self-Paced Nutrition Course</h3>
              <p className="text-gray-600 mb-4">
                I'm excited to introduce my brand new Self-Paced Nutrition course. It's built on the exact framework I use with my private clients and designed for those who want results but don't necessarily need the one-on-one support. Whether it's about affordability, independence, or convenience, this course gives more people access to a proven system that works.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Philosophy */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-secondary mb-8">My Coaching Philosophy</h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-white to-blue-50 p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-primary">No Cookie-Cutter Solutions</h3>
              <p className="text-gray-700">
                What sets my coaching apart is that I don't rely on cookie-cutter meal plans. I take the time to understand your current eating habits and then guide you through small, meaningful changes that build real momentum—changes that actually stick.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-primary">Ongoing Support & Accountability</h3>
              <p className="text-gray-700">
                I'll be with you every step of the way to provide you guidance and accountability. Success isn't just about having the right plan—it's about having the right support system to help you implement it consistently.
              </p>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-primary">Sustainable Results</h3>
              <p className="text-gray-700">
                My ultimate mission is simple: help as many people as possible find a sustainable way of eating that leads to lasting fat loss, better health, without any gimmicks, shortcuts, or unnecessary restrictions.
              </p>
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