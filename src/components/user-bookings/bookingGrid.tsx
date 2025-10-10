"use client";

import { BookingCard } from "./bookingCard";

interface BookingsGridProps {
  bookings: any[];
}

export function BookingsGrid({ bookings }: BookingsGridProps) {
  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}