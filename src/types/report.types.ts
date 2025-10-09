// Sales Report Types
export interface SalesReport {
  summary: {
    totalTransactions: number;
    totalRevenue: number;
    averageBookingValue: number;
  };
  byProperty: Array<{
    propertyName: string;
    bookings: number;
    revenue: number;
  }>;
  transactions: Array<{
    id: number;
    bookingDate: string;
    checkIn: string;
    checkOut: string;
    property: string;
    room: string;
    guest: string;
    duration: number;
    totalPrice: number;
  }>;
}

// Availability Report Types
export interface AvailabilityReport {
  month: number;
  year: number;
  properties: Array<{
    propertyId: number;
    propertyName: string;
    rooms: Array<{
      roomId: number;
      roomName: string;
      calendar: {
        [day: number]: {
          date: string;
          status: 'AVAILABLE' | 'BOOKED';
        };
      };
    }>;
  }>;
}

// Filter Types
export interface SalesReportFilter {
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'price' | 'property';
  propertyId?: number;
}

export interface AvailabilityReportFilter {
  month?: number;
  year?: number;
}

// Response Types
export interface SalesReportResponse {
  success: boolean;
  message: string;
  data?: SalesReport;
}

export interface AvailabilityReportResponse {
  success: boolean;
  message: string;
  data?: AvailabilityReport;
}
