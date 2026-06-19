import React from "react";
import {
    TouchableOpacity,
    View,
    StyleSheet,
    Pressable,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import DashboardScreen from "../Screens/Dashboard/DashboardScreen";
import EventListScreens from "../Screens/Events/EventListScreens";
import DonationListScreen from "../Screens/Donations/DonationListScreen";
import MyProfileScreen from "../Screens/Profile/MyProfileScreen";
import MyBookingScreen from "../Screens/Profile/myInfoDetails/MyBookingScreen";
import RoomAvailableScreen from "../Screens/Rooms/RoomAvailableScreen";
import { useTheme } from "../utility/AppTheam/ThemeContext";


const Tab = createBottomTabNavigator();

function AddButton({ children, onPress }: any) {
    return (
        <TouchableOpacity
            style={styles.addButtonContainer}
            activeOpacity={1}
            onPress={onPress}
        >
            <View style={styles.addButton}>
                {children}
            </View>
        </TouchableOpacity>
    );
}

export default function TabNavigator() {
    const { colors, darkMode, toggleTheme } = useTheme();
    const styles = createStyles(colors);
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,

                tabBarStyle: styles.tabBar,

                tabBarActiveTintColor: "#ED7723",
                tabBarInactiveTintColor: "#7A7A7A",

                // REMOVE TAB PRESS SHADOW / RIPPLE
                tabBarButton: (props) => (
                    <Pressable
                        {...props}
                        android_ripple={null}
                        style={[props.style, styles.tabButton]}
                    />
                ),
            }}
        >
            {/* HOME */}
            <Tab.Screen
                name="Home"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialIcons
                            name="home-filled"
                            size={30}
                            color={focused ? "#ED7723" : colors.icons}
                        />
                    ),
                }}
            />

            {/* BOOKING */}
            <Tab.Screen
                name="Booking"
                component={RoomAvailableScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialIcons
                            name="calendar-month"
                            size={30}
                            color={focused ? "#ED7723" : colors.icons}
                        />
                    ),
                }}
            />

            {/* DONATION */}
            <Tab.Screen
                name="Donation"
                component={DonationListScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialIcons
                            name="volunteer-activism"
                            size={30}
                            color={focused ? "#ED7723" : colors.icons}
                        />
                    ),
                }}
            />

            {/* PROFILE */}
            <Tab.Screen
                name="Profile"
                component={MyProfileScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialIcons
                            name="person"
                            size={30}
                            color={focused ? "#ED7723" : colors.icons}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const createStyles = (colors: any) =>
    StyleSheet.create({
        tabBar: {
            position: "absolute",
            left: 15,
            right: 15,
            height: 70,
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            backgroundColor: colors.card,
            elevation: 10,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: {
                width: 0,
                height: 5,
            },

            borderTopWidth: 0,

            paddingTop: 10,
        },

        tabButton: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",

            // REMOVE CLICK BACKGROUND
            backgroundColor: "transparent",
        },

        addButtonContainer: {
            top: -25,
            justifyContent: "center",
            alignItems: "center",
        },

        addButton: {
            width: 65,
            height: 65,

            borderRadius: 35,

            backgroundColor: "#ED7723",

            justifyContent: "center",
            alignItems: "center",

            elevation: 8,

            shadowColor: "#ED7723",
            shadowOpacity: 0.4,
            shadowRadius: 8,

            shadowOffset: {
                width: 0,
                height: 4,
            },

            borderWidth: 5,
            borderColor: "#FFF",
        },
    });