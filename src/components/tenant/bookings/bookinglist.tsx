"use client";

import { BookingCard } from "./bookingCard";

interface BookingsListProps {
  bookings: any[];
  onUpdate: () => void;
}

export function BookingsList({ bookings, onUpdate }: BookingsListProps) {
  const pendingConfirmation = bookings.filter(
    (b) => b.status === "PENDING_CONFIRMATION"
  );

  return (
    <div className="space-y-8">
      {pendingConfirmation.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Pending Confirmation ({pendingConfirmation.length})
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {pendingConfirmation.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onUpdate={onUpdate} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onUpdate={onUpdate} />
          ))}
        </div>
      </div>
    </div>
  );
}