// src/screens/SlotBooking.js
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  Modal,
  ImageBackground
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { colors, globalStyles } from '../styles/theme';
import Loading from '../components/common/Loading';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const toYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fromYYYYMMDD = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const SlotBooking = ({ route, navigation }) => {
  const { patientId, patientName } = route.params;
  const { user } = useAuth();
  const pollerRef = useRef(null);

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => toYYYYMMDD(new Date()));

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [monthYearPickerVisible, setMonthYearPickerVisible] = useState(false);

  useEffect(() => {
    loadAvailableSlots();
    if (pollerRef.current) {
      clearInterval(pollerRef.current);
    }
    pollerRef.current = setInterval(() => {
      loadAvailableSlots({ silent: true });
    }, 10000);
    return () => {
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
      }
    };
  }, [selectedDate]);

  const loadAvailableSlots = async (options = {}) => {
    const { silent = false } = options;
    if (!silent) {
      setLoading(true);
    }
    try {
      const response = await apiService.getAvailableSlots(selectedDate, 1);
      if (response.success) {
        let apiSlots = response.slots || [];
        const now = new Date();
        const isToday = selectedDate === toYYYYMMDD(now);
        if (isToday) {
          apiSlots = apiSlots.map(dayData => {
            const updatedSlots = (dayData.slots || []).map(s => {
              if (!s.available) return s;
              const [hh, mm] = s.time.split(':').map(Number);
              const slotDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm);
              if (slotDateTime <= now) {
                return { ...s, available: false, disabledBecauseTimePassed: true };
              }
              return s;
            });
            return { ...dayData, slots: updatedSlots };
          });
        }
        setSlots(apiSlots);
      } else {
        if (!silent) Alert.alert('Error', 'Failed to load available slots');
      }
    } catch (error) {
      console.error('Load slots error:', error);
      if (!silent) Alert.alert('Error', 'Failed to load available slots');
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  };

  // Calendar with restrictions (no past years/months/days)
  // Calendar that shows only current month dates aligned to correct weekdays
const generateCalendarDates = () => {
  const dates = [];
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  // First day of month
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = firstOfMonth.getDay(); // 0 = Sunday, 1 = Monday...

  // Last date of month
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

  // Push empty slots for days before the 1st (to align grid)
  for (let i = 0; i < firstWeekday; i++) {
    dates.push({ empty: true, key: `empty-${i}` });
  }

  // Push actual month dates
  for (let d = 1; d <= lastDateOfMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateString = toYYYYMMDD(dateObj);

    const isPast = dateObj < today;
    const isSunday = dateObj.getDay() === 0;
    const disabled = isPast || isSunday;

    dates.push({
      dateObj,
      inMonth: true,
      dateString,
      day: d,
      disabled,
      key: `day-${d}`,
    });
  }

  return dates;
};


  const goPrevMonth = () => {
    const d = new Date(visibleMonth);
    const now = new Date();

    // Block past years
    if (d.getFullYear() <= now.getFullYear() && d.getMonth() <= now.getMonth()) {
      return; // prevent navigating before current month of current year
    }

    d.setMonth(d.getMonth() - 1);
    d.setDate(1);
    setVisibleMonth(d);
  };

  const goNextMonth = () => {
    const d = new Date(visibleMonth);
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    setVisibleMonth(d);
  };

  const openMonthYearPicker = () => {
    setMonthYearPickerVisible(true);
  };

  const selectMonthYear = (monthIndex, year) => {
    const now = new Date();
    // Prevent choosing past years/months
    if (year < now.getFullYear()) return;
    if (year === now.getFullYear() && monthIndex < now.getMonth()) return;

    const d = new Date(year, monthIndex, 1);
    setVisibleMonth(d);
    const currentlySelected = fromYYYYMMDD(selectedDate);
    if (currentlySelected.getFullYear() !== year || currentlySelected.getMonth() !== monthIndex) {
      setSelectedDate(toYYYYMMDD(d));
      setSelectedSlot(null);
    }
    setMonthYearPickerVisible(false);
  };

  const handleDatePress = (dateString, disabled) => {
    if (disabled) return;
    setSelectedDate(dateString);
    setSelectedSlot(null);
    const clickedDate = fromYYYYMMDD(dateString);
    clickedDate.setDate(1);
    if (clickedDate.getTime() !== visibleMonth.getTime()) {
      setVisibleMonth(clickedDate);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAvailableSlots();
  };

  const handleSlotSelection = (date, time) => {
    setSelectedSlot({ date, time });
  };


 const handleBookSlot = async () => {
  if (!selectedSlot) {
    Alert.alert('Error', 'Please select a time slot');
    return;
  }

  setBooking(true); // show loading

  try {
    // Step 1: Book the slot
    const slotResponse = await apiService.bookSlot({
      date: selectedSlot.date,
      time: selectedSlot.time,
      doctor_id: user.id,
      patient_id: patientId,
    });

    if (!slotResponse.success) {
      Alert.alert('Error', slotResponse.error || 'Failed to book slot');
      return;
    }

    console.log('Slot booked successfully.');

    // Step 2: Update patient details
    const patientResponse = await apiService.updatePatient({
      patient_id: patientId,
      scan_date: selectedSlot.date,
      scan_time: selectedSlot.time,
    });

    if (!patientResponse.success) {
      Alert.alert(
        'Partial Success',
        'Slot booked but failed to update patient details. Redirecting to dashboard anyway.'
      );
      console.warn('Failed to update patient details:', patientResponse.error);
    } else {
      console.log('Patient details updated successfully.');
    }

    // Step 3: Redirect to Doctor Dashboard (remove SlotBooking from stack)
    console.log('Redirecting to DoctorDashboard...');
    navigation.replace('DoctorDashboard'); // replace ensures back button does not return to booking

  } catch (error) {
    console.error('Booking error:', error);
    Alert.alert('Error', 'Something went wrong while booking the slot');
  } finally {
    setBooking(false); // hide loading
  }
};


  const renderTimeSlot = (slot, date) => {
    const now = new Date();
    const isToday = date === toYYYYMMDD(now);
    let timePassed = false;
    if (isToday) {
      const [hh, mm] = (slot.time || '00:00').split(':').map(Number);
      const slotDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm);
      if (slotDateTime <= now) timePassed = true;
    }
    const available = !!slot.available && !timePassed;
    const isSelected = selectedSlot && selectedSlot.date === date && selectedSlot.time === slot.time;
    return (
      <TouchableOpacity
        key={slot.time}
        style={[
          styles.timeSlot,
          !available && styles.unavailableSlot,
          isSelected && styles.selectedSlot,
        ]}
        onPress={() => available && handleSlotSelection(date, slot.time)}
        disabled={!available}
        activeOpacity={0.7}>
        <Text style={[
          styles.timeText,
          !available && styles.unavailableText,
          isSelected && styles.selectedText,
        ]}>
          {new Date(`2000-01-01T${slot.time}`).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit',
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  const selectedDayData = useMemo(() => {
    return slots.find(dayData => dayData.date === selectedDate) || { date: selectedDate, slots: [] };
  }, [slots, selectedDate]);

  if (loading && !refreshing) {
    return <Loading message="Loading available slots..." />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./a1_header_bg.jpg')}
        resizeMode="repeat"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Book Appointment</Text>
            <Text style={styles.patientInfo}>Patient: {patientName}</Text>
          </View>
        </View>
      </ImageBackground>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.calendarContainer}>
  <Text style={styles.calendarTitle}>Select Appointment Date</Text>

  {/* Month navigation */}
  {/* Month navigation */}
<View style={styles.monthNav}>
  <TouchableOpacity onPress={goPrevMonth} style={styles.navButton}>
    <Text style={styles.navButtonText}>◀</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={openMonthYearPicker} style={styles.monthLabel}>
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.monthLabelText}>
        {MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
      </Text>
      <Text style={styles.monthHintText}>Click here to jump to required month/year</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity onPress={goNextMonth} style={styles.navButton}>
    <Text style={styles.navButtonText}>▶</Text>
  </TouchableOpacity>
</View>


  {/* Week header */}
  <View style={styles.weekHeader}>
  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d =>
    <Text key={d} style={styles.weekHeaderText}>{d}</Text>
  )}
</View>


  {/* Compact calendar grid */}
  <View style={styles.calendarGrid}>
  {generateCalendarDates().map(item => {
    if (item.empty) {
      return <View key={item.key} style={styles.calendarDate} />;
    }
    const isSelected = item.dateString === selectedDate;
    return (
      <TouchableOpacity
        key={item.key}
        style={[
          styles.calendarDate,
          item.disabled && styles.calendarDateDisabled,
          isSelected && styles.calendarDateSelected,
        ]}
        onPress={() => handleDatePress(item.dateString, item.disabled)}
        disabled={item.disabled}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.calendarDateText,
            item.disabled && styles.calendarDateTextDisabled,
            isSelected && styles.calendarDateTextSelected,
          ]}
        >
          {item.day}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>

</View>

        <View style={styles.slotsSection}>
          {selectedDayData && selectedDayData.slots && selectedDayData.slots.length > 0 ? (
            <View style={styles.slotsGrid}>
              {selectedDayData.slots.map(slot => renderTimeSlot(slot, selectedDayData.date))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No slots available for this date</Text>
              <Text style={styles.emptySubtext}>Please select another day</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {selectedSlot && (
          <View style={styles.selectedSlotInfo}>
            <Text style={styles.selectedSlotText}>
              Selected: {fromYYYYMMDD(selectedSlot.date).toLocaleDateString()} at{' '}
              {new Date(`2000-01-01T${selectedSlot.time}`).toLocaleTimeString([], {
                hour: '2-digit', minute: '2-digit',
              })}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedSlot || booking) && styles.disabledButton,
          ]}
          onPress={handleBookSlot}
          disabled={!selectedSlot || booking}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>
            {booking ? 'Booking...' : 'Confirm Appointment'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL UI */}
      <Modal
        visible={monthYearPickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMonthYearPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Month & Year</Text>
            <View style={styles.pickerRow}>
              {/* Month Picker */}
              <ScrollView style={styles.pickerColumn}>
                {MONTH_NAMES.map((m, idx) => {
                  const now = new Date();
                  const disabled =
                    visibleMonth.getFullYear() === now.getFullYear() &&
                    idx < now.getMonth();
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.pickerItem,
                        idx === visibleMonth.getMonth() && styles.pickerItemSelected,
                        disabled && { opacity: 0.4 },
                      ]}
                      onPress={() =>
                        !disabled && selectMonthYear(idx, visibleMonth.getFullYear())
                      }
                      disabled={disabled}
                    >
                      <Text style={styles.pickerItemText}>{m}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Year Picker */}
              <ScrollView style={styles.pickerColumn}>
                {(() => {
                  const currentYear = new Date().getFullYear();
                  const years = [];
                  for (let y = currentYear; y <= currentYear + 5; y++) {
                    years.push(y);
                  }
                  return years.map(y => (
                    <TouchableOpacity
                      key={y}
                      style={[
                        styles.pickerItem,
                        y === visibleMonth.getFullYear() && styles.pickerItemSelected,
                      ]}
                      onPress={() => selectMonthYear(visibleMonth.getMonth(), y)}
                    >
                      <Text style={styles.pickerItemText}>{y}</Text>
                    </TouchableOpacity>
                  ));
                })()}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setMonthYearPickerVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// styles unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8fa' },
  header: { 
    minWidth:'100%', 
    padding: 20, 
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  patientInfo: { fontSize: 15, color: '#b2dfdb' },
  scrollContent: { paddingBottom: 20 },
  calendarContainer: { backgroundColor: '#ffffff', margin: 16, borderRadius: 16, padding: 12, ...globalStyles.shadow },
  calendarTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12, textAlign: 'center' },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navButton: { padding: 8, borderRadius: 20 },
  navButtonText: { fontSize: 22, color: '#003E33', fontWeight: '700' },
  monthLabel: { alignItems: 'center' },
  monthLabelText: { fontSize: 18, fontWeight: '700', color: '#2c3e50' },
  monthLabelSubtext: { fontSize: 12, color: '#7f8c8d' },
  // week header container
weekHeader: {
  flexDirection: 'row',
  justifyContent: 'flex-start', // keep items left-to-right
  marginBottom: 8,
},

// week header text (one cell per weekday, exactly 1/7 width)
weekHeaderText: {
  flexBasis: '14.2857%',    // 100 / 7 -> aligns with calendar cells
  textAlign: 'center',
  fontSize: 11,
  color: '#95a5a6',
  fontWeight: '700',
  textTransform: 'uppercase',
  paddingVertical: 4,
},

// calendar grid container
calendarGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start', // pack items left; no space-between
},

// each calendar cell (one cell per weekday, exact column width)
calendarDate: {
  flexBasis: '14.2857%',   // ensures exactly 7 columns per row
  aspectRatio: 4,          // square
  borderRadius: 6,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 6,         // vertical spacing only
  backgroundColor: '#f7f8fa',
  borderWidth: 1,
  borderColor: '#e0e0e0',
  overflow: 'hidden',
},

calendarDateSelected: {
  backgroundColor: '#003E33',
  borderColor: '#145a37',
},

calendarDateDisabled: {
  backgroundColor: '#e0e0e0',
  borderColor: '#d1d1d1',
},

calendarDateText: {
  fontSize: 13,
  fontWeight: '600',
  color: '#34495e',
},

calendarDateTextMuted: {
  color: '#bdc3c7',
},

calendarDateTextDisabled: {
  color: '#b0b0b0',
  textDecorationLine: 'line-through',
},

calendarDateTextSelected: {
  color: '#ffffff',
},
monthHintText: {
  fontSize: 10,
  color: '#888',   // light gray so it doesn’t dominate
  marginTop: 2,
},


  calendarDayName: { fontSize: 9, color: '#7f8c8d', marginTop: 2, fontWeight: '600', textTransform: 'uppercase' },
  slotsSection: { paddingHorizontal: 16 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  timeSlot: { backgroundColor: '#ffffff', borderRadius: 8, padding: 12, marginBottom: 8, width: '31%', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  unavailableSlot: { backgroundColor: '#bdbdbd', borderColor: '#9e9e9e' },
  unavailableText: { color: '#ffffff', textDecorationLine: 'line-through' },
  selectedSlot: { backgroundColor: '#ffeb3b', borderColor: '#fbc02d' },
  timeText: { fontSize: 14, fontWeight: '600', color: '#333' },
  selectedText: { color: '#333', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', padding: 40, backgroundColor: '#fff', margin: 16, borderRadius: 16 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#7f8c8d', textAlign: 'center' },
  footer: { padding: 16, paddingTop: 8, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e0e0e0', ...globalStyles.shadow },
  selectedSlotInfo: { alignItems: 'center', marginBottom: 8 },
  selectedSlotText: { fontSize: 14, fontWeight: 'bold', color: '#003E33' },
  bookButton: { backgroundColor: '#003E33', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  disabledButton: { backgroundColor: '#a5d6a7' },
  bookButtonText: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '92%', maxHeight: '80%', backgroundColor: '#ffffff', borderRadius: 16, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#333', textAlign: 'center' },
  pickerRow: { flexDirection: 'row', height: 300 },
  pickerColumn: { flex: 1 },
  pickerItem: { paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center' },
  pickerItemSelected: { backgroundColor: '#e8f5e9', borderRadius: 8 },
  pickerItemText: { fontSize: 16, color: '#333', fontWeight: '500' },
  modalClose: { marginTop: 12, padding: 12, alignItems: 'center', backgroundColor: '#e8f5e9', borderRadius: 8 },
  modalCloseText: { color: '#003E33', fontWeight: '700', fontSize: 16 },
});

export default SlotBooking;