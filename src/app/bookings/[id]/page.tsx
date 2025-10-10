"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { reservationAPI } from "@/lib/api/reservation.api";
import { reviewAPI } from "@/lib/api/review.api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingHeader } from "@/components/bookings/bookingHeader";
import { PropertyInfo } from "@/components/bookings/propertyInfo";
import { PaymentUploadSection } from "@/components/bookings/paymentUploadSelection";
import { PaymentProofStatus } from "@/components/bookings/paymentProofStatus";
import { ReviewSection } from "@/components/bookings/reviewSection";
import { BookingActions } from "@/components/bookings/bookingActions";
import { ReviewDialog } from "@/components/bookings/reviewDialog";

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();
  const bookingId = parseInt(params.id as string);

  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    loadBookingDetail();
    checkCanReview();
  }, []);

  const loadBookingDetail = async () => {
    setIsLoading(true);
    try {
      const response = await reservationAPI.getReservationDetail(bookingId, token!);
      if (response.data) {
        setBooking(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load booking detail");
      router.push("/bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const checkCanReview = async () => {
    try {
      const response = await reviewAPI.canUserReview(bookingId, token!);
      setCanReview(response.data.canReview);
    } catch (error) {
      setCanReview(false);
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

  if (!booking) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <BookingHeader booking={booking} />
            <PropertyInfo booking={booking} />
            
            <PaymentUploadSection 
              booking={booking} 
              onUploadSuccess={loadBookingDetail}
            />

            <PaymentProofStatus booking={booking} />

            {canReview && (
              <ReviewSection onWriteReview={() => setShowReviewDialog(true)} />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BookingActions 
              booking={booking} 
              onCancel={loadBookingDetail}
            />
          </div>
        </div>
      </main>

      {showReviewDialog && (
        <ReviewDialog
          bookingId={bookingId}
          propertyId={booking.property.id}
          propertyName={booking.property.name}
          onClose={() => {
            setShowReviewDialog(false);
            checkCanReview();
          }}
        />
      )}

      <Footer />
    </div>
  );
}