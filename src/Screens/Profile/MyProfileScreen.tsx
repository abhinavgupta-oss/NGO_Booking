import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useNavigation } from "@react-navigation/native";

import { logout } from "../../Services/Utils/UtilsService";
import { removeAuthData } from "../../Stores/AuthStore/AuthStorage";

import { useProfileStore } from "../../Stores/useProfileStore";

import CustomeLoading from "../../Component/Loading/CustomeLoading";
import CommonHeader from "../../Component/Header/CommonHeader";
import { useTheme } from "../../utility/AppTheam/ThemeContext";
import ProfileUpdateModal from "./ProfileUpdateModal";
import { DevoteeUpdateProfile } from "../../Services/Devotee/DevoteeServices";
import { useToast } from "../../Component/Toast/ToastContext";

const profileMenu = [
    {
        id: 1,
        title: "My Bookings",
        icon: "calendar-month",
        screen: "MyBookingScreen",
    },
    {
        id: 2,
        title: "My Donations",
        icon: "volunteer-activism",
        screen: "MyDonation",
    },
    {
        id: 4,
        title: "General Settings",
        icon: "settings",
        screen: "SettingsScreen",
    },
];

const MyProfileScreen = () => {
    const navigation: any = useNavigation();
    const { showToast } = useToast();
    const { myProfile, loading, fetchMyprofile } = useProfileStore();
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [UserData, setUserData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
        mobile: "",
        email: "",
        panNumber: "",
    });



    const InfoRow = ({
        label,
        value,
    }: {
        label: string;
        value: any;
    }) => (
        <View style={styles.row}>
            <Text style={styles.label}>
                {label}
            </Text>

            <Text style={styles.rowValue}>
                {value}
            </Text>
        </View>
    );

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            await fetchMyprofile();
            setUserData({
                firstName: myProfile?.firstName || "",
                middleName: myProfile?.middleName || "",
                lastName: myProfile?.lastName || "",
                dob: myProfile?.dob || "",
                mobile: myProfile?.mobile || "",
                email: myProfile?.email || "",
                panNumber: myProfile?.panNumber || "",
            })
        } catch (error: any) { }
    };

    const handelLogOut = async () => {
        try {
            const resp = await logout();

            if (resp?.status) {
                await removeAuthData();

                navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                });
            }
        } catch (error: any) { console.log(error) }
    };

    const handelProfileUpdate = async (data: any) => {
        try {
            const resp = await DevoteeUpdateProfile(myProfile?.id, data)
            if (resp?.status) {
                showToast(resp?.message, "success");
                fetchProfileData()
            }
            return resp?.status
        } catch (error: any) {

        } finally {

        }
        console.log("handelProfileUpdate", data)
    }

    const renderMenuItem = (item: any, index: number) => {
        return (
            <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={[
                    styles.menuItem,
                    index === profileMenu.length - 1 && {
                        borderBottomWidth: 0,
                    },
                ]}
                onPress={() =>
                    navigation.navigate(item.screen, {
                        userId: myProfile?.id,
                    })
                }
            >
                <View style={styles.leftContainer}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons
                            name={item.icon}
                            size={22}
                            color={colors.primary}
                        />
                    </View>

                    <Text style={styles.menuTitle}>
                        {item.title}
                    </Text>
                </View>

                <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#999"
                />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor={colors.primary}
                barStyle="light-content"
            />

            <CommonHeader title="My Profile" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {/* PROFILE CARD */}

                <View style={styles.profileCard}>
                    <View style={styles.profileImageWrapper}>
                        <Image
                            source={{
                                uri:
                                    myProfile?.profilePicUrl ||
                                    myProfile?.branchLogo,
                            }}
                            style={styles.profileImage}
                        />

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.cameraButton}

                        >
                            <MaterialIcons
                                name="photo-camera"
                                size={18}
                                color="#FFF"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>
                        {myProfile?.fullName || "Devotee Name"}
                    </Text>

                    <Text style={styles.mobile}>
                        +91 {myProfile?.mobile}
                    </Text>
                    {myProfile?.email && (
                        <Text style={styles.mobile}>
                            {myProfile?.email}
                        </Text>
                    )}

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.editButton}
                        onPress={() => setShowProfileModal(true)}
                    >
                        <MaterialIcons
                            name="edit"
                            size={18}
                            color="#FFF"
                        />

                        <Text style={styles.editButtonText}>
                            Edit Profile
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* STATS CARD */}
                <View style={styles.sections}>

                    <InfoRow
                        label="Payment Type"
                        value={myProfile?.lastLoginOn}
                    />

                    <InfoRow
                        label="Registration Date"
                        value={myProfile?.registrationDate}
                    />

                    <InfoRow
                        label="DOB"
                        value={myProfile?.dob}
                    />

                </View>


                {/* MENU */}

                <View style={styles.menuContainer}>
                    {profileMenu.map((item, index) =>
                        renderMenuItem(item, index),
                    )}
                </View>

                {/* LOGOUT */}

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.logoutButton}
                    onPress={handelLogOut}
                >
                    <MaterialIcons
                        name="logout"
                        size={22}
                        color="#FF4D4F"
                    />

                    <Text style={styles.logoutText}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </ScrollView>



            <ProfileUpdateModal
                visible={showProfileModal}
                onClose={() =>
                    setShowProfileModal(false)
                }
                profileData={UserData}
                onSave={(data) => {
                    console.log("Updated Data", data);
                    const response = handelProfileUpdate(data)
                    if (response) {
                        setShowProfileModal(false);
                    }
                }}
            />

            <CustomeLoading isLoading={loading} />
        </SafeAreaView>
    );
};


export default MyProfileScreen;



const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },

        scrollContainer: {
            paddingHorizontal: 18,
            paddingTop: 80,
            paddingBottom: 90,
        },

        profileCard: {
            backgroundColor: colors.card,
            marginTop: -60,
            borderRadius: 28,
            paddingVertical: 28,
            paddingHorizontal: 20,
            alignItems: "center",

            elevation: 6,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowRadius: 6,
        },

        profileImageWrapper: {
            position: "relative",
        },

        profileImage: {
            width: 110,
            height: 110,
            borderRadius: 60,
            borderWidth: 4,
            borderColor: colors.card,
            backgroundColor: "#EEE",
        },

        cameraButton: {
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 34,
            height: 34,
            borderRadius: 20,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
        },

        userName: {
            marginTop: 18,
            fontSize: 24,
            fontWeight: "700",
            color: colors.text,
        },

        mobile: {
            marginTop: 6,
            fontSize: 15,
            color: colors.subText,
        },

        editButton: {
            marginTop: 18,
            backgroundColor: colors.primary,
            paddingHorizontal: 22,
            paddingVertical: 12,
            borderRadius: 30,
            flexDirection: "row",
            alignItems: "center",
        },

        editButtonText: {
            marginLeft: 8,
            color: "#FFF",
            fontSize: 15,
            fontWeight: "700",
        },

        sections: {
            padding: 15,
            marginTop: 24,
            backgroundColor: colors.card,
            borderRadius: 20,
        },

        menuContainer: {
            marginTop: 24,
            backgroundColor: colors.card,
            borderRadius: 24,
            overflow: "hidden",
            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowRadius: 5,
        },

        menuItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 18,
            paddingHorizontal: 18,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },

        leftContainer: {
            flexDirection: "row",
            alignItems: "center",
        },

        iconContainer: {
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor:
                colors.background === "#121212"
                    ? "#2A2A2A"
                    : "#F4F6FA",
            justifyContent: "center",
            alignItems: "center",
        },

        menuTitle: {
            marginLeft: 14,
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
        },

        logoutButton: {
            marginTop: 26,
            backgroundColor:
                colors.background === "#121212"
                    ? "#2A1C1C"
                    : "#FFF1F0",
            borderRadius: 20,
            paddingVertical: 16,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },

        logoutText: {
            marginLeft: 10,
            fontSize: 17,
            fontWeight: "700",
            color: "#FF4D4F",
        },

        row: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
        },

        label: {
            color: "#777",
            flex: 1,
        },

        rowValue: {
            flex: 1,
            textAlign: "right",
            color: "#111",
            fontFamily: "Poppins-Medium",
        },
    });