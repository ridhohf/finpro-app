"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Navigation } from "lucide-react";
import {
  geocodingService,
  GeocodingResult,
} from "@/lib/service/geocoding.service";
import { toast } from "sonner";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  }) => void;
  required?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onLocationSelect,
  required,
}: AddressAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search addresses with debounce
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      const results = await geocodingService.searchAddress(searchQuery);
      setSuggestions(results);
      setIsSearching(false);
      setShowSuggestions(true);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSelectSuggestion = (result: GeocodingResult) => {
    const address = result.formatted;
    const city = result.components.city || result.components.state || "";

    setSearchQuery(address);
    onChange(address);
    setShowSuggestions(false);

    if (onLocationSelect) {
      onLocationSelect({
        address,
        city,
        lat: result.lat,
        lng: result.lng,
      });
    }

    toast.success("Address selected!");
  };

  const handleUseCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await geocodingService.getCurrentLocation();
      if (!location) {
        toast.error("Unable to get your location");
        return;
      }

      const result = await geocodingService.reverseGeocode(
        location.lat,
        location.lng
      );
      if (!result) {
        toast.error("Unable to get address from location");
        return;
      }

      const address = result.formatted;
      const city = result.components.city || result.components.state || "";

      setSearchQuery(address);
      onChange(address);

      if (onLocationSelect) {
        onLocationSelect({
          address,
          city,
          lat: result.lat,
          lng: result.lng,
        });
      }

      toast.success("Location detected!");
    } catch (error) {
      toast.error("Failed to get location");
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label
        htmlFor="address"
        className="text-base font-semibold text-gray-700"
      >
        Address *
      </Label>

      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="address"
              placeholder="Start typing address... (e.g., Jl. Sudirman, Jakarta)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onChange(e.target.value);
              }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              required={required}
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>

          <Button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isGettingLocation}
            variant="outline"
            className="h-12 px-4 rounded-xl border-2"
            title="Use current location"
          >
            {isGettingLocation ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Navigation className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
            {suggestions.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSuggestion(result)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">
                      {result.components.road || result.components.suburb || ""}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">
                      {result.formatted}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        💡 Start typing to search addresses, or click{" "}
        <Navigation className="w-3 h-3 inline" /> to use your current location
      </p>
    </div>
  );
}
