"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";

interface GuestInformationProps {
  user: any;
  guests: number;
}

export function GuestInformation({ user, guests }: GuestInformationProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-blue-600" />
        Guest Information
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-700">
              Full Name
            </Label>
            <Input
              value={user?.name || ""}
              disabled
              className="h-12 bg-gray-50 border-2"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-700">Email</Label>
            <Input
              value={user?.email || ""}
              disabled
              className="h-12 bg-gray-50 border-2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-700">
            Number of Guests
          </Label>
          <Input
            value={`${guests} Guest${guests > 1 ? "s" : ""}`}
            disabled
            className="h-12 bg-gray-50 border-2"
          />
        </div>
      </div>
    </div>
  );
}