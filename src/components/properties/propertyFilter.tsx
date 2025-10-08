// src/components/properties/PropertyFilters.tsx
'use client';

import { useEffect, useState } from 'react';
import { Search, MapPin, Calendar, Users, DollarSign, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { propertyAPI } from '@/lib/api/property.api';
import { format } from 'date-fns';

interface PropertyFiltersProps {
  filters: {
    city: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    categoryId: string;
    search: string;
    minPrice: string;
    maxPrice: string;
  };
  onFilterChange: (filters: any) => void;
  onSearch: () => void;
}

export function PropertyFilters({ filters, onFilterChange, onSearch }: PropertyFiltersProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [citiesResponse] = await Promise.all([
        propertyAPI.getCities(),
      ]);

      if (citiesResponse.data) {
        setCities(citiesResponse.data);
      }
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  const handleClearFilters = () => {
    onFilterChange({
      city: '',
      checkIn: '',
      checkOut: '',
      guests: '',
      categoryId: '',
      search: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  const hasActiveFilters =
    filters.city ||
    filters.checkIn ||
    filters.checkOut ||
    filters.guests ||
    filters.categoryId ||
    filters.search ||
    filters.minPrice ||
    filters.maxPrice;

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <Card className="p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-blue-600 hover:text-blue-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search by Name */}
        <div className="space-y-2">
          <Label htmlFor="search" className="flex items-center text-gray-700">
            <Search className="w-4 h-4 mr-1" />
            Search Property
          </Label>
          <Input
            id="search"
            placeholder="Property name..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>

        {/* City Filter */}
        <div className="space-y-2">
          <Label className="flex items-center text-gray-700">
            <MapPin className="w-4 h-4 mr-1" />
            City
          </Label>
          <Select
            value={filters.city}
            onValueChange={(value) => onFilterChange({ city: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check-in Date */}
        <div className="space-y-2">
          <Label htmlFor="checkIn" className="flex items-center text-gray-700">
            <Calendar className="w-4 h-4 mr-1" />
            Check-in
          </Label>
          <Input
            id="checkIn"
            type="date"
            min={today}
            value={filters.checkIn}
            onChange={(e) => onFilterChange({ checkIn: e.target.value })}
          />
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <Label htmlFor="checkOut" className="flex items-center text-gray-700">
            <Calendar className="w-4 h-4 mr-1" />
            Check-out
          </Label>
          <Input
            id="checkOut"
            type="date"
            min={filters.checkIn || today}
            value={filters.checkOut}
            onChange={(e) => onFilterChange({ checkOut: e.target.value })}
          />
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <Label className="flex items-center text-gray-700">
            <Users className="w-4 h-4 mr-1" />
            Guests
          </Label>
          <Select
            value={filters.guests}
            onValueChange={(value) => onFilterChange({ guests: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="flex items-center text-gray-700">
            <DollarSign className="w-4 h-4 mr-1" />
            Price Range (per night)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              min="0"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              min="0"
            />
          </div>
        </div>

        {/* Apply Button */}
        <Button
          onClick={onSearch}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <Search className="w-4 h-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </Card>
  );
}