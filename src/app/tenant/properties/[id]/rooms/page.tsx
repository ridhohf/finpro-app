"use client";

import { ProtectedRoute } from "@/components/auth/protectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tenantAPI } from "@/lib/api/tenant.api";
import { useAuthStore } from "@/lib/store/auth.store";
import {
  ArrowLeft,
  Bed,
  Calendar,
  DollarSign,
  Edit,
  Loader2,
  Plus,
  TrendingUp,
  Trash2,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PropertyRoomsPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();
  const propertyId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    loadPropertyData();
    loadRooms();
  }, []);

  const loadPropertyData = async () => {
    try {
      const response = await tenantAPI.getPropertyById(propertyId, token!);
      if (response.data) {
        setProperty(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load property data");
      router.push("/tenant/properties");
    }
  };

  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const response = await tenantAPI.getRoomsByProperty(propertyId, token!);
      if (response.data) {
        setRooms(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (room: any) => {
    if (!confirm(`Are you sure you want to delete "${room.name}"?`)) return;

    try {
      await tenantAPI.deleteRoom(room.id, token!);
      toast.success("Room deleted successfully");
      loadRooms();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete room");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ProtectedRoute requiredRole="tenant">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/tenant/properties")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Manage Rooms
                </h1>
                <p className="text-gray-600">
                  {property?.name || "Loading..."}
                </p>
              </div>
              <Button
                onClick={() =>
                  router.push(`/tenant/properties/${propertyId}/rooms/new`)
                }
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Room
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading rooms...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && rooms.length === 0 && (
            <Card className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-4">
                <Bed className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Rooms Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Add rooms to start accepting bookings for this property
              </p>
              <Button
                onClick={() =>
                  router.push(`/tenant/properties/${propertyId}/rooms/new`)
                }
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Room
              </Button>
            </Card>
          )}

          {/* Rooms Grid */}
          {!isLoading && rooms.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  <div className="flex flex-col">
                    {/* Image */}
                    <div className="w-full h-48 bg-gray-200 relative">
                      {room.picture?.[0] ? (
                        <img
                          src={room.picture[0]}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Bed className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {room.name}
                      </h3>

                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {room.description}
                      </p>

                      {/* Room Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Base Price</p>
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(Number(room.basePrice))}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Users className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Max Guests</p>
                            <p className="font-semibold text-gray-900">
                              {room.maxGuests} guests
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/tenant/properties/${propertyId}/rooms/${room.id}/edit`
                            )
                          }
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(room)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                          onClick={() =>
                            router.push(
                              `/tenant/properties/${propertyId}/rooms/${room.id}/availability`
                            )
                          }
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Availability
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                          onClick={() =>
                            router.push(
                              `/tenant/properties/${propertyId}/rooms/${room.id}/peak-seasons`
                            )
                          }
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Peak Seasons
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
