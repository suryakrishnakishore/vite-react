// src/screens/PendingDoctors.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert, ScrollView, useWindowDimensions, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import apiService from "../services/api";
import { colors, globalStyles } from "../styles/theme";

const PendingDoctors = ({ navigation }) => {
  const [doctors, setDoctors] = useState([]);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const loadPendingDoctors = async () => {
    const res = await apiService.post("auth.php", { action: "get_pending_doctors" });
    if (res.success) {
      setDoctors(res.doctors);
    } else {
      Alert.alert("Error", res.error || "Failed to load pending doctors");
    }
  };

  const approveDoctor = async (doctorId) => {
    const res = await apiService.post("auth.php", { action: "approve_doctor", doctor_id: doctorId });
    if (res.success) {
      Alert.alert("Success", "Doctor approved!");
      loadPendingDoctors();
    } else {
      Alert.alert("Error", res.error || "Approval failed");
    }
  };

  const declineDoctor = async (doctorId) => {
    const res = await apiService.post("auth.php", { action: "decline_doctor", doctor_id: doctorId }); 
    if (res.success) {
      Alert.alert("Success", "Doctor declined!");
      loadPendingDoctors();
    } else {
      Alert.alert("Error", res.error || "Decline failed");
    }
  };

  useEffect(() => {
    loadPendingDoctors();
  }, []);
  
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { minWidth: 150 }]}>{item.name}</Text>
      <Text style={[styles.cell, { minWidth: 200 }]}>{item.email}</Text>
      <Text style={[styles.cell, { minWidth: 120 }]}>{item.phone}</Text>
      <Text style={[styles.cell, styles.boldText, { minWidth: 150 }]}>{item.specialization ? item.specialization : '--'}</Text>
      {!item.is_approved && (
        <View style={[styles.buttonContainer, { minWidth: 180 }]}>
          <TouchableOpacity style={styles.button} onPress={() => approveDoctor(item.id)}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineBtn} onPress={() => declineDoctor(item.id)}>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Navigation Header */}
      <ImageBackground 
        source={require('./a1_header_bg.jpg')} 
        style={styles.headerContainer}
        imageStyle={styles.headerImage}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Pending Doctors</Text>
        </View>
      </ImageBackground>
      
      {/* Horizontal Scrollable Table */}
      <View style={styles.tableWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.tableContainer, { width: isSmallScreen ? Math.max(width - 32, 800) : width - 32 }]}>
            <View style={styles.header}>
              <Text style={[styles.headerCell, styles.boldText, { minWidth: 150 }]}>Name</Text>
              <Text style={[styles.headerCell, styles.boldText, { minWidth: 200 }]}>Email</Text>
              <Text style={[styles.headerCell, styles.boldText, { minWidth: 120 }]}>Phone</Text>
              <Text style={[styles.headerCell, styles.boldText, { minWidth: 150 }]}>Specialization</Text>
              <Text style={[styles.headerCell, styles.boldText, { minWidth: 180 }]}>Actions</Text>
            </View>
            <FlatList
              data={doctors}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              ListEmptyComponent={
                <Text style={[styles.noData, styles.boldText]}>
                  NO PENDING DOCTOR APPROVALS
                </Text>
              }
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  headerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerImage: {
    opacity: 0.9,
  },
  headerOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold",
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tableWrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  tableContainer: {
    minWidth: 800,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#003E33', // Darker green for table header
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700', // Gold accent
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.success,
    paddingHorizontal: 14,
    marginRight: 6,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  declineBtn: {
    backgroundColor: colors.error,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: { 
    color: "white", 
    fontSize: 12,
    fontWeight: '600',
  },
  boldText: { 
    fontWeight: "bold" 
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  noData: { 
    textAlign: 'center', 
    fontSize: 16, 
    paddingVertical: 40,
    color: colors.text,
    fontStyle: 'italic',
  },
});

export default PendingDoctors;
