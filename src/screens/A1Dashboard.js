// src/screens/A1Dashboard.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
  ImageBackground
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { colors, globalStyles } from '../styles/theme';
import Loading from '../components/common/Loading';

const A1Dashboard = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, slotBooked, scanned
  const [showDoctors, setShowDoctors] = useState(false);

  // 🔹 Load Patients
  const loadPatients = async () => {
    try {
      const response = await apiService.getPatients({
        user_type: 'a1_user',
      });
      if (response.success) {
        const filteredAndSorted = (response.patients || [])
          .filter(p => p.status !== 'pending')
          .sort((a, b) => {
            const dateA = new Date(`${a.scan_date} ${a.scan_time}`);
            const dateB = new Date(`${b.scan_date} ${b.scan_time}`);
            return dateA - dateB;
          });
        setPatients(filteredAndSorted);
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

  // 🔹 Load Pending Doctors (list + count)
  const loadPendingDoctors = async () => {
    try {
      const res = await apiService.post('auth.php', { action: 'get_pending_doctors' });
      if (res.success) {
        setPendingDoctors(res.doctors || []);
      } else {
        setPendingDoctors([]);
      }
    } catch (err) {
      console.error('Error loading pending doctors:', err);
      setPendingDoctors([]);
    }
  };

  // 🔹 Approve a doctor
  const approveDoctor = async (doctorId) => {
    const res = await apiService.post('auth.php', {
      action: 'approve_doctor',
      doctor_id: doctorId,
    });
    if (res.success) {
      Alert.alert('Success', 'Doctor approved!');
      loadPendingDoctors();
    } else {
      Alert.alert('Error', res.error || 'Approval failed');
    }
  };

  // 🔹 When screen is focused, reload both patients & pending doctors
  useFocusEffect(
    useCallback(() => {
      loadPatients();
      loadPendingDoctors();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadPatients();
    loadPendingDoctors();
  };

  const handleLogout = async () => {
    await logout();
  };

  // Filter patients
  const filteredPatients =
    filter === 'all'
      ? patients
      : filter === 'slotBooked'
      ? patients.filter(p => p.status === 'scanned')
      : filter === 'scanned'
      ? patients.filter(p => p.status === 'completed')
      : patients.filter(p => p.status === filter);

  // Stats calculation
  const stats = {
    total: patients.length,
    pending: patients.filter(p => p.status === 'pending').length,
    slotBooked: patients.filter(p => p.status === 'scanned').length,
    scanned: patients.filter(p => p.status === 'completed').length,
    pendingDoctors: pendingDoctors.length,
  };

  const renderPatientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() =>
        navigation.navigate('PatientDetails', {
          patientId: item.id,
          userType: 'a1_user',
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.patientHeader}>
        <Text style={styles.patientName}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'scanned'
              ? styles.slotBookedBadge
              : item.status === 'completed'
              ? styles.scannedBadge
              : styles[`${item.status}Badge`],
          ]}
        >
          <Text style={styles.statusText}>
            {item.status === 'scanned'
              ? 'Slot Booked'
              : item.status === 'completed'
              ? 'Scanned'
              : item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.patientDetail}>👨‍⚕ Dr. {item.doctor_name}</Text>
      <Text style={styles.patientDetail}>📞 {item.contact_number}</Text>
      <Text style={styles.patientDetail}>📍 {item.location}</Text>

      {item.scan_date && item.scan_time && (
        <Text style={styles.patientDetail}>
          📅 {new Date(item.scan_date).toLocaleDateString()} at {item.scan_time}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading message="Loading patients..." />;
  }

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
              <Text style={styles.logoText}>A1 ALIGNERS</Text>
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
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {stats.pending}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard} onPress={() => setFilter('slotBooked')}>
          <Text style={[styles.statNumber, { color: '#007bff' }]}>
            {stats.slotBooked}
          </Text>
          <Text style={styles.statLabel}>Slot Booked</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard} onPress={() => setFilter('scanned')}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {stats.scanned}
          </Text>
          <Text style={styles.statLabel}>Scanned</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigation.navigate('PendingDoctors')}
        >
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {stats.pendingDoctors}
          </Text>
          <Text style={styles.statLabel}>Pending Doctors</Text>
        </TouchableOpacity>
      </View>

      {/* Patient List */}
      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filter === 'all' ? 'No patients yet' : `No ${filter} patients`}
            </Text>
            <Text style={styles.emptySubtext}>
              {filter === 'all'
                ? 'Patients will appear here when doctors add them'
                : `Switch to "All" to see all patients`}
            </Text>
          </View>
        }
      />

      {showDoctors && (
        <FlatList
          data={pendingDoctors}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.doctorCard}>
              <View style={styles.doctorRow}>
                <Text style={[styles.doctorCell, { flex: 2 }]}>{item.name || '-'}</Text>
                <Text style={[styles.doctorCell, { flex: 3 }]}>{item.email || '-'}</Text>
                <Text style={[styles.doctorCell, { flex: 2 }]}>{item.phone || '-'}</Text>
                <Text style={[styles.doctorCell, { flex: 2 }]}>
                  {item.specialization || '-'}
                </Text>
                <Text style={[styles.doctorCell, { flex: 1 }]}>
                  {item.is_approved ? 'Yes' : 'No'}
                </Text>
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={() => approveDoctor(item.id)}
                >
                  <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  background: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    minWidth:'100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
    color: 'white', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    ...globalStyles.shadow,
  },
  statNumber: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  statLabel: { fontSize: 10, color: colors.placeholder, marginTop: 2 },
  listContainer: { padding: 20, paddingTop: 0 },
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
  patientName: { fontSize: 18, fontWeight: 'bold', color: colors.text, flex: 1 },
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
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  emptySubtext: {
    fontSize: 14,
    color: colors.placeholder,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default A1Dashboard;
