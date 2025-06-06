import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Shield, Clock, DollarSign } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ callId, sessionDetails }: { callId: string, sessionDetails: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/coaching-success?callId=${callId}`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-medium"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <DollarSign className="w-4 h-4 mr-2" />
            Complete Payment - ${sessionDetails?.price || '0'}
          </>
        )}
      </Button>
    </form>
  );
};

export default function CheckoutCoaching() {
  const [clientSecret, setClientSecret] = useState("");
  const [callId, setCallId] = useState("");
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('clientSecret');
    const id = urlParams.get('callId');
    
    if (!secret || !id) {
      setLocation('/book-coaching-call');
      return;
    }
    
    setClientSecret(secret);
    setCallId(id);
    
    // Extract session details from URL or set defaults
    const duration = urlParams.get('duration') || '30';
    const price = urlParams.get('price') || (duration === '30' ? '50' : duration === '45' ? '70' : '85');
    setSessionDetails({
      duration: duration + ' minutes',
      price: price
    });
  }, [setLocation]);

  if (!clientSecret || !callId) {
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
            <CardTitle className="text-3xl text-secondary">Complete Your Payment</CardTitle>
            <p className="text-gray-600">Personal Coaching Session</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Session Summary */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">Your Coaching Session:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• One-on-one personalized coaching with Coach Mark</li>
                <li>• {sessionDetails?.duration} focused nutrition and fitness guidance</li>
                <li>• FaceTime or WhatsApp video call</li>
                <li>• Customized recommendations for your goals</li>
                <li>• Follow-up resources and action plan</li>
              </ul>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Session Total:</span>
                <span className="text-2xl font-bold text-primary">${sessionDetails?.price}</span>
              </div>
            </div>

            {/* Payment Form */}
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm callId={callId} sessionDetails={sessionDetails} />
            </Elements>

            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>🔒 Secure checkout powered by Stripe</p>
              <p>Your payment information is encrypted and secure</p>
            </div>

            {/* What Happens Next */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  What Happens Next
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-medium">Payment Confirmation</p>
                    <p className="text-sm text-gray-600">You'll receive an email confirmation with your booking details</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium">Session Preparation</p>
                    <p className="text-sm text-gray-600">Coach Mark will prepare personalized guidance for your session</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium">Your Coaching Call</p>
                    <p className="text-sm text-gray-600">Join your scheduled session for personalized nutrition and fitness guidance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Information */}
            <div className="border-t pt-6 space-y-4 text-xs text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">Terms & Conditions</h4>
                <p className="mb-2">
                  By purchasing this coaching session, you agree to our terms of service. Payment is required in advance to secure your session. 
                  All payments are processed securely through Stripe.
                </p>
                <p className="mb-2">
                  <strong>Refund Policy:</strong> Sessions ending early won't be refunded. Unused time can be credited toward future sessions. 
                  Overtime extensions will be invoiced after the call.
                </p>
                <p>
                  <strong>Rescheduling:</strong> Please contact Coach Mark directly if you need to reschedule your session. 
                  24-hour notice is appreciated when possible.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Health Disclaimer</h4>
                <p className="mb-2">
                  This coaching session is intended for educational and informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Coach Mark is not a licensed physician, dietitian, or mental health professional, and the information provided during coaching should not be interpreted as medical advice.
                </p>
                <p className="mb-2">
                  Always consult your doctor or a qualified healthcare provider before starting any new diet, exercise, or lifestyle program—especially if you have pre-existing medical conditions, are pregnant or breastfeeding, or are taking prescription medications.
                </p>
                <p>
                  By booking this coaching session, you acknowledge that you are responsible for your own health decisions and outcomes. The strategies and recommendations shared during coaching are based on Coach Mark's personal experience and coaching methodology and may not be appropriate for every individual. Results may vary and are dependent on your consistency, effort, and individual circumstances.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Privacy & Copyright</h4>
                <p>
                  © {new Date().getFullYear()} Coach Mark Nutrition. All rights reserved. 
                  Session content and materials are proprietary and confidential. 
                  Your personal information is protected according to our privacy policy.
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