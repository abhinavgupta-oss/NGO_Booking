import React, {
    useEffect,
    useCallback,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
} from "react-native";

import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useNavigation } from "@react-navigation/native";

import { logout } from "../../Services/Utils/UtilsService";
import { removeAuthData } from "../../Stores/AuthStore/AuthStorage";

import { colors } from "../../utility/AppTheam";

import { useProfileStore } from "../../Stores/useProfileStore";

import CustomeLoading from "../../Component/Loading/CustomeLoading";

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
        id: 3,
        title: "Address",
        icon: "location-on",
        screen: "Address",
    },
    {
        id: 4,
        title: "Notification Settings",
        icon: "notifications-none",
        screen: "NotificationSettings",
    },
    {
        id: 5,
        title: "Help & Support",
        icon: "help-outline",
        screen: "HelpSupport",
    },
    {
        id: 6,
        title: "About Us",
        icon: "info-outline",
        screen: "AboutUs",
    },
];

const MyProfileScreen = () => {
    const navigation: any =
        useNavigation();

    const {
        myProfile,
        loading,
        fetchMyprofile,
    } = useProfileStore();

    const fetchProfileData = useCallback(
        async () => {
            try {
                const resp =
                    await fetchMyprofile();

                console.log("resp", resp);
            } catch (error: any) {
                console.log(
                    "Profile Error",
                    error,
                );
            }
        },
        [fetchMyprofile],
    );

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    console.log("myProfile", myProfile);

    const handelLogOut = async () => {
        try {
            const resp = await logout();

            console.log("resp", resp);

            if (resp?.status) {
                await removeAuthData();

                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: "Login",
                        },
                    ],
                });
            }
        } catch {

        }
    };

    const renderMenuItem = (
        item: any,
    ) => {
        return (
            <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                activeOpacity={0.8}
                onPress={() =>
                    navigation.navigate(
                        item.screen,
                        {
                            userId:
                                myProfile?.id,
                        },
                    )
                }
            >
                <View
                    style={
                        styles.leftContainer
                    }
                >
                    <View
                        style={
                            styles.iconContainer
                        }
                    >
                        <MaterialIcons
                            name={item.icon}
                            size={22}
                            color="#555"
                        />
                    </View>

                    <Text
                        style={
                            styles.menuTitle
                        }
                    >
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
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#F8F8F8"
                barStyle="dark-content"
            />

            <ScrollView
                contentContainerStyle={
                    styles.scrollContainer
                }
                showsVerticalScrollIndicator={
                    false
                }
            >
                {/* PROFILE CARD */}

                <View
                    style={styles.profileCard}
                >
                    {/* TOP PROFILE */}

                    <View
                        style={
                            styles.profileHeader
                        }
                    >
                        <Image
                            source={
                                myProfile?.profilePicUrl
                                    ? {
                                          uri: myProfile?.profilePicUrl,
                                      }
                                    : {
                                          uri: myProfile?.branchLogo,
                                      }
                            }
                            style={
                                styles.profileImage
                            }
                        />

                        <View
                            style={
                                styles.profileInfo
                            }
                        >
                            <Text
                                style={
                                    styles.userName
                                }
                            >
                                {
                                    myProfile?.fullName
                                }
                            </Text>

                            <Text
                                style={
                                    styles.mobile
                                }
                            >
                                +91 -{" "}
                                {
                                    myProfile?.mobile
                                }
                            </Text>

                            <TouchableOpacity>
                                <Text
                                    style={
                                        styles.editText
                                    }
                                >
                                    Edit Profile
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* MENU LIST */}

                    <View
                        style={
                            styles.menuContainer
                        }
                    >
                        {profileMenu.map(
                            renderMenuItem,
                        )}
                    </View>

                    {/* LOGOUT */}

                    <TouchableOpacity
                        style={
                            styles.logoutButton
                        }
                        onPress={
                            handelLogOut
                        }
                    >
                        <Text
                            style={
                                styles.logoutText
                            }
                        >
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <CustomeLoading
                isLoading={loading}
            />
        </View>
    );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

    scrollContainer: {
        paddingBottom: 30,
    },

    profileCard: {
        backgroundColor: "#FFF",
        padding: 18,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 5,
    },

    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 22,
    },

    profileImage: {
        width: 78,
        height: 78,
        borderRadius: 40,
        backgroundColor: "#EEE",
    },

    profileInfo: {
        marginLeft: 16,
        flex: 1,
    },

    userName: {
        fontSize: 24,
        fontWeight: "700",
        color: "#222",
    },

    mobile: {
        marginTop: 4,
        fontSize: 15,
        color: "#666",
    },

    editText: {
        marginTop: 8,
        fontSize: 15,
        fontWeight: "700",
        color: colors.primary,
    },

    menuContainer: {
        borderWidth: 1,
        borderColor: "#EFEFEF",
        borderRadius: 18,
        overflow: "hidden",
    },

    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor:
            "#F1F1F1",
    },

    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 34,
        alignItems: "center",
    },

    menuTitle: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },

    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 24,
        paddingHorizontal: 8,
    },

    logoutText: {
        marginLeft: 10,
        fontSize: 17,
        fontWeight: "700",
        color: "#FF5B5B",
    },
});