"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { groupCitiesByProvince } from "@/lib/constants/cities";

interface CitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function CitySelector({ value, onChange, required }: CitySelectorProps) {
  const citiesByProvince = groupCitiesByProvince();

  return (
    <div className="space-y-2">
      <Label htmlFor="city" className="text-base font-semibold text-gray-700">
        City *
      </Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl">
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {Object.entries(citiesByProvince).map(([province, cities]) => (
            <SelectGroup key={province}>
              <SelectLabel className="font-bold text-blue-600 text-sm">
                {province}
              </SelectLabel>
              {cities.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}