// src/components/forms/PatientForm.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Button from '../common/Button';
import { colors, globalStyles } from '../../styles/theme';

const PatientForm = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    contact_number: initialData?.contact_number || '',
    location: initialData?.location || '',
    age: initialData?.age?.toString() || '',
    gender: initialData?.gender || 'male',
    medical_history: initialData?.medical_history || '',
  });
  const [errors, setErrors] = useState({});

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Patient name is required';
    }

    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.contact_number)) {
      newErrors.contact_number = 'Please enter a valid contact number';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    // Age validation (optional but must be valid if provided)
    if (formData.age && (isNaN(formData.age) || parseInt(formData.age) < 1 || parseInt(formData.age) > 150)) {
      newErrors.age = 'Please enter a valid age (1-150)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors and try again');
      return;
    }

    const submitData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
    };

    onSubmit(submitData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const renderInput = (field, placeholder, options = {}) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>
        {placeholder}
        {['name', 'contact_number', 'location'].includes(field) && (
          <Text style={styles.required}> *</Text>
        )}
      </Text>
      <TextInput
        style={[
          styles.input,
          errors[field] && styles.inputError,
          options.multiline && styles.textArea,
        ]}
        placeholder={`Enter ${placeholder.toLowerCase()}`}
        value={formData[field]}
        onChangeText={(value) => updateField(field, value)}
        placeholderTextColor={colors.placeholder}
        {...options}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  const renderGenderSelector = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderContainer}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.genderOption,
              formData.gender === option.value && styles.genderOptionSelected,
            ]}
            onPress={() => updateField('gender', option.value)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.genderOptionText,
              formData.gender === option.value && styles.genderOptionTextSelected,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEditing ? 'Edit Patient' : 'Add New Patient'}
          </Text>
          <Text style={styles.subtitle}>
            {isEditing ? 'Update patient information' : 'Enter patient details to continue'}
          </Text>
        </View>

        {/* Form Fields */}
        {renderInput('name', 'Patient Name', {
          autoCapitalize: 'words',
        })}

        {renderInput('contact_number', 'Contact Number', {
          keyboardType: 'phone-pad',
        })}

        {renderInput('location', 'Location/Address', {
          autoCapitalize: 'words',
        })}

        {renderInput('age', 'Age', {
          keyboardType: 'numeric',
          maxLength: 3,
        })}

        {renderGenderSelector()}

        {renderInput('medical_history', 'Medical History', {
          multiline: true,
          numberOfLines: 4,
          textAlignVertical: 'top',
        })}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={isEditing ? 'Update Patient' : 'Add Patient & Book Slot'}
            onPress={handleSubmit}
            loading={loading}
            variant="primary"
            size="large"
            style={styles.submitButton}
          />

          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            size="large"
            style={styles.cancelButton}
          />
        </View>

        {/* Form Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            <Text style={styles.required}>*</Text> Required fields
          </Text>
          {!isEditing && (
            <Text style={styles.infoText}>
              After adding the patient, you'll be able to book an appointment slot.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    padding: 20,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.placeholder,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  input: {
    ...globalStyles.input,
    fontSize: 16,
    minHeight: 48,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.disabled,
    backgroundColor: colors.surface,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  genderOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  genderOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  genderOptionTextSelected: {
    color: colors.surface,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  submitButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 0,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    ...globalStyles.shadow,
  },
  infoText: {
    fontSize: 12,
    color: colors.placeholder,
    lineHeight: 16,
    marginBottom: 4,
  },
});

export default PatientForm;