import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
    BackHandler,
    ToastAndroid,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Icons } from "../../utility/utility";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors } from "../../utility/AppTheam";
import { useProfileStore } from "../../Stores/useProfileStore";
import CustomeLoading from "../../Component/Loading/CustomeLoading";
import { useEventStore } from "../../Stores/useEventStore";

const DashboardScreen = () => {
    const navigation = useNavigation()
    const menuList = [
        {
            id: 1,
            title: "Donate Now",
            icons: Icons.donation,
        },
        {
            id: 2,
            title: "Book Room",
            icons: Icons.roomBook,
        },
        {
            id: 3,
            title: "Seva",
            icons: Icons.bookseva,
        },
        {
            id: 4,
            title: "Events",
            icons: Icons.events,
        },
    ];

    const [selectedSchedule, setSelectedSchedule] =
        useState<"Morning" | "Evening">(
            "Morning"
        );

    const morningSchedule = [
        {
            time: "5:00 AM",
            title: "Mangal Aarti",
        },
        {
            time: "6:30 AM",
            title: "Yoga & Meditation",
        },
        {
            time: "8:00 AM",
            title: "Breakfast Prasadam",
        },
    ];

    const eveningSchedule = [
        {
            time: "5:00 PM",
            title: "Sandhya Aarti",
        },
        {
            time: "6:30 PM",
            title: "Bhajan & Kirtan",
        },
        {
            time: "8:00 PM",
            title: "Dinner Prasadam",
        },
    ];
    const { myProfile, loading, fetchMyprofile } = useProfileStore();
    const { eventList, fetchEventList } = useEventStore();

    useFocusEffect(
        useCallback(() => {
            fetchData()

            let backPressedOnce = false;
            const onBackPress = () => {
                if (backPressedOnce) {
                    BackHandler.exitApp();
                    return true;
                }

                backPressedOnce = true;
                ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);

                setTimeout(() => {
                    backPressedOnce = false;
                }, 2000);

                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );

            return () => backHandler.remove();
        }, [])
    );

    const fetchData = async () => {
        try {
            const resp = await fetchMyprofile();
            console.log("resp", resp)

            const eventPayload = {
                "eventFilterTypeId": 3,
                "pageNumber": 1,
                "pageSize": 3,
            }

            const respList = await fetchEventList(eventPayload);
            console.log("respList", respList)
        } catch (error) {
            console.log("error", error);
        }
    };


    const handelNavigate = async (id: any) => {

        switch (id) {

            case 1:

                navigation.navigate("Dashboard", {
                    screen: "Donation",
                });

                break;

            case 2:

                navigation.navigate("Dashboard", {
                    screen: "Booking",
                });

                break;

            case 3:

                navigation.navigate("Dashboard", {
                    screen: "Donation",
                });
                break;

            case 4:

                navigation.navigate("EventListScreens");

                break;

            default:

                console.log("No Route Found");
                break;
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={colors.primary}
                barStyle="light-content"
            />

            {/* ================= HEADER ================= */}

            <LinearGradient
                colors={[colors.primary, "#F59E0B"]}
                style={styles.header}
            >
                <View style={{ width: "70%" }}>
                    <Text style={styles.welcomeText}>
                        Jay Gau Mata,
                        Jay Gopal.! 🙏
                    </Text>

                    <Text style={styles.userName}>
                        Namaste, {myProfile?.fullName || "Devotee"}
                    </Text>
                </View>

                <TouchableOpacity style={styles.notificationBtn}>
                    <MaterialIcons
                        name="notifications-none"
                        color="#FFF"
                        size={28}
                    />
                </TouchableOpacity>
            </LinearGradient>

            {/* ================= BODY ================= */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {/* ================= QUICK CARD ================= */}

                <LinearGradient
                    colors={["#FFF7ED", "#FFE7D1"]}
                    style={styles.quickCard}
                >
                    <View style={{ flex: 1 }}>
                        <Text style={styles.quickTitle}>
                            Today's Darshan
                        </Text>

                        <Text style={styles.quickSubTitle}>
                            Book your darshan slot quickly and avoid waiting.
                        </Text>

                        <TouchableOpacity style={styles.bookBtn}>
                            <Text style={styles.bookBtnText}>
                                Book Now
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Image
                        source={Icons.bookseva}
                        style={styles.quickImage}
                        resizeMode="contain"
                    />
                </LinearGradient>

                {/* ================= QUICK ACTION ================= */}

                <Text style={styles.sectionTitle}>
                    Quick Actions
                </Text>

                <View style={styles.gridContainer}>
                    {menuList.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuCard}
                            activeOpacity={0.8}
                            onPress={() => handelNavigate(item.id)}
                        >
                            <LinearGradient
                                colors={["#FFFFFF", "#FFF7ED"]}
                                style={styles.menuGradient}
                            >
                                <View style={styles.iconContainer}>
                                    <Image
                                        source={item.icons}
                                        style={styles.menuIcon}
                                        resizeMode="contain"
                                    />
                                </View>

                                <Text style={styles.menuTitle}>
                                    {item.title}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ================= EVENTS ================= */}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Upcoming Events
                    </Text>

                    <TouchableOpacity onPress={() =>
                        navigation.navigate("EventListScreens")
                    }>
                        <Text style={styles.viewAll}>
                            View All
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ================= EVENT LIST ================= */}

                {eventList?.length > 0 ? (
                    eventList.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.eventCard}
                            activeOpacity={0.8}
                            onPress={() =>
                                navigation.navigate(
                                    "EventDetails",
                                    {
                                        eventDetails: item,
                                    },
                                )
                            }
                        >
                            <LinearGradient
                                colors={[
                                    "#FFFFFF",
                                    "#FFF7ED",
                                ]}
                                style={
                                    styles.eventGradient
                                }
                            >
                                <Image
                                    source={{
                                        uri: item.bannerURL,
                                    }}
                                    style={
                                        styles.eventImage
                                    }
                                    resizeMode="cover"
                                />

                                <View
                                    style={
                                        styles.eventContent
                                    }
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={
                                            styles.eventTitle
                                        }
                                    >
                                        {item.title}
                                    </Text>

                                    <Text
                                        style={
                                            styles.eventType
                                        }
                                    >
                                        {
                                            item.eventTypeName
                                        }
                                    </Text>

                                    <View
                                        style={
                                            styles.dateContainer
                                        }
                                    >
                                        <MaterialIcons
                                            name="date-range"
                                            size={15}
                                            color={colors.primary}
                                        />

                                        <Text
                                            style={
                                                styles.dateText
                                            }
                                        >
                                            {
                                                item.startDate
                                            }
                                        </Text>
                                    </View>

                                    <View
                                        style={
                                            styles.locationContainer
                                        }
                                    >
                                        <MaterialIcons
                                            name="location-on"
                                            size={15}
                                            color={colors.primary}
                                        />

                                        <Text
                                            numberOfLines={2}
                                            style={
                                                styles.locationText
                                            }
                                        >
                                            {item.venue}
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons
                            name="search"
                            size={80}
                            color="#D6D6D6"
                        />

                        <Text style={styles.emptyTitle}>
                            No Current Events
                        </Text>

                        <Text style={styles.emptySubTitle}>
                            Events will appear here
                        </Text>
                    </View>
                )}

                {/* ================= DAILY SCHEDULE ================= */}

                {/* ================= DAILY SCHEDULE ================= */}

                <Text style={styles.scheduleTitle}>
                    Daily Schedule
                </Text>

                <View style={styles.scheduleContainer}>

                    {/* TOGGLE */}

                    <View style={styles.toggleContainer}>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                setSelectedSchedule("Morning")
                            }
                            style={[
                                styles.toggleBtn,

                                selectedSchedule ===
                                "Morning" &&
                                styles.activeToggleBtn,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.toggleText,

                                    selectedSchedule ===
                                    "Morning" &&
                                    styles.activeToggleText,
                                ]}
                            >
                                Morning
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                setSelectedSchedule("Evening")
                            }
                            style={[
                                styles.toggleBtn,

                                selectedSchedule ===
                                "Evening" &&
                                styles.activeToggleBtn,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.toggleText,

                                    selectedSchedule ===
                                    "Evening" &&
                                    styles.activeToggleText,
                                ]}
                            >
                                Evening
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {/* LIST */}

                    {(selectedSchedule === "Morning"
                        ? morningSchedule
                        : eveningSchedule
                    ).map((item, index) => (

                        <View
                            key={index}
                            style={styles.scheduleRow}
                        >

                            <Text style={styles.timeText}>
                                {item.time}
                            </Text>

                            <View style={styles.scheduleCard}>
                                <Text
                                    style={
                                        styles.scheduleCardText
                                    }
                                >
                                    {item.title}
                                </Text>
                            </View>

                        </View>
                    ))}
                </View>

            </ScrollView>
            <CustomeLoading isLoading={loading} />
        </View>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

    // ================= HEADER =================

    header: {
        paddingTop: 25,
        paddingHorizontal: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 5,
    },

    welcomeText: {
        // width:"0%",
        color: "#FFF",
        fontSize: 25,
        opacity: 0.9,
        fontFamily: "Poppins-SemiBold"
    },

    userName: {
        color: "#FFF",
        fontSize: 17,
        fontFamily: "Poppins-SemiBold",
        marginTop: 4,
    },

    notificationBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },

    // ================= BODY =================

    scrollContainer: {
        padding: 18,
        paddingBottom: 100,
    },

    // ================= QUICK CARD =================

    quickCard: {
        borderRadius: 24,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
        elevation: 3,
    },

    quickTitle: {
        fontSize: 22,
        fontFamily: "Poppins-SemiBold",
        color: "#000",
    },

    quickSubTitle: {
        fontSize: 14,
        fontFamily: "Poppins-SemiBold",
        color: "#555",
        marginTop: 8,
        lineHeight: 20,
        width: "90%",
    },

    quickImage: {
        width: 90,
        height: 90,
    },

    bookBtn: {
        marginTop: 18,
        backgroundColor: colors.primary,
        alignSelf: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },

    bookBtnText: {
        color: "#FFF",
        fontFamily: "Poppins-SemiBold",
        fontSize: 14,
    },

    // ================= SECTION =================

    sectionHeader: {
        marginTop: 28,
        marginBottom: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    sectionTitle: {
        fontSize: 20,
        fontFamily: "Poppins-SemiBold",
        color: "#111",
        marginBottom: 18,
    },

    viewAll: {
        color: colors.primary,
        fontSize: 15,
        fontFamily: "Poppins-SemiBold",
    },

    // ================= MENU =================

    gridContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },

    menuCard: {
        // height: 160,
        width: "23%",
        marginBottom: 15,
    },

    menuGradient: {
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
        minHeight: 140,
    },

    iconContainer: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: "#FFF3E8",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },

    menuIcon: {
        width: 34,
        height: 34,
    },

    menuTitle: {
        fontSize: 13,
        fontFamily: "Poppins-SemiBold",
        color: "#333",
        textAlign: "center",
        paddingHorizontal: 4,
        lineHeight: 18,
    },

    // ================= EVENT CARD =================

    eventCard: {
        marginBottom: 16,
    },

    eventGradient: {
        borderRadius: 20,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
    },

    eventImage: {
        width: 100,
        height: 100,
        borderRadius: 16,
        backgroundColor: "#EEE",
    },

    eventContent: {
        flex: 1,
        marginLeft: 14,
    },

    eventTitle: {
        fontSize: 17,
        fontFamily: "Poppins-SemiBold",
        color: "#222",
    },

    eventType: {
        fontSize: 13,
        color: colors.primary,
        fontFamily: "Poppins-SemiBold",
        marginTop: 4,
        marginBottom: 10,
    },

    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },

    dateText: {
        fontSize: 13,
        color: "#555",
        marginLeft: 5,
        fontFamily: "Poppins-SemiBold",
    },

    locationContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    locationText: {
        fontSize: 13,
        color: "#555",
        marginLeft: 5,
        flex: 1,
        fontFamily: "Poppins-SemiBold",
    },


    // ================= DAILY SCHEDULE =================

    scheduleTitle: {
        fontSize: 22,
        fontFamily: "Poppins-SemiBold",
        color: "#0B2341",
        marginTop: 15,
        marginBottom: 18,
    },

    scheduleContainer: {
        backgroundColor: "#F3F3F3",
        borderRadius: 24,
        padding: 18,
        marginBottom: 25,
        elevation: 2,
    },

    toggleContainer: {
        flexDirection: "row",
        backgroundColor: "#ECECEC",
        borderRadius: 16,
        padding: 5,
        marginBottom: 24,
    },

    toggleBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
    },

    activeToggleBtn: {
        backgroundColor: colors.primary,
    },

    toggleText: {
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        color: "#666",
    },

    activeToggleText: {
        color: "#FFF",
    },

    scheduleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },

    timeText: {
        width: 90,
        fontSize: 15,
        color: "#23395B",
        fontFamily: "Poppins-SemiBold",
    },

    scheduleCard: {
        flex: 1,
        backgroundColor: "#F5EDE2",
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 18,
    },

    scheduleCardText: {
        fontSize: 17,
        fontFamily: "Poppins-SemiBold",
        color: "#0B2341",
    },
    emptyContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },

    emptyTitle: {
        marginTop: 16,
        fontSize: 22,
        color: "#222",
        fontFamily: "Poppins-SemiBold",
    },

    emptySubTitle: {
        marginTop: 6,
        fontSize: 15,
        color: "#777",
        fontFamily: "Poppins-Regular",
    },

});