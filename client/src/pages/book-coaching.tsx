import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BookCoaching() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    selectedTimeSlot: "",
    goals: "",
    experience: "",
    eatingOut: "",
    typicalDay: "",
    drinks: "",
    emotionalEating: "",
    medications: "",
    contactMethod: "",
    source: "course" // Track that this came from the course page
  });

  // Query to fetch available time slots
  const { data: availableSlots, isLoading: slotsLoading } = useQuery<Array<{value: string, label: string}>>({
    queryKey: ["/api/available-time-slots"],
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/consultation-requests", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to submit request");
      }
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted Successfully!",
        description: "Thank you for your interest in 1-on-1 coaching. I'll contact you within 24 hours to schedule your discounted session.",
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        selectedTimeSlot: "",
        goals: "",
        experience: "",
        eatingOut: "",
        typicalDay: "",
        drinks: "",
        emotionalEating: "",
        medications: "",
        contactMethod: "",
        source: "course"
      });
      
      // Invalidate the time slots query to refresh available slots
      queryClient.invalidateQueries({ queryKey: ["/api/available-time-slots"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.selectedTimeSlot || !formData.goals || !formData.contactMethod) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    submitMutation.mutate(formData);
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Book Your 1-on-1 Nutrition Coaching
            </h1>
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold text-lg">
                🎉 Course Member Discount: 20% OFF Regular Pricing
              </p>
              <p className="text-green-700">
                Original Price: <span className="line-through">$399</span> → Your Price: <strong>$319 for 4 weeks</strong>
              </p>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get completely personalized nutrition coaching based on your individual needs and goals. 
              I take the time to understand your current eating habits and guide you through meaningful changes that stick.
            </p>
          </div>

          {/* Form Section */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardTitle className="text-2xl text-center">Book Your Discounted Coaching Session</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <Label htmlFor="contactMethod">Preferred Contact Method *</Label>
                  <Select value={formData.contactMethod} onValueChange={(value) => handleChange("contactMethod", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="text">Text Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Slot Selection */}
                <div>
                  <Label htmlFor="timeSlot">Preferred Time Slot *</Label>
                  <Select 
                    value={formData.selectedTimeSlot} 
                    onValueChange={(value) => handleChange("selectedTimeSlot", value)}
                    disabled={slotsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={slotsLoading ? "Loading available slots..." : "Select your preferred time slot"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots?.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Goals and Assessment */}
                <div>
                  <Label htmlFor="goals">Your Nutrition Goals *</Label>
                  <Textarea
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => handleChange("goals", e.target.value)}
                    placeholder="Describe your specific nutrition and health goals..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Previous Experience with Nutrition Tracking</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    placeholder="Tell me about your experience with tracking food, dieting, or nutrition programs..."
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="eatingOut">How Often Do You Eat Out?</Label>
                  <Input
                    id="eatingOut"
                    value={formData.eatingOut}
                    onChange={(e) => handleChange("eatingOut", e.target.value)}
                    placeholder="e.g., 2-3 times per week"
                  />
                </div>

                <div>
                  <Label htmlFor="typicalDay">Describe a Typical Day of Eating</Label>
                  <Textarea
                    id="typicalDay"
                    value={formData.typicalDay}
                    onChange={(e) => handleChange("typicalDay", e.target.value)}
                    placeholder="Walk me through what you typically eat in a day..."
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="drinks">What Do You Typically Drink?</Label>
                  <Input
                    id="drinks"
                    value={formData.drinks}
                    onChange={(e) => handleChange("drinks", e.target.value)}
                    placeholder="Water, coffee, soda, alcohol, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="emotionalEating">Do You Struggle with Emotional Eating?</Label>
                  <Textarea
                    id="emotionalEating"
                    value={formData.emotionalEating}
                    onChange={(e) => handleChange("emotionalEating", e.target.value)}
                    placeholder="Tell me about your relationship with food and eating patterns..."
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="medications">Current Medications or Health Conditions</Label>
                  <Textarea
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => handleChange("medications", e.target.value)}
                    placeholder="Any medications, supplements, or health conditions I should know about..."
                    className="min-h-[80px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Submitting..." : "Book My Discounted Coaching Session"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}