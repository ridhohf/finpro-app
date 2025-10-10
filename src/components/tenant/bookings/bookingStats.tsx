"use client";

import { Calendar, Clock, Check } from "lucide-react";

interface BookingStatsProps {
  bookings: any[];
}

export function BookingStats({ bookings }: BookingStatsProps) {
  const stats = [
    {
      label: "Pending Confirmation",
      count: bookings.filter((b) => b.status === "PENDING_CONFIRMATION").length,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      icon: Clock,
    },
    {
      label: "Confirmed",
      count: bookings.filter((b) => b.status === "CONFIRMED").length,
      color: "text-green-600",
      bg: "bg-green-100",
      icon: Check,
    },
    {
      label: "Completed",
      count: bookings.filter((b) => b.status === "COMPLETED").length,
      color: "text-blue-600",
      bg: "bg-blue-100",
      icon: Check,
    },
    {
      label: "Total Bookings",
      count: bookings.length,
      color: "text-purple-600",
      bg: "bg-purple-100",
      icon: Calendar,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
