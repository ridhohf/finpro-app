"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { geocodingService } from "@/lib/service/geocoding.service";
import { toast } from "sonner";

interface CoordinatePickerProps {
  lat: string;
  lng: string;
  onLatChange: (value: string) => void;
  onLngChange: (value: string) => void;
  onAddressFound?: (address: string, city: string) => void;
}

export function CoordinatePicker({
  lat,
  lng,
  onLatChange,
  onLngChange,
  onAddressFound,
}: CoordinatePickerProps) {
  const [isSearching, setIsSearching] = useState(false);

  const handleGetAddress = async () => {
    if (!lat || !lng) {
      toast.error("Please enter both latitude and longitude");
      return;
    }

    setIsSearching(true);
    try {
      const result = await geocodingService.reverseGeocode(
        parseFloat(lat),
        parseFloat(lng)
      );

      if (!result) {
        toast.error("Unable to find address for these coordinates");
        return;
      }

      const address = result.formatted;
      const city = result.components.city || result.components.state || "";

      if (onAddressFound) {
        onAddressFound(address, city);
      }

      toast.success("Address found!");
    } catch (error) {
      toast.error("Failed to get address");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lat" className="text-base font-semibold text-gray-700">
            Latitude
          </Label>
          <Input
            id="lat"
            type="number"
            step="any"
            placeholder="-6.200000"
            value={lat}
            onChange={(e) => onLatChange(e.target.value)}
            className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lng" className="text-base font-semibold text-gray-700">
            Longitude
          </Label>
          <Input
            id="lng"
            type="number"
            step="any"
            placeholder="106.816666"
            value={lng}
            onChange={(e) => onLngChange(e.target.value)}
            className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={handleGetAddress}
        disabled={isSearching || !lat || !lng}
        variant="outline"
        className="w-full h-10 rounded-xl border-2"
      >
        {isSearching ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Getting Address...
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4 mr-2" />
            Get Address from Coordinates
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500">
        💡 Enter coordinates to automatically find the address
      </p>
    </div>
  );
}