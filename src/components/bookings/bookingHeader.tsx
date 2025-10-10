"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Check, X } from "lucide-react";

interface BookingHeaderProps {
  booking: any;
}

export function BookingHeader({ booking }: BookingHeaderProps) {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (booking.status !== "PENDING_PAYMENT") return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expiresAt = new Date(booking.createdAt).getTime() + 60 * 60 * 1000;
      const remaining = expiresAt - now;

      if (remaining <= 0) {
        setTimeRemaining("Expired");
        clearInterval(timer);
      } else {
        const minutes = Math.floor((remaining / 1000 / 60) % 60);
        const seconds = Math.floor((remaining / 1000) % 60);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [booking]);

  const getStatusBadge = () => {
    const config: Record<
      string,
      { label: string; className: string; icon: any }
    > = {
      PENDING_PAYMENT: {
        label: "Waiting Payment",
        className: "bg-orange-100 text-orange-700 hover:bg-orange-200",
        icon: Clock,
      },
      PENDING_CONFIRMATION: {
        label: "Waiting Confirmation",
        className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        icon: Clock,
      },
      CONFIRMED: {
        label: "Confirmed",
        className: "bg-green-100 text-green-700 hover:bg-green-200",
        icon: Check,
      },
      CANCELLED: {
        label: "Cancelled",
        className: "bg-red-100 text-red-700 hover:bg-red-200",
        icon: X,
      },
      COMPLETED: {
        label: "Completed",
        className: "bg-blue-100 text-blue-700 hover:bg-blue-200",
        icon: Check,
      },
    };

    const statusConfig = config[booking.status] || config.PENDING_PAYMENT;
    const Icon = statusConfig.icon;

    return (
      <Badge
        className={`${statusConfig.className} border-0 text-base px-4 py-2`}
      >
        <Icon className="w-4 h-4 mr-2" />
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => router.push("/bookings")}
        className="mb-6 hover:bg-white rounded-xl"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Bookings
      </Button>

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Details
            </h1>
            <p className="text-gray-600">Booking ID: #{booking.id}</p>
          </div>
          {getStatusBadge()}
        </div>

        {booking.status === "PENDING_PAYMENT" && timeRemaining && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-700" />
              </div>
              <div>
                <h3 className="font-bold text-orange-900 mb-1">
                  Complete Payment Within:
                </h3>
                <p className="text-2xl font-bold text-orange-700">
                  {timeRemaining}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  Your booking will be automatically cancelled if not paid
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
