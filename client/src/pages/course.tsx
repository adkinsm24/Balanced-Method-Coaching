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
    if (user && !user.hasCourseAccess) {
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

  if (!user?.hasCourseAccess) {
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
                Transform your relationship with food using the same proven framework 
                I use with my private coaching clients.
              </p>
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">8 Core Modules</h3>
                    <p className="text-sm text-gray-600">Comprehensive nutrition fundamentals</p>
                  </div>
                  <div>
                    <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Lifetime Access</h3>
                    <p className="text-sm text-gray-600">Learn at your own pace</p>
                  </div>
                  <div>
                    <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Proven Results</h3>
                    <p className="text-sm text-gray-600">Evidence-based approach</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Content */}
          <Tabs defaultValue="modules" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="modules">Course Modules</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="progress">Your Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="space-y-4">
              <div className="grid gap-4">
                {/* Module 1 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Module 1: Nutrition Fundamentals</CardTitle>
                      <Badge variant="outline">45 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Understanding macronutrients, micronutrients, and how your body processes food.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Module
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Module 2 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Module 2: Building Sustainable Habits</CardTitle>
                      <Badge variant="outline">52 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Creating lasting change through small, consistent actions that compound over time.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Module
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Module 3 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Module 3: Meal Planning & Prep</CardTitle>
                      <Badge variant="outline">38 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Practical strategies for planning, shopping, and preparing nutritious meals efficiently.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Module
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Module 4 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Module 4: Emotional Eating Mastery</CardTitle>
                      <Badge variant="outline">41 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Understanding triggers, developing awareness, and creating healthy coping strategies.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Module
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional modules would go here */}
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