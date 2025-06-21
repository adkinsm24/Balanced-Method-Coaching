import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/footer";

// This will work once you add your VITE_STRIPE_PUBLIC_KEY
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY ? 
  loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) : null;

const CheckoutForm = ({ userEmail }: { userEmail: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/success",
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful, grant course access
        try {
          const response = await fetch('/api/confirm-course-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              userEmail: userEmail
            }),
          });

          if (response.ok) {
            toast({
              title: "Payment Successful",
              description: "Welcome to the Self-Paced Nutrition Course! Course access granted.",
            });
            
            // Redirect to course page after a short delay
            setTimeout(() => {
              window.location.href = '/course';
            }, 2000);
          } else {
            toast({
              title: "Payment Processed",
              description: "Payment completed but there was an issue granting access. Please contact support.",
              variant: "destructive",
            });
          }
        } catch (accessError) {
          toast({
            title: "Payment Processed",
            description: "Payment completed but there was an issue granting access. Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-medium"
      >
        {isProcessing ? "Processing..." : "Complete Purchase - $149"}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      // Create PaymentIntent for the course
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userEmail: email
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setEmailSubmitted(true);
        setError("");
      } else {
        setError("Payment setup failed. Please try again.");
      }
    } catch (error) {
      setError("Unable to initialize payment. Please check your connection.");
    }
  };

  if (error && !emailSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="shadow-xl border-0">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => setError("")} className="mt-4">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  // Show email collection form first
  if (!emailSubmitted || !clientSecret) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Self-Paced Nutrition Course
              </CardTitle>
              <p className="text-xl text-gray-600 mt-2">$149 - One-time payment</p>
            </CardHeader>
            <CardContent>
              {!emailSubmitted ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      You'll receive login credentials and course access via email
                    </p>
                  </div>
                  {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                  )}
                  <Button type="submit" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              ) : (
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  <p className="mt-4 text-gray-600">Setting up secure checkout...</p>
                </div>
              )}
              
              <Separator className="my-8" />
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">What's Included:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    11 comprehensive modules covering all aspects of nutrition
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Downloadable guides and worksheets for each section
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Practical strategies for sustainable lifestyle changes
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Access to Coach Mark's proven methods
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Lifetime access to all course materials
                  </li>
                </ul>
              </div>

              <Separator className="my-6" />
              
              {/* Legal Disclaimers */}
              <div className="space-y-4 text-xs text-gray-600">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Terms & Conditions</h4>
                  <p className="mb-2">
                    By purchasing this course, you agree to our terms of service. This is a digital product with immediate access upon payment completion. 
                    All payments are processed securely through Stripe.
                  </p>
                  <p className="mb-2">
                    <strong>Refund Policy:</strong> Due to the digital nature of this course and immediate access provided, all sales are final. 
                    No refunds will be provided after purchase completion.
                  </p>
                  <p>
                    <strong>Course Access:</strong> You will receive lifetime access to all course materials. 
                    Login credentials will be sent to your email address within 24 hours of purchase.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Health Disclaimer</h4>
                  <p className="mb-2">
                    This course is intended for educational and informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. 
                    Coach Mark is not a licensed physician, dietitian, or mental health professional, and the information provided in this course should not be interpreted as medical advice.
                  </p>
                  <p className="mb-2">
                    Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or dietary changes. 
                    Never disregard professional medical advice or delay in seeking it because of something you have learned in this course.
                  </p>
                  <p>
                    Individual results may vary. The strategies and information presented in this course are based on Coach Mark's experience and may not be suitable for everyone. 
                    Please consult with a healthcare professional before making significant changes to your diet or lifestyle.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Privacy & Data</h4>
                  <p>
                    Your personal information and payment details are protected and will never be shared with third parties. 
                    We use industry-standard security measures to protect your data and privacy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  // Show Stripe checkout form
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Complete Your Purchase
            </CardTitle>
            <p className="text-lg text-gray-600 mt-2">
              Self-Paced Nutrition Course - $149
            </p>
            <p className="text-sm text-gray-500">
              Email: {email}
            </p>
          </CardHeader>
          <CardContent>
            {stripePromise && clientSecret ? (
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#2563eb',
                    }
                  }
                }}
              >
                <CheckoutForm userEmail={email} />
              </Elements>
            ) : (
              <div className="text-center">
                <p className="text-red-600">Payment system not configured</p>
              </div>
            )}

            <Separator className="my-6" />
            
            {/* Legal Disclaimers for Payment Page */}
            <div className="space-y-4 text-xs text-gray-600">
              <div>
                <h4 className="font-semibold mb-2 text-sm">Purchase Agreement</h4>
                <p className="mb-2">
                  By completing this purchase, you acknowledge that you have read and agree to all terms and conditions. 
                  This is a final sale of digital content with immediate access provided upon payment confirmation.
                </p>
                <p>
                  <strong>Important:</strong> All course content is proprietary and protected by copyright. 
                  Sharing, distributing, or reselling course materials is strictly prohibited.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-sm">Health & Liability Disclaimer</h4>
                <p>
                  This course provides general nutrition education and is not personalized medical advice. 
                  Consult your healthcare provider before making dietary changes. Coach Mark and this course are not liable for any health outcomes or decisions made based on course content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}