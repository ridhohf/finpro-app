"use client";

import { ProtectedRoute } from "@/components/auth/protectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tenantAPI } from "@/lib/api/tenant.api";
import { useAuthStore } from "@/lib/store/auth.store";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RoomAvailabilityPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();
  const propertyId = parseInt(params.id as string);
  const roomId = parseInt(params.roomId as string);

  const [isLoading, setIsLoading] = useState(true);
  const [room, setRoom] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [bulkData, setBulkData] = useState({
    startDate: "",
    endDate: "",
    isAvailable: "true",
    priceOverride: "",
  });

  useEffect(() => {
    loadRoomData();
  }, []);

  useEffect(() => {
    loadAvailabilities();
  }, [currentDate]);

  const loadRoomData = async () => {
    try {
      const response = await tenantAPI.getRoomById(roomId, token!);
      if (response.data) {
        setRoom(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load room data");
      router.push(`/tenant/properties/${propertyId}/rooms`);
    }
  };

  const loadAvailabilities = async () => {
    setIsLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const response = await tenantAPI.getAvailability(
        roomId,
        month,
        year,
        token!
      );
      if (response.data) {
        setAvailabilities(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load availability data");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getAvailabilityForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availabilities.find((a) => a.date.startsWith(dateStr));
  };

  const handleToggleAvailability = async (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const current = getAvailabilityForDate(day);
    const newAvailability = !current?.isAvailable;

    try {
      await tenantAPI.updateSingleAvailability(
        roomId,
        {
          date: dateStr,
          isAvailable: newAvailability,
        },
        token!
      );
      toast.success(
        `Room marked as ${newAvailability ? "available" : "unavailable"}`
      );
      loadAvailabilities();
    } catch (error: any) {
      toast.error("Failed to update availability");
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkData.startDate || !bulkData.endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (new Date(bulkData.startDate) > new Date(bulkData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setIsSaving(true);
    try {
      const data: any = {
        startDate: bulkData.startDate,
        endDate: bulkData.endDate,
        isAvailable: bulkData.isAvailable === "true",
      };

      if (bulkData.priceOverride) {
        data.priceOverride = parseFloat(bulkData.priceOverride);
      }

      await tenantAPI.bulkUpdateAvailability(roomId, data, token!);
      toast.success("Availability updated successfully");
      setBulkData({
        startDate: "",
        endDate: "",
        isAvailable: "true",
        priceOverride: "",
      });
      setIsBulkMode(false);
      loadAvailabilities();
    } catch (error: any) {
      toast.error(error.message || "Failed to update availability");
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <ProtectedRoute requiredRole="tenant">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() =>
                router.push(`/tenant/properties/${propertyId}/rooms`)
              }
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rooms
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Room Availability
                </h1>
                <p className="text-gray-600">{room?.name || "Loading..."}</p>
              </div>
              <Button
                onClick={() => setIsBulkMode(!isBulkMode)}
                variant={isBulkMode ? "default" : "outline"}
                className={isBulkMode ? "bg-blue-600" : ""}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Bulk Update
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Bulk Update Form */}
          {isBulkMode && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Bulk Update Availability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={bulkData.startDate}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Input
                    type="date"
                    value={bulkData.endDate}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, endDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={bulkData.isAvailable}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, isAvailable: e.target.value })
                    }
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Price Override (Optional)</Label>
                  <Input
                    type="number"
                    placeholder="Leave empty for base price"
                    value={bulkData.priceOverride}
                    onChange={(e) =>
                      setBulkData({
                        ...bulkData,
                        priceOverride: e.target.value,
                      })
                    }
                    min="0"
                    step="1000"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleBulkUpdate}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Apply Changes"
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsBulkMode(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Calendar */}
          <Card className="p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span>Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                <span>Custom Price</span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {/* Day Names */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-semibold text-gray-600 py-2"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth().map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} className="p-2"></div>;
                    }

                    const availability = getAvailabilityForDate(day);
                    const isAvailable = availability?.isAvailable ?? true;
                    const hasCustomPrice = availability?.priceOverride;

                    return (
                      <button
                        key={day}
                        onClick={() => handleToggleAvailability(day)}
                        className={`
                          aspect-square p-2 rounded-lg border-2 transition-all
                          hover:shadow-md relative
                          ${
                            isAvailable
                              ? hasCustomPrice
                                ? "bg-blue-100 border-blue-300 hover:bg-blue-200"
                                : "bg-green-100 border-green-300 hover:bg-green-200"
                              : "bg-red-100 border-red-300 hover:bg-red-200"
                          }
                        `}
                      >
                        <div className="text-sm font-semibold">{day}</div>
                        {hasCustomPrice && (
                          <div className="text-xs mt-1 font-medium">
                            {formatCurrency(Number(availability.priceOverride))}
                          </div>
                        )}
                        <div className="absolute top-1 right-1">
                          {isAvailable ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <X className="w-3 h-3 text-red-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Room Info */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Base Price per Night</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {room && formatCurrency(Number(room.basePrice))}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  Click on any date to toggle availability
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
