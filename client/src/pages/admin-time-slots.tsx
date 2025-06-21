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
import { Trash2, Plus, Clock, Calendar, Edit } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

const timeSlotSchema = z.object({
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
  dayOfWeek: z.string().min(1, "Day of week is required"),
  timeOfDay: z.string().min(1, "Time of day is required"),
});

type TimeSlotForm = z.infer<typeof timeSlotSchema>;

const DAYS_OF_WEEK = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
];

const TIMES_OF_DAY = [
  { value: "6am", label: "6:00 AM" },
  { value: "630am", label: "6:30 AM" },
  { value: "7am", label: "7:00 AM" },
  { value: "730am", label: "7:30 AM" },
  { value: "8am", label: "8:00 AM" },
  { value: "830am", label: "8:30 AM" },
  { value: "9am", label: "9:00 AM" },
  { value: "930am", label: "9:30 AM" },
  { value: "10am", label: "10:00 AM" },
  { value: "1030am", label: "10:30 AM" },
  { value: "11am", label: "11:00 AM" },
  { value: "1130am", label: "11:30 AM" },
  { value: "12pm", label: "12:00 PM" },
  { value: "1230pm", label: "12:30 PM" },
  { value: "1pm", label: "1:00 PM" },
  { value: "130pm", label: "1:30 PM" },
  { value: "2pm", label: "2:00 PM" },
  { value: "230pm", label: "2:30 PM" },
  { value: "3pm", label: "3:00 PM" },
  { value: "330pm", label: "3:30 PM" },
  { value: "4pm", label: "4:00 PM" },
  { value: "430pm", label: "4:30 PM" },
  { value: "5pm", label: "5:00 PM" },
  { value: "530pm", label: "5:30 PM" },
  { value: "6pm", label: "6:00 PM" },
  { value: "630pm", label: "6:30 PM" },
  { value: "7pm", label: "7:00 PM" },
  { value: "730pm", label: "7:30 PM" },
  { value: "8pm", label: "8:00 PM" },
];

export default function AdminTimeSlots() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSlot, setEditingSlot] = useState<any>(null);

  const form = useForm<TimeSlotForm>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      value: "",
      label: "",
      dayOfWeek: "",
      timeOfDay: "",
    },
  });

  const { data: timeSlots, isLoading } = useQuery({
    queryKey: ["/api/admin/time-slots"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: TimeSlotForm) => {
      const response = await apiRequest("POST", "/api/admin/time-slots", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Time Slot Added",
        description: "New time slot has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/time-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/available-time-slots"] });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create time slot.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TimeSlotForm }) => {
      const response = await apiRequest("PUT", `/api/admin/time-slots/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Time Slot Updated",
        description: "Time slot has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/time-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/available-time-slots"] });
      setEditingSlot(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update time slot.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/time-slots/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Time Slot Deleted",
        description: "Time slot has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/time-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/available-time-slots"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete time slot.",
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/admin/time-slots/${id}/toggle`, { isActive });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Time Slot Updated",
        description: "Time slot status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/time-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/available-time-slots"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update time slot status.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (slot: any) => {
    setEditingSlot(slot);
    form.setValue("value", slot.value);
    form.setValue("label", slot.label);
    form.setValue("dayOfWeek", slot.dayOfWeek);
    form.setValue("timeOfDay", slot.timeOfDay);
  };

  const handleCancelEdit = () => {
    setEditingSlot(null);
    form.reset();
  };

  const generateValue = (dayOfWeek: string, timeOfDay: string) => {
    return `${dayOfWeek}-${timeOfDay}`;
  };

  const generateLabel = (dayOfWeek: string, timeOfDay: string) => {
    const day = DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label;
    const time = TIMES_OF_DAY.find(t => t.value === timeOfDay)?.label;
    return `${day} ${time} EST`;
  };

  const onSubmit = (data: TimeSlotForm) => {
    const finalData = {
      ...data,
      value: generateValue(data.dayOfWeek, data.timeOfDay),
      label: generateLabel(data.dayOfWeek, data.timeOfDay),
    };

    if (editingSlot) {
      updateMutation.mutate({ id: editingSlot.id, data: finalData });
    } else {
      createMutation.mutate(finalData);
    }
  };

  const groupedSlots = timeSlots?.reduce((acc: any, slot: any) => {
    if (!acc[slot.dayOfWeek]) {
      acc[slot.dayOfWeek] = [];
    }
    acc[slot.dayOfWeek].push(slot);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Manage Available Time Slots
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Add, edit, or remove available booking time slots for coaching calls.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add/Edit Form */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    {editingSlot ? "Edit Time Slot" : "Add New Time Slot"}
                  </CardTitle>
                  <CardDescription>
                    {editingSlot ? "Update the selected time slot" : "Create a new available time slot"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="dayOfWeek"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Day of Week</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DAYS_OF_WEEK.map((day) => (
                                  <SelectItem key={day.value} value={day.value}>
                                    {day.label}
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
                        name="timeOfDay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIMES_OF_DAY.map((time) => (
                                  <SelectItem key={time.value} value={time.value}>
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        <Button 
                          type="submit" 
                          className="flex-1"
                          disabled={createMutation.isPending || updateMutation.isPending}
                        >
                          {editingSlot ? "Update" : "Add"} Time Slot
                        </Button>
                        {editingSlot && (
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Existing Time Slots */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Current Time Slots
                  </CardTitle>
                  <CardDescription>
                    Manage your available booking times by day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Loading time slots...</p>
                    </div>
                  ) : !timeSlots?.length ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No time slots configured yet</p>
                      <p className="text-sm mt-2">Add your first time slot using the form</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {DAYS_OF_WEEK.map((day) => {
                        const daySlots = groupedSlots?.[day.value] || [];
                        if (daySlots.length === 0) return null;

                        return (
                          <div key={day.value} className="space-y-3">
                            <h3 className="font-semibold text-lg text-gray-900">{day.label}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {daySlots.map((slot: any) => (
                                <div
                                  key={slot.id}
                                  className={`p-3 border rounded-lg ${
                                    slot.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      <span className={slot.isActive ? 'text-green-800' : 'text-gray-500'}>
                                        {TIMES_OF_DAY.find(t => t.value === slot.timeOfDay)?.label}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Badge variant={slot.isActive ? "default" : "secondary"}>
                                        {slot.isActive ? "Active" : "Inactive"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(slot)}
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={slot.isActive ? "secondary" : "default"}
                                      onClick={() => toggleActiveMutation.mutate({ 
                                        id: slot.id, 
                                        isActive: !slot.isActive 
                                      })}
                                    >
                                      {slot.isActive ? "Deactivate" : "Activate"}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => deleteMutation.mutate(slot.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}