"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function EmptyBookings() {
  const router = useRouter();

  return (
    <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
      <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
      <p className="text-gray-600 mb-6">
        Start exploring properties and make your first booking
      </p>
      <Button
        onClick={() => router.push("/")}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
      >
        Browse Properties
      </Button>
    </div>
  );
}