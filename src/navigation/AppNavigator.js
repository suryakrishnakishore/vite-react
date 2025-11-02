// src/screens/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import DoctorDashboard from '../screens/DoctorDashboard';
import A1Dashboard from '../screens/A1Dashboard';
import PatientDetails from '../screens/PatientDetails';
import SlotBooking from '../screens/SlotBooking';
import Loading from '../components/common/Loading';
import PendingDoctors from '../screens/PendingDoctors';


const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, token, userType, loading, fromLogout } = useAuth();

  if (loading) return <Loading />;

  const authenticated = !!(user && token && userType);
  
  return (
    <Stack.Navigator
      key={authenticated ? 'auth' : fromLogout ? 'logout' : 'guest'}
      initialRouteName={
        authenticated ? undefined : fromLogout ? 'Login' : 'Landing'
      }
      screenOptions={{
        headerShown:false
      }}
    >
      {!authenticated ? (
        <>
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
  name="Login"
  component={LoginScreen}
  initialParams={{ userType: userType ? userType : 'doctor' }} // or 'a1', depending on your default
/>

        </>
      ) : userType === 'doctor' ? (
        <>
          <Stack.Screen
            name="DoctorDashboard"
            component={DoctorDashboard}
            options={{ title: 'Doctor Dashboard' }}
          />
          <Stack.Screen
            name="SlotBooking"
            component={SlotBooking}
            options={{ title: 'Book Appointment' }}
          />
          <Stack.Screen
            name="PatientDetails"
            component={PatientDetails}
            options={{ title: 'Patient Details' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="A1Dashboard"
            component={A1Dashboard}
            options={{ title: 'A1 Aligners Dashboard' }}
          />
          <Stack.Screen
            name="PatientDetails"
            component={PatientDetails}
            options={{ title: 'Patient Details' }}
          />
          <Stack.Screen
    name="PendingDoctors"
    component={PendingDoctors}
    options={{ title: 'Pending Doctors' }}
  />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
