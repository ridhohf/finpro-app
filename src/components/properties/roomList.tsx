"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Users, CheckCircle, XCircle } from "lucide-react";
import type { Room } from "@/types/property.types";
import { formatCurrency } from "@/lib/currency";

interface RoomListProps {
  rooms: Room[];
  checkIn?: string;
  checkOut?: string;
  propertyId: number;
}

export function RoomList({
  rooms,
  checkIn,
  checkOut,
  propertyId,
}: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No rooms available at this property.
      </div>
    );
  }

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  return (
    <div className="space-y-4">
      {rooms.map((room) => {
        const currentPrice = room.currentPrice || room.basePrice;
        const totalPrice = nights > 0 ? currentPrice * nights : currentPrice;
        const isAvailable = room.isAvailable !== false;

        return (
          <Card
            key={room.id}
            className={`p-6 ${!isAvailable ? "opacity-60" : ""}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Room Image */}
              <div className="md:col-span-1">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
                  {room.picture && room.picture.length > 0 ? (
                    <img
                      src={room.picture[0]}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Bed className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {/* Availability Badge */}
                  <div className="absolute top-2 right-2">
                    {isAvailable ? (
                      <Badge className="bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Not Available
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {room.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Max {room.maxGuests} guests
                    </div>
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      Room
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="border-t pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-blue-600">
                        {formatCurrency(currentPrice)}
                      </span>
                      <span className="text-gray-500">per night</span>
                    </div>

                    {room.currentPrice &&
                      room.currentPrice !== room.basePrice && (
                        <p className="text-sm text-green-600 mt-1">
                          Peak season rate applied
                        </p>
                      )}

                    {nights > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {nights} {nights === 1 ? "night" : "nights"} ×{" "}
                          {formatCurrency(currentPrice)}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          Total: {formatCurrency(totalPrice)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <Button className="flex-1" disabled={!isAvailable}>
                    {isAvailable ? "Book Now (Feature 2)" : "Not Available"}
                  </Button>
                  {room.picture && room.picture.length > 1 && (
                    <Button variant="outline">
                      View Gallery ({room.picture.length})
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Info Message */}
      {!checkIn || !checkOut ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Select check-in and check-out dates to see
            availability and total prices for your stay.
          </p>
        </div>
      ) : null}
    </div>
  );
}
