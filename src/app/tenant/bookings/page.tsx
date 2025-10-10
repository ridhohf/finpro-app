"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { reservationAPI } from "@/lib/api/reservation.api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BookingStats } from "@/components/tenant/bookings/bookingStats";
import { BookingFilters } from "@/components/tenant/bookings/bookingFilters";
import { BookingsList } from "@/components/tenant/bookings/bookinglist";
import { EmptyState } from "@/components/tenant/bookings/emptyState";

export default function TenantBookingsPage() {
  const { token } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    propertyId: "",
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await reservationAPI.getTenantReservations(
        token!,
        filters.status,
        filters.propertyId ? parseInt(filters.propertyId) : undefined
      );

      if (response.data) {
        setBookings(response.data.bookings || []);
        setProperties(response.data.properties || []);
      }
    } catch (error: any) {
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Bookings</h1>
        <p className="text-gray-600">Manage guest reservations</p>
      </div>

      <BookingStats bookings={bookings} />

      <BookingFilters
        filters={filters}
        properties={properties}
        onFilterChange={setFilters}
      />

      {bookings.length > 0 ? (
        <BookingsList bookings={bookings} onUpdate={loadData} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
