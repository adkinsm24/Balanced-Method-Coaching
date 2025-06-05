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
                      <CardTitle className="text-xl">Module 1: Nutrition Foundation & Mindset</CardTitle>
                      <Badge variant="outline">52 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Build the right mindset and understand core nutrition principles that form the foundation of lasting transformation.
                    </p>
                    <div className="text-sm text-gray-600 mb-4">
                      <h4 className="font-semibold mb-2">What you'll learn:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>The psychology behind successful nutrition changes</li>
                        <li>Why diets fail and what actually works long-term</li>
                        <li>Understanding your relationship with food</li>
                        <li>Setting realistic, sustainable goals</li>
                        <li>The role of self-compassion in your journey</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Module
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Workbook
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Module 2 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Module 2: Macronutrients & Energy Balance</CardTitle>
                      <Badge variant="outline">48 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Master the fundamentals of protein, carbs, and fats - and how to balance them for your goals.
                    </p>
                    <div className="text-sm text-gray-600 mb-4">
                      <h4 className="font-semibold mb-2">What you'll learn:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>How much protein you actually need (and why most people get it wrong)</li>
                        <li>The truth about carbs and when to eat them</li>
                        <li>Healthy fats that support your metabolism</li>
                        <li>Creating your personal calorie and macro targets</li>
                        <li>Flexible tracking methods that fit your lifestyle</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Module
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Calculator
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Module 3 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Module 3: Meal Planning & Prep Systems</CardTitle>
                      <Badge variant="outline">44 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Build efficient systems for meal planning and prep that save time while keeping you on track.
                    </p>
                    <div className="text-sm text-gray-600 mb-4">
                      <h4 className="font-semibold mb-2">What you'll learn:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>The 3-step meal planning system I use with all my clients</li>
                        <li>Batch cooking strategies that save hours each week</li>
                        <li>Smart grocery shopping to reduce food waste</li>
                        <li>Building flexible meal templates</li>
                        <li>Emergency backup plans for busy weeks</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Module
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Templates
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Module 4 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Module 4: Emotional Eating & Food Relationships</CardTitle>
                      <Badge variant="outline">38 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Break free from emotional eating patterns and build a healthier relationship with food.
                    </p>
                    <div className="text-sm text-gray-600 mb-4">
                      <h4 className="font-semibold mb-2">What you'll learn:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Identifying your personal emotional eating triggers</li>
                        <li>The difference between physical and emotional hunger</li>
                        <li>Building awareness without judgment</li>
                        <li>Alternative coping strategies for stress and emotions</li>
                        <li>Creating food freedom while staying healthy</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Module
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Journal
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Module 5 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Module 5: Hydration & Recovery Nutrition</CardTitle>
                      <Badge variant="outline">31 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Optimize your hydration, sleep, and recovery through strategic nutrition timing.
                    </p>
                    <div className="text-sm text-gray-600 mb-4">
                      <h4 className="font-semibold mb-2">What you'll learn:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>How much water you really need (it's not 8 glasses)</li>
                        <li>Electrolyte balance for optimal performance</li>
                        <li>Foods that support better sleep quality</li>
                        <li>Post-workout nutrition for faster recovery</li>
                        <li>Managing energy levels throughout the day</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Module
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Module 6 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Module 6: Eating Out & Social Situations</CardTitle>
                      <Badge variant="outline">29 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Navigate restaurants, social events, and travel while maintaining your nutrition goals.
                    </p>
                    <div className="text-sm text-gray-600 mb-4">
                      <h4 className="font-semibold mb-2">What you'll learn:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Restaurant strategies that don't involve salads</li>
                        <li>Handling social pressure around food choices</li>
                        <li>Travel nutrition planning and airport/hotel tips</li>
                        <li>Holiday and special event navigation</li>
                        <li>Maintaining progress without being antisocial</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Module
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Checklist
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Module 7 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Module 7: Troubleshooting & Plateaus</CardTitle>
                      <Badge variant="outline">35 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Overcome common challenges, break through plateaus, and get back on track after setbacks.
                    </p>
                    <div className="text-sm text-gray-600 mb-4">
                      <h4 className="font-semibold mb-2">What you'll learn:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Why progress stalls and how to restart momentum</li>
                        <li>Adjusting your approach as your body changes</li>
                        <li>Dealing with cravings and late-night eating</li>
                        <li>Getting back on track after a "bad" day or week</li>
                        <li>When and how to modify your nutrition plan</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Module
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Toolkit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Module 8 */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Module 8: Long-Term Success & Maintenance</CardTitle>
                      <Badge variant="outline">42 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Build systems for lifelong success and create your personalized nutrition lifestyle.
                    </p>
                    <div className="text-sm text-gray-600 mb-4">
                      <h4 className="font-semibold mb-2">What you'll learn:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Transitioning from weight loss to maintenance</li>
                        <li>Building flexibility into your nutrition approach</li>
                        <li>Creating your personal "non-negotiables"</li>
                        <li>Planning for life changes and challenges</li>
                        <li>Continuing to evolve your relationship with food</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Module
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Roadmap
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