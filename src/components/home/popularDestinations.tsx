"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, TrendingUp, ArrowRight } from "lucide-react";
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
        setCities(response.data.slice(0, 8));
      }
    } catch (error) {
      console.error("Failed to load cities:", error);
    }
  };

  const cityImages: Record<string, string> = {
    Jakarta:
      "https://images.unsplash.com/photo-1555899434-94d1526a7919?w=800&q=80",
    Bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    Bandung:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
    Surabaya:
      "https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=800&q=80",
    Yogyakarta:
      "https://images.unsplash.com/photo-1568214379698-fcca53aa1c6e?w=800&q=80",
    Medan:
      "https://images.unsplash.com/photo-1555217851-a4b6a7be2d35?w=800&q=80",
    Semarang:
      "https://images.unsplash.com/photo-1604659750936-37f1c77ae5cc?w=800&q=80",
    Makassar:
      "https://images.unsplash.com/photo-1589197331516-5c94c15ce1c4?w=800&q=80",
  };

  if (cities.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-3">
              <TrendingUp className="w-4 h-4" />
              Trending
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600">
              Explore the most visited cities
            </p>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {cities.map((city) => (
            <Link
              key={city}
              href={`/properties?city=${encodeURIComponent(city)}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 md:h-56 overflow-hidden">
                {/* Image */}
                {cityImages[city] ? (
                  <img
                    src={cityImages[city]}
                    alt={city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <h3 className="text-lg font-bold">{city}</h3>
                    </div>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
