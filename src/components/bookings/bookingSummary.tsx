"use client";

import { Building2, Calendar, Users } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface BookingSummaryProps {
  room: any;
  property: any;
  checkIn: string;
  checkOut: string;
  guests: number;
  duration: number;
  totalPrice: number;
}

export function BookingSummary({
  room,
  property,
  checkIn,
  checkOut,
  guests,
  duration,
  totalPrice,
}: BookingSummaryProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="sticky top-24 space-y-6">
      {/* Property Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="aspect-video relative">
          {room.picture?.[0] ? (
            <img
              src={room.picture[0]}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Building2 className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{room.name}</h3>
          <p className="text-gray-600 mb-4">{property.name}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Check-in</span>
              </div>
              <span className="font-semibold text-gray-900">
                {formatDate(checkIn)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Check-out</span>
              </div>
              <span className="font-semibold text-gray-900">
                {formatDate(checkOut)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">Guests</span>
              </div>
              <span className="font-semibold text-gray-900">{guests}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Price Details</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {formatCurrency(room.currentPrice || room.basePrice)} x {duration}{" "}
              nights
            </span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totalPrice)}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
