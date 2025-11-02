// src/utils/helpers.js
import { Platform } from 'react-native';
import { 
  DATE_FORMATS, 
  TIME_FORMATS, 
  VALIDATION, 
  FILE_UPLOAD,
  TIME_SLOTS 
} from './constants';

// Date and Time Helpers
export const dateHelpers = {
  // Format date for display
  formatDate: (date, format = DATE_FORMATS.DISPLAY) => {
    if (!date) return '';
    const dateObj = new Date(date);
    
    switch (format) {
      case DATE_FORMATS.DISPLAY:
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        });
      case DATE_FORMATS.FULL:
        return dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case DATE_FORMATS.SHORT:
        return dateObj.toLocaleDateString('en-US');
      case DATE_FORMATS.INPUT:
        return dateObj.toISOString().split('T')[0];
      default:
        return dateObj.toLocaleDateString();
    }
  },

  // Format time for display
  formatTime: (time, format = TIME_FORMATS.DISPLAY) => {
    if (!time) return '';
    
    // Handle both full datetime and time-only strings
    let timeObj;
    if (time.includes('T')) {
      timeObj = new Date(time);
    } else {
      timeObj = new Date(`2000-01-01T${time}`);
    }

    switch (format) {
      case TIME_FORMATS.DISPLAY:
        return timeObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      case TIME_FORMATS.INPUT:
        return timeObj.toTimeString().slice(0, 5);
      case TIME_FORMATS.24_HOUR:
        return timeObj.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });
      default:
        return timeObj.toLocaleTimeString();
    }
  },

  // Get current date in various formats
  getCurrentDate: (format = DATE_FORMATS.INPUT) => {
    return dateHelpers.formatDate(new Date(), format);
  },

  // Get current time in various formats
  getCurrentTime: (format = TIME_FORMATS.INPUT) => {
    return dateHelpers.formatTime(new Date(), format);
  },

  // Check if date is today
  isToday: (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
  },

  // Check if date is in the past
  isPast: (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate < today;
  },

  // Add days to a date
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  // Get day name
  getDayName: (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  },

  // Check if day is weekend (Sunday = 0)
  isWeekend: (date) => {
    const day = new Date(date).getDay();
    return day === 0; // Only Sunday for our system
  },
};

// Validation Helpers
export const validationHelpers = {
  // Validate email
  isValidEmail: (email) => {
    return VALIDATION.EMAIL.PATTERN.test(email);
  },

  // Validate phone number
  isValidPhone: (phone) => {
    return VALIDATION.PHONE.PATTERN.test(phone);
  },

  // Validate password strength
  isValidPassword: (password) => {
    return password && password.length >= VALIDATION.PASSWORD.MIN_LENGTH;
  },

  // Validate name
  isValidName: (name) => {
    return name && name.length >= VALIDATION.NAME.MIN_LENGTH && VALIDATION.NAME.PATTERN.test(name);
  },

  // Validate age
  isValidAge: (age) => {
    const ageNum = parseInt(age);
    return ageNum >= VALIDATION.AGE.MIN && ageNum <= VALIDATION.AGE.MAX;
  },

  // Check if string is empty or whitespace
  isEmpty: (str) => {
    return !str || str.trim().length === 0;
  },

  // Validate required fields
  validateRequired: (obj, fields) => {
    const errors = {};
    fields.forEach(field => {
      if (validationHelpers.isEmpty(obj[field])) {
        errors[field] = `${field} is required`;
      }
    });
    return errors;
  },
};

// File Helpers
export const fileHelpers = {
  // Check if file size is within limit
  isValidFileSize: (fileSize, type = 'IMAGE') => {
    const maxSize = FILE_UPLOAD.MAX_SIZE[type];
    return fileSize <= maxSize;
  },

  // Check if file type is allowed
  isValidFileType: (fileName, type = 'IMAGE') => {
    const extension = fileName.split('.').pop().toLowerCase();
    return FILE_UPLOAD.ALLOWED_TYPES[type].includes(extension);
  },

  // Format file size for display
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get file extension
  getFileExtension: (fileName) => {
    return fileName.split('.').pop().toLowerCase();
  },

  // Generate unique filename
  generateFileName: (originalName) => {
    const extension = fileHelpers.getFileExtension(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}_${random}.${extension}`;
  },
};

// String Helpers
export const stringHelpers = {
  // Capitalize first letter
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Convert to title case
  toTitleCase: (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Truncate string with ellipsis
  truncate: (str, maxLength = 50) => {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  },

  // Remove extra whitespace
  cleanWhitespace: (str) => {
    if (!str) return '';
    return str.replace(/\s+/g, ' ').trim();
  },

  // Generate initials from name
  getInitials: (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  },

  // Format phone number for display
  formatPhone: (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
    }
    return phone;
  },

  // Generate random string
  randomString: (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
};

// Array Helpers
export const arrayHelpers = {
  // Remove duplicates from array
  unique: (arr) => {
    return [...new Set(arr)];
  },

  // Group array by property
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const group = item[key];
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Sort array by property
  sortBy: (arr, key, direction = 'asc') => {
    return arr.sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
  },

  // Chunk array into smaller arrays
  chunk: (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  // Find item by property value
  findBy: (arr, key, value) => {
    return arr.find(item => item[key] === value);
  },

  // Filter array by multiple conditions
  filterBy: (arr, conditions) => {
    return arr.filter(item => {
      return Object.keys(conditions).every(key => {
        return item[key] === conditions[key];
      });
    });
  },
};

// Platform Helpers
export const platformHelpers = {
  // Check if running on web
  isWeb: () => Platform.OS === 'web',

  // Check if running on iOS
  isIOS: () => Platform.OS === 'ios',

  // Check if running on Android
  isAndroid: () => Platform.OS === 'android',

  // Get platform-specific value
  select: (options) => Platform.select(options),

  // Check if device is tablet (rough estimation)
  isTablet: (width, height) => {
    const deviceWidth = width || 0;
    const deviceHeight = height || 0;
    return Math.min(deviceWidth, deviceHeight) >= 768;
  },
};

// Time Slot Helpers
export const timeSlotHelpers = {
  // Generate time slots for a day
  generateTimeSlots: () => {
    const slots = [];
    let currentTime = new Date(`2000-01-01T${TIME_SLOTS.START_TIME}:00`);
    const endTime = new Date(`2000-01-01T${TIME_SLOTS.END_TIME}:00`);

    while (currentTime < endTime) {
      slots.push({
        time: currentTime.toTimeString().slice(0, 5),
        display: dateHelpers.formatTime(currentTime, TIME_FORMATS.DISPLAY),
        available: true,
      });

      currentTime.setMinutes(currentTime.getMinutes() + TIME_SLOTS.INTERVAL_MINUTES);
    }

    return slots;
  },

  // Check if time slot is in working hours
  isWorkingHour: (time) => {
    const slotTime = new Date(`2000-01-01T${time}:00`);
    const startTime = new Date(`2000-01-01T${TIME_SLOTS.START_TIME}:00`);
    const endTime = new Date(`2000-01-01T${TIME_SLOTS.END_TIME}:00`);

    return slotTime >= startTime && slotTime < endTime;
  },

  // Check if day is working day
  isWorkingDay: (date) => {
    const day = new Date(date).getDay();
    return TIME_SLOTS.WORKING_DAYS.includes(day);
  },

  // Get next available slot
  getNextAvailableSlot: (slots, currentTime = null) => {
    const now = currentTime || new Date();
    const todaySlots = slots.filter(slot => {
      const slotTime = new Date(`${dateHelpers.getCurrentDate()}T${slot.time}:00`);
      return slotTime > now && slot.available;
    });

    return todaySlots.length > 0 ? todaySlots[0] : null;
  },
};

// Color Helpers
export const colorHelpers = {
  // Convert hex to rgba
  hexToRgba: (hex, opacity = 1) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // Lighten color
  lighten: (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  },

  // Darken color
  darken: (color, percent) => {
    return colorHelpers.lighten(color, -percent);
  },
};

// Storage Helpers
export const storageHelpers = {
  // Safe JSON parse
  parseJSON: (jsonString, fallback = null) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Failed to parse JSON:', error);
      return fallback;
    }
  },

  // Safe JSON stringify
  stringifyJSON: (obj, fallback = '{}') => {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      console.warn('Failed to stringify JSON:', error);
      return fallback;
    }
  },
};

// Network Helpers
export const networkHelpers = {
  // Simple retry function
  retry: async (fn, retries = 3, delay = 1000) => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return networkHelpers.retry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  },

  // Check if error is network-related
  isNetworkError: (error) => {
    return !error.response && error.request;
  },

  // Build query string from object
  buildQueryString: (params) => {
    const query = Object.keys(params)
      .filter(key => params[key] !== null && params[key] !== undefined)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    return query ? `?${query}` : '';
  },
};

// Form Helpers
export const formHelpers = {
  // Create form data from object
  createFormData: (data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (data[key] instanceof File) {
          formData.append(key, data[key]);
        } else if (typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key].toString());
        }
      }
    });

    return formData;
  },

  // Reset form to initial values
  resetForm: (setFormData, initialValues) => {
    setFormData(initialValues);
  },

  // Update single form field
  updateField: (setFormData, field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  },

  // Validate form and return errors
  validateForm: (data, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const value = data[field];
      const rule = rules[field];
      
      if (rule.required && validationHelpers.isEmpty(value)) {
        errors[field] = `${stringHelpers.toTitleCase(field)} is required`;
      } else if (value && rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.message || `Invalid ${field}`;
      } else if (value && rule.minLength && value.length < rule.minLength) {
        errors[field] = `${stringHelpers.toTitleCase(field)} must be at least ${rule.minLength} characters`;
      } else if (value && rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `${stringHelpers.toTitleCase(field)} cannot exceed ${rule.maxLength} characters`;
      }
    });
    
    return errors;
  },
};

// Export all helpers
export default {
  dateHelpers,
  validationHelpers,
  fileHelpers,
  stringHelpers,
  arrayHelpers,
  platformHelpers,
  timeSlotHelpers,
  colorHelpers,
  storageHelpers,
  networkHelpers,
  formHelpers,
};