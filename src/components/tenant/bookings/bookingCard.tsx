"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth.store";
import { reservationAPI } from "@/lib/api/reservation.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Check, X, Eye, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";
import { RejectDialog } from "./rejectDialog";

interface BookingCardProps {
  booking: any;
  onUpdate: () => void;
}

export function BookingCard({ booking, onUpdate }: BookingCardProps) {
  const { token } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleConfirmPayment = async () => {
    if (!confirm("Are you sure you want to confirm this payment?")) return;

    setIsProcessing(true);
    try {
      await reservationAPI.confirmPayment(booking.id, true, null, token!);
      toast.success("Payment confirmed successfully!");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelBooking = async () => {
    const reason = prompt("Please provide cancellation reason:");
    if (!reason?.trim()) return;

    setIsProcessing(true);
    try {
      await reservationAPI.tenantCancelReservation(
        booking.id,
        reason.trim(),
        token!
      );
      toast.success("Booking cancelled");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = () => {
    const config: Record<string, { label: string; className: string; icon: any }> = {
      PENDING_PAYMENT: {
        label: "Waiting Payment",
        className: "bg-orange-100 text-orange-700",
        icon: Clock,
      },
      PENDING_CONFIRMATION: {
        label: "Waiting Confirmation",
        className: "bg-yellow-100 text-yellow-700",
        icon: Clock,
      },
      CONFIRMED: {
        label: "Confirmed",
        className: "bg-green-100 text-green-700",
        icon: Check,
      },
      CANCELLED: {
        label: "Cancelled",
        className: "bg-red-100 text-red-700",
        icon: X,
      },
      COMPLETED: {
        label: "Completed",
        className: "bg-blue-100 text-blue-700",
        icon: Check,
      },
    };

    const statusConfig = config[booking.status] || config.PENDING_PAYMENT;
    const Icon = statusConfig.icon;

    return (
      <Badge className={`${statusConfig.className} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {statusConfig.label}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
              {booking.room.picture?.[0] ? (
                <img
                  src={booking.room.picture[0]}
                  alt={booking.room.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {booking.room.name}
                  </h3>
                  <p className="text-gray-600">{booking.property.name}</p>
                </div>
                {getStatusBadge()}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Guest</p>
                  <p className="font-semibold text-gray-900">{booking.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Check-in</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(booking.checkIn)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Check-out</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(booking.checkOut)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Price</p>
                  <p className="font-bold text-green-600">
                    {formatCurrency(Number(booking.totalPrice))}
                  </p>
                </div>
              </div>

              {booking.paymentProofs && booking.paymentProofs.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Payment Proof:
                  </p>
                  <img
                    src={booking.paymentProofs[0].image}
                    alt="Payment proof"
                    className="w-full max-w-xs h-32 object-contain bg-white rounded-xl border-2 border-gray-200"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {booking.status === "PENDING_CONFIRMATION" && (
                  <>
                    <Button
                      onClick={handleConfirmPayment}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirm Payment
                    </Button>
                    <Button
                      onClick={() => setShowRejectDialog(true)}
                      disabled={isProcessing}
                      variant="outline"
                      className="rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}

                {booking.status === "PENDING_PAYMENT" && (
                  <Button
                    onClick={handleCancelBooking}
                    disabled={isProcessing}
                    variant="outline"
                    className="rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel Booking
                  </Button>
                )}

                <Link href={`/tenant/bookings/${booking.id}`}>
                  <Button variant="outline" className="rounded-xl border-2">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRejectDialog && (
        <RejectDialog
          bookingId={booking.id}
          onClose={() => setShowRejectDialog(false)}
          onSuccess={() => {
            setShowRejectDialog(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}