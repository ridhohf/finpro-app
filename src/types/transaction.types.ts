// Transaction Status Types
export type TransactionStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING_CONFIRMATION'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';

// Main Transaction Interface
export interface Transaction {
  id: number;
  userId: number;
  propertyId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  duration: number;
  totalPrice: number;
  status: TransactionStatus;
  reminderSentAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  property?: {
    id: number;
    name: string;
    address: string;
    city: string;
    picture: string[];
  };
  room?: {
    id: number;
    name: string;
    basePrice: number;
    maxGuests: number;
  };
  paymentProofs?: PaymentProof[];
}

// Payment Proof Interface
export interface PaymentProof {
  id: number;
  reservationId: number;
  image: string;
  isValid: boolean;
  rejectedReason?: string;
  uploadedAt: string;
  updatedAt: string;
}

// Request Types
export interface CreateBookingRequest {
  roomId: number;
  checkIn: string;
  checkOut: string;
}

export interface UploadPaymentProofRequest {
  transactionId: number;
  paymentProof: File;
}

export interface ConfirmPaymentRequest {
  transactionId: number;
}

export interface RejectPaymentRequest {
  transactionId: number;
  reason: string;
}

export interface CancelTransactionRequest {
  transactionId: number;
  reason?: string;
}

// Filter Types
export interface TransactionFilter {
  status?: TransactionStatus;
  propertyId?: number;
  startDate?: string;
  endDate?: string;
}

// API Response Types
export interface TransactionResponse {
  success: boolean;
  message: string;
  data?: Transaction;
}

export interface TransactionListResponse {
  success: boolean;
  message: string;
  data: Transaction[];
  count: number;
}
