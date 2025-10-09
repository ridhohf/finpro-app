"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Users, CheckCircle, XCircle, Maximize2 } from "lucide-react";
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
      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
        <Bed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No rooms available at this property.</p>
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
    <div className="space-y-6">
      {rooms.map((room) => {
        const currentPrice = room.currentPrice || room.basePrice;
        const totalPrice = nights > 0 ? currentPrice * nights : currentPrice;
        const isAvailable = room.isAvailable !== false;

        return (
          <div
            key={room.id}
            className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
              !isAvailable ? "opacity-60" : ""
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              {/* Room Image */}
              <div className="md:col-span-1">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group">
                  {room.picture && room.picture.length > 0 ? (
                    <img
                      src={room.picture[0]}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Bed className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {/* Availability Badge */}
                  <div className="absolute top-3 right-3">
                    {isAvailable ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Available
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg">
                        <XCircle className="w-3 h-3 mr-1" />
                        Not Available
                      </Badge>
                    )}
                  </div>

                  {/* Gallery Badge */}
                  {room.picture && room.picture.length > 1 && (
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-black/60 backdrop-blur-sm text-white border-0">
                        <Maximize2 className="w-3 h-3 mr-1" />
                        {room.picture.length} photos
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Room Details */}
              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {room.name}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {room.description}
                  </p>

                  <div className="flex items-center gap-6 text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">
                        Max {room.maxGuests} guests
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Room</span>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatCurrency(currentPrice)}
                      </span>
                      <span className="text-gray-600">per night</span>
                    </div>

                    {room.currentPrice &&
                      room.currentPrice !== room.basePrice && (
                        <p className="text-sm text-green-600 font-medium mb-3">
                          ⚡ Peak season rate applied
                        </p>
                      )}

                    {nights > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">
                          {nights} {nights === 1 ? "night" : "nights"} ×{" "}
                          {formatCurrency(currentPrice)}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatCurrency(totalPrice)}
                          </span>
                          <span className="text-gray-600">total</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={!isAvailable}
                  >
                    {isAvailable ? "Book Now (Feature 2)" : "Not Available"}
                  </Button>
                  {room.picture && room.picture.length > 1 && (
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-2 hover:bg-gray-50"
                    >
                      <Maximize2 className="w-4 h-4 mr-2" />
                      View Gallery
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Info Message */}
      {!checkIn ||
        (!checkOut && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6">
            <p className="text-center text-gray-700">
              💡 <strong>Tip:</strong> Select check-in and check-out dates to
              see availability and total prices for your stay.
            </p>
          </div>
        ))}
    </div>
  );
}
