export interface Property {
  id: number;
  name: string;
  description: string;
  picture: string[];
  address: string;
  city: string;
  lat: number | null;
  lng: number | null;
  category: {
    id: number;
    name: string;
  };
  lowestPrice: number;
  availableRooms: number;
  totalReviews: number;
  averageRating: number;
}

export interface PropertyDetail extends Property {
  tenant: {
    id: number;
    name: string;
    tenantProfile: {
      companyName: string;
      phone?: string;
    };
  };
  rooms: Room[];
  reviews: Review[];
}

export interface Room {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  maxGuests: number;
  picture: string[];
  currentPrice?: number;
  isAvailable?: boolean;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  tenantReply?: string;
  repliedAt?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface PropertyCategory {
  id: number;
  name: string;
  description: string;
}

export interface SearchParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  categoryId?: number;
  search?: string;
  sortBy?: "name" | "price";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PropertySearchResponse {
  success: boolean;
  message: string;
  data: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    categoryId?: number;
  };
}

export interface PriceCalendar {
  roomId: number;
  roomName: string;
  basePrice: number;
  calendar: {
    date: string;
    price: number;
    isAvailable: boolean;
  }[];
}
