"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Share2, Heart } from "lucide-react";

interface PropertyDetailHeaderProps {
  property: any;
}

export function PropertyDetailHeader({ property }: PropertyDetailHeaderProps) {
  const router = useRouter();

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4 hover:bg-white rounded-xl"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Properties
      </Button>

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              {property.category.name}
            </Badge>
            {property.averageRating > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-900">
                  {property.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-600 text-sm">
                  ({property.totalReviews} reviews)
                </span>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {property.name}
          </h1>

          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-lg">
              {property.address}, {property.city}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}