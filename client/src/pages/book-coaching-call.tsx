import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, Calendar, DollarSign } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

const coachingCallSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  selectedTimeSlot: z.string().min(1, "Please select a time slot"),
  duration: z.number().min(30).max(60),
});

type CoachingCallForm = z.infer<typeof coachingCallSchema>;

const DURATION_OPTIONS = [
  { value: 30, label: "30 minutes", price: 50 },
  { value: 45, label: "45 minutes", price: 70 },
  { value: 60, label: "60 minutes", price: 85 },
];

export default function BookCoachingCall() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const form = useForm<CoachingCallForm>({
    resolver: zodResolver(coachingCallSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      selectedTimeSlot: "",
      duration: 30,
    },
  });

  const { data: availableSlots, isLoading: slotsLoading } = useQuery({
    queryKey: ["/api/available-time-slots"],
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: CoachingCallForm) => {
      const selectedOption = DURATION_OPTIONS.find(opt => opt.value === data.duration);
      const response = await apiRequest("POST", "/api/coaching-calls/create-payment-intent", {
        ...data,
        amount: selectedOption!.price * 100, // Convert to cents
      });
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Redirecting to Payment",
        description: "Please complete your payment to confirm your coaching call.",
      });
      // Redirect to checkout with the payment intent
      setLocation(`/checkout-coaching?clientSecret=${data.clientSecret}&callId=${data.callId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CoachingCallForm) => {
    if (!selectedDuration) {
      toast({
        title: "Please select a duration",
        description: "Choose your preferred coaching call duration.",
        variant: "destructive",
      });
      return;
    }
    bookingMutation.mutate({ ...data, duration: selectedDuration });
  };

  const selectedOption = selectedDuration ? DURATION_OPTIONS.find(opt => opt.value === selectedDuration) : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Book Your Personal Coaching Call
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get personalized nutrition and fitness guidance with Coach Mark. 
              Choose your preferred duration and secure your spot with advance payment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Duration Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Choose Your Duration
                </CardTitle>
                <CardDescription>
                  Select the coaching call duration that best fits your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {DURATION_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedDuration === option.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedDuration(option.value);
                      form.setValue("duration", option.value);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{option.label}</h3>
                        <p className="text-sm text-gray-600">
                          Perfect for {option.value === 30 ? "quick guidance" : 
                                     option.value === 45 ? "focused coaching" : 
                                     "comprehensive planning"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${option.price}</div>
                        <div className="text-sm text-gray-500">per session</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Your Session
                </CardTitle>
                <CardDescription>
                  Complete your details to secure your coaching call
                </CardDescription>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">Call Information</h3>
                  <p className="text-sm text-blue-700 mb-1">
                    Calls are conducted via <strong>FaceTime</strong> (iPhone required) or <strong>WhatsApp video call</strong>.
                  </p>
                  <p className="text-xs text-blue-600">Allows me to call you from abroad with no extra charge.</p>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="selectedTimeSlot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time Slot</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time slot" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {slotsLoading ? (
                                <SelectItem value="loading" disabled>Loading available slots...</SelectItem>
                              ) : (
                                Array.isArray(availableSlots) ? availableSlots.map((slot: any) => (
                                  <SelectItem key={slot.value} value={slot.value}>
                                    {slot.label}
                                  </SelectItem>
                                )) : null
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedOption && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Session Total:</span>
                          <span className="text-xl font-bold text-primary">${selectedOption.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Payment required to confirm your {selectedOption.label} coaching session
                        </p>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={!selectedDuration || bookingMutation.isPending}
                    >
                      {bookingMutation.isPending ? (
                        "Processing..."
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4 mr-2" />
                          Proceed to Payment ({selectedOption ? `$${selectedOption.price}` : "Select Duration"})
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Policies */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Coaching Call Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Payment & Booking</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Payment is required in advance to secure your session</li>
                    <li>• All payments are processed securely through Stripe</li>
                    <li>• You'll receive confirmation via email after payment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Session Duration & Credits</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Sessions ending early won't be refunded</li>
                    <li>• Unused time can be credited toward future sessions</li>
                    <li>• Overtime extensions will be invoiced after the call</li>
                  </ul>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  By booking a coaching call, you agree to these terms. For questions or rescheduling, 
                  please contact Coach Mark directly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  );
}