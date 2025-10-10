"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { toast } from "sonner";

interface ReportTableProps {
  reportData: any;
}

export function ReportTable({ reportData }: ReportTableProps) {
  const handleExport = () => {
    toast.info("Export feature coming soon!");
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
        <Button
          onClick={handleExport}
          variant="outline"
          className="rounded-xl border-2"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {reportData.bookings && reportData.bookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Booking ID
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Property
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Guest
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Check-in
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">
                  Nights
                </th>
                <th className="text-right py-4 px-4 font-semibold text-gray-700">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.bookings.map((booking: any) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">#{booking.id}</td>
                  <td className="py-4 px-4">{booking.property.name}</td>
                  <td className="py-4 px-4">{booking.user.name}</td>
                  <td className="py-4 px-4">
                    {new Date(booking.checkIn).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-4 px-4">{booking.duration}</td>
                  <td className="py-4 px-4 text-right font-semibold text-green-600">
                    {formatCurrency(Number(booking.totalPrice))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No bookings found for the selected period</p>
        </div>
      )}
    </div>
  );
}