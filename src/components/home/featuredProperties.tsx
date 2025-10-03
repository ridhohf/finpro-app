"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MapPin, Loader2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { propertyAPI } from "@/lib/api/property.api";
import type { Property } from "@/types/property.types";

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const response = await propertyAPI.searchProperties({
        limit: 6,
        sortBy: "price",
        sortOrder: "desc",
      });

      if (response.data) {
        setProperties(response.data);
      }
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked properties from around the world
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  {property.picture && property.picture.length > 0 ? (
                    <img
                      src={property.picture[0]}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <MapPin className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                      {property.category.name}
                    </Badge>
                  </div>

                  {/* Rating Badge */}
                  {property.averageRating > 0 && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold">
                      <Star className="w-4 h-4 fill-current" />
                      {property.averageRating.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {property.name}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm line-clamp-1">
                      {property.city}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-sm text-gray-500">Starting from</div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${property.lowestPrice}
                        <span className="text-sm text-gray-500 font-normal">
                          /night
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {property.availableRooms} rooms
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.totalReviews} reviews
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/properties">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              View All Properties
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
