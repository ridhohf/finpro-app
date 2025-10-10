"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingFiltersProps {
  filters: {
    status: string;
    propertyId: string;
  };
  properties: any[];
  onFilterChange: (filters: any) => void;
}

export function BookingFilters({
  filters,
  properties,
  onFilterChange,
}: BookingFiltersProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFilterChange({ ...filters, status: value })
          }
        >
          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING_PAYMENT">Waiting Payment</SelectItem>
            <SelectItem value="PENDING_CONFIRMATION">
              Waiting Confirmation
            </SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.propertyId}
          onValueChange={(value) =>
            onFilterChange({ ...filters, propertyId: value })
          }
        >
          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            {properties.map((property) => (
              <SelectItem key={property.id} value={property.id.toString()}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
