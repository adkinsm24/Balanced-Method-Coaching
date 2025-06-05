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
                {/* Part 0 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Part 0: Introduction & Program Overview</CardTitle>
                      <Badge variant="outline">Start Here</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Welcome to your nutrition transformation journey. Get an overview of what to expect and how to get the most out of this course.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Part 1 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Part 1: Downloading MyFitnessPal</CardTitle>
                      <Badge variant="outline">Essential</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Step-by-step guide to downloading and setting up MyFitnessPal, the essential tool for tracking your nutrition.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Part 2 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Part 2: Logging on MyFitnessPal</CardTitle>
                      <Badge variant="outline">Tutorial</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Learn how to effectively log your food and track your daily nutrition using MyFitnessPal's features.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Part 3 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Part 3: Establishing Your Nutritional Goals</CardTitle>
                      <Badge variant="outline">Foundation</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Learn how to set realistic, achievable nutritional goals that align with your lifestyle and objectives.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Part 4 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Part 4: Roadmap to Achieving Your Nutritional Goals</CardTitle>
                      <Badge variant="outline">Strategy</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Create a clear roadmap with actionable steps to achieve your specific nutritional goals.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Part 5 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Part 5: Strategies to Achieving Your Nutritional Goals Over Time</CardTitle>
                      <Badge variant="outline">Long-term</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Develop sustainable strategies to maintain progress and stay consistent with your nutrition goals over time.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Part 6 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Part 6: Other Factors Influencing Fat Loss</CardTitle>
                      <Badge variant="outline">Advanced</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Understand the additional factors beyond nutrition that impact fat loss and body composition.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Part 7 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Part 7: Tracking Progress</CardTitle>
                      <Badge variant="outline">Monitoring</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Learn effective methods to track your progress beyond just the scale for sustainable success.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Part 8 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Part 8: Progress Expectations and Interpreting Check-in Results</CardTitle>
                      <Badge variant="outline">Analysis</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Set realistic expectations and learn how to properly interpret your check-in results.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Part 9 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Part 9: Breaking Through Plateaus</CardTitle>
                      <Badge variant="outline">Problem-solving</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Overcome plateaus and stalls in your progress with proven strategies and adjustments.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Part 10 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Part 10: Post-Goal Mindset</CardTitle>
                      <Badge variant="outline">Maintenance</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Develop the right mindset for maintaining your results after achieving your goals.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Part 11 */}
                <Card className="hover:shadow-lg transition-shadow border-2 border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Part 11: Getting Started</CardTitle>
                      <Badge className="bg-primary text-white">Action Time</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Put everything together and take your first steps toward achieving your nutrition goals.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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