"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { propertyAPI } from "@/lib/api/property.api";

export function PopularDestinations() {
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const response = await propertyAPI.getCities();
      if (response.data) {
        // Take first 8 cities
        setCities(response.data.slice(0, 8));
      }
    } catch (error) {
      console.error("Failed to load cities:", error);
    }
  };

  // City images (you can replace with real images)
  const cityImages: Record<string, string> = {
    Jakarta: "https://images.unsplash.com/photo-1555899434-94d1526a7919?w=800",
    Bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    Bandung:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800",
    Surabaya:
      "https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=800",
    Yogyakarta:
      "https://images.unsplash.com/photo-1568214379698-fcca53aa1c6e?w=800",
    Medan: "https://images.unsplash.com/photo-1555217851-a4b6a7be2d35?w=800",
    Semarang:
      "https://images.unsplash.com/photo-1604659750936-37f1c77ae5cc?w=800",
    Makassar:
      "https://images.unsplash.com/photo-1589197331516-5c94c15ce1c4?w=800",
  };

  if (cities.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600">
              Explore the most popular cities
            </p>
          </div>
          <div className="hidden md:flex items-center text-blue-600">
            <TrendingUp className="w-5 h-5 mr-2" />
            <span className="font-semibold">Trending Now</span>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {cities.map((city) => (
            <Link
              key={city}
              href={`/properties?city=${encodeURIComponent(city)}`}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-40 md:h-48 overflow-hidden">
                  {cityImages[city] ? (
                    <img
                      src={cityImages[city]}
                      alt={city}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* City Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center text-white">
                      <MapPin className="w-4 h-4 mr-2" />
                      <h3 className="text-lg font-bold">{city}</h3>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
