"use client";

import { RoomList } from "@/components/properties/roomList";
import { Bed } from "lucide-react";

interface PropertyRoomsProps {
  rooms: any[];
  checkIn: string;
  checkOut: string;
  propertyId: number;
}

export function PropertyRooms({
  rooms,
  checkIn,
  checkOut,
  propertyId,
}: PropertyRoomsProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Bed className="w-6 h-6 text-blue-600" />
        Available Rooms
      </h2>
      <RoomList
        rooms={rooms}
        checkIn={checkIn}
        checkOut={checkOut}
        propertyId={propertyId}
      />
    </div>
  );
}