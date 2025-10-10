"use client";

import { Building2 } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface PropertyBreakdownProps {
  breakdown: any[];
  totalRevenue: number;
}

export function PropertyBreakdown({
  breakdown,
  totalRevenue,
}: PropertyBreakdownProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Revenue by Property
      </h2>

      <div className="space-y-4">
        {breakdown.map((item: any) => (
          <div
            key={item.propertyId}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{item.propertyName}</p>
                <p className="text-sm text-gray-600">
                  {item.bookingCount} bookings
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(item.revenue)}
              </p>
              <p className="text-sm text-gray-600">
                {((item.revenue / totalRevenue) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}