import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/footer";

type BookedSlot = {
  id: number;
  timeSlot: string;
  consultationRequestId: number;
  bookedAt: string;
};

type ConsultationRequest = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  selectedTimeSlot: string;
  goals: string;
  status: string;
  createdAt: string;
};

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();
  const [newSlot, setNewSlot] = useState({ value: "", label: "" });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch booked slots
  const { data: bookedSlots, isLoading: bookedSlotsLoading } = useQuery<BookedSlot[]>({
    queryKey: ["/api/admin/booked-slots"],
    retry: false,
  });

  // Fetch consultation requests
  const { data: consultationRequests, isLoading: requestsLoading } = useQuery<ConsultationRequest[]>({
    queryKey: ["/api/consultation-requests"],
    retry: false,
  });

  // Fetch available slots
  const { data: availableSlots } = useQuery<Array<{value: string, label: string}>>({
    queryKey: ["/api/available-time-slots"],
    retry: false,
  });

  // Delete booked slot mutation
  const deleteSlotMutation = useMutation({
    mutationFn: async (slotId: number) => {
      const response = await fetch(`/api/admin/booked-slots/${slotId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete slot");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Time slot has been freed up and is now available for booking.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/booked-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/available-time-slots"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete time slot.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteSlot = (slotId: number) => {
    if (confirm("Are you sure you want to free up this time slot? It will become available for new bookings.")) {
      deleteSlotMutation.mutate(slotId);
    }
  };

  const formatTimeSlot = (timeSlot: string) => {
    const slotMap: Record<string, string> = {
      "mon-6am": "Monday 6:00 AM EST",
      "mon-630am": "Monday 6:30 AM EST",
      "mon-730am": "Monday 7:30 AM EST",
      "mon-8am": "Monday 8:00 AM EST",
      "mon-830am": "Monday 8:30 AM EST",
      "mon-930am": "Monday 9:30 AM EST",
      "mon-10am": "Monday 10:00 AM EST",
      "mon-1030am": "Monday 10:30 AM EST",
      "mon-11am": "Monday 11:00 AM EST",
      "mon-1130am": "Monday 11:30 AM EST",
      "mon-12pm": "Monday 12:00 PM EST",
      "tue-6am": "Tuesday 6:00 AM EST",
      "tue-630am": "Tuesday 6:30 AM EST",
      "tue-7am": "Tuesday 7:00 AM EST",
      "tue-730am": "Tuesday 7:30 AM EST",
      "tue-8am": "Tuesday 8:00 AM EST",
      "tue-830am": "Tuesday 8:30 AM EST",
      "tue-9am": "Tuesday 9:00 AM EST",
      "tue-930am": "Tuesday 9:30 AM EST",
      "tue-1030am": "Tuesday 10:30 AM EST",
      "tue-11am": "Tuesday 11:00 AM EST",
      "tue-1130am": "Tuesday 11:30 AM EST",
      "tue-12pm": "Tuesday 12:00 PM EST",
      "wed-6am": "Wednesday 6:00 AM EST",
      "wed-630am": "Wednesday 6:30 AM EST",
      "wed-7am": "Wednesday 7:00 AM EST",
      "wed-730am": "Wednesday 7:30 AM EST",
      "wed-830am": "Wednesday 8:30 AM EST",
      "wed-9am": "Wednesday 9:00 AM EST",
      "wed-930am": "Wednesday 9:30 AM EST",
      "wed-1030am": "Wednesday 10:30 AM EST",
      "wed-1130am": "Wednesday 11:30 AM EST",
      "thu-6am": "Thursday 6:00 AM EST",
      "thu-630am": "Thursday 6:30 AM EST",
      "thu-7am": "Thursday 7:00 AM EST",
      "thu-8am": "Thursday 8:00 AM EST",
      "thu-830am": "Thursday 8:30 AM EST",
      "thu-930am": "Thursday 9:30 AM EST",
      "thu-10am": "Thursday 10:00 AM EST",
      "thu-11am": "Thursday 11:00 AM EST",
      "thu-1130am": "Thursday 11:30 AM EST",
      "thu-12pm": "Thursday 12:00 PM EST",
      "fri-6am": "Friday 6:00 AM EST",
      "fri-630am": "Friday 6:30 AM EST",
      "fri-7am": "Friday 7:00 AM EST",
      "fri-730am": "Friday 7:30 AM EST",
      "fri-8am": "Friday 8:00 AM EST",
      "fri-830am": "Friday 8:30 AM EST",
      "fri-1030am": "Friday 10:30 AM EST",
      "fri-11am": "Friday 11:00 AM EST",
      "fri-1130am": "Friday 11:30 AM EST",
      "fri-12pm": "Friday 12:00 PM EST",
    };
    return slotMap[timeSlot] || timeSlot;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-secondary mb-8">Booking Administration</h1>
        
        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {bookedSlots?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Available Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {availableSlots?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {consultationRequests?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booked Slots Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Current Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookedSlotsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="mt-2 text-gray-600">Loading bookings...</p>
              </div>
            ) : bookedSlots && bookedSlots.length > 0 ? (
              <div className="space-y-4">
                {bookedSlots.map((slot) => {
                  const request = consultationRequests?.find(r => r.id === slot.consultationRequestId);
                  return (
                    <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{formatTimeSlot(slot.timeSlot)}</Badge>
                          <Badge variant={request?.status === 'confirmed' ? 'default' : 'secondary'}>
                            {request?.status || 'pending'}
                          </Badge>
                        </div>
                        {request && (
                          <div className="text-sm text-gray-600">
                            <p><strong>{request.firstName} {request.lastName}</strong></p>
                            <p>{request.email} | {request.phone}</p>
                            <p className="mt-1">{request.goals.substring(0, 100)}...</p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Booked: {new Date(slot.bookedAt).toLocaleDateString()} at {new Date(slot.bookedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="ml-4 text-red-600 hover:text-red-700"
                        disabled={deleteSlotMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                        Free Up
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No bookings yet. When people book consultation calls, they'll appear here.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Slots Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Available Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableSlots && availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <Badge key={slot.value} variant="secondary" className="p-2 text-center">
                    {slot.label}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                All time slots are currently booked.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  );
}