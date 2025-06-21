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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Clock, Edit2, ToggleLeft, ToggleRight, Calendar, CalendarX, CalendarPlus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { format, addDays } from "date-fns";

const timeSlotSchema = z.object({
  dayOfWeek: z.string().min(1, "Day is required"),
  timeOfDay: z.string().min(1, "Time is required"),
});

const specificDateSlotSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

const dateOverrideSchema = z.object({
  date: z.string().min(1, "Date is required"),
  type: z.enum(["blocked", "blocked_specific", "available_only"]),
  timeSlots: z.array(z.string()).optional(), // For blocking specific time slots
  reason: z.string().optional(),
});

type TimeSlotForm = z.infer<typeof timeSlotSchema>;
type SpecificDateSlotForm = z.infer<typeof specificDateSlotSchema>;
type DateOverrideForm = z.infer<typeof dateOverrideSchema>;

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
  { value: "12am", label: "12:00 AM" },
  { value: "1230am", label: "12:30 AM" },
  { value: "1am", label: "1:00 AM" },
  { value: "130am", label: "1:30 AM" },
  { value: "2am", label: "2:00 AM" },
  { value: "230am", label: "2:30 AM" },
  { value: "3am", label: "3:00 AM" },
  { value: "330am", label: "3:30 AM" },
  { value: "4am", label: "4:00 AM" },
  { value: "430am", label: "4:30 AM" },
  { value: "5am", label: "5:00 AM" },
  { value: "530am", label: "5:30 AM" },
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
  { value: "830pm", label: "8:30 PM" },
  { value: "9pm", label: "9:00 PM" },
  { value: "930pm", label: "9:30 PM" },
  { value: "10pm", label: "10:00 PM" },
  { value: "1030pm", label: "10:30 PM" },
  { value: "11pm", label: "11:00 PM" },
  { value: "1130pm", label: "11:30 PM" },
];

export default function AdminTimeSlots() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSlot, setEditingSlot] = useState<any>(null);

  const form = useForm<TimeSlotForm>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      dayOfWeek: "",
      timeOfDay: "",
    },
  });

  const specificDateForm = useForm<SpecificDateSlotForm>({
    resolver: zodResolver(specificDateSlotSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  const dateOverrideForm = useForm<DateOverrideForm>({
    resolver: zodResolver(dateOverrideSchema),
    defaultValues: {
      date: "",
      type: "blocked",
      timeSlots: [],
      reason: "",
    },
  });

  const { data: timeSlots, isLoading } = useQuery({
    queryKey: ["/api/admin/time-slots"],
  });

  const { data: specificDateSlots, isLoading: slotsLoading } = useQuery({
    queryKey: ["/api/admin/specific-date-slots"],
  });

  const { data: dateOverrides, isLoading: overridesLoading } = useQuery({
    queryKey: ["/api/admin/date-overrides"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: TimeSlotForm) => {
      console.log("Submitting time slot data:", data);
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
      console.error("Time slot creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create time slot.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & TimeSlotForm) => {
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

  const toggleMutation = useMutation({
    mutationFn: async (id: number) => {
      const slot = timeSlots?.find((s: any) => s.id === id);
      if (!slot) return;
      
      const response = await apiRequest("PUT", `/api/admin/time-slots/${id}/toggle`, {
        isActive: !slot.isActive
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Time Slot Updated",
        description: "Time slot status has been changed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/time-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/available-time-slots"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle time slot.",
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

  const createSpecificSlotMutation = useMutation({
    mutationFn: async (data: SpecificDateSlotForm) => {
      const response = await apiRequest("POST", "/api/admin/specific-date-slots", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/specific-date-slots"] });
      toast({
        title: "Success",
        description: "Date range created successfully",
      });
      specificDateForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create specific date slot.",
        variant: "destructive",
      });
    },
  });

  const createDateOverrideMutation = useMutation({
    mutationFn: async (data: DateOverrideForm) => {
      const response = await apiRequest("POST", "/api/admin/date-overrides", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Date Override Added",
        description: "Date availability override has been created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/date-overrides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/available-time-slots"] });
      dateOverrideForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create date override.",
        variant: "destructive",
      });
    },
  });

  const deleteSpecificSlotMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/specific-date-slots/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Specific Date Slot Deleted",
        description: "Date-specific time slot has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/specific-date-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/available-time-slots"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete specific date slot.",
        variant: "destructive",
      });
    },
  });

  const deleteDateRangeMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log("Attempting to delete date range with ID:", id);
      await apiRequest("DELETE", `/api/admin/date-overrides/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/specific-date-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/date-overrides"] });
      toast({
        title: "Success",
        description: "Date range deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete date range",
        variant: "destructive",
      });
    },
  });

  const deleteDateOverrideMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/date-overrides/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Date Override Deleted",
        description: "Date override has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/date-overrides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/available-time-slots"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete date override.",
        variant: "destructive",
      });
    },
  });

  const generateValue = (dayOfWeek: string, timeOfDay: string) => {
    return `${dayOfWeek}-${timeOfDay}`;
  };

  const generateLabel = (dayOfWeek: string, timeOfDay: string) => {
    const day = DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label;
    const time = TIMES_OF_DAY.find(t => t.value === timeOfDay)?.label;
    return `${day} ${time} EST`;
  };

  const generateSpecificValue = (date: string, timeOfDay: string) => {
    return `${date}-${timeOfDay}`;
  };

  const generateSpecificLabel = (date: string, timeOfDay: string) => {
    const time = TIMES_OF_DAY.find(t => t.value === timeOfDay)?.label;
    const dateObj = new Date(date);
    const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');
    return `${formattedDate} ${time} EST`;
  };

  const onSubmit = (data: TimeSlotForm) => {
    console.log("Form submitted with data:", data);
    
    const finalData = {
      dayOfWeek: data.dayOfWeek,
      timeOfDay: data.timeOfDay,
      value: generateValue(data.dayOfWeek, data.timeOfDay),
      label: generateLabel(data.dayOfWeek, data.timeOfDay),
      isActive: true,
    };
    
    console.log("Final data to be sent:", finalData);

    if (editingSlot) {
      updateMutation.mutate({ id: editingSlot.id, ...finalData });
    } else {
      createMutation.mutate(finalData);
    }
  };

  const onSubmitSpecificSlot = (data: SpecificDateSlotForm) => {
    console.log("Specific date form submitted:", data);
    
    const finalData = {
      startDate: data.startDate,
      endDate: data.endDate,
      label: `Date Range: ${data.startDate} to ${data.endDate}`,
      isActive: true,
    };
    
    createSpecificSlotMutation.mutate(finalData);
  };

  const onSubmitDateOverride = (data: DateOverrideForm) => {
    createDateOverrideMutation.mutate(data);
  };

  // Generate dates that are within the specific date ranges
  const getAvailableDatesForOverrides = () => {
    if (!specificDateSlots?.length) return [];
    
    const allDates = [];
    
    // Get all dates from date ranges
    specificDateSlots.forEach((slot: any) => {
      if (slot.type === 'date_range' && slot.startDate && slot.endDate) {
        const start = new Date(slot.startDate);
        const end = new Date(slot.endDate);
        
        for (let currentDate = new Date(start); currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
          const dateStr = format(currentDate, 'yyyy-MM-dd');
          const dateLabel = format(currentDate, 'EEEE, MMM d');
          
          // Only add if not already in the list
          if (!allDates.find(d => d.value === dateStr)) {
            allDates.push({
              value: dateStr,
              label: dateLabel,
            });
          }
        }
      }
    });
    
    // Sort dates chronologically
    return allDates.sort((a, b) => new Date(a.value).getTime() - new Date(b.value).getTime());
  };

  const availableDatesForOverrides = getAvailableDatesForOverrides();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Calendar Management
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your booking calendar with recurring time slots, specific date appointments, and availability overrides.
            </p>
          </div>

          <Tabs defaultValue="recurring-slots" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recurring-slots">Recurring Slots</TabsTrigger>
              <TabsTrigger value="specific-dates">Specific Dates</TabsTrigger>
              <TabsTrigger value="date-overrides">Date Overrides</TabsTrigger>
            </TabsList>

            <TabsContent value="recurring-slots" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add/Edit Time Slot */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {editingSlot ? "Edit Time Slot" : "Add Time Slot"}
                    </CardTitle>
                    <CardDescription>
                      {editingSlot 
                        ? "Update the selected time slot" 
                        : "Create a new recurring time slot for weekly availability"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                        console.log("Form validation errors:", errors);
                        toast({
                          title: "Form Error",
                          description: "Please check all fields are filled correctly.",
                          variant: "destructive",
                        });
                      })} className="space-y-4">
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
                            onClick={() => {
                              console.log("Button clicked");
                              console.log("Form values:", form.getValues());
                              console.log("Form errors:", form.formState.errors);
                            }}
                          >
                            {editingSlot ? "Update Time Slot" : "Add Time Slot"}
                          </Button>
                          {editingSlot && (
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                setEditingSlot(null);
                                form.reset();
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Current Time Slots */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Current Time Slots
                    </CardTitle>
                    <CardDescription>
                      Manage your recurring weekly time slots
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
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No time slots configured</p>
                        <p className="text-sm mt-2">Add your first time slot to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {DAYS_OF_WEEK.map(({ value: dayValue, label: dayLabel }) => {
                          const daySlots = timeSlots.filter((slot: any) => slot.dayOfWeek === dayValue);
                          if (daySlots.length === 0) return null;
                          
                          // Sort slots by time order
                          const sortedSlots = daySlots.sort((a: any, b: any) => {
                            const aIndex = TIMES_OF_DAY.findIndex(t => t.value === a.timeOfDay);
                            const bIndex = TIMES_OF_DAY.findIndex(t => t.value === b.timeOfDay);
                            return aIndex - bIndex;
                          });
                          
                          return (
                            <div key={dayValue} className="space-y-2">
                              <h3 className="font-semibold text-lg text-blue-800">
                                {dayLabel}
                              </h3>
                              <div className="grid gap-2">
                                {sortedSlots.map((slot: any) => (
                                <div
                                  key={slot.id}
                                  className={`p-3 border rounded-lg ${
                                    slot.isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className={`font-medium ${slot.isActive ? 'text-blue-800' : 'text-gray-500'}`}>
                                        {TIMES_OF_DAY.find(t => t.value === slot.timeOfDay)?.label}
                                      </p>
                                      <p className="text-sm text-gray-500">{slot.value}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={slot.isActive ? "default" : "secondary"}>
                                        {slot.isActive ? "Active" : "Inactive"}
                                      </Badge>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => toggleMutation.mutate(slot.id)}
                                      >
                                        {slot.isActive ? (
                                          <ToggleRight className="h-3 w-3" />
                                        ) : (
                                          <ToggleLeft className="h-3 w-3" />
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setEditingSlot(slot);
                                          form.setValue("dayOfWeek", slot.dayOfWeek);
                                          form.setValue("timeOfDay", slot.timeOfDay);
                                        }}
                                      >
                                        <Edit2 className="h-3 w-3" />
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
            </TabsContent>

            <TabsContent value="specific-dates" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Specific Date Slot */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarPlus className="w-5 h-5" />
                      Add Date Range Slots
                    </CardTitle>
                    <CardDescription>
                      Block out or make available all dates in a range (e.g., 6/23/2025 to 9/30/2025)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...specificDateForm}>
                      <form onSubmit={specificDateForm.handleSubmit(onSubmitSpecificSlot)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={specificDateForm.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={specificDateForm.control}
                            name="endDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>





                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={createSpecificSlotMutation.isPending}
                        >
                          Add Date Range Slots
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Existing Specific Date Slots */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Specific Date Slots
                    </CardTitle>
                    <CardDescription>
                      Time slots created for specific date ranges
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {slotsLoading ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Loading specific date slots...</p>
                      </div>
                    ) : !specificDateSlots?.length ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No specific date slots configured</p>
                        <p className="text-sm mt-2">Add one-time slots for specific dates</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {specificDateSlots.map((slot: any) => (
                          <div
                            key={slot.id}
                            className={`p-3 border rounded-lg ${
                              slot.isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`font-medium ${slot.isActive ? 'text-blue-800' : 'text-gray-500'}`}>
                                  {slot.label}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {slot.type === 'date_range' ? (
                                    <span className="flex items-center gap-1">
                                      <CalendarPlus className="h-3 w-3" />
                                      {slot.date}
                                    </span>
                                  ) : (
                                    slot.date
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={slot.isActive ? "default" : "secondary"}>
                                  {slot.isActive ? "Active" : "Inactive"}
                                </Badge>
                                {slot.type === 'date_range' && (
                                  <Badge variant="outline">Range</Badge>
                                )}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    console.log("Deleting slot:", slot);
                                    if (slot.type === 'date_range') {
                                      deleteDateRangeMutation.mutate(slot.id);
                                    } else {
                                      deleteSpecificSlotMutation.mutate(slot.id);
                                    }
                                  }}
                                  disabled={deleteDateRangeMutation.isPending || deleteSpecificSlotMutation.isPending}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="date-overrides" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Date Override */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarX className="w-5 h-5" />
                      Add Date Override
                    </CardTitle>
                    <CardDescription>
                      Block dates or make only specific slots available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...dateOverrideForm}>
                      <form onSubmit={dateOverrideForm.handleSubmit(onSubmitDateOverride)} className="space-y-4">
                        <FormField
                          control={dateOverrideForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select date" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableDatesForOverrides.length > 0 ? (
                                    availableDatesForOverrides.map((date) => (
                                      <SelectItem key={date.value} value={date.value}>
                                        {date.label}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="" disabled>
                                      No date ranges available. Add date ranges first.
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={dateOverrideForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Override Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select override type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="blocked">Block All Time Slots</SelectItem>
                                  <SelectItem value="blocked_specific">Block Specific Time Slots</SelectItem>
                                  <SelectItem value="available_only">Available Only</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {dateOverrideForm.watch("type") === "blocked_specific" && (
                          <FormField
                            control={dateOverrideForm.control}
                            name="timeSlots"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Time Slots to Block</FormLabel>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                                  {TIMES_OF_DAY.map((time) => (
                                    <label key={time.value} className="flex items-center space-x-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={field.value?.includes(time.value) || false}
                                        onChange={(e) => {
                                          const currentValues = field.value || [];
                                          if (e.target.checked) {
                                            field.onChange([...currentValues, time.value]);
                                          } else {
                                            field.onChange(currentValues.filter(v => v !== time.value));
                                          }
                                        }}
                                        className="rounded"
                                      />
                                      <span className="text-sm">{time.label}</span>
                                    </label>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={dateOverrideForm.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reason (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="e.g., Holiday, Personal time off, Special event..."
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={createDateOverrideMutation.isPending || availableDatesForOverrides.length === 0}
                        >
                          {availableDatesForOverrides.length === 0 ? "No Date Ranges Available" : "Add Date Override"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Existing Date Overrides */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarX className="w-5 h-5" />
                      Date Overrides
                    </CardTitle>
                    <CardDescription>
                      Dates with special availability rules
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {overridesLoading ? (
                      <div className="text-center py-8">
                        <CalendarX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Loading date overrides...</p>
                      </div>
                    ) : !dateOverrides?.length ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No date overrides configured</p>
                        <p className="text-sm mt-2">
                          {availableDatesForOverrides.length === 0 
                            ? "Add date ranges first to enable date overrides" 
                            : "Block dates or set special availability within your date ranges"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dateOverrides.map((override: any) => (
                          <div
                            key={override.id}
                            className={`p-3 border rounded-lg ${
                              override.type === 'blocked' || override.type === 'blocked_specific' 
                                ? 'bg-red-50 border-red-200' 
                                : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`font-medium ${
                                  override.type === 'blocked' || override.type === 'blocked_specific' 
                                    ? 'text-red-800' 
                                    : 'text-blue-800'
                                }`}>
                                  {format(new Date(override.date), 'EEEE, MMMM d, yyyy')}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {override.type === 'blocked' ? 'All slots blocked' : 
                                   override.type === 'blocked_specific' ? 'Specific slots blocked' : 
                                   'Only specific slots available'}
                                </p>
                                {override.type === 'blocked_specific' && override.timeSlots && (
                                  <div className="mt-2">
                                    <p className="text-xs text-gray-600 mb-1">Blocked times:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {JSON.parse(override.timeSlots).map((timeSlot: string) => {
                                        const time = TIMES_OF_DAY.find(t => t.value === timeSlot);
                                        return (
                                          <Badge key={timeSlot} variant="secondary" className="text-xs">
                                            {time?.label || timeSlot}
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                {override.reason && (
                                  <p className="text-sm text-gray-500 mt-1">{override.reason}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={
                                  override.type === 'blocked' || override.type === 'blocked_specific' 
                                    ? "destructive" 
                                    : "default"
                                }>
                                  {override.type === 'blocked' ? 'All Blocked' : 
                                   override.type === 'blocked_specific' ? 'Specific Blocked' : 
                                   'Available Only'}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteDateOverrideMutation.mutate(override.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </main>
  );
}