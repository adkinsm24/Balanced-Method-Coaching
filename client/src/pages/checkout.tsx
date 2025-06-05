import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/footer";

// This will work once you add your VITE_STRIPE_PUBLIC_KEY
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY ? 
  loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) : null;

const CheckoutForm = () => {
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

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/success",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to the Self-Paced Nutrition Course!",
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

  useEffect(() => {
    // Create PaymentIntent for the course
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        amount: 149,
        productName: "Self-Paced Nutrition Course"
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        setError("Payment setup failed. Please try again.");
      }
    })
    .catch(() => {
      setError("Unable to initialize payment. Please check your connection.");
    });
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="shadow-xl border-0">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Setup Required</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <p className="text-sm text-gray-500">
                  Stripe payment processing needs to be configured to accept payments.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  if (!clientSecret) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" aria-label="Loading"/>
            <p className="mt-4 text-gray-600">Setting up secure checkout...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-secondary">Complete Your Purchase</CardTitle>
            <p className="text-gray-600">Self-Paced Nutrition Course</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Course Summary */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">What You're Getting:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Complete nutrition framework used with private clients</li>
                <li>• Learn at your own pace</li>
                <li>• Proven system that works</li>
                <li>• Lifetime access to all course materials</li>
              </ul>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold text-primary">$149</span>
              </div>
            </div>

            {/* Payment Form */}
            {stripePromise ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            ) : (
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">Payment processing is being configured. Please check back soon.</p>
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              <p>🔒 Secure checkout powered by Stripe</p>
              <p>Your payment information is encrypted and secure</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}