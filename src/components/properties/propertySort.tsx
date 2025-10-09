"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface PropertySortProps {
  sortBy: "name" | "price";
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: "name" | "price", sortOrder: "asc" | "desc") => void;
}

export function PropertySort({
  sortBy,
  sortOrder,
  onSortChange,
}: PropertySortProps) {
  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-") as [
      "name" | "price",
      "asc" | "desc"
    ];
    onSortChange(newSortBy, newSortOrder);
  };

  const currentValue = `${sortBy}-${sortOrder}`;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-gray-700">
        <ArrowUpDown className="w-4 h-4" />
        <span className="text-sm font-semibold">Sort by:</span>
      </div>

      <Select value={currentValue} onValueChange={handleSortChange}>
        <SelectTrigger className="w-48 h-10 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="price-asc">Price (Low to High)</SelectItem>
          <SelectItem value="price-desc">Price (High to Low)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
