"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BookingFormHeader() {
  const router = useRouter();

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 hover:bg-white rounded-xl"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Complete Your Booking
        </h1>
        <p className="text-gray-600">You're just one step away from your stay!</p>
      </div>
    </>
  );
}