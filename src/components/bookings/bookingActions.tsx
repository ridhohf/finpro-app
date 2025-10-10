"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { reservationAPI } from "@/lib/api/reservation.api";
import { Button } from "@/components/ui/button";
import { Building2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BookingActionsProps {
  booking: any;
  onCancel: () => void;
}

export function BookingActions({ booking, onCancel }: BookingActionsProps) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isCancelling, setIsCancelling] = useState(false);

  const canCancel =
    booking.status === "PENDING_PAYMENT" &&
    !booking.paymentProofs?.some((p: any) => !p.isValid);

  const handleCancelBooking = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsCancelling(true);
    try {
      await reservationAPI.cancelReservation(booking.id, token!);
      toast.success("Booking cancelled successfully");
      onCancel();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
        <h3 className="font-bold text-gray-900 mb-4">Actions</h3>

        {canCancel && (
          <Button
            onClick={handleCancelBooking}
            disabled={isCancelling}
            variant="outline"
            className="w-full rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-600"
          >
            {isCancelling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel Booking
              </>
            )}
          </Button>
        )}

        <Button
          onClick={() => router.push(`/properties/${booking.property.id}`)}
          variant="outline"
          className="w-full rounded-xl border-2"
        >
          <Building2 className="w-4 h-4 mr-2" />
          View Property
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Contact the property for any questions
        </p>

        {booking?.property?.tenant?.tenantProfile?.phone && (
          <a
            href={`tel:${booking?.property?.tenant?.tenantProfile?.phone || ''}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <span className="text-sm font-semibold">
              {booking.property.tenant.tenantProfile.phone}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
