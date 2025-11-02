// src/services/storage.js
import { Platform } from 'react-native';

class StorageService {
  constructor() {
    this.isWeb = Platform.OS === 'web';
  }

  async setItem(key, value) {
    try {
      if (this.isWeb) {
        localStorage.setItem(key, value);
      } else {
        // For React Native, we'll use a simple in-memory storage
        // In production, use AsyncStorage or Secure Store
        if (!global.dentalAppStorage) {
          global.dentalAppStorage = {};
        }
        global.dentalAppStorage[key] = value;
      }
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  }

  async getItem(key) {
    try {
      if (this.isWeb) {
        return localStorage.getItem(key);
      } else {
        if (!global.dentalAppStorage) {
          return null;
        }
        return global.dentalAppStorage[key] || null;
      }
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      if (this.isWeb) {
        localStorage.removeItem(key);
      } else {
        if (global.dentalAppStorage && global.dentalAppStorage[key]) {
          delete global.dentalAppStorage[key];
        }
      }
      return true;
    } catch (error) {
      console.error('Storage removeItem error:', error);
      return false;
    }
  }

  async clear() {
    try {
      if (this.isWeb) {
        localStorage.clear();
      } else {
        global.dentalAppStorage = {};
      }
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }
}

export const storage = new StorageService();