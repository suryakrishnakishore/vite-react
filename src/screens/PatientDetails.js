// src/screens/PatientDetails.js
import { Linking, TextInput, ImageBackground, Image, useWindowDimensions } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { colors, globalStyles } from '../styles/theme';
import Loading from '../components/common/Loading';

const PatientDetails = ({ route, navigation }) => {
  const { patientId, userType: routeUserType } = route.params;
  const { user, userType } = useAuth();
  const currentUserType = routeUserType || userType;
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth >= 900;

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState(null); // "a1" or "doctor"
  const [selectedFiles, setSelectedFiles] = useState({
    video: null,
    report: null,
    photos: [],
  });

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ contact_number: '', age: '' });
  const [errors, setErrors] = useState({ contact_number: '', age: '' });

  const digitsOnly = (str) => (str || '').replace(/\D/g, '');

  const validateContact = (raw) => {
    const v = digitsOnly(raw);
    if (v.length === 0) return 'Contact number is required';
    if (v.length !== 10) return 'Must be exactly 10 digits';
    if (!/^[6-9]/.test(v)) return 'Must start with 6–9';
    return '';
  };

  const validateAge = (raw) => {
    const v = digitsOnly(raw);
    if (v.length === 0) return 'Age is required';
    const n = parseInt(v, 10);
    if (Number.isNaN(n)) return 'Age must be a number';
    if (n < 1 || n > 120) return 'Age must be between 1 and 120';
    return '';
  };

  useEffect(() => {
    loadPatientDetails();
  }, []);

  useEffect(() => {
    if (patient && !editMode) {
      const photos = [
        patient.photo_path1,
        patient.photo_path2,
        patient.photo_path3,
        patient.photo_path4,
        patient.photo_path5,
        patient.photo_path6,
      ].filter(Boolean);
      patient.photos = photos; // attach array for UI

      setForm({
        contact_number: digitsOnly(patient.contact_number || ''),
        age: digitsOnly(String(patient.age ?? '')),
      });
      setErrors({ contact_number: '', age: '' });
    }
  }, [patient, editMode]);

  const loadPatientDetails = async () => {
    try {
      const response = await apiService.getPatientDetails(patientId);
      if (response.success) {
        setPatient(response.patient);
      } else {
        Alert.alert('Error', 'Failed to load patient details');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Load patient details error:', error);
      Alert.alert('Error', 'Failed to load patient details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const onChangeContact = (text) => {
    const clean = digitsOnly(text).slice(0, 10);
    setForm((p) => ({ ...p, contact_number: clean }));
    setErrors((p) => ({ ...p, contact_number: validateContact(clean) }));
  };

  const onChangeAge = (text) => {
    const clean = digitsOnly(text).slice(0, 3);
    setForm((p) => ({ ...p, age: clean }));
    setErrors((p) => ({ ...p, age: validateAge(clean) }));
  };

  const isChanged = useMemo(() => {
    if (!patient) return false;
    const origContact = digitsOnly(patient.contact_number || '');
    const origAge = digitsOnly(String(patient.age ?? ''));
    return (
      form.contact_number !== origContact ||
      form.age !== origAge
    );
  }, [patient, form.contact_number, form.age]);

  const hasErrors = useMemo(() => {
    return Boolean(errors.contact_number) || Boolean(errors.age);
  }, [errors]);

  const canSave = editMode && !hasErrors && isChanged && form.contact_number && form.age && !saving;

  const saveEdits = async () => {
    const cErr = validateContact(form.contact_number);
    const aErr = validateAge(form.age);
    setErrors({ contact_number: cErr, age: aErr });
    if (cErr || aErr) return;

    setSaving(true);
    try {
      const payload = {
        patient_id: patientId,
        contact_number: form.contact_number,
        age: parseInt(form.age, 10),
      };
      const response = await apiService.updatePatient(payload);
      if (response.success) {
        Alert.alert('Success', 'Details updated');
        setEditMode(false);
        await loadPatientDetails();
      } else {
        Alert.alert('Error', response.error || 'Failed to update details');
      }
    } catch (e) {
      console.error('Update details error:', e);
      Alert.alert('Error', 'Failed to update details');
    } finally {
      setSaving(false);
    }
  };

const handleDeletePhoto = async (photoPath) => {
  try {
    const formData = new FormData();
    formData.append("action", "delete_photo");
    formData.append("patient_id", patientId.toString());
    formData.append("photo_path", photoPath);
    const response = await fetch(`${apiService.baseURL}/uploads.php`, {
      method: "POST",
      headers: {
        ...(apiService.token && { Authorization: `Bearer ${apiService.token}` }),
      },
      body: formData,
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      throw new Error("Invalid JSON from server: " + text);
    }

    if (result.success) {
      await loadPatientDetails(); // refresh patient photos after delete
    } else {
      console.error("Delete failed:", result.error || "Unknown error");
    }
  } catch (err) {
    console.error("Delete photo error:", err);
  }
};



  const cancelEdits = () => {
    if (patient) {
      setForm({
        contact_number: digitsOnly(patient.contact_number || ''),
        age: digitsOnly(String(patient.age ?? '')),
      });
      setErrors({ contact_number: '', age: '' });
    }
    setEditMode(false);
  };

  const pickDocument = async (type) => {
    try {
      let result;
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        if (type === 'video') {
          input.accept = 'video/mp4,video/avi,video/mov,video/webm';
        } else if (type === 'photos') {
          input.accept = 'image/jpeg,image/png,image/jpg';
          input.multiple = true;
        } else {
          input.accept = 'application/pdf,image/jpeg,image/png,image/jpg';
        }
        return new Promise((resolve) => {
          input.onchange = (event) => {
            const files = event.target.files;
            if (files.length > 0) {
              if (type === 'photos') {
                const newPhotos = [...selectedFiles.photos, ...Array.from(files)].slice(0, 6);
                setSelectedFiles((prev) => ({ ...prev, photos: newPhotos }));
                Alert.alert('Success', `${files.length} photo(s) selected (max 6)`);
              } else {
                const file = files[0];
                setSelectedFiles((prev) => ({ ...prev, [type]: file }));
                Alert.alert('Success', `${type} file selected: ${file.name}`);
              }
            }
            resolve();
          };
          input.oncancel = () => resolve();
          input.click();
        });
      } else {
        result = await DocumentPicker.getDocumentAsync({
          type:
            type === 'video'
              ? ['video/mp4', 'video/avi', 'video/mov', 'video/webm']
              : type === 'photos'
              ? ['image/jpeg', 'image/png', 'image/jpg']
              : ['application/pdf'],
          copyToCacheDirectory: true,
          multiple: type === 'photos',
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          if (type === 'photos') {
            setSelectedFiles((prev) => {
              const newPhotos = [...prev.photos, ...result.assets].slice(0, 6);
              return { ...prev, photos: newPhotos };
            });
            Alert.alert('Success', `${result.assets.length} photo(s) selected (max 6)`);
          } else {
            const file = result.assets[0];
            setSelectedFiles((prev) => ({ ...prev, [type]: file }));
            Alert.alert('Success', `${type} file selected: ${file.name}`);
          }
        }
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to select file');
    }
  };

  const handleUpload = async () => {
    if (uploadType === 'a1' && !selectedFiles.video && !selectedFiles.report) {
      Alert.alert('Error', 'Please select at least a video or a report to upload');
      return;
    }
    if (uploadType === 'doctor' && (!selectedFiles.photos || selectedFiles.photos.length === 0)) {
      Alert.alert('Error', 'Please select at least one photo to upload');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('patient_id', patientId.toString());
      formData.append('upload_type', uploadType);

      if (selectedFiles.video) {
        if (Platform.OS === 'web') {
          formData.append('video', selectedFiles.video);
        } else {
          formData.append('video', {
            uri: selectedFiles.video.uri,
            type: selectedFiles.video.mimeType || 'video/mp4',
            name: selectedFiles.video.name || 'video.mp4',
          });
        }
      }

      if (selectedFiles.report) {
        if (Platform.OS === 'web') {
          formData.append('report', selectedFiles.report);
        } else {
          formData.append('report', {
            uri: selectedFiles.report.uri,
            type: selectedFiles.report.mimeType || 'application/pdf',
            name: selectedFiles.report.name || 'report.pdf',
          });
        }
      }

      if (uploadType === 'doctor' && selectedFiles.photos?.length > 0) {
        selectedFiles.photos.forEach((photo, idx) => {
          if (Platform.OS === 'web') {
            formData.append('photos[]', photo);
          } else {
            formData.append('photos', {
              uri: photo.uri,
              type: photo.mimeType || 'image/jpeg',
              name: photo.name || `photo_${idx + 1}.jpg`,
            });
          }
        });
      }

      const response = await fetch(`${apiService.baseURL}/uploads.php`, {
        method: 'POST',
        headers: {
          ...(apiService.token && { Authorization: `Bearer ${apiService.token}` }),
        },
        body: formData,
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid JSON from server: ' + text);
      }

      if (result.success) {
        setShowUploadModal(false);
        setSelectedFiles({ video: null, report: null, photos: [] });
        await loadPatientDetails();
        Alert.alert('Success', 'Files uploaded successfully!');
      } else {
        Alert.alert('Error', result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const openFile = (filePath) => {
    const fileUrl = apiService.getFileURL(filePath);
    Linking.openURL(fileUrl).catch((err) => {
      console.error('Failed to open file:', err);
      Alert.alert('Error', 'Could not open file');
    });
  };

  const getFileName = (path) => (path ? path.split('/').pop() : '');

  if (loading) return <Loading message="Loading patient details..." />;

  if (!patient) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Patient not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Background Image */}
      <ImageBackground
        source={require('./a1_header_bg.jpg')}
        style={styles.headerBackground}
        resizeMode="repeat"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient Details</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </ImageBackground>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Personal Details Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>👤</Text>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            {currentUserType === 'doctor' && (
              <View style={styles.editButtonContainer}>
                {editMode ? (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={[styles.smallButton, !canSave && styles.smallButtonDisabled]}
                      onPress={saveEdits}
                      disabled={!canSave}
                    >
                      <Text style={styles.smallButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.smallButton, styles.cancelButton]} onPress={cancelEdits}>
                      <Text style={[styles.smallButtonText, styles.cancelButtonText]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.smallButton} onPress={() => setEditMode(true)}>
                    <Text style={styles.smallButtonText}>✏️ Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View style={styles.sectionContent}>
            <View style={styles.infoGrid}>
            {/* Row 1: Full Name & Age */}
            <View style={isLargeScreen ? styles.infoRow : styles.infoColumn}>
              <View style={[styles.infoItem, isLargeScreen && styles.infoItemHalf]}>
                <Text style={styles.infoIcon}>👤</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Full Name</Text>
                  <Text style={styles.infoValue}>{patient.name}</Text>
                </View>
              </View>

              <View style={[styles.infoItem, isLargeScreen && styles.infoItemHalf]}>
                <Text style={styles.infoIcon}>🎂</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Age</Text>
                  {editMode ? (
                    <View style={{ flex: 1 }}>
                      <TextInput
                        value={form.age}
                        onChangeText={onChangeAge}
                        keyboardType="number-pad"
                        inputMode="numeric"
                        maxLength={3}
                        placeholder="Age"
                        style={[
                          styles.editInput,
                          errors.age ? styles.inputError : styles.inputOk,
                        ]}
                      />
                      {!!errors.age && <Text style={styles.fieldError}>{errors.age}</Text>}
                    </View>
                  ) : (
                    <Text style={styles.infoValue}>{patient.age ?? '-'}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Row 2: Contact & Location */}
            <View style={isLargeScreen ? styles.infoRow : styles.infoColumn}>
              <View style={[styles.infoItem, isLargeScreen && styles.infoItemHalf]}>
                <Text style={styles.infoIcon}>📞</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Contact Number</Text>
                  {editMode ? (
                    <View style={{ flex: 1 }}>
                      <TextInput
                        value={form.contact_number}
                        onChangeText={onChangeContact}
                        keyboardType="phone-pad"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10-digit mobile"
                        style={[
                          styles.editInput,
                          errors.contact_number ? styles.inputError : styles.inputOk,
                        ]}
                      />
                      {!!errors.contact_number && (
                        <Text style={styles.fieldError}>{errors.contact_number}</Text>
                      )}
                    </View>
                  ) : (
                    <Text style={styles.infoValue}>{patient.contact_number}</Text>
                  )}
                </View>
              </View>

              <View style={[styles.infoItem, isLargeScreen && styles.infoItemHalf]}>
                <Text style={styles.infoIcon}>📍</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{patient.location}</Text>
                </View>
              </View>
            </View>

            {/* Row 3: Doctor & Appointment (if exists) */}
            {(patient.doctor_name || patient.scan_date) && (
              <View style={isLargeScreen ? styles.infoRow : styles.infoColumn}>
                {patient.doctor_name && (
                  <View style={[styles.infoItem, isLargeScreen && patient.scan_date && styles.infoItemHalf]}>
                    <Text style={styles.infoIcon}>👨‍⚕️</Text>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Assigned Doctor</Text>
                      <Text style={styles.infoValue}>Dr. {patient.doctor_name}</Text>
                    </View>
                  </View>
                )}

                {patient.scan_date && (
                  <View style={[styles.infoItem, isLargeScreen && patient.doctor_name && styles.infoItemHalf]}>
                    <Text style={styles.infoIcon}>📅</Text>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Appointment</Text>
                      <Text style={styles.infoValue}>
                        {new Date(patient.scan_date).toLocaleDateString()} at {patient.scan_time}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
            </View>
          </View>
        </View>

        {/* Medical Summary Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🏥</Text>
            <Text style={styles.sectionTitle}>Medical Summary</Text>
          </View>

          <View style={styles.sectionContent}>
            {/* Chief Complaint */}
            <View style={styles.medicalSection}>
              <Text style={styles.medicalLabel}>Chief Complaint</Text>
              {patient.chief_complaint ? (
                <Text style={styles.medicalText}>{patient.chief_complaint}</Text>
              ) : (
                <Text style={[styles.medicalText, { fontStyle: 'italic', color: '#9CA3AF' }]}>
                  No chief complaint recorded
                </Text>
              )}
            </View>

            {/* Medical History */}
            <View style={styles.medicalSection}>
              <Text style={styles.medicalLabel}>Medical History</Text>
              {patient.medical_history ? (
                <Text style={styles.medicalText}>{patient.medical_history}</Text>
              ) : (
                <Text style={[styles.medicalText, { fontStyle: 'italic', color: '#9CA3AF' }]}>
                  No medical history recorded
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Treatment Files Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📁</Text>
            <Text style={styles.sectionTitle}>Treatment Files</Text>
          </View>

          <View style={styles.sectionContent}>

          {!patient.video_path && !patient.report_path && !(patient.photos?.length > 0) ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateIcon}>📂</Text>
              <Text style={styles.emptyStateText}>No files uploaded yet</Text>
              <Text style={styles.emptyStateSubtext}>Treatment files will appear here once uploaded</Text>
            </View>
          ) : (
            <View style={styles.filesGrid}>
              {patient.video_path && (
                <View style={styles.fileCard}>
                  <View style={styles.fileCardHeader}>
                    <Text style={styles.fileCardIcon}>🎥</Text>
                    <Text style={styles.fileCardType}>Scan Video</Text>
                  </View>
                  <Text style={styles.fileCardName} numberOfLines={2}>
                    {getFileName(patient.video_path)}
                  </Text>
                  <TouchableOpacity
                    style={styles.fileCardButton}
                    onPress={() => openFile(patient.video_path)}
                  >
                    <Text style={styles.fileCardButtonText}>▶ View Video</Text>
                  </TouchableOpacity>
                </View>
              )}

              {patient.report_path && (
                <View style={styles.fileCard}>
                  <View style={styles.fileCardHeader}>
                    <Text style={styles.fileCardIcon}>📄</Text>
                    <Text style={styles.fileCardType}>Report</Text>
                  </View>
                  <Text style={styles.fileCardName} numberOfLines={2}>
                    {getFileName(patient.report_path)}
                  </Text>
                  <TouchableOpacity
                    style={styles.fileCardButton}
                    onPress={() => openFile(patient.report_path)}
                  >
                    <Text style={styles.fileCardButtonText}>📖 View Report</Text>
                  </TouchableOpacity>
                </View>
              )}

{patient.photos && patient.photos.length > 0 && (
                <View style={styles.photosContainer}>
                  <View style={styles.photosHeader}>
                    <Text style={styles.photosTitle}>📸 Doctor's Photos ({patient.photos.length})</Text>
                  </View>
                  <View style={styles.photosList}>
                    {patient.photos.map((photo, idx) => (
                      <View key={idx} style={styles.photoItem}>
                        <View style={styles.photoItemContent}>
                          <Text style={styles.photoItemIcon}>🖼️</Text>
                          <View style={styles.photoItemInfo}>
                            <Text style={styles.photoItemTitle}>Photo {idx + 1}</Text>
                            <Text style={styles.photoItemName} numberOfLines={1}>
                              {getFileName(photo)}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.photoItemActions}>
                          <TouchableOpacity
                            style={styles.photoActionButton}
                            onPress={() => openFile(photo)}
                          >
                            <Text style={styles.photoActionButtonText}>👁️ View</Text>
                          </TouchableOpacity>
                          {currentUserType === 'doctor' && (
                            <TouchableOpacity
                              style={[styles.photoActionButton, styles.deleteButton]}
                              onPress={() => handleDeletePhoto(photo)}
                            >
                              <Text style={styles.photoActionButtonText}>🗑️</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
          </View>
        </View>

        {/* Upload Buttons */}
        <View style={styles.uploadButtonContainer}>
          {currentUserType === 'a1_user' && (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => {
                setUploadType('a1');
                setShowUploadModal(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.uploadButtonText}>
                {patient.video_path || patient.report_path ? 'Change Uploaded Files' : 'Upload Files'}
              </Text>
            </TouchableOpacity>
          )}

          {currentUserType === 'doctor' && (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => {
                setUploadType("doctor");
                setShowUploadModal(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.uploadButtonText}>Upload Photos</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalContainer}>
          <ImageBackground
            source={require('./a1_header_bg.jpg')}
            style={styles.modalHeaderBackground}
            resizeMode="repeat"
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {uploadType === 'a1' ? '📤 Upload Video & Report' : '📸 Upload Photos'}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowUploadModal(false)}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {uploadType === 'a1' && (
              <>
                <View style={styles.uploadSection}>
                  <Text style={styles.uploadLabel}>Scan Video</Text>
                  <TouchableOpacity
                    style={styles.pickFileButton}
                    onPress={() => pickDocument('video')}
                  >
                    <Text style={styles.pickFileButtonText}>
                      {selectedFiles.video ? '📹 Change Video' : '📹 Select Video'}
                    </Text>
                  </TouchableOpacity>
                  {selectedFiles.video && (
                    <Text style={styles.selectedFileText}>
                      Selected: {selectedFiles.video.name}
                    </Text>
                  )}
                </View>

                <View style={styles.uploadSection}>
                  <Text style={styles.uploadLabel}>Treatment Report</Text>
                  <TouchableOpacity
                    style={styles.pickFileButton}
                    onPress={() => pickDocument('report')}
                  >
                    <Text style={styles.pickFileButtonText}>
                      {selectedFiles.report ? '📄 Change Report' : '📄 Select Report'}
                    </Text>
                  </TouchableOpacity>
                  {selectedFiles.report && (
                    <Text style={styles.selectedFileText}>
                      Selected: {selectedFiles.report.name}
                    </Text>
                  )}
                </View>
              </>
            )}

            {uploadType === "doctor" && (
  <View style={styles.uploadSection}>
    <Text style={styles.uploadLabel}>Upload Photos (Max 6)</Text>

    {patient.photos && patient.photos.length >= 6 ? (
      <Text style={styles.noFileText}>You have already uploaded 6 photos. Delete or replace to add new ones.</Text>
    ) : (
      <TouchableOpacity
        style={styles.pickFileButton}
        onPress={() => pickDocument("photos")}
      >
        <Text style={styles.pickFileButtonText}>📷 Select Photos</Text>
      </TouchableOpacity>
    )}

    {selectedFiles.photos.map((photo, idx) => (
      <Text key={idx} style={styles.selectedFileText}>
        Selected: {photo.name || `photo_${idx + 1}.jpg`}
      </Text>
    ))}
  </View>
)}

            <TouchableOpacity
              style={[
                styles.uploadSubmitButton,
                uploadType === 'a1' &&
                  !selectedFiles.video &&
                  !selectedFiles.report &&
                  styles.disabledButton,
                uploadType === 'doctor' &&
                  selectedFiles.photos.length === 0 &&
                  styles.disabledButton,
              ]}
              onPress={handleUpload}
              disabled={
                uploading ||
                (uploadType === 'a1' &&
                  !selectedFiles.video &&
                  !selectedFiles.report) ||
                (uploadType === 'doctor' && selectedFiles.photos.length === 0)
              }
              activeOpacity={0.8}
            >
              <Text style={styles.uploadSubmitButtonText}>
                {uploading ? 'Uploading...' : 'Upload Files'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  
  // Header Styles
  headerBackground: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerPlaceholder: {
    width: 40,
  },

  scrollContainer: { flex: 1, padding: 16 },
  
  // Section Styles - Consistent with DoctorDashboard
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...globalStyles.shadow,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.disabled,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003E33',
    letterSpacing: 0.3,
  },
  sectionContent: {
    padding: 16,
  },
  editButtonContainer: {
    marginLeft: 'auto',
  },
  
  // Info Grid Styles
  infoGrid: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 4,
  },
  infoColumn: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 4,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    maxWidth: 480,
    ...globalStyles.shadow,
  },
  infoItemHalf: {
    flex: 1,
    maxWidth: 480,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    lineHeight: 22,
  },
  
  // Medical Section Styles (within sectionContent)
  medicalSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    ...globalStyles.shadow,
  },
  medicalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  medicalText: { 
    fontSize: 15, 
    color: colors.text, 
    lineHeight: 22,
  },
  
  editInput: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 15,
    backgroundColor: colors.surface,
    marginTop: 4,
  },
  inputOk: { borderColor: '#d0d5dd' },
  inputError: { borderColor: colors.error },
  fieldError: { marginTop: 6, fontSize: 12, color: colors.error },
  smallButton: {
    backgroundColor: '#003E33',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    alignItems: 'center',
    ...globalStyles.shadow,
  },
  smallButtonDisabled: { opacity: 0.5 },
  smallButtonText: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
  cancelButton: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#003E33' },
  cancelButtonText: { color: '#003E33' },
  
  // Upload Button Styles
  uploadButtonContainer: {
    gap: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#003E33',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
    maxWidth: 300,
    ...globalStyles.shadow,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  // Empty State Styles
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  
  // Files Grid Styles
  filesGrid: {
    gap: 12,
  },
  fileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    ...globalStyles.shadow,
  },
  fileCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  fileCardIcon: {
    fontSize: 28,
  },
  fileCardType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003E33',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fileCardName: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  fileCardButton: {
    backgroundColor: '#003E33',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  fileCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  
  // Photos Section Styles
  photosContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
  },
  photosHeader: {
    marginBottom: 12,
  },
  photosTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003E33',
  },
  photosList: {
    gap: 10,
  },
  photoItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...globalStyles.shadow,
  },
  photoItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  photoItemIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  photoItemInfo: {
    flex: 1,
  },
  photoItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  photoItemName: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  photoItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  photoActionButton: {
    backgroundColor: '#003E33',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  photoActionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeaderBackground: {
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: { 
    flex: 1, 
    padding: 20,
    paddingTop: 24,
  },
  uploadSection: { 
    marginBottom: 24,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    ...globalStyles.shadow,
  },
  uploadLabel: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#003E33', 
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  pickFileButton: {
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#003E33',
    borderStyle: 'dashed',
    ...globalStyles.shadow,
  },
  pickFileButtonText: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#003E33',
    letterSpacing: 0.3,
  },
  selectedFileText: { 
    fontSize: 13, 
    fontWeight: '600',
    color: '#059669', 
    marginTop: 8,
    marginLeft: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
  },
  noFileText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 12,
  },
  uploadSubmitButton: {
    backgroundColor: '#003E33',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 20,
    minWidth: 200,
    maxWidth: 300,
    ...globalStyles.shadow,
  },
  disabledButton: { backgroundColor: colors.disabled, opacity: 0.5 },
  uploadSubmitButtonText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default PatientDetails;
