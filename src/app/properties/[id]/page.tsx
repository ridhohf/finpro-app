"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ImageGallery } from "@/components/properties/imageGallery";
import { RoomList } from "@/components/properties/roomList";
import { PriceCalendar } from "@/components/properties/priceCalendar";
import { ReviewsSection } from "@/components/properties/reviewSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Star,
  Building2,
  Phone,
  Calendar,
  Users,
  Share2,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { propertyAPI } from "@/lib/api/property.api";
import type { PropertyDetail } from "@/types/property.types";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";

export default function PropertyDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const propertyId = parseInt(params.id as string);

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState({
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
  });

  useEffect(() => {
    loadPropertyDetail();
  }, [propertyId, selectedDates.checkIn, selectedDates.checkOut]);

  const loadPropertyDetail = async () => {
    setIsLoading(true);
    try {
      const response = await propertyAPI.getPropertyDetail(
        propertyId,
        selectedDates.checkIn,
        selectedDates.checkOut
      );

      if (response.data) {
        setProperty(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load property details");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center bg-white rounded-3xl p-12 shadow-lg max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Property Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The property you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6 hover:bg-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>

          {/* Header */}
          <div className="mb-8">
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

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-2 hover:bg-gray-50"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-2 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <ImageGallery images={property.picture} name={property.name} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  About This Property
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Rooms */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Available Rooms
                </h2>
                <RoomList
                  rooms={property.rooms}
                  checkIn={selectedDates.checkIn}
                  checkOut={selectedDates.checkOut}
                  propertyId={property.id}
                />
              </div>

              {/* Price Calendar */}
              {property.rooms.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Price Calendar
                  </h2>
                  <PriceCalendar roomId={property.rooms[0].id} />
                </div>
              )}

              {/* Reviews */}
              <div>
                <ReviewsSection
                  reviews={property.reviews}
                  averageRating={property.averageRating}
                  totalReviews={property.totalReviews}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Booking Card */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <div className="text-center mb-6">
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Starting from
                      </span>
                    </div>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatCurrency(property.lowestPrice)}
                      </span>
                      <span className="text-gray-500">/night</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Check-in
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        value={selectedDates.checkIn}
                        onChange={(e) =>
                          setSelectedDates({
                            ...selectedDates,
                            checkIn: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Check-out
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        value={selectedDates.checkOut}
                        onChange={(e) =>
                          setSelectedDates({
                            ...selectedDates,
                            checkOut: e.target.value,
                          })
                        }
                        min={selectedDates.checkIn}
                      />
                    </div>

                    <Button
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled
                    >
                      Booking Available in Feature 2
                    </Button>
                  </div>
                </div>

                {/* Host Information */}
                <div className="bg-white rounded-3xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Hosted by
                  </h3>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {property.tenant.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {property.tenant.tenantProfile.companyName}
                      </p>
                    </div>
                  </div>

                  {property.tenant.tenantProfile.phone && (
                    <div className="flex items-center gap-3 text-gray-600 py-3 border-t border-gray-100">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">
                        {property.tenant.tenantProfile.phone}
                      </span>
                    </div>
                  )}
                </div>

                {/* Map Placeholder */}
                {property.lat && property.lng && (
                  <div className="bg-white rounded-3xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Location
                    </h3>
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-3">
                      <MapPin className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      {property.address}, {property.city}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
