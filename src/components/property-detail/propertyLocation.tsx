"use client";

import { MapPin } from "lucide-react";

interface PropertyLocationProps {
  address: string;
  city: string;
  lat: number;
  lng: number;
}

export function PropertyLocation({
  address,
  city,
  lat,
  lng,
}: PropertyLocationProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-3">
        <MapPin className="w-12 h-12 text-gray-400" />
      </div>
      <p className="text-sm text-gray-600">
        {address}, {city}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Coordinates: {lat}, {lng}
      </p>
    </div>
  );
}