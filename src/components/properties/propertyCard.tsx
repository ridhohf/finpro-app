import Link from "next/link";
import { Star, MapPin, Bed } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/types/property.types";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`} className="group">
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full">
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
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold shadow-lg">
              <Star className="w-4 h-4 fill-current" />
              {property.averageRating.toFixed(1)}
            </div>
          )}

          {/* Available Rooms Badge */}
          {property.availableRooms > 0 && (
            <div className="absolute bottom-4 right-4 bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold shadow-lg">
              <Bed className="w-4 h-4" />
              {property.availableRooms} available
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.name}
          </h3>

          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.city}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
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
              <div className="text-sm text-gray-600 font-medium">
                {property.totalReviews}{" "}
                {property.totalReviews === 1 ? "review" : "reviews"}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
