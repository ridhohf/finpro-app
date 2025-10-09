"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Loader2,
  Sparkles,
} from "lucide-react";
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

    const params = new URLSearchParams({
      city: searchData.city,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests,
    });

    router.push(`/properties?${params.toString()}`);
  };

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="relative min-h-[650px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Book your dream vacation today</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Stay
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Discover amazing places around the world with the best prices
          </p>
        </div>

        {/* Search Card - Modern Design */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* City */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Destination
                </Label>
                <Select
                  value={searchData.city}
                  onValueChange={(value) =>
                    setSearchData({ ...searchData, city: value })
                  }
                  disabled={isLoadingCities}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors rounded-xl">
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

              {/* Check-in */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Check-in
                </Label>
                <Input
                  type="date"
                  min={today}
                  className="h-12 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors rounded-xl"
                  value={searchData.checkIn}
                  onChange={(e) =>
                    setSearchData({ ...searchData, checkIn: e.target.value })
                  }
                  required
                />
              </div>

              {/* Check-out */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Check-out
                </Label>
                <Input
                  type="date"
                  min={searchData.checkIn || today}
                  className="h-12 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors rounded-xl"
                  value={searchData.checkOut}
                  onChange={(e) =>
                    setSearchData({ ...searchData, checkOut: e.target.value })
                  }
                  required
                />
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  Guests
                </Label>
                <Select
                  value={searchData.guests}
                  onValueChange={(value) =>
                    setSearchData({ ...searchData, guests: value })
                  }
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors rounded-xl">
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
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-5xl mx-auto">
          {[
            { label: "Properties", value: "10,000+" },
            {
              label: "Cities",
              value: cities.length > 0 ? `${cities.length}+` : "50+",
            },
            { label: "Happy Guests", value: "100K+" },
            { label: "Reviews", value: "50K+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 hover:bg-white/20 transition-colors"
            >
              <div className="text-2xl md:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-white/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
