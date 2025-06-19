import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus } from "lucide-react";
import { format, addDays, isSameDay, parseISO, isAfter, startOfDay } from "date-fns";
import "react-day-picker/dist/style.css";

interface TimeSlot {
  value: string;
  label: string;
}

interface CalendarSchedulerProps {
  availableSlots: TimeSlot[] | any[];
  selectedSlot?: string;
  onSlotSelect: (slot: string) => void;
  className?: string;
}

// Parse time slot value to get day and time information
function parseTimeSlot(slotValue: string): { day: string; time: string; date: Date } {
  const dayMap: { [key: string]: number } = {
    "mon": 1, "tue": 2, "wed": 3, "thu": 4, "fri": 5, "sat": 6, "sun": 0
  };
  
  const [dayStr, timeStr] = slotValue.split('-');
  const dayOfWeek = dayMap[dayStr];
  
  // Convert time string to display format
  let displayTime = timeStr.replace('am', ' AM').replace('pm', ' PM');
  displayTime = displayTime.replace(/(\d+)(?=AM|PM)/, '$1:00');
  displayTime = displayTime.replace(/(\d+)30/, '$1:30');
  
  // Calculate the next occurrence of this day
  const today = new Date();
  const currentDay = today.getDay();
  let daysUntilTarget = dayOfWeek - currentDay;
  if (daysUntilTarget <= 0) {
    daysUntilTarget += 7; // Next week
  }
  
  const targetDate = addDays(startOfDay(today), daysUntilTarget);
  
  return {
    day: dayStr,
    time: displayTime,
    date: targetDate
  };
}

// Group slots by date
function groupSlotsByDate(slots: TimeSlot[]): { [key: string]: TimeSlot[] } {
  const grouped: { [key: string]: TimeSlot[] } = {};
  
  slots.forEach(slot => {
    const { date } = parseTimeSlot(slot.value);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(slot);
  });
  
  return grouped;
}

// Generate Google Calendar link
function generateGoogleCalendarLink(slot: TimeSlot, userDetails: { name: string; email: string }): string {
  const { date, time } = parseTimeSlot(slot.value);
  
  // Create start and end times (assuming 1 hour duration)
  const startTime = new Date(date);
  const [timeOnly] = time.split(' ');
  const [hours, minutes = '0'] = timeOnly.split(':');
  startTime.setHours(parseInt(hours), parseInt(minutes));
  
  const endTime = new Date(startTime);
  endTime.setHours(startTime.getHours() + 1);
  
  const startISO = startTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endISO = endTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const title = encodeURIComponent('Nutrition Coaching Call');
  const details = encodeURIComponent(`
Nutrition Coaching Call with Balanced Method Coaching

Duration: 1 hour
Participant: ${userDetails.name} (${userDetails.email})

This is your scheduled nutrition coaching session. Please be prepared to discuss your health goals and current nutrition habits.
  `.trim());
  
  const location = encodeURIComponent('Video Call (details will be provided)');
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startISO}/${endISO}&details=${details}&location=${location}`;
}

export default function CalendarScheduler({ 
  availableSlots, 
  selectedSlot, 
  onSlotSelect,
  className = "" 
}: CalendarSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [groupedSlots, setGroupedSlots] = useState<{ [key: string]: TimeSlot[] }>({});
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });

  useEffect(() => {
    if (availableSlots) {
      setGroupedSlots(groupSlotsByDate(availableSlots));
    }
  }, [availableSlots]);

  useEffect(() => {
    // Try to get user details from form context or local storage
    const formData = document.querySelector('form');
    if (formData) {
      const firstNameInput = formData.querySelector('input[name="firstName"]') as HTMLInputElement;
      const lastNameInput = formData.querySelector('input[name="lastName"]') as HTMLInputElement;
      const emailInput = formData.querySelector('input[name="email"]') as HTMLInputElement;
      
      if (firstNameInput && lastNameInput && emailInput) {
        setUserDetails({
          name: `${firstNameInput.value} ${lastNameInput.value}`.trim(),
          email: emailInput.value
        });
      }
    }
  }, [selectedSlot]);

  // Get available dates
  const availableDates = Object.keys(groupedSlots).map(dateKey => new Date(dateKey));
  
  // Get slots for selected date
  const slotsForSelectedDate = selectedDate 
    ? groupedSlots[format(selectedDate, 'yyyy-MM-dd')] || []
    : [];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slot: string) => {
    onSlotSelect(slot);
  };

  const handleAddToCalendar = (slot: TimeSlot) => {
    if (!userDetails.name || !userDetails.email) {
      alert('Please fill in your name and email first before adding to calendar.');
      return;
    }
    
    const googleCalendarLink = generateGoogleCalendarLink(slot, userDetails);
    window.open(googleCalendarLink, '_blank');
  };

  const isDateAvailable = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return Object.keys(groupedSlots).includes(dateKey);
  };

  const isDateInPast = (date: Date) => {
    return !isAfter(date, startOfDay(new Date()));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Your Preferred Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose a Date</h3>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateInPast}
                modifiers={{
                  available: availableDates,
                }}
                modifiersStyles={{
                  available: {
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    fontWeight: 'bold',
                  },
                }}
                className="border rounded-lg p-4"
                showOutsideDays={false}
                fixedWeeks
              />
              <div className="text-sm text-muted-foreground">
                <Badge variant="secondary" className="mr-2">Blue dates</Badge>
                have available time slots
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Times</h3>
              {selectedDate ? (
                slotsForSelectedDate.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                    {slotsForSelectedDate.map(slot => {
                      const { time } = parseTimeSlot(slot.value);
                      const isSelected = selectedSlot === slot.value;
                      
                      return (
                        <div key={slot.value} className="flex items-center gap-2">
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            className="flex-1 justify-start"
                            onClick={() => handleSlotSelect(slot.value)}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {time}
                          </Button>
                          {isSelected && userDetails.name && userDetails.email && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddToCalendar(slot)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            >
                              <Plus className="h-4 w-4" />
                              Add to Calendar
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No available times for this date</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a date to see available times</p>
                </div>
              )}
            </div>
          </div>

          {selectedSlot && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  Selected: {availableSlots.find(s => s.value === selectedSlot)?.label}
                </span>
              </div>
              {userDetails.name && userDetails.email && (
                <Button
                  variant="link"
                  className="p-0 h-auto mt-2 text-green-700 dark:text-green-300"
                  onClick={() => {
                    const slot = availableSlots.find(s => s.value === selectedSlot);
                    if (slot) handleAddToCalendar(slot);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Google Calendar
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}