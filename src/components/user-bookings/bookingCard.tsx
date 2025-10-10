"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Eye, Calendar, Clock, Check, X } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface BookingCardProps {
  booking: any;
}

export function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter();

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
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-6">
          {/* Image */}
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

          {/* Content */}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                <p className="font-semibold text-gray-900">#{booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Check-in - Check-out
                </p>
                <p className="font-semibold text-gray-900">
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Price</p>
                <p className="font-bold text-green-600">
                  {formatCurrency(Number(booking.totalPrice))}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push(`/bookings/${booking.id}`)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>

              {booking.status === "PENDING_PAYMENT" && (
                <Button
                  onClick={() => router.push(`/bookings/${booking.id}#upload`)}
                  variant="outline"
                  className="rounded-xl border-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Upload Payment
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}