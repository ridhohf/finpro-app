"use client";

import { Calendar } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
      <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
      <p className="text-gray-600">
        Bookings will appear here when guests make reservations
      </p>
    </div>
  );
}