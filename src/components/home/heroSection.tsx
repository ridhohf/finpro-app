"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { propertyAPI } from "@/lib/api/property.api";
import { format } from "date-fns";

export function HeroSection() {
  const router = useRouter();
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [searchData, setSearchData] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
  });

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const response = await propertyAPI.getCities();
      if (response.data) {
        setCities(response.data);
      }
    } catch (error) {
      console.error("Failed to load cities:", error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchData.city) {
      toast.error("Please select a city");
      return;
    }

    if (!searchData.checkIn || !searchData.checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    setIsSearching(true);

    // Build query params
    const params = new URLSearchParams({
      city: searchData.city,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests,
    });

    // Navigate to search results
    router.push(`/properties?${params.toString()}`);
  };

  // Get today's date for min date
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-400">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] animate-pulse"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Discover amazing places to stay around the world
          </p>
        </div>

        {/* Search Card */}
        <Card className="max-w-5xl mx-auto p-6 md:p-8 shadow-2xl backdrop-blur-sm bg-white/95">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Mobile: Stack vertically, Desktop: Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* City Selection */}
              <div className="space-y-2">
                <Label
                  htmlFor="city"
                  className="flex items-center text-gray-700"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Where to?
                </Label>
                <Select
                  value={searchData.city}
                  onValueChange={(value) =>
                    setSearchData({ ...searchData, city: value })
                  }
                  disabled={isLoadingCities}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue
                      placeholder={
                        isLoadingCities ? "Loading..." : "Select city"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Check-in Date */}
              <div className="space-y-2">
                <Label
                  htmlFor="checkIn"
                  className="flex items-center text-gray-700"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Check-in
                </Label>
                <Input
                  id="checkIn"
                  type="date"
                  min={today}
                  className="h-12"
                  value={searchData.checkIn}
                  onChange={(e) =>
                    setSearchData({ ...searchData, checkIn: e.target.value })
                  }
                  required
                />
              </div>

              {/* Check-out Date */}
              <div className="space-y-2">
                <Label
                  htmlFor="checkOut"
                  className="flex items-center text-gray-700"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Check-out
                </Label>
                <Input
                  id="checkOut"
                  type="date"
                  min={searchData.checkIn || today}
                  className="h-12"
                  value={searchData.checkOut}
                  onChange={(e) =>
                    setSearchData({ ...searchData, checkOut: e.target.value })
                  }
                  required
                />
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <Label
                  htmlFor="guests"
                  className="flex items-center text-gray-700"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Guests
                </Label>
                <Select
                  value={searchData.guests}
                  onValueChange={(value) =>
                    setSearchData({ ...searchData, guests: value })
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Properties
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto">
          {[
            { label: "Properties", value: "10,000+" },
            {
              label: "Cities",
              value: cities.length > 0 ? `${cities.length}+` : "50+",
            },
            { label: "Happy Guests", value: "100K+" },
            { label: "Countries", value: "25+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center text-white backdrop-blur-sm bg-white/10 rounded-lg p-4"
            >
              <div className="text-2xl md:text-3xl font-bold mb-1">
                {stat.value}
              </div>
              <div className="text-sm md:text-base opacity-90">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
