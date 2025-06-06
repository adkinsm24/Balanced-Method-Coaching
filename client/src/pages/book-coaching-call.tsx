import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  contactMethod: z.string().min(1, "Please select a contact method"),
  goals: z.string().min(1, "Please let us know what you'd like to cover"),
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
      contactMethod: "",
      goals: "",
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
    console.log("Form submitted with data:", data);
    console.log("Selected duration:", selectedDuration);
    console.log("Form errors:", form.formState.errors);
    
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

          <div className="max-w-2xl mx-auto">
            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Your Session
                </CardTitle>
                <CardDescription className="space-y-2">
                  <p>Complete your details to secure your coaching call</p>
                  <p className="text-sm text-blue-700">
                    <strong>Calls via FaceTime (iPhone) or WhatsApp </strong> - allows international calling at no extra charge.
                  </p>
                </CardDescription>
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
                            <FormLabel>First Name *</FormLabel>
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
                            <FormLabel>Last Name *</FormLabel>
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
                          <FormLabel>Email *</FormLabel>
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
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How would you prefer to be contacted? *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose your preferred contact method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="facetime">FaceTime (iPhone required)</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What would you like us to cover during the call? *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe your goals, questions, or specific topics you'd like to discuss..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Duration *</FormLabel>
                          <Select onValueChange={(value) => {
                            const duration = parseInt(value);
                            setSelectedDuration(duration);
                            field.onChange(duration);
                          }} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose session duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DURATION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value.toString()}>
                                  {option.label} - ${option.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="selectedTimeSlot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time Slot *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time slot" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {slotsLoading ? (
                                <SelectItem value="loading-placeholder" disabled>Loading available slots...</SelectItem>
                              ) : (
                                Array.isArray(availableSlots) && availableSlots.length > 0 ? availableSlots.map((slot: any) => (
                                  <SelectItem key={slot.value} value={slot.value}>
                                    {slot.label}
                                  </SelectItem>
                                )) : (
                                  <SelectItem value="no-slots" disabled>No available slots</SelectItem>
                                )
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
                      onClick={(e) => {
                        console.log("Button clicked!");
                        console.log("Selected duration:", selectedDuration);
                        console.log("Form valid:", form.formState.isValid);
                        console.log("Form values:", form.getValues());
                      }}
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