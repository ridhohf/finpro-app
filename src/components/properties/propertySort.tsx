import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PropertySortProps {
  sortBy: 'name' | 'price';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'name' | 'price', sortOrder: 'asc' | 'desc') => void;
}

export function PropertySort({ sortBy, sortOrder, onSortChange }: PropertySortProps) {
  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)', sortBy: 'name' as const, sortOrder: 'asc' as const },
    { value: 'name-desc', label: 'Name (Z-A)', sortBy: 'name' as const, sortOrder: 'desc' as const },
    { value: 'price-asc', label: 'Price (Low to High)', sortBy: 'price' as const, sortOrder: 'asc' as const },
    { value: 'price-desc', label: 'Price (High to Low)', sortBy: 'price' as const, sortOrder: 'desc' as const },
  ];

  const currentValue = `${sortBy}-${sortOrder}`;

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-500" />
      <Select
        value={currentValue}
        onValueChange={(value) => {
          const option = sortOptions.find((opt) => opt.value === value);
          if (option) {
            onSortChange(option.sortBy, option.sortOrder);
          }
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                {option.sortOrder === 'asc' ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}