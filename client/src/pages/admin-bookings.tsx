import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Phone, Mail, User, Trash2, DollarSign } from "lucide-react";

interface ConsultationRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactMethod: string;
  selectedTimeSlot: string;
  goals: string;
  status: string;
  createdAt: string;
}

interface CoachingCall {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactMethod: string;
  selectedTimeSlot: string;
  goals: string;
  duration: number;
  amount: number;
  status: string;
  stripePaymentIntentId?: string;
  createdAt: string;
}

interface BookedSlot {
  id: number;
  timeSlot: string;
  duration: number;
  isSecondarySlot: boolean;
  primarySlotId?: number;
  consultationRequestId?: number;
  coachingCallId?: number;
  bookedAt: string;
}

export default function AdminBookingsPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  const { data: consultationRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ["/api/consultation-requests"],
    enabled: !!user,
  });

  const { data: coachingCalls, isLoading: loadingCalls } = useQuery({
    queryKey: ["/api/coaching-calls"],
    enabled: !!user,
  });

  const { data: bookedSlots, isLoading: loadingSlots } = useQuery({
    queryKey: ["/api/admin/booked-slots"],
    enabled: !!user,
  });

  const deleteRequestMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/consultation-requests/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Consultation request deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultation-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/booked-slots"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCallMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/coaching-calls/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Coaching call deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/coaching-calls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/booked-slots"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatTimeSlot = (timeSlot: string) => {
    const parts = timeSlot.split('-');
    if (parts.length >= 4) {
      const date = new Date(parts.slice(0, 3).join('-'));
      const time = parts[3];
      return `${date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })} at ${time}`;
    }
    return timeSlot;
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      confirmed: "default",
      pending: "secondary",
      paid: "default",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Booking Management
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              View and manage all consultation requests, coaching calls, and booked time slots.
            </p>
          </div>

          <Tabs defaultValue="consultation-requests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="consultation-requests">Free Intro Calls</TabsTrigger>
              <TabsTrigger value="coaching-calls">Paid Coaching Calls</TabsTrigger>
              <TabsTrigger value="booked-slots">All Booked Slots</TabsTrigger>
            </TabsList>

            <TabsContent value="consultation-requests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Free Introductory Calls ({consultationRequests?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingRequests ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                      <p className="mt-4 text-gray-600">Loading consultation requests...</p>
                    </div>
                  ) : consultationRequests && consultationRequests.length > 0 ? (
                    <div className="space-y-4">
                      {consultationRequests.map((request: ConsultationRequest) => (
                        <Card key={request.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">
                                  {request.firstName} {request.lastName}
                                </h3>
                                {getStatusBadge(request.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {request.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {request.phone}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {formatTimeSlot(request.selectedTimeSlot)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Contact via {request.contactMethod}
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm font-medium">Goals:</p>
                                <p className="text-sm text-gray-700">{request.goals}</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                Booked: {new Date(request.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteRequestMutation.mutate(request.id)}
                              disabled={deleteRequestMutation.isPending}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No consultation requests found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="coaching-calls" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Paid Coaching Calls ({coachingCalls?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingCalls ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                      <p className="mt-4 text-gray-600">Loading coaching calls...</p>
                    </div>
                  ) : coachingCalls && coachingCalls.length > 0 ? (
                    <div className="space-y-4">
                      {coachingCalls.map((call: CoachingCall) => (
                        <Card key={call.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">
                                  {call.firstName} {call.lastName}
                                </h3>
                                {getStatusBadge(call.status)}
                                <Badge variant="outline">{call.duration} min</Badge>
                                <Badge variant="outline">${(call.amount / 100).toFixed(2)}</Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {call.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {call.phone}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {formatTimeSlot(call.selectedTimeSlot)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Contact via {call.contactMethod}
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm font-medium">Goals:</p>
                                <p className="text-sm text-gray-700">{call.goals}</p>
                              </div>
                              {call.stripePaymentIntentId && (
                                <p className="text-xs text-gray-500">
                                  Payment ID: {call.stripePaymentIntentId}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">
                                Booked: {new Date(call.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteCallMutation.mutate(call.id)}
                              disabled={deleteCallMutation.isPending}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No coaching calls found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="booked-slots" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    All Booked Time Slots ({bookedSlots?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingSlots ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                      <p className="mt-4 text-gray-600">Loading booked slots...</p>
                    </div>
                  ) : bookedSlots && bookedSlots.length > 0 ? (
                    <div className="space-y-4">
                      {bookedSlots.map((slot: BookedSlot) => (
                        <Card key={slot.id} className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">
                                  {formatTimeSlot(slot.timeSlot)}
                                </h3>
                                <Badge variant="outline">{slot.duration} min</Badge>
                                {slot.isSecondarySlot && (
                                  <Badge variant="secondary">Secondary Slot</Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {slot.consultationRequestId && (
                                  <span>Free Intro Call (ID: {slot.consultationRequestId})</span>
                                )}
                                {slot.coachingCallId && (
                                  <span>Paid Coaching Call (ID: {slot.coachingCallId})</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                Booked: {new Date(slot.bookedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No booked slots found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}