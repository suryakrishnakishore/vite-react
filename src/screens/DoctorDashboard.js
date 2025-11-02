// src/screens/DoctorDashboard.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Image,
  ImageBackground
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { colors, globalStyles } from '../styles/theme';
import Loading from '../components/common/Loading';

const DoctorDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [filter, setFilter] = useState('all');
  const [patientForm, setPatientForm] = useState({
    name: '',
    contact_number: '',
    location: '',
    age: '',
    gender: 'male',
    chief_complaint: '',
    medical_history: '',
  });
  const [errors, setErrors] = useState({});

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [])
  );

  const loadPatients = async () => {
    try {
      const response = await apiService.getPatients({
        doctor_id: user.id,
        user_type: 'doctor',
      });

      if (response.success) {
        setPatients(response.patients || []);
      } else {
        Alert.alert('Error', 'Failed to load patients');
      }
    } catch (error) {
      console.error('Load patients error:', error);
      Alert.alert('Error', 'Failed to load patients');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPatients();
  };

  const handleAddPatient = async () => {
    // Trim inputs
    const trimmed = {
      name: (patientForm.name || '').trim(),
      contact_number: (patientForm.contact_number || '').trim(),
      location: (patientForm.location || '').trim(),
      age: ((patientForm.age ?? '') + '').trim(),
      gender: patientForm.gender,
      chief_complaint: (patientForm.chief_complaint || '').trim(),
      medical_history: (patientForm.medical_history || '').trim(),
    };

    const digitsOnlyContact = trimmed.contact_number.replace(/\D/g, '');

    // Validation
    const newErrors = {};

    if (!trimmed.name) newErrors.name = 'Patient name is required';
    else if (!/^[A-Za-z\s\.]{3,}$/.test(trimmed.name))
      newErrors.name = 'Only letters, dotat least 3 characters';

    if (!digitsOnlyContact) newErrors.contact_number = 'Contact number is required';
    else if (!/^[6-9]\d{9}$/.test(digitsOnlyContact))
      newErrors.contact_number = 'Enter a valid mobile number';

    if (!trimmed.location) newErrors.location = 'Location is required';
    else if (!/^[A-Za-z\s\.,#0-9]{3,}$/.test(trimmed.location))
      newErrors.location = 'Letters, digits, dot, comma, #, at least 3 characters';

    if (trimmed.age) {
      const ageNum = Number(trimmed.age);
      if (!Number.isInteger(ageNum) || ageNum <= 0)
        newErrors.age = 'Enter a valid positive age';
      else if (ageNum >= 100) newErrors.age = 'Age must be below 100';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Submit
    try {
      const payload = {
        ...patientForm,
        name: trimmed.name,
        contact_number: digitsOnlyContact,
        location: trimmed.location,
        age: trimmed.age ? Number(trimmed.age) : null,
        doctor_id: user.id,
      };

      const response = await apiService.createPatient(payload);

      if (response.success) {
        await loadPatients();
        setShowAddPatient(false);
        setPatientForm({
          name: '',
          contact_number: '',
          location: '',
          age: '',
          gender: 'male',
          chief_complaint: '',
          medical_history: '',
        });
        setErrors({});

        Alert.alert('Success', 'Patient details submitted successfully!', [
          {
            text: 'Book Slot Now',
            onPress: () => {
              navigation.navigate('SlotBooking', {
                patientId: response.patient_id,
                patientName: payload.name,
              });
            },
          },
          {
            text: 'Book Later',
            style: 'cancel',
          },
        ]);
      } else {
        Alert.alert('Error', response.error || 'Failed to add patient');
      }
    } catch (error) {
      console.error('Add patient error:', error);
      Alert.alert('Error', 'Failed to add patient');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const filteredPatients =
    filter === 'all'
      ? patients
      : filter === 'slotBooked'
      ? patients.filter(p => p.status === 'scanned')
      : filter === 'scanned'
      ? patients.filter(p => p.status === 'completed')
      : patients.filter(p => p.status === filter);

  const renderPatientItem = ({ item }) => {
    let badgeStyle;
    if (item.status === 'scanned') badgeStyle = styles.slotBookedBadge;
    else if (item.status === 'completed') badgeStyle = styles.scannedBadge;
    else badgeStyle = styles.pendingBadge;

    return (
      <TouchableOpacity
        style={styles.patientCard}
        onPress={() => navigation.navigate('PatientDetails', { patientId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.patientHeader}>
          <Text style={styles.patientName}>{item.name}</Text>
          <View style={[styles.statusBadge, badgeStyle]}>
            <Text style={styles.statusText}>
              {item.status === 'scanned'
                ? 'Slot Booked'
                : item.status === 'completed'
                ? 'Scanned'
                : item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.patientDetail}>📞 {item.contact_number}</Text>
        <Text style={styles.patientDetail}>📍 {item.location}</Text>

        {item.scan_date && item.scan_time ? (
          <View style={styles.appointmentContainer}>
            <Text style={styles.appointmentLabel}>📅 Slot Booked At:</Text>
            <Text style={styles.appointmentText}>
              {new Date(item.scan_date).toLocaleDateString()} at {item.scan_time}
            </Text>
          </View>
        ) : (
          <View style={styles.noAppointmentContainer}>
            <Text style={styles.noAppointmentText}>No appointment booked</Text>
            {item.status !== 'completed' && (
              <TouchableOpacity
                style={styles.bookSlotButton}
                onPress={() =>
                  navigation.navigate('SlotBooking', {
                    patientId: item.id,
                    patientName: item.name,
                  })
                }
                activeOpacity={0.8}
              >
                <Text style={styles.bookSlotButtonText}>📅 Book Slot</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {item.treatment_confirmed && (
          <Text style={styles.confirmedText}>✅ Treatment Confirmed</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) return <Loading message="Loading patients..." />;

  const stats = {
    total: patients.length,
    pending: patients.filter(p => p.status === 'pending').length,
    slotBooked: patients.filter(p => p.status === 'scanned').length,
    scanned: patients.filter(p => p.status === 'completed').length,
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      <ImageBackground
        source={require('./a1_header_bg.jpg')}
        style={styles.background}
        resizeMode="repeat"
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerSection}>
              <Image
                source={require('./a1_logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.logoText}>{user.name}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      
      {/* Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statCard} onPress={() => setFilter('all')}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard} onPress={() => setFilter('pending')}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard} onPress={() => setFilter('slotBooked')}>
          <Text style={[styles.statNumber, { color: '#007bff' }]}>{stats.slotBooked}</Text>
          <Text style={styles.statLabel}>Slot Booked</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard} onPress={() => setFilter('scanned')}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{stats.scanned}</Text>
          <Text style={styles.statLabel}>Scanned</Text>
        </TouchableOpacity>
      </View>

      {/* Add Patient Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setPatientForm({
            name: '',
            contact_number: '',
            location: '',
            age: '',
            gender: 'male',
            chief_complaint: '',
            medical_history: '',
          });
          setShowAddPatient(true);
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+ Add New Patient</Text>
      </TouchableOpacity>

      {/* Patient List */}
      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No patients found</Text>
            <Text style={styles.emptySubtext}>Try changing the filter above</Text>
          </View>
        }
      />

      {/* Add Patient Modal */}
      <Modal visible={showAddPatient} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <ImageBackground
            source={require('./a1_header_bg.jpg')}
            style={styles.modalHeaderBackground}
            resizeMode="repeat"
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowAddPatient(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add New Patient</Text>
              <View style={styles.headerPlaceholder} />
            </View>
          </ImageBackground>

          {/* Modal Content */}
          <ScrollView 
            style={styles.modalContent} 
            contentContainerStyle={styles.modalContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Personal Details Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>👤</Text>
                <Text style={styles.sectionTitle}>Personal Details</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.rowContainer}>
                  <View style={[styles.inputGroup, styles.inputGroupFlex]}>
                    <Text style={styles.inputLabel}>Full Name *</Text>
                    <TextInput
                      style={[styles.input, errors.name && styles.inputError]}
                      placeholder="Enter patient's full name"
                      placeholderTextColor={colors.placeholder}
                      value={patientForm.name}
                      onChangeText={text => setPatientForm({ ...patientForm, name: text })}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                  </View>

                  <View style={[styles.inputGroup, styles.inputGroupSmall]}>
                    <Text style={styles.inputLabel}>Age</Text>
                    <TextInput
                      style={[styles.input, errors.age && styles.inputError]}
                      placeholder="Age"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="numeric"
                      value={patientForm.age}
                      onChangeText={text => setPatientForm({ ...patientForm, age: text })}
                    />
                    {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
                  </View>
                </View>
              </View>
            </View>

            {/* Contact Details Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>📞</Text>
                <Text style={styles.sectionTitle}>Contact Details</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.rowContainer}>
                  <View style={[styles.inputGroup, styles.inputGroupFlex]}>
                    <Text style={styles.inputLabel}>Contact Number *</Text>
                    <TextInput
                      style={[styles.input, errors.contact_number && styles.inputError]}
                      placeholder="10-digit mobile number"
                      placeholderTextColor={colors.placeholder}
                      keyboardType="numeric"
                      maxLength={10}
                      value={patientForm.contact_number}
                      onChangeText={text => setPatientForm({ ...patientForm, contact_number: text })}
                    />
                    {errors.contact_number && <Text style={styles.errorText}>{errors.contact_number}</Text>}
                  </View>

                  <View style={[styles.inputGroup, styles.inputGroupFlex]}>
                    <Text style={styles.inputLabel}>Location *</Text>
                    <TextInput
                      style={[styles.input, errors.location && styles.inputError]}
                      placeholder="Address/location"
                      placeholderTextColor={colors.placeholder}
                      value={patientForm.location}
                      onChangeText={text => setPatientForm({ ...patientForm, location: text })}
                    />
                    {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
                  </View>
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
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Chief Complaint</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter patient's main concern or reason for visit"
                    placeholderTextColor={colors.placeholder}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    value={patientForm.chief_complaint}
                    onChangeText={text => setPatientForm({ ...patientForm, chief_complaint: text })}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Medical History</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter any relevant medical history, allergies, or conditions"
                    placeholderTextColor={colors.placeholder}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    value={patientForm.medical_history}
                    onChangeText={text => setPatientForm({ ...patientForm, medical_history: text })}
                  />
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleAddPatient}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>✓ Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddPatient(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    minWidth:'100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    alignContent: 'center',
    paddingHorizontal: 24,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  logoText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: 'white',  // Golden yellow
    letterSpacing: 1
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  logoutText: { 
    color: '#ffffff', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  doctorName: { fontSize: 20, fontWeight: 'bold', color: colors.surface },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    ...globalStyles.shadow,
  },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.placeholder, marginTop: 4 },
  addButton: {
    backgroundColor: '#003E33',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...globalStyles.shadow,
  },
  addButtonText: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  listContainer: { padding: 20 },
  patientCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...globalStyles.shadow,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientName: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  pendingBadge: { backgroundColor: colors.warning },
  slotBookedBadge: { backgroundColor: '#007bff' },
  scannedBadge: { backgroundColor: colors.success },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.surface,
    textTransform: 'capitalize',
  },
  patientDetail: { fontSize: 14, color: colors.placeholder, marginBottom: 4 },
  appointmentContainer: {
    backgroundColor: colors.lightGreen,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  appointmentLabel: { fontSize: 14, fontWeight: '500', color: colors.darkGreen },
  appointmentText: { fontSize: 14, fontWeight: 'bold', color: colors.darkGreen },
  noAppointmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.disabled,
  },
  noAppointmentText: { fontSize: 14, color: colors.placeholder, fontStyle: 'italic' },
  bookSlotButton: {
    backgroundColor: '#003E33',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    ...globalStyles.shadow,
  },
  bookSlotButtonText: { fontSize: 13, fontWeight: 'bold', color: '#ffffff' },
  confirmedText: { fontSize: 14, fontWeight: 'bold', color: colors.success, marginTop: 8 },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: colors.placeholder, textAlign: 'center' },
  
  // Modal Styles
  modalContainer: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  modalHeaderBackground: {
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerPlaceholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Section Styles
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
  
  // Row Layout Styles
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    maxWidth: 480,
    width: '100%',
    gap: 50,
  },
  
  // Input Styles
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupFlex: {
    flex: 1,
  },
  inputGroupSmall: {
    width: 100,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.disabled,
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#ffffff',
    color: colors.text,
    fontSize: 15,
  },
  inputError: {
    borderColor: colors.warning,
    backgroundColor: '#fff5f5',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  errorText: { 
    color: colors.warning, 
    marginTop: 4,
    fontSize: 12,
    fontStyle: 'italic',
  },
  
  // Button Styles
  modalButtonsContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  submitButton: {
    backgroundColor: '#003E33',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 140,
    ...globalStyles.shadow,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#003E33',
    minWidth: 140,
  },
  cancelText: {
    color: '#003E33',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default DoctorDashboard;