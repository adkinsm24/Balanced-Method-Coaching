import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, Mail, ArrowRight } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function CoachingSuccess() {
  const [, setLocation] = useLocation();
  const [isConfirming, setIsConfirming] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const confirmPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const callId = urlParams.get('callId');
      const paymentIntent = urlParams.get('payment_intent');
      
      if (!callId || !paymentIntent) {
        setError("Missing booking information");
        setIsConfirming(false);
        return;
      }

      try {
        console.log('Confirming payment:', { callId, paymentIntent });
        const response = await fetch(`/api/coaching-calls/${callId}/confirm-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to confirm payment');
        }
        
        setConfirmed(true);
      } catch (error: any) {
        console.error('Payment confirmation error:', error);
        setError(error.message || "Failed to confirm payment");
      } finally {
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, []);

  if (isConfirming) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-lg text-gray-600">Confirming your payment...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 to-white">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Payment Confirmation Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => setLocation('/book-coaching-call')} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Coaching Call Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Your payment has been processed and your coaching session is now scheduled.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  What's Next
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <div>
                    <p className="font-medium">Payment Confirmed</p>
                    <p className="text-sm text-gray-600">Your coaching call has been paid for and secured</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium">Email Confirmation Sent</p>
                    <p className="text-sm text-gray-600">Check your email for booking details and session information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium">Coach Mark Notified</p>
                    <p className="text-sm text-gray-600">Coach Mark has been notified and will prepare for your session</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="font-medium">Session Day</p>
                    <p className="text-sm text-gray-600">Join your scheduled coaching call for personalized guidance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Clock className="w-5 h-5" />
                  Session Policies Reminder
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <ul className="space-y-2 text-sm">
                  <li>• Sessions ending early won't be refunded, but unused time can be credited toward future sessions</li>
                  <li>• If we go over time significantly, Coach Mark will check if you'd like to extend</li>
                  <li>• Any overtime extensions will be invoiced after the call</li>
                  <li>• For rescheduling or questions, contact Coach Mark directly</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Important Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Check your email:</strong> You should receive a confirmation email with your session details shortly.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Prepare for your session:</strong> Think about your specific goals and questions you'd like to discuss with Coach Mark.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={() => setLocation('/')} variant="outline" className="flex-1">
                Return Home
              </Button>
              <Button onClick={() => setLocation('/coaching-offers')} className="flex-1">
                <ArrowRight className="w-4 h-4 mr-2" />
                View All Services
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}