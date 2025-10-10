"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";

interface PropertyBookingSidebarProps {
  property: any;
  selectedDates: {
    checkIn: string;
    checkOut: string;
  };
  onDatesChange: (dates: any) => void;
}

export function PropertyBookingSidebar({
  property,
  selectedDates,
  onDatesChange,
}: PropertyBookingSidebarProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book");
      router.push(`/login?redirect=/properties/${property.id}`);
      return;
    }

    if (!user?.isVerified) {
      toast.error("Please verify your email before booking");
      return;
    }

    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    const availableRoom = property.rooms.find((r: any) => r.isAvailable !== false);

    if (!availableRoom) {
      toast.error("No rooms available for selected dates");
      return;
    }

    router.push(
      `/properties/${property.id}/book?roomId=${availableRoom.id}&checkIn=${selectedDates.checkIn}&checkOut=${selectedDates.checkOut}&guests=1`
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            Check-in
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            value={selectedDates.checkIn}
            onChange={(e) =>
              onDatesChange({
                ...selectedDates,
                checkIn: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            Check-out
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            value={selectedDates.checkOut}
            onChange={(e) =>
              onDatesChange({
                ...selectedDates,
                checkOut: e.target.value,
              })
            }
            min={selectedDates.checkIn}
          />
        </div>

        <Button
          onClick={handleBooking}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Now
        </Button>
      </div>
    </div>
  );
}