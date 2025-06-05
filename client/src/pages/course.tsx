import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { BookOpen, Clock, CheckCircle, Play, Download, Star } from "lucide-react";

// Video data structure for each course part
// To add Vimeo videos: Replace empty videoUrl with your Vimeo video URLs
// Example: "https://vimeo.com/123456789" or "https://player.vimeo.com/video/123456789"
const courseVideos = [
  { id: 0, title: "Introduction & Program Overview", videoUrl: "https://player.vimeo.com/video/1090975324", badge: "Start Here" },
  { id: 1, title: "Downloading MyFitnessPal", videoUrl: "https://player.vimeo.com/video/1090987690", badge: "Essential" },
  { id: 2, title: "Logging on MyFitnessPal", videoUrl: "https://player.vimeo.com/video/1091003401", badge: "Tutorial" },
  { id: 3, title: "Establishing Your Nutritional Goals", videoUrl: "https://player.vimeo.com/video/1090997254", badge: "Foundation" },
  { id: 4, title: "Roadmap to Achieving Your Nutritional Goals", videoUrl: "", badge: "Strategy" },
  { id: 5, title: "Strategies to Achieving Your Nutritional Goals Over Time", videoUrl: "", badge: "Long-term" },
  { id: 6, title: "Other Factors Influencing Fat Loss", videoUrl: "", badge: "Advanced" },
  { id: 7, title: "Tracking Progress", videoUrl: "", badge: "Monitoring" },
  { id: 8, title: "Progress Expectations and Interpreting Check-in Results", videoUrl: "", badge: "Analysis" },
  { id: 9, title: "Breaking Through Plateaus", videoUrl: "", badge: "Problem-solving" },
  { id: 10, title: "Post-Goal Mindset", videoUrl: "", badge: "Maintenance" },
  { id: 11, title: "Getting Started", videoUrl: "", badge: "Action Time" },
];

const videoDescriptions = [
  "Welcome to your nutrition transformation journey. Get an overview of what to expect and how to get the most out of this course.",
  "Step-by-step guide to downloading and setting up MyFitnessPal, the essential tool for tracking your nutrition.",
  "Learn how to effectively log your food and track your daily nutrition using MyFitnessPal's features.",
  "Learn how to set realistic, achievable nutritional goals that align with your lifestyle and objectives.",
  "Create a clear roadmap with actionable steps to achieve your specific nutritional goals.",
  "Develop sustainable strategies to maintain progress and stay consistent with your nutrition goals over time.",
  "Understand the additional factors beyond nutrition that impact fat loss and body composition.",
  "Learn effective methods to track your progress beyond just the scale for sustainable success.",
  "Set realistic expectations and learn how to properly interpret your check-in results.",
  "Overcome plateaus and stalls in your progress with proven strategies and adjustments.",
  "Develop the right mindset for maintaining your results after achieving your goals.",
  "Put everything together and take your first steps toward achieving your nutrition goals.",
];

export default function Course() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to log in to access course content.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Check if user has course access
  useEffect(() => {
    if (user && !(user as any).hasCourseAccess) {
      toast({
        title: "Course Access Required",
        description: "Please purchase the course to access this content.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/coaching-offers";
      }, 2000);
      return;
    }
  }, [user, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!(user as any)?.hasCourseAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p>Checking course access...</p>
          </CardContent>
        </Card>
      </div>
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="videos">Video Lessons</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="progress">Your Progress</TabsTrigger>
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
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Meal Planning Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Ready-to-use meal planning sheets and shopping lists to streamline your nutrition journey.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Templates
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recipe Collection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      50+ nutritious recipes that are simple, delicious, and align with the course principles.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Recipes
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Progress Tracking Sheets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Tools to monitor your progress, habits, and celebrate your wins along the way.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Trackers
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Reference Guides</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Handy cheat sheets for portion sizes, nutrient timing, and troubleshooting common issues.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Guides
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Your Learning Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Course Completion</span>
                        <span className="text-sm text-gray-600">0% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>

                    <Separator />

                    <div className="text-center py-8">
                      <h3 className="text-xl font-semibold mb-4">Ready to Begin?</h3>
                      <p className="text-gray-600 mb-6">
                        Start with Module 1 to lay the foundation for your nutrition transformation.
                      </p>
                      <Button size="lg" className="bg-primary hover:bg-primary/90">
                        Begin Your Journey
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Support Section */}
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Need Support?</h3>
              <p className="text-gray-600 mb-6">
                Have questions about the course content or need personalized guidance? 
                I'm here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = '/book-call'}>
                  Book Support Call
                </Button>
                <Button variant="outline" className="flex-1">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}