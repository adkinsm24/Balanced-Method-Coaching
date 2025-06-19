import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { BookOpen, Clock, CheckCircle, Play, Download, Star } from "lucide-react";

// Video data structure for each course part
// To add Vimeo videos: Replace empty videoUrl with your Vimeo video URLs
// Example: "https://vimeo.com/123456789" or "https://player.vimeo.com/video/123456789"
const courseVideos = [
  { id: 0, title: "Introduction & Program Overview", videoUrl: "https://player.vimeo.com/video/1090975324", badge: "Start Here" },
  { id: 1, title: "Downloading MyFitnessPal", videoUrl: "https://player.vimeo.com/video/1090987690", badge: "Essential" },
  { id: 2, title: "Logging on MyFitnessPal", videoUrl: "https://player.vimeo.com/video/1092200453", badge: "Tutorial" },
  { id: 3, title: "Establishing Your Nutritional Goals", videoUrl: "https://player.vimeo.com/video/1090997254", badge: "Foundation" },
  { id: 4, title: "Roadmap to Achieving Your Nutritional Goals", videoUrl: "https://player.vimeo.com/video/1090997641", badge: "Strategy" },
  { id: 5, title: "Strategies to Achieving Your Nutritional Goals Over Time", videoUrl: "https://player.vimeo.com/video/1090998630", badge: "Long-term" },
  { id: 6, title: "Other Factors Influencing Fat Loss", videoUrl: "https://player.vimeo.com/video/1090999246", badge: "Advanced" },
  { id: 7, title: "Tracking Progress", videoUrl: "https://player.vimeo.com/video/1090999757", badge: "Monitoring" },
  { id: 8, title: "Progress Expectations and Interpreting Check-in Results", videoUrl: "https://player.vimeo.com/video/1091000786", badge: "Analysis" },
  { id: 9, title: "Breaking Through Plateaus", videoUrl: "https://player.vimeo.com/video/1091001199", badge: "Problem-solving" },
  { id: 10, title: "Post-Goal Mindset", videoUrl: "https://player.vimeo.com/video/1091001699", badge: "Maintenance" },
  { id: 11, title: "Getting Started & Closing Words", videoUrl: "https://player.vimeo.com/video/1091002509", badge: "Action Time" },
];

const videoDescriptions = [
  "Welcome to your nutrition transformation journey. Get an overview of what to expect and how to get the most out of this course.",
  "Step-by-step guide to downloading and setting up MyFitnessPal, the essential tool for tracking your nutrition.",
  "Learn how to effectively log your food and track your daily nutrition using MyFitnessPal's features.",
  "Learn how to set realistic, achievable nutritional goals that align with your lifestyle and objectives.",
  "I'll walk you through how I personally structure my diet to meet my goals. This approach is best suited for those with prior tracking experience who are ready to make multiple changes from the start.",
  "Develop sustainable strategies to maintain progress and stay consistent with your nutrition goals over time.",
  "Understand the additional factors beyond nutrition that impact fat loss and body composition.",
  "Learn effective methods to track your progress beyond just the scale for sustainable success.",
  "Learn what real progress looks like and how to interpret your check-in results.",
  "Overcome plateaus and stalls in your progress with proven strategies and adjustments.",
  "Develop the right mindset for maintaining your results after achieving your goals.",
  "Take your first steps towards a leaner physique and better health by putting the theory into practice.",
];

export default function Course() {
  const { user } = useAuth();

  // If user doesn't have course access, show purchase prompt
  if (user && !user.hasCourseAccess) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 pt-20">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  🔒 Course Access Required
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Get instant access to the complete nutrition transformation course with 12 comprehensive video lessons.
                </p>
              </div>

              <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="pt-8 pb-8">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                      <div>
                        <Play className="w-8 h-8 text-primary mx-auto mb-2" />
                        <h3 className="font-semibold">12 Video Lessons</h3>
                        <p className="text-sm text-gray-600">Step-by-step guidance</p>
                      </div>
                      <div>
                        <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                        <h3 className="font-semibold">Lifetime Access</h3>
                        <p className="text-sm text-gray-600">Watch anytime, anywhere</p>
                      </div>
                      <div>
                        <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                        <h3 className="font-semibold">Actionable Content</h3>
                        <p className="text-sm text-gray-600">Real results guaranteed</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        size="lg"
                        onClick={() => window.location.href = '/coaching-offers'}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Get Course Access
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => window.location.href = '/book-coaching-call'}
                      >
                        Book Coaching Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <Badge variant="secondary" className="mb-4">
                <Star className="w-4 h-4 mr-1" />
                Course Member
              </Badge>
              <h1 className="text-4xl font-bold text-secondary mb-4">
                Welcome to Your Self-Paced Nutrition Course
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Follow this step-by-step video series to master nutrition tracking and achieve your goals using MyFitnessPal.
              </p>
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <Play className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">11 Video Lessons</h3>
                    <p className="text-sm text-gray-600">Step-by-step video instruction</p>
                  </div>
                  <div>
                    <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Lifetime Access</h3>
                    <p className="text-sm text-gray-600">Watch anytime, anywhere</p>
                  </div>
                  <div>
                    <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Actionable Content</h3>
                    <p className="text-sm text-gray-600">Practical implementation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Content */}
          <Tabs defaultValue="videos" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="videos">Video Lessons</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="space-y-4">
              <div className="grid gap-4">
                {courseVideos.map((video, index) => (
                  <Card 
                    key={video.id} 
                    className={`hover:shadow-lg transition-shadow ${video.id === 11 ? 'border-2 border-primary' : ''}`}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Part {video.id}: {video.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        {videoDescriptions[index]}
                      </p>
                      <div className="space-y-3">
                        {video.videoUrl ? (
                          <>
                            {/* Embedded Vimeo Player */}
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <iframe
                                src={video.videoUrl.includes('player.vimeo.com') 
                                  ? video.videoUrl 
                                  : video.videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')
                                }
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                                title={`Part ${video.id}: ${video.title}`}
                              />
                            </div>

                            {/* Summary Document Download */}
                            <div className="mt-4">
                              <Button 
                                variant="default" 
                                className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-primary"
                                onClick={() => {
                                  window.open(`/api/download/Part-${video.id}-Summary.docx`, '_blank');
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Part {video.id} Summary
                              </Button>
                            </div>

                            {/* Part 2 specific links */}
                            {video.id === 2 && (
                              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1LSU0hWU85rRtYBab6mXW4wdzF6BYhDcbb9twknvw_hg/edit?gid=2075152349#gid=2075152349', '_blank')}
                                >
                                  Calories in Foods & Drinks + Substitutes
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1nQwBITawpOLODsuVve0hFD7QckwgGWvwcE4y6MItdoE/edit?gid=774705126#gid=774705126', '_blank')}
                                >Weight Changes in Cooked Foods</Button>
                              </div>
                            )}

                            {/* Part 3 specific links */}
                            {video.id === 3 && (
                              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => window.open('https://pmc.ncbi.nlm.nih.gov/articles/PMC5568065/', '_blank')}
                                >
                                  Meta-analysis on fat/carb ratios
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => window.open('https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/calorie-calculator/itt-20402304', '_blank')}
                                >
                                  Maintenance calorie calculator
                                </Button>
                              </div>
                            )}

                            {/* Part 4 specific links */}
                            {video.id === 4 && (
                              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1dWf-Dj6Ix7ZedD2mvwm4ZQuUi0PUA3T2fwhuMy43KrU/edit?gid=129396426#gid=129396426', '_blank')}
                                >Table of Proteins</Button>
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1WtKHPO8zuJJjLg2feDBjpfGnNR9uQ9Crmp8ekbCoPCs/edit?gid=658011043#gid=658011043', '_blank')}
                                >
                                  Carbs and Fiber
                                </Button>
                              </div>
                            )}

                            {/* Part 5 specific links */}
                            {video.id === 5 && (
                              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1LSU0hWU85rRtYBab6mXW4wdzF6BYhDcbb9twknvw_hg/edit?gid=2075152349#gid=2075152349', '_blank')}
                                >
                                  Calories in Foods & Drinks + Substitutes
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1dWf-Dj6Ix7ZedD2mvwm4ZQuUi0PUA3T2fwhuMy43KrU/edit?gid=129396426#gid=129396426', '_blank')}
                                >Table of Proteins</Button>
                              </div>
                            )}

                            {/* Part 6 specific links */}
                            {video.id === 6 && (
                              <div className="space-y-3 mt-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => window.open('https://inbodyusa.com/blogs/inbodyblog/how-to-tell-if-youre-skinny-fat-and-what-to-do-if-you-are/', '_blank')}
                                  >
                                    Skinny fat article
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => window.open('https://pmc.ncbi.nlm.nih.gov/articles/PMC2951287/#:~:text=Sleep%20curtailment%20decreased%20the%20fraction,towards%20oxidation%20of%20less%20fat', '_blank')}
                                  >Research Article on the Lack of Sleep</Button>
                                </div>
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => window.open('https://www.youtube.com/watch?v=AKGrmY8OSHM&t=38s', '_blank')}
                                >
                                  NSDR with Andrew Huberman
                                </Button>
                              </div>
                            )}

                            {/* Part 7 specific links */}
                            {video.id === 7 && (
                              <div className="space-y-3 mt-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => window.open('https://www.stevegranthealth.com/articles-posts/what-is-an-appropriate-body-fat-percentage-goal/#:~:text=Is%20there%20an%20ideal%20body,and%20below%206%25%20for%20males.', '_blank')}
                                  >
                                    Article by Steve Grant
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    onClick={() => window.open('https://www.webmd.com/fitness-exercise/what-is-body-composition', '_blank')}
                                  >
                                    WebMD body fat recommendations by age
                                  </Button>
                                </div>
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/11L8fft6894kZKf6JcBaKvSpcpGoLvoSzTzPmkqGlv_A/edit?gid=369675530#gid=369675530', '_blank')}
                                >
                                  Measurements Tracker (Go to "File" then "Make a Copy" to use it)
                                </Button>
                              </div>
                            )}

                            {/* Part 8 specific links */}
                            {video.id === 8 && (
                              <div className="mt-4">
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => window.open('https://inbodyusa.com/blogs/inbodyblog/why-does-my-weight-fluctuate-day-to-day/', '_blank')}
                                >
                                  Weight fluctuations due to water retention
                                </Button>
                              </div>
                            )}

                          </>
                        ) : (
                          <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                            <div className="text-center">
                              <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 font-medium">Video Coming Soon</p>
                              <p className="text-sm text-gray-400">This lesson will be available shortly</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Google Sheets Resources & Tools
</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Essential nutrition documents and tools to help guide you through your fat loss journey.</p>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://docs.google.com/spreadsheets/d/1LSU0hWU85rRtYBab6mXW4wdzF6BYhDcbb9twknvw_hg/edit?gid=2075152349#gid=2075152349', '_blank')}
                      >
                        Calories in Foods & Drinks + Substitutes
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://docs.google.com/spreadsheets/d/1nQwBITawpOLODsuVve0hFD7QckwgGWvwcE4y6MItdoE/edit?gid=774705126#gid=774705126', '_blank')}
                      >Weight Changes in Cooked Foods</Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://docs.google.com/spreadsheets/d/1dWf-Dj6Ix7ZedD2mvwm4ZQuUi0PUA3T2fwhuMy43KrU/edit?gid=129396426#gid=129396426', '_blank')}
                      >Table of Proteins</Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://docs.google.com/spreadsheets/d/1WtKHPO8zuJJjLg2feDBjpfGnNR9uQ9Crmp8ekbCoPCs/edit?gid=658011043#gid=658011043', '_blank')}
                      >
                        Carbs and Fiber
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://docs.google.com/spreadsheets/d/11L8fft6894kZKf6JcBaKvSpcpGoLvoSzTzPmkqGlv_A/edit?gid=369675530#gid=369675530', '_blank')}
                      >
                        Measurements Tracker
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/calorie-calculator/itt-20402304', '_blank')}
                      >
                        Maintenance calorie calculator
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://www.youtube.com/watch?v=AKGrmY8OSHM&t=38s', '_blank')}
                      >NSDR with Andrew Huberman (10-minute relaxation meditation)</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Research Articles & Other Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Scientific research and other various articles from the course.</p>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://pmc.ncbi.nlm.nih.gov/articles/PMC5568065/', '_blank')}
                      >
                        Meta-analysis on fat/carb ratios
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://pmc.ncbi.nlm.nih.gov/articles/PMC2951287/#:~:text=Sleep%20curtailment%20decreased%20the%20fraction,towards%20oxidation%20of%20less%20fat', '_blank')}
                      >
                        Research Article on the Lack of Sleep
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://www.stevegranthealth.com/articles-posts/what-is-an-appropriate-body-fat-percentage-goal/#:~:text=Is%20there%20an%20ideal%20body,and%20below%206%25%20for%20males.', '_blank')}
                      >
                        Article by Steve Grant (Body Fat Goals)
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://www.webmd.com/fitness-exercise/what-is-body-composition', '_blank')}
                      >
                        WebMD body fat recommendations by age
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://inbodyusa.com/blogs/inbodyblog/how-to-tell-if-youre-skinny-fat-and-what-to-do-if-you-are/', '_blank')}
                      >
                        Skinny fat article
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.open('https://inbodyusa.com/blogs/inbodyblog/why-does-my-weight-fluctuate-day-to-day/', '_blank')}
                      >
                        Weight fluctuations due to water retention
                      </Button>
                    </div>
                  </CardContent>
                </Card>


              </div>
            </TabsContent>


          </Tabs>

          {/* Exclusive Member Discount Section */}
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <CardContent className="pt-6 text-center">
              <Badge className="mb-4 bg-green-600 text-white px-4 py-1 text-sm font-semibold">
                🎉 EXCLUSIVE MEMBER DISCOUNT
              </Badge>
              <h3 className="text-2xl font-bold mb-4 text-green-800">
                20% OFF 1-on-1 Nutrition Coaching
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Take your nutrition journey to the next level with personalized coaching and support. 
                As a course member, you get <strong>20% off</strong> all 1-on-1 coaching sessions and calls.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-6">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-4 pb-4">
                    <h4 className="font-semibold text-lg mb-2">1-on-1 Nutrition Coaching</h4>
                    <p className="text-gray-600 text-sm mb-3">Get completely personalized nutrition coaching based on your individual needs and goals. </p>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      <span className="line-through text-gray-400 text-lg mr-2">$399</span>
                      $120/session
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-4 pb-4">
                    <h4 className="font-semibold text-lg mb-2">Quick Coaching Call</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      30-60 minute focused sessions for specific questions and guidance
                    </p>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      <span className="line-through text-gray-400 text-lg mr-2">$75</span>
                      $60/call
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/coaching-offers'}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Get 20% OFF Coaching
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = '/book-coaching-call'}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  Book Discounted Call
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                * Discount automatically applied for course members during checkout
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}