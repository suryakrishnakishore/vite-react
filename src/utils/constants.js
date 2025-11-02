// src/utils/constants.js

// App Configuration
export const APP_CONFIG = {
  NAME: 'Dental Management System',
  VERSION: '1.0.0',
  DESCRIPTION: 'Professional dental appointment and treatment management system',
  AUTHOR: 'A1 Aligners Team',
};

// User Types
export const USER_TYPES = {
  DOCTOR: 'doctor',
  A1_USER: 'a1_user',
  ADMIN: 'admin',
};

// Patient Status
export const PATIENT_STATUS = {
  PENDING: 'pending',
  SCANNED: 'scanned',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

// Time Slot Configuration
export const TIME_SLOTS = {
  START_TIME: '09:00',
  END_TIME: '21:00',
  INTERVAL_MINUTES: 30,
  WORKING_DAYS: [1, 2, 3, 4, 5, 6], // Monday to Saturday
  EXCLUDED_DAYS: [0], // Sunday
};

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: {
    VIDEO: 100 * 1024 * 1024, // 100MB
    REPORT: 10 * 1024 * 1024,  // 10MB
    IMAGE: 5 * 1024 * 1024,    // 5MB
  },
  ALLOWED_TYPES: {
    VIDEO: ['mp4', 'avi', 'mov', 'webm', 'mkv'],
    REPORT: ['pdf', 'doc', 'docx'],
    IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
  },
  MIME_TYPES: {
    VIDEO: [
      'video/mp4',
      'video/avi',
      'video/quicktime',
      'video/webm',
      'video/x-msvideo',
    ],
    REPORT: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    IMAGE: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
    ],
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth.php',
    REGISTER: 'auth.php',
    LOGOUT: 'auth.php',
    REFRESH: 'auth.php',
  },
  PATIENTS: {
    LIST: 'patients.php',
    CREATE: 'patients.php',
    UPDATE: 'patients.php',
    DELETE: 'patients.php',
    DETAILS: 'patients.php',
  },
  SLOTS: {
    LIST: 'slots.php',
    BOOK: 'slots.php',
    CANCEL: 'slots.php',
    AVAILABLE: 'slots.php',
  },
  UPLOADS: {
    UPLOAD: 'uploads.php',
    DOWNLOAD: 'uploads.php',
    DELETE: 'uploads.php',
  },
  NOTIFICATIONS: {
    LIST: 'notifications.php',
    MARK_READ: 'notifications.php',
  },
};

// Database Tables
export const DB_TABLES = {
  DOCTORS: 'doctors',
  A1_USERS: 'a1_users',
  PATIENTS: 'patients',
  TIME_SLOTS: 'time_slots',
  NOTIFICATIONS: 'notifications',
  UPLOADS: 'uploads',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'dental_user',
  TOKEN: 'dental_token',
  USER_TYPE: 'dental_user_type',
  SETTINGS: 'dental_settings',
  THEME: 'dental_theme',
  LANGUAGE: 'dental_language',
};

// Navigation Routes
export const ROUTES = {
  // Auth Stack
  LANDING: 'Landing',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',

  // Doctor Stack
  DOCTOR_DASHBOARD: 'DoctorDashboard',
  PATIENT_FORM: 'PatientForm',
  SLOT_BOOKING: 'SlotBooking',
  PATIENT_DETAILS: 'PatientDetails',
  DOCTOR_PROFILE: 'DoctorProfile',

  // A1 Stack
  A1_DASHBOARD: 'A1Dashboard',
  A1_PATIENT_LIST: 'A1PatientList',
  A1_UPLOADS: 'A1Uploads',
  A1_SETTINGS: 'A1Settings',

  // Common
  NOTIFICATIONS: 'Notifications',
  SETTINGS: 'Settings',
  HELP: 'Help',
  ABOUT: 'About',
};

// Form Validation Rules
export const VALIDATION = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  PHONE: {
    PATTERN: /^[\+]?[0-9\s\-\(\)]{10,}$/,
    MESSAGE: 'Please enter a valid phone number',
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
    MESSAGE: 'Password must be at least 6 characters long',
  },
  NAME: {
    MIN_LENGTH: 2,
    PATTERN: /^[a-zA-Z\s]+$/,
    MESSAGE: 'Name must contain only letters and spaces',
  },
  AGE: {
    MIN: 1,
    MAX: 150,
    MESSAGE: 'Please enter a valid age (1-150)',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  SERVER: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size is too large.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  UPLOAD_FAILED: 'File upload failed.',
  LOGIN_FAILED: 'Invalid email or password.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  SLOT_UNAVAILABLE: 'Selected time slot is not available.',
  PATIENT_NOT_FOUND: 'Patient not found.',
  ACCESS_DENIED: 'Access denied.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTRATION: 'Registration successful!',
  PATIENT_ADDED: 'Patient added successfully!',
  PATIENT_UPDATED: 'Patient updated successfully!',
  SLOT_BOOKED: 'Appointment booked successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
  TREATMENT_CONFIRMED: 'Treatment confirmed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  LOGOUT: 'Logged out successfully!',
};

// Date and Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  FULL: 'dddd, MMMM DD, YYYY',
  SHORT: 'MM/DD/YYYY',
  ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ',
};

export const TIME_FORMATS = {
  DISPLAY: 'h:mm A',
  INPUT: 'HH:mm',
  FULL: 'h:mm:ss A',
  SHORT: 'h:mm A',
  24_HOUR: 'HH:mm',
};

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

// Specialization Options
export const SPECIALIZATION_OPTIONS = [
  { value: 'general', label: 'General Dentistry' },
  { value: 'orthodontist', label: 'Orthodontist' },
  { value: 'oral_surgeon', label: 'Oral Surgeon' },
  { value: 'periodontist', label: 'Periodontist' },
  { value: 'endodontist', label: 'Endodontist' },
  { value: 'prosthodontist', label: 'Prosthodontist' },
  { value: 'pediatric', label: 'Pediatric Dentist' },
  { value: 'cosmetic', label: 'Cosmetic Dentist' },
];

// Language Options
export const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
];

// Theme Options
export const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'auto', label: 'System', icon: '⚙️' },
];

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  APPOINTMENT: 'appointment',
  TREATMENT: 'treatment',
  SYSTEM: 'system',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9]\d{1,14}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  NAME: /^[a-zA-Z\s'-]{2,50}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMERIC: /^\d+$/,
  URL: /^https?:\/\/.+/,
};

// Default Values
export const DEFAULTS = {
  PATIENT: {
    GENDER: 'male',
    AGE: null,
    MEDICAL_HISTORY: '',
  },
  APPOINTMENT: {
    DURATION: 30, // minutes
    BUFFER_TIME: 5, // minutes
  },
  PAGINATION: {
    PAGE: 1,
    LIMIT: 20,
  },
};

export default {
  APP_CONFIG,
  USER_TYPES,
  PATIENT_STATUS,
  APPOINTMENT_STATUS,
  TIME_SLOTS,
  FILE_UPLOAD,
  API_ENDPOINTS,
  DB_TABLES,
  STORAGE_KEYS,
  ROUTES,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DATE_FORMATS,
  TIME_FORMATS,
  GENDER_OPTIONS,
  SPECIALIZATION_OPTIONS,
  LANGUAGE_OPTIONS,
  THEME_OPTIONS,
  NOTIFICATION_TYPES,
  PAGINATION,
  REGEX,
  DEFAULTS,
};