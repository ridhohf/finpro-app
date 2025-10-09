"use client";

import { useState, useEffect } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { propertyAPI } from "@/lib/api/property.api";
import { formatCurrency } from "@/lib/currency";

interface PropertyFiltersProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onSearch: () => void;
}

export function PropertyFilters({
  filters,
  onFilterChange,
  onSearch,
}: PropertyFiltersProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);

  useEffect(() => {
    loadFiltersData();
  }, []);

  const loadFiltersData = async () => {
    try {
      const [citiesRes] = await Promise.all([propertyAPI.getCities()]);

      if (citiesRes.data) setCities(citiesRes.data);
    } catch (error) {
      console.error("Failed to load filters:", error);
    }
  };

  const handleClearFilters = () => {
    onFilterChange({
      city: "",
      checkIn: "",
      checkOut: "",
      guests: "",
      categoryId: "",
      search: "",
      minPrice: "",
      maxPrice: "",
    });
    setPriceRange([0, 10000000]);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Clear all
        </Button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search properties..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="pl-10 h-11 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
          />
        </div>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">City</Label>
        <Select
          value={filters.city}
          onValueChange={(value) => onFilterChange({ ...filters, city: value })}
        >
          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Category</Label>
        <Select
          value={filters.categoryId}
          onValueChange={(value) =>
            onFilterChange({ ...filters, categoryId: value })
          }
        >
          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Check-in & Check-out */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Check-in
          </Label>
          <Input
            type="date"
            value={filters.checkIn}
            onChange={(e) =>
              onFilterChange({ ...filters, checkIn: e.target.value })
            }
            className="h-11 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Check-out
          </Label>
          <Input
            type="date"
            value={filters.checkOut}
            onChange={(e) =>
              onFilterChange({ ...filters, checkOut: e.target.value })
            }
            min={filters.checkIn}
            className="h-11 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Guests</Label>
        <Select
          value={filters.guests}
          onValueChange={(value) =>
            onFilterChange({ ...filters, guests: value })
          }
        >
          <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? "Guest" : "Guests"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-gray-700">
          Price Range
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000000}
          step={100000}
          className="py-4"
        />
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{formatCurrency(priceRange[0])}</span>
          <span className="text-gray-600">{formatCurrency(priceRange[1])}</span>
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={onSearch}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Search className="w-4 h-4 mr-2" />
        Apply Filters
      </Button>
    </div>
  );
}
