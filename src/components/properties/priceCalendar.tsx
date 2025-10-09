"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { propertyAPI } from "@/lib/api/property.api";
import type { PriceCalendar as PriceCalendarType } from "@/types/property.types";
import { toast } from "sonner";
import { formatCurrency, formatCurrencyCompact } from "@/lib/currency";

interface PriceCalendarProps {
  roomId: number;
}

export function PriceCalendar({ roomId }: PriceCalendarProps) {
  const [calendarData, setCalendarData] = useState<PriceCalendarType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadCalendar();
  }, [roomId, currentDate]);

  const loadCalendar = async () => {
    setIsLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const response = await propertyAPI.getRoomPriceCalendar(
        roomId,
        month,
        year
      );
      if (response.data) setCalendarData(response.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load calendar");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const getDaysInMonth = () => {
    if (!calendarData) return [];
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const days: ((typeof calendarData.calendar)[0] | null)[] =
      Array(firstDay).fill(null);
    calendarData.calendar.forEach((day) => days.push(day));
    return days;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!calendarData) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
        <p className="text-gray-600">Failed to load calendar</p>
      </div>
    );
  }

  const days = getDaysInMonth();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {getMonthName(currentDate)}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
            className="rounded-xl border-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            className="rounded-xl border-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 rounded" />
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded" />
          <span className="text-gray-600">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded" />
          <span className="text-gray-600">Peak Season</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-gray-50 rounded-2xl overflow-hidden">
        {/* Week Days */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-blue-600 to-purple-600">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-semibold text-white"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="aspect-square bg-gray-100"
                />
              );
            }

            const isPeakSeason = day.price > calendarData.basePrice;
            const bgColor = !day.isAvailable
              ? "bg-red-50 hover:bg-red-100"
              : isPeakSeason
              ? "bg-blue-50 hover:bg-blue-100"
              : "bg-green-50 hover:bg-green-100";

            return (
              <div
                key={day.date}
                className={`aspect-square p-2 ${bgColor} transition-colors cursor-pointer group relative`}
              >
                <div className="flex flex-col h-full">
                  <div className="text-sm font-semibold text-gray-900">
                    {new Date(day.date).getDate()}
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center">
                    {day.isAvailable ? (
                      <>
                        <div className="text-base font-bold text-gray-900">
                          {formatCurrencyCompact(day.price)}
                        </div>
                        {isPeakSeason && (
                          <div className="text-xs text-blue-600 font-semibold mt-1">
                            Peak
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-xs text-red-600 font-semibold text-center">
                        Not Available
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Tooltip */}
                <div className="absolute inset-0 bg-black/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                  <div className="text-center text-white">
                    <div className="text-xs mb-1">
                      {new Date(day.date).toLocaleDateString()}
                    </div>
                    <div className="font-bold">{formatCurrency(day.price)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4">
        <p className="text-sm text-gray-700">
          <strong>Base Price:</strong> {formatCurrency(calendarData.basePrice)}{" "}
          per night
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Hover over dates to see detailed pricing
        </p>
      </div>
    </div>
  );
}
