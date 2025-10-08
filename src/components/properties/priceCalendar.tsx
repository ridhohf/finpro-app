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

      if (response.data) {
        setCalendarData(response.data);
      }
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

    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    const days: ((typeof calendarData.calendar)[0] | null)[] =
      Array(firstDay).fill(null);

    calendarData.calendar.forEach((day) => {
      days.push(day);
    });

    return days;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!calendarData) {
    return (
      <div className="text-center py-8 text-gray-500">
        Failed to load calendar
      </div>
    );
  }

  const days = getDaysInMonth();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {getMonthName(currentDate)}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
          <span className="text-gray-600">Not Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded" />
          <span className="text-gray-600">Peak Season</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="aspect-square border-r border-b bg-gray-50"
                />
              );
            }

            const isPeakSeason = day.price > calendarData.basePrice;
            const bgColor = !day.isAvailable
              ? "bg-red-50 hover:bg-red-100"
              : isPeakSeason
              ? "bg-blue-50 hover:bg-blue-100"
              : "bg-green-50 hover:bg-green-100";

            const borderColor = !day.isAvailable
              ? "border-red-200"
              : isPeakSeason
              ? "border-blue-200"
              : "border-green-200";

            return (
              <div
                key={day.date}
                className={`aspect-square border-r border-b p-2 ${bgColor} ${borderColor} transition-colors cursor-pointer`}
              >
                <div className="flex flex-col h-full">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(day.date).getDate()}
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center">
                    {day.isAvailable ? (
                      <>
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrencyCompact(day.price)}
                        </div>
                        {isPeakSeason && (
                          <div className="text-xs text-blue-600 font-medium">
                            Peak
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-xs text-red-600 font-medium text-center">
                        Not Available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Base Price:</strong> {formatCurrency(calendarData.basePrice)}{" "}
          per night
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Prices may vary based on peak seasons and availability. Click on a
          date to see more details.
        </p>
      </div>
    </div>
  );
}
