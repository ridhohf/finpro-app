"use client";

import { Building2, Calendar, Users } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface PropertyInfoProps {
  booking: any;
}

export function PropertyInfo({ booking }: PropertyInfoProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Property Information
      </h2>

      <div className="flex gap-6 mb-6">
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {booking.room.name}
          </h3>
          <p className="text-gray-600 mb-3">{booking.property.name}</p>
          <p className="text-sm text-gray-500">
            {booking.property.address}, {booking.property.city}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Check-in</span>
          </div>
          <p className="font-bold text-gray-900">
            {formatDate(booking.checkIn)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Check-out</span>
          </div>
          <p className="font-bold text-gray-900">
            {formatDate(booking.checkOut)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Duration</span>
          </div>
          <p className="font-bold text-gray-900">
            {booking.duration} Night{booking.duration > 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Total Price</span>
          </div>
          <p className="font-bold text-green-600">
            {formatCurrency(Number(booking.totalPrice))}
          </p>
        </div>
      </div>
    </div>
  );
}
