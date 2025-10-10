"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface BookingsFiltersProps {
  filters: {
    status: string;
    search: string;
  };
  onFilterChange: (filters: any) => void;
  onSearch: () => void;
}

export function BookingsFilters({
  filters,
  onFilterChange,
  onSearch,
}: BookingsFiltersProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by booking ID or property name..."
              value={filters.search}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
            />
          </div>
        </div>

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
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}