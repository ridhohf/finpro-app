"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { propertyAPI } from "@/lib/api/property.api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PropertyDetailHeader } from "@/components/property-detail/propertyDetailHeader";
import { PropertyImageGallery } from "@/components/property-detail/propertyImageGallery";
import { PropertyAbout } from "@/components/property-detail/propertyAbout";
// import { PropertyFacilities } from "@/components/property-detail/propertyFacilities";
import { PropertyRooms } from "@/components/property-detail/propertyRooms";
import { PropertyPriceCalendar } from "@/components/property-detail/propertyPriceCalendar";
import { PropertyReviews } from "@/components/property-detail/propertyReview";
import { PropertyBookingSidebar } from "@/components/property-detail/propertyBookingSidebar";
import { PropertyHostInfo } from "@/components/property-detail/propertyHostInfo";
import { PropertyLocation } from "@/components/property-detail/propertyLocation";

export default function PropertyDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const propertyId = parseInt(params.id as string);

  const [property, setProperty] = useState<any>(null);
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
          <PropertyDetailHeader property={property} />
          <PropertyImageGallery
            images={property.picture}
            name={property.name}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <PropertyAbout property={property} />
              {/* <PropertyFacilities propertyId={property.id} /> */}
              <PropertyRooms
                rooms={property.rooms}
                checkIn={selectedDates.checkIn}
                checkOut={selectedDates.checkOut}
                propertyId={property.id}
              />
              {property.rooms.length > 0 && (
                <PropertyPriceCalendar roomId={property.rooms[0].id} />
              )}
              <PropertyReviews
                reviews={property.reviews}
                averageRating={property.averageRating}
                totalReviews={property.totalReviews}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <PropertyBookingSidebar
                  property={property}
                  selectedDates={selectedDates}
                  onDatesChange={setSelectedDates}
                />
                <PropertyHostInfo tenant={property.tenant} />
                {property.lat && property.lng && (
                  <PropertyLocation
                    address={property.address}
                    city={property.city}
                    lat={property.lat}
                    lng={property.lng}
                  />
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
