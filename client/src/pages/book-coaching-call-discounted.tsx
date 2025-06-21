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
import CalendarScheduler from "@/components/calendar-scheduler";

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

// Discounted pricing for course members (20% off)
const DURATION_OPTIONS = [
  { value: 30, label: "30 minutes", price: 40 },
  { value: 45, label: "45 minutes", price: 56 },
  { value: 60, label: "60 minutes", price: 68 },
];

export default function BookCoachingCallDiscounted() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  const form = useForm<CoachingCallForm>({
    resolver: zodResolver(coachingCallSchema),
    mode: "onChange", // Only validate on change, don't auto-submit
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

  const selectedOption = DURATION_OPTIONS.find(option => option.value === selectedDuration);

  const { data: availableSlots, isLoading: slotsLoading } = useQuery({
    queryKey: ["/api/available-time-slots"],
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: CoachingCallForm) => {
      const response = await fetch("/api/coaching-calls/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          source: "course", // Track source as course member
          amount: selectedOption ? selectedOption.price * 100 : 0, // Convert to cents
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to book coaching call");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Redirecting to Payment",
        description: "Please complete your payment to confirm your coaching call.",
      });
      // Redirect to checkout with the payment intent and session details
      setLocation(`/checkout-coaching?clientSecret=${data.clientSecret}&paymentIntentId=${data.paymentIntentId}&duration=${selectedDuration}&price=${selectedOption?.price}`);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error processing your booking.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CoachingCallForm) => {
    bookingMutation.mutate(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <Calendar className="w-4 h-4 mr-1" />
              Course Member Discount - 20% OFF
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Book Your Discounted Coaching Call
            </h1>
            <p className="text-lg text-gray-600">
              Exclusive pricing for course members - get personalized nutrition guidance with Coach Mark
            </p>
          </div>

          {/* Pricing Display */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {DURATION_OPTIONS.map((option) => (
              <div key={option.value} className="text-center p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 mr-1 text-gray-500" />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
                <div className="text-sm text-gray-500 line-through">${option.value === 30 ? "50" : option.value === 45 ? "70" : "85"}</div>
                <div className="text-2xl font-bold text-green-600">${option.price}</div>
                <div className="text-xs text-green-600">20% OFF</div>
              </div>
            ))}
          </div>

          {/* Booking Form */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Schedule Your Discounted Session</CardTitle>
              <CardDescription className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Call Information</h3>
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
                        <FormLabel>Preferred Date & Time *</FormLabel>
                        <FormControl>
                          <CalendarScheduler
                            availableSlots={Array.isArray(availableSlots) ? availableSlots : []}
                            selectedSlot={field.value}
                            onSlotSelect={field.onChange}
                            userDetails={{
                              name: `${form.watch('firstName')} ${form.watch('lastName')}`.trim(),
                              email: form.watch('email')
                            }}
                            duration={selectedDuration}
                            isCoachingCall={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedOption && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Course Member Price:</span>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 line-through">${selectedOption.value === 30 ? "50" : selectedOption.value === 45 ? "70" : "85"}</div>
                          <div className="text-xl font-bold text-green-600">${selectedOption.price}</div>
                        </div>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        You save ${selectedOption.value === 30 ? "10" : selectedOption.value === 45 ? "14" : "17"} with your course member discount!
                      </p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white" 
                    disabled={bookingMutation.isPending}
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