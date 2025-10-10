"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { propertyAPI } from "@/lib/api/property.api";
import { reservationAPI } from "@/lib/api/reservation.api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingFormHeader } from "@/components/bookings/bookingFormHeader";
import { ImportantNotice } from "@/components/bookings/importantNotice";
import { GuestInformation } from "@/components/bookings/guestInformation";
import { PaymentInformation } from "@/components/bookings/paymentInformation";
import { BookingSummary } from "@/components/bookings/bookingSummary";
import { useBookingCalculations } from "@/hooks/useBookingCalculations";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, token, isAuthenticated } = useAuthStore();

  const propertyId = parseInt(params.id as string);
  const roomId = parseInt(searchParams.get("roomId") || "0");
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = parseInt(searchParams.get("guests") || "1");

  const [property, setProperty] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { duration, totalPrice } = useBookingCalculations(
    room,
    checkIn,
    checkOut
  );

  useEffect(() => {
    validateAndLoadData();
  }, []);

  const validateAndLoadData = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to make a booking");
      router.push(`/login?redirect=/properties/${propertyId}/book`);
      return;
    }

    if (!roomId || !checkIn || !checkOut) {
      toast.error("Invalid booking parameters");
      router.push(`/properties/${propertyId}`);
      return;
    }

    await loadBookingData();
  };

  const loadBookingData = async () => {
    setIsLoading(true);
    try {
      const response = await propertyAPI.getPropertyDetail(
        propertyId,
        checkIn,
        checkOut
      );

      if (response.data) {
        setProperty(response.data);
        const selectedRoom = response.data.rooms.find(
          (r: any) => r.id === roomId
        );
        if (selectedRoom) {
          setRoom(selectedRoom);
        } else {
          throw new Error("Room not found");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load booking data");
      router.push(`/properties/${propertyId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.isVerified) {
      toast.error("Please verify your email before booking");
      return;
    }

    // 🔍 ADD THIS DEBUG
    console.log("Token:", token);
    console.log("User:", user);
    console.log("Is Authenticated:", isAuthenticated);

    if (!token) {
      toast.error("Please login to continue");
      router.push(`/login?redirect=/properties/${propertyId}/book`);
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        roomId,
        checkIn,
        checkOut,
        duration,
        totalPrice,
      };

      // 🔍 ADD THIS DEBUG
      console.log("Booking Data:", bookingData);
      console.log("Sending to API with token:", token.substring(0, 20) + "...");

      const response = await reservationAPI.createReservation(
        bookingData,
        token
      );

      if (response.data) {
        toast.success("Booking created successfully!");
        router.push(`/bookings/${response.data.id}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
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

  if (!property || !room) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <BookingFormHeader />
            <ImportantNotice />

            <form onSubmit={handleSubmit} className="space-y-6">
              <GuestInformation user={user} guests={guests} />
              <PaymentInformation property={property} />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-lg font-semibold shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    ✓ Confirm Booking
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <BookingSummary
              room={room}
              property={property}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              duration={duration}
              totalPrice={totalPrice}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
