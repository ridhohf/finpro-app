import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Building2, MapPin, Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/currency";

interface PropertyCardProps {
  property: {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    picture: string[];
    category?: {
      name: string;
    };
    minPrice?: number;
    maxGuests?: number;
    _count?: {
      reviews: number;
    };
    averageRating?: number;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => router.push(`/properties/${property.id}`)}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {property.picture?.[0] ? (
          <img
            src={property.picture[0]}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Building2 className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Category Badge */}
        {property.category && (
          <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 hover:bg-white">
            {property.category.name}
          </Badge>
        )}

        {/* Rating Badge */}
        {property.averageRating && property.averageRating > 0 && (
          <Badge className="absolute top-3 right-3 bg-yellow-500/90 text-white hover:bg-yellow-500">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {property.averageRating.toFixed(1)}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {property.name}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{property.city}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {property.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {property.maxGuests && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{property.maxGuests}</span>
              </div>
            )}
            {property._count && property._count.reviews > 0 && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                <span>{property._count.reviews} reviews</span>
              </div>
            )}
          </div>

          {/* Price */}
          {property.minPrice && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Starting from</p>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(property.minPrice)}
              </p>
              <p className="text-xs text-gray-500">per night</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
