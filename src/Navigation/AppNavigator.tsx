import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, BackHandler, Platform, View } from 'react-native';
import SplashScreen from '../Screens/UtilityScreens/SplashScreen';
import UpdateScreen from '../Screens/UtilityScreens/UpdateScreen';
import LoginScreen from '../Screens/UserAuth/LogIn/LoginScreen';
import TabNavigator from './TabNavigator';
import DonationDetails from '../Screens/Donations/DonationDetails';
import DonationPenDetails from '../Screens/Donations/DonationPenDetails';
import EventDetailsScreen from '../Screens/Events/EventDetailsScreen';
import EventListScreens from '../Screens/Events/EventListScreens';
import MyProfileScreen from '../Screens/Profile/MyProfileScreen';
import DevoteeReceiptScreen from '../Screens/Donations/DevoteeReceiptScreen';
import MyDonationScreen from '../Screens/Profile/myInfoDetails/MyDonationScreen';
import RegisterScreen from '../Screens/UserAuth/Registration/RegisterScreen';
import RoomAvailableScreen from '../Screens/Rooms/RoomAvailableScreen';
import RoomDetailsScreen from '../Screens/Rooms/RoomDetailsScreen';
import CreateBookingScreen from '../Screens/Booking/CreateBookingScreen';
import ConfirmedBookingScreen from '../Screens/Booking/ConfirmedBookingScreen';
import MyBookingScreen from '../Screens/Profile/myInfoDetails/MyBookingScreen';
import OnlinePayment from '../Screens/Payment/OnlinePayment';
import SettingsScreen from '../Screens/General/SettingsScreen';
import ForgetPassword from '../Screens/UserAuth/ForgetPassword/ForgetPassword';
import BookingDetails from '../Screens/Profile/myInfoDetails/BookingDetails';

const Stack = createNativeStackNavigator();
export default function App() {
    const navigationRef = useRef<any>(null);

    return (
        <NavigationContainer ref={navigationRef}>
            {/* 🔥 Custom Notification UI */}
            <>
                {/* <CustomNotification
          visible={!!notif}
          title={notif?.title}
          message={notif?.message}
          onPress={() => {
            if (notif?.data?.screen) {
              navigationRef.current?.navigate(notif.data.screen, notif.data);
            }
            setNotif(null);
          }}
          onClose={() => setNotif(null)}
        /> */}

                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Update" component={UpdateScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="Dashboard" component={TabNavigator} />
                    <Stack.Screen name="EventListScreens" component={EventListScreens} />
                    <Stack.Screen name="DonationDetails" component={DonationDetails} />
                    <Stack.Screen name="DonationPenDetails" component={DonationPenDetails} />
                    <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
                    <Stack.Screen name="DevoteeReceipt" component={DevoteeReceiptScreen} />
                    <Stack.Screen name="MyDonation" component={MyDonationScreen} />
                    <Stack.Screen name="RoomAvailableScreen" component={RoomAvailableScreen} />
                    <Stack.Screen name="RoomDetailsScreen" component={RoomDetailsScreen} />
                    <Stack.Screen name="CreateBookingScreen" component={CreateBookingScreen} />
                    <Stack.Screen name="MyBookingScreen" component={MyBookingScreen} />
                    <Stack.Screen name="BookingDetails" component={BookingDetails} />
                    <Stack.Screen name="OnlinePayment" component={OnlinePayment} />
                    <Stack.Screen name="ConfirmedBookingScreen" component={ConfirmedBookingScreen} />
                    <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
                    
                    
                </Stack.Navigator>
            </>
        </NavigationContainer>
    );
}