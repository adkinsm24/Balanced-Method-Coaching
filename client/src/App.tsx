import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Navigation from "@/components/navigation";
import SocialMedia from "@/components/social-media";
import Home from "@/pages/home";
import About from "@/pages/about";
import CoachingOffers from "@/pages/coaching-offers";
import BookCall from "@/pages/book-call";
import BookCoachingCall from "@/pages/book-coaching-call";
import BookCoachingCallRegular from "@/pages/book-coaching-call-regular";
import BookCoachingCallDiscounted from "@/pages/book-coaching-call-discounted";
import BookCoaching from "@/pages/book-coaching";
import Checkout from "@/pages/checkout";
import CheckoutCoaching from "@/pages/checkout-coaching";
import Success from "@/pages/success";
import CoachingSuccess from "@/pages/coaching-success";
import Course from "@/pages/course";
import Admin from "@/pages/admin";
import AdminTimeSlots from "@/pages/admin-time-slots";
import AdminCalendar from "@/pages/admin-calendar";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/coaching-offers" component={CoachingOffers} />
      <Route path="/book-call" component={BookCall} />
      <Route path="/book-coaching-call" component={BookCoachingCall} />
      <Route path="/book-coaching-call-regular" component={BookCoachingCallRegular} />
      <Route path="/book-coaching-call-discounted" component={BookCoachingCallDiscounted} />
      <Route path="/book-coaching" component={BookCoaching} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout-coaching" component={CheckoutCoaching} />
      <Route path="/success" component={Success} />
      <Route path="/coaching-success" component={CoachingSuccess} />
      <ProtectedRoute path="/course" component={Course} />
      <ProtectedRoute path="/admin" component={Admin} />
      <ProtectedRoute path="/admin/time-slots" component={AdminTimeSlots} />
      <ProtectedRoute path="/admin/calendar" component={AdminCalendar} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Navigation />
          <SocialMedia variant="floating" />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
