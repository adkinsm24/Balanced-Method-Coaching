import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Success() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Grant course access after successful payment
  useEffect(() => {
    const grantAccess = async () => {
      if (isAuthenticated) {
        try {
          await apiRequest("POST", "/api/grant-course-access", {});
          toast({
            title: "Course Access Granted!",
            description: "You now have access to your nutrition course.",
          });
        } catch (error) {
          console.error("Error granting course access:", error);
        }
      }
    };

    grantAccess();
  }, [isAuthenticated, toast]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card className="shadow-xl border-0 text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-secondary">Payment Successful!</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Welcome to the Self-Paced Nutrition Course!</h2>
              <p className="text-gray-600 leading-relaxed">
                Thank you for your purchase. Your course access will be set up shortly.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 text-left">
              <h3 className="font-semibold mb-3">What happens next:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• You'll receive a confirmation email with course access details</li>
                <li>• Course materials will be available within 24 hours</li>
                <li>• Start learning at your own pace with lifetime access</li>
                <li>• Apply the same proven framework I use with private clients</li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Questions about your course? Feel free to reach out to me directly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {isAuthenticated ? (
                  <Button 
                    onClick={() => window.location.href = '/course'}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Access Your Course
                  </Button>
                ) : (
                  <Button 
                    onClick={() => window.location.href = '/api/login'}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Login to Access Course
                  </Button>
                )}
                <Button 
                  onClick={() => window.location.href = '/book-call'}
                  variant="outline"
                  className="flex-1"
                >
                  Book a Support Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}