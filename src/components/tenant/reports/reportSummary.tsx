"use client";

import { DollarSign, Calendar, Users, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface ReportSummaryProps {
  reportData: any;
}

export function ReportSummary({ reportData }: ReportSummaryProps) {
  const summaryCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(reportData.totalRevenue || 0),
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Bookings",
      value: reportData.totalBookings || 0,
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Unique Guests",
      value: reportData.uniqueGuests || 0,
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Avg. Booking Value",
      value: formatCurrency(reportData.averageBookingValue || 0),
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}