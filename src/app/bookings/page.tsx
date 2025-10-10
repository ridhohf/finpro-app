"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { reservationAPI } from "@/lib/api/reservation.api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingsHeader } from "@/components/user-bookings/bookingHeader";
import { BookingsFilters } from "@/components/user-bookings/bookingFilters";
import { BookingsGrid } from "@/components/user-bookings/bookingGrid";
import { EmptyBookings } from "@/components/user-bookings/emptyBooking";

export default function BookingsListPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();

  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view bookings");
      router.push("/login");
      return;
    }
    loadBookings();
  }, [filters.status]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const response = await reservationAPI.getUserReservations(
        token!,
        filters.status,
        filters.search
      );
      if (response.data) {
        setBookings(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    loadBookings();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <BookingsHeader />

        <BookingsFilters
          filters={filters}
          onFilterChange={setFilters}
          onSearch={handleSearch}
        />

        {bookings.length > 0 ? (
          <BookingsGrid bookings={bookings} />
        ) : (
          <EmptyBookings />
        )}
      </main>

      <Footer />
    </div>
  );
}
