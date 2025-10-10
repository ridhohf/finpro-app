"use client";

import { PriceCalendar } from "@/components/properties/priceCalendar";
import { Calendar } from "lucide-react";

interface PropertyPriceCalendarProps {
  roomId: number;
}

export function PropertyPriceCalendar({ roomId }: PropertyPriceCalendarProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-blue-600" />
        Price Calendar
      </h2>
      <PriceCalendar roomId={roomId} />
    </div>
  );
}