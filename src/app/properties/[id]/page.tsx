"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ImageGallery } from "@/components/properties/imageGallery";
import { PriceCalendar } from "@/components/properties/priceCalendar";
import { ReviewsSection } from "@/components/properties/reviewSection";
import { RoomList } from "@/components/properties/roomList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { propertyAPI } from "@/lib/api/property.api";
import type { PropertyDetail } from "@/types/property.types";
import {
  Building2,
  Calendar,
  Loader2,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Property Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The property you're looking for doesn't exist.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <a href="/" className="hover:text-blue-600">
                Home
              </a>
              <span>/</span>
              <a href="/properties" className="hover:text-blue-600">
                Properties
              </a>
              <span>/</span>
              <span className="text-gray-900">{property.name}</span>
            </div>

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.name}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {property.address}, {property.city}
                    </span>
                  </div>
                  {property.averageRating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {property.averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-600">
                        ({property.totalReviews} reviews)
                      </span>
                    </div>
                  )}
                  <Badge>{property.category.name}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <ImageGallery images={property.picture} name={property.name} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  About This Property
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </Card>

              {/* Rooms */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Available Rooms
                </h2>
                <RoomList
                  rooms={property.rooms}
                  checkIn={selectedDates.checkIn}
                  checkOut={selectedDates.checkOut}
                  propertyId={property.id}
                />
              </Card>

              {/* Price Calendar */}
              {property.rooms.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Price Calendar
                  </h2>
                  <PriceCalendar roomId={property.rooms[0].id} />
                </Card>
              )}

              {/* Reviews */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Guest Reviews
                </h2>
                <ReviewsSection
                  reviews={property.reviews}
                  averageRating={property.averageRating}
                  totalReviews={property.totalReviews}
                />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Booking Card - Placeholder for Feature 2 */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Check-in
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={selectedDates.checkIn}
                          onChange={(e) =>
                            setSelectedDates({
                              ...selectedDates,
                              checkIn: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Check-out
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    </div>

                    <Button className="w-full" size="lg" disabled>
                      Booking Available in Feature 2
                    </Button>
                  </div>
                </Card>

                {/* Host Information */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Hosted by</h3>
                      <p className="text-sm text-gray-600">
                        {property.tenant.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      {property.tenant.tenantProfile.companyName}
                    </div>
                    {property.tenant.tenantProfile.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {property.tenant.tenantProfile.phone}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Map Placeholder */}
                {property.lat && property.lng && (
                  <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Location
                    </h3>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {property.address}, {property.city}
                    </p>
                  </Card>
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
