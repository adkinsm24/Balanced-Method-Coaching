import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function SignupSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    weightGoal: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.weightGoal) {
      toast({
        title: "Please fill in all fields",
        description: "All fields are required to get started.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // This would integrate with Coach Mark's lead capture system
      // For now, show success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Success!",
        description: "Thank you for signing up! Coach Mark will be in touch with you soon.",
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        weightGoal: ''
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="signup" className="min-h-screen bg-secondary text-secondary-foreground py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Start Your Transformation?</h2>
        <p className="text-xl mb-12 opacity-90">
          Take the first step towards lasting weight loss with a personalized consultation
        </p>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Get Your Free Consultation</CardTitle>
            <CardDescription>
              Start your personalized weight-loss journey with Coach Mark
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weightGoal">How much weight do you want to lose?</Label>
                <Select onValueChange={(value) => handleInputChange('weightGoal', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your weight loss goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10-20">10-20 pounds</SelectItem>
                    <SelectItem value="20-40">20-40 pounds</SelectItem>
                    <SelectItem value="40-60">40-60 pounds</SelectItem>
                    <SelectItem value="60+">60+ pounds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 h-auto text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Get My Free Consultation"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Program Overview Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold mb-8">Your Personalized Weight-Loss Journey</h3>
          <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto">
            Unlike generic programs, every aspect is customized to your unique situation
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-blue-50/80 border-blue-200/50">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground text-2xl font-bold">1</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-800">Personal Assessment</h4>
                <p className="text-gray-700">Complete lifestyle and fitness evaluation to understand your unique needs</p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50/80 border-blue-200/50">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground text-2xl font-bold">2</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-800">Custom Plan Creation</h4>
                <p className="text-gray-700">Receive your personalized nutrition and exercise plan tailored to your goals</p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50/80 border-blue-200/50">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground text-2xl font-bold">3</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-800">Ongoing Support</h4>
                <p className="text-gray-700">Weekly check-ins and plan adjustments to ensure consistent progress</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
