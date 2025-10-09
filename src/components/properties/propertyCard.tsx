import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Star, Users, Heart } from "lucide-react";
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
    lowestPrice?: number;
    basePrice?: number;
    maxGuests?: number;
    _count?: {
      reviews: number;
    };
    averageRating?: number;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const displayPrice =
    property.minPrice || property.lowestPrice || property.basePrice || 0;

  return (
    <div
      className="group cursor-pointer"
      onClick={() => router.push(`/properties/${property.id}`)}
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          {property.picture?.[0] ? (
            <img
              src={property.picture[0]}
              alt={property.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
              <Building2 className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            {property.category && (
              <Badge className="bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white shadow-lg border-0">
                {property.category.name}
              </Badge>
            )}

            {/* Favorite Button */}
            <button className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
            </button>
          </div>

          {/* Rating Badge */}
          {property.averageRating && property.averageRating > 0 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-yellow-400 rounded-full shadow-lg">
              <Star className="w-4 h-4 fill-current text-gray-900" />
              <span className="text-sm font-bold text-gray-900">
                {property.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.name}
          </h3>

          <div className="flex items-center text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.city}</span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {property.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {property.maxGuests && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{property.maxGuests}</span>
                </div>
              )}
              {property._count && property._count.reviews > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{property._count.reviews}</span>
                </div>
              )}
            </div>

            {displayPrice > 0 && (
              <div className="text-right">
                <div className="text-xs text-gray-500">From</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(displayPrice)}
                  </span>
                  <span className="text-xs text-gray-500">/night</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
