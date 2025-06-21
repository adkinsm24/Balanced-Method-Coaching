import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import CalendarScheduler from "@/components/calendar-scheduler";
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Free Introductory Call
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
              Ready to transform your relationship with food and achieve lasting results? Let's chat about your goals and see if my 1-on-1 nutrition coaching is the right fit for you.
            </p>
          </div>

          {/* Form Section */}
          <Card className="shadow-xl border-0">
            
            <CardContent>
              <div className="text-center pb-6 pt-8">
                <h3 className="text-2xl text-secondary mb-2">Let's Get Started</h3>
                <p className="text-gray-600">This quick form helps me prepare for our conversation and make the most of your time.</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Call Information</h3>
                <p className="text-sm text-blue-700 mb-1">
                  Calls are conducted via <strong>FaceTime</strong> (iPhone required) or <strong>WhatsApp video call</strong>.
                </p>
                <p className="text-xs text-blue-600">Allows me to call you from abroad with no extra charge.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="mt-1"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                    className="mt-1"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">How would you prefer to be contacted? *</Label>
                  <Select onValueChange={(value) => handleChange("contactMethod", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose your preferred contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facetime">FaceTime (iPhone required)</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Calendar Time Slot Selection */}
                <CalendarScheduler
                  availableSlots={availableSlots || []}
                  selectedSlot={formData.selectedTimeSlot}
                  onSlotSelect={(slot) => handleChange("selectedTimeSlot", slot)}
                  userDetails={{
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email
                  }}
                />

                {/* Goals and Background */}
                <div>
                  <Label htmlFor="goals" className="text-sm font-medium text-gray-700">What are your main health and nutrition goals? *</Label>
                  <Textarea
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => handleChange("goals", e.target.value)}
                    required
                    className="mt-1"
                    rows={3}
                    placeholder="e.g., lose weight, gain muscle, improve energy, develop better eating habits..."
                  />
                </div>

                <div>
                  <Label htmlFor="experience" className="text-sm font-medium text-gray-700">Previous experience with nutrition coaching or dieting?</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    className="mt-1"
                    rows={2}
                    placeholder="Tell me about any previous attempts, what worked, what didn't..."
                  />
                </div>

                <div>
                  <Label htmlFor="eatingOut" className="text-sm font-medium text-gray-700">On average, how many times per week do you eat meals away from home — including restaurants, takeout, or social events like birthdays and get-togethers?</Label>
                  <Input
                    id="eatingOut"
                    value={formData.eatingOut}
                    onChange={(e) => handleChange("eatingOut", e.target.value)}
                    className="mt-1"
                    placeholder="e.g., 2-3 times, rarely, daily..."
                  />
                </div>

                <div>
                  <Label htmlFor="typicalDay" className="text-sm font-medium text-gray-700">What does a typical day of eating look like?</Label>
                  <Textarea
                    id="typicalDay"
                    value={formData.typicalDay}
                    onChange={(e) => handleChange("typicalDay", e.target.value)}
                    className="mt-1"
                    rows={3}
                    placeholder="Describe your usual breakfast, lunch, dinner, and any snacks..."
                  />
                </div>

                <div>
                  <Label htmlFor="drinks" className="text-sm font-medium text-gray-700">Do you drink soda, alcohol, lattes, or other caloric drinks?</Label>
                  <Textarea
                    id="drinks"
                    value={formData.drinks}
                    onChange={(e) => handleChange("drinks", e.target.value)}
                    className="mt-1"
                    rows={2}
                    placeholder="Type and frequency of beverages you regularly consume..."
                  />
                </div>

                <div>
                  <Label htmlFor="emotionalEating" className="text-sm font-medium text-gray-700">Do you eat for any other reason than being hungry?</Label>
                  <Textarea
                    id="emotionalEating"
                    value={formData.emotionalEating}
                    onChange={(e) => handleChange("emotionalEating", e.target.value)}
                    className="mt-1"
                    rows={2}
                    placeholder="e.g., stress, boredom, social situations, celebrations..."
                  />
                </div>

                <div>
                  <Label htmlFor="medications" className="text-sm font-medium text-gray-700">Are you on any medications? </Label>
                  <Textarea
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => handleChange("medications", e.target.value)}
                    className="mt-1"
                    rows={2}
                    placeholder="List any medications and note if you're aware of weight-related effects..."
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={submitMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit & Schedule Your Free Call"}
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