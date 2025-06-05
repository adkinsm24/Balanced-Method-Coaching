import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ConsultationRequest } from "@shared/schema";

export default function Admin() {
  const {
    data: requests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/consultation-requests"],
    queryFn: async () => {
      const response = await fetch("/api/consultation-requests");
      if (!response.ok) throw new Error("Failed to fetch requests");
      return response.json() as Promise<ConsultationRequest[]>;
    },
  });

  if (isLoading)
    return <div className="p-8">Loading consultation requests...</div>;
  if (error)
    return <div className="p-8 text-red-600">Error loading requests</div>;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Consultation Requests
        </h1>

        {requests && requests.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 text-center">
                No consultation requests yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {requests?.map((request) => (
              <Card key={request.id} className="shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      {request.firstName} {request.lastName}
                    </CardTitle>
                    <Badge variant="outline">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Contact Information
                      </h3>
                      <p>
                        <strong>Email:</strong> {request.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {request.phone}
                      </p>
                      <p>
                        <strong>Contact Method:</strong> {request.contactMethod}
                      </p>
                      <p>
                        <strong>Preferred Time:</strong>{" "}
                        {request.selectedTimeSlot}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Goals
                      </h3>
                      <p className="text-gray-600">{request.goals}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Previous Experience
                      </h3>
                      <p className="text-gray-600">
                        {request.experience || "None provided"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Eating Out Frequency
                      </h3>
                      <p className="text-gray-600">
                        {request.eatingOut || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Typical Day of Eating
                    </h3>
                    <p className="text-gray-600">
                      {request.typicalDay || "Not provided"}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Beverages
                      </h3>
                      <p className="text-gray-600">
                        {request.drinks || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Emotional Eating
                      </h3>
                      <p className="text-gray-600">
                        {request.emotionalEating || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Medications
                    </h3>
                    <p className="text-gray-600">
                      {request.medications || "None listed"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
