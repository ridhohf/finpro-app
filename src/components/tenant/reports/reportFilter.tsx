"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, Loader2 } from "lucide-react";

interface ReportFiltersProps {
  filters: {
    startDate: string;
    endDate: string;
    propertyId: string;
  };
  properties: any[];
  isLoading: boolean;
  onFilterChange: (filters: any) => void;
  onGenerate: () => void;
}

export function ReportFilters({
  filters,
  properties,
  isLoading,
  onFilterChange,
  onGenerate,
}: ReportFiltersProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Report Filters</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              onFilterChange({ ...filters, startDate: e.target.value })
            }
            className="h-12 border-2 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              onFilterChange({ ...filters, endDate: e.target.value })
            }
            min={filters.startDate}
            className="h-12 border-2 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Property</Label>
          <Select
            value={filters.propertyId}
            onValueChange={(value) =>
              onFilterChange({ ...filters, propertyId: value })
            }
          >
            <SelectTrigger className="h-12 border-2 rounded-xl">
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

        <div className="flex items-end">
          <Button
            onClick={onGenerate}
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <BarChart3 className="w-5 h-5 mr-2" />
            )}
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
}