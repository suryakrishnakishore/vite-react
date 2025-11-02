// src/services/api.js
import { Platform } from "react-native";

// Configure base URL based on platform
const getBaseURL = () => {
  if (Platform.OS === "web") {
    return "https://a1-aligners-node-backend.onrender.com/dental-management-system/backend/api";
  } else {
    return Platform.OS === "android"
      ? "http://10.0.2.2:3000/dental-management-system/backend/api"
      : "http://localhost:3000/dental-management-system/backend/api";
  }
};

const BASE_URL = getBaseURL();

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

async request(endpoint, options = {}) {
  const url = `${this.baseURL}/${endpoint}`;

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const raw = await response.text();

    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error("❌ Invalid JSON from server:", raw);
      data = { success: false, error: "Invalid server response", raw };
    }

    if (!response.ok) {
      return { success: false, status: response.status, ...data };
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    return {
      success: false,
      status: 0,
      error: "Network error. Please check your connection.",
    };
  }
}


  async get(endpoint, params = {}) {
    const queryString =
      Object.keys(params).length > 0
        ? "?" + new URLSearchParams(params).toString()
        : "";
    return this.request(`${endpoint}${queryString}`, {
      method: "GET",
    });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }

  async uploadFile(endpoint, formData) {
    const url = `${this.baseURL}/${endpoint}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
        },
        body: formData,
      });

      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { raw };
      }

      if (!response.ok) {
        return { success: false, status: response.status, ...data };
      }
      return data;
    } catch (error) {
      console.error("File upload failed:", error);
      return {
        success: false,
        status: 0,
        error: "Network error. Please check your connection.",
      };
    }
  }

  // ---------------- AUTH ----------------
  async loginDoctor(email, password) {
    return this.post("auth.php", {
      action: "doctor_login",
      email,
      password,
    });
  }

  async loginA1User(email, password) {
    return this.post("auth.php", {
      action: "a1_login",
      email,
      password,
    });
  }

  async registerDoctor(doctorData) {
    return this.post("auth.php", {
      action: "doctor_register",
      ...doctorData,
    });
  }

    async resetPasswordDoctor(email, newPassword) {
    return this.post("auth.php", {
      action: "doctor_reset_password",
      email,
      new_password: newPassword,
    });
  }

  async resetPasswordA1(email, newPassword) {
    return this.post("auth.php", {
      action: "a1_reset_password",
      email,
      new_password: newPassword,
    });
  }


  // ---------------- PATIENTS ----------------
  async getPatients(params = {}) {
    return this.get("patients.php", params);
  }

  async createPatient(patientData) {
    return this.post("patients.php", patientData);
  }

  async updatePatient(patientData) {
    return this.put("patients.php", patientData);
  }

  async getPatientDetails(patientId) {
    return this.get("patients.php", { patient_id: patientId });
  }

  // ---------------- SLOTS ----------------
  async getAvailableSlots(date, weeks = 2) {
    return this.get("slots.php", { date, weeks });
  }

  async bookSlot(slotData) {
    return this.post("slots.php", slotData);
  }

  // ---------------- UPLOADS ----------------
  async uploadPatientFiles(patientId, files) {
    const formData = new FormData();
    formData.append("patient_id", patientId);

    // Video
    if (files.video) {
      if (Platform.OS === "web") {
        const videoBlob = await (await fetch(files.video.uri)).blob();
        formData.append(
          "video",
          videoBlob,
          files.video.name || `video_${Date.now()}.mp4`
        );
      } else {
        formData.append("video", {
          uri: files.video.uri,
          name: files.video.name || `video_${Date.now()}.mp4`,
          type: files.video.mimeType || "video/mp4",
        });
      }
    }

    // Report
    if (files.report) {
      if (Platform.OS === "web") {
        const reportBlob = await (await fetch(files.report.uri)).blob();
        formData.append(
          "report",
          reportBlob,
          files.report.name || `report_${Date.now()}.pdf`
        );
      } else {
        formData.append("report", {
          uri: files.report.uri,
          name: files.report.name || `report_${Date.now()}.pdf`,
          type: files.report.mimeType || "application/pdf",
        });
      }
    }

    return this.uploadFile("uploads.php", formData);
  }

  // Get file URL
  getFileURL(filePath) {
    return `${this.baseURL}/uploads.php?action=get_file&file_path=${encodeURIComponent(
      filePath
    )}`;
  }
}

export default new ApiService();
