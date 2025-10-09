export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  SOCIAL_LOGIN: '/auth/social-login',
  GOOGLE_LOGIN: '/auth/google-login',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
  RESET_PASSWORD: '/auth/reset-password',
  CONFIRM_RESET_PASSWORD: '/auth/confirm-reset-password',
  PROFILE: '/auth/profile',
  UPDATE_PASSWORD: '/auth/password',

  // Property Catalog (Public)
  PROPERTY_SEARCH: '/properties/search',
  PROPERTY_DETAIL: '/properties',
  PROPERTY_CITIES: '/properties/cities',
  ROOM_CALENDAR: '/properties/rooms',

  // Tenant - Categories
  TENANT_CATEGORIES: '/tenant/categories',

  // Tenant - Properties
  TENANT_PROPERTIES: '/tenant/properties',

  // Tenant - Rooms
  TENANT_ROOMS: '/tenant/rooms',

  // Tenant - Room Availability
  TENANT_ROOM_AVAILABILITY: '/tenant/room-availability',

  // Tenant - Peak Seasons
  TENANT_PEAK_SEASONS: '/tenant/peak-seasons',

  // Tenant - Dashboard
  TENANT_DASHBOARD: '/tenant/dashboard',

  // ===== FEATURE 2: TRANSACTIONS =====
  TRANSACTIONS: '/transactions',
  TRANSACTION_DETAIL: '/transactions',
  UPLOAD_PAYMENT: '/transactions',
  CONFIRM_PAYMENT: '/transactions',
  REJECT_PAYMENT: '/transactions',
  CANCEL_TRANSACTION: '/transactions',

  // ===== FEATURE 2: REVIEWS =====
  SUBMIT_REVIEW: '/transactions',
  REPLY_REVIEW: '/reviews',
  PROPERTY_REVIEWS: '/properties',

  // ===== FEATURE 2: REPORTS =====
  SALES_REPORT: '/report/tenant',
  AVAILABILITY_REPORT: '/report/tenant',
} as const;
