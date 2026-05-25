import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, View, Image, StyleSheet, StatusBar, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { colors } from "../../utility/AppTheam";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;


const RoomDetailsScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { room } = route.params;


    const flatListRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const roomImages = useMemo(
        () =>
            room?.images || [
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
            ],
        [room]
    );

    const amenities = room?.amenities || [
        "AC",
        "WiFi",
        "TV",
        "Parking",
        "Breakfast",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = activeIndex + 1;

            if (nextIndex >= roomImages.length) {
                nextIndex = 0;
            }

            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });

            setActiveIndex(nextIndex);
        }, 3000); // 3 sec

        return () => clearInterval(interval);
    }, [activeIndex, roomImages.length]);

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

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                >
                    <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color="#FFF"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Room Details
                </Text>
                <TouchableOpacity>
                    <MaterialIcons
                        name="favorite"
                        size={22}
                        color="red"
                    />
                </TouchableOpacity>
            </LinearGradient>
            {/* ================= BODY ================= */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}

            >
                {/* ================= IMAGE CAROUSEL ================= */}
                <FlatList
                    ref={flatListRef}
                    data={roomImages}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    snapToInterval={screenWidth}
                    decelerationRate="fast"
                    bounces={false}
                    renderItem={({ item }) => (
                        <View style={styles.imageWrapper}>
                            <Image source={{ uri: item }} style={styles.roomImage} />
                        </View>
                    )}
                    getItemLayout={(data, index) => ({
                        length: screenWidth,
                        offset: screenWidth * index,
                        index,
                    })}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.round(
                            event.nativeEvent.contentOffset.x / screenWidth
                        );
                        setActiveIndex(index);
                    }}
                />
                <View style={styles.dotsContainer}>
                    {roomImages.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                activeIndex === index && styles.activeDot
                            ]}
                        />
                    ))}
                </View>
                {/* ================= ROOM INFO ================= */}

                <View style={styles.infoContainer}>

                    <Text style={styles.roomName}>
                        {room?.roomName || "AC Room"}
                    </Text>

                    <Text style={styles.roomPrice}>
                        {room?.price || 1200}
                        <Text style={styles.nightText} />
                    </Text>

                </View>

                {/* ================= ICON CARDS (GUEST + AMENITIES) ================= */}

                <View style={styles.iconRowContainer}>

                    {/* GUESTS */}
                    <View style={styles.itemContainer}>

                        <View style={styles.guestCard}>
                            <MaterialIcons
                                name="groups"
                                color={colors.primary}
                                size={28}
                            />
                        </View>

                        <Text style={styles.itemText}>
                            2 Guests
                        </Text>

                    </View>

                    {/* AMENITIES */}
                    {amenities.slice(0, 3).map((item, index) => (
                        <View key={index} style={styles.itemContainer}>

                            <View style={styles.amenityCard}>
                                <MaterialIcons
                                    name={
                                        item === "AC"
                                            ? "ac-unit"
                                            : item === "WiFi"
                                                ? "wifi"
                                                : item === "TV"
                                                    ? "tv"
                                                    : "star"
                                    }
                                    color={colors.primary}
                                    size={26}
                                />
                            </View>

                            <Text style={styles.itemText}>
                                {item}
                            </Text>

                        </View>
                    ))}

                </View>

                {/* ================= ABOUT ROOM ================= */}
                <Text style={styles.sectionTitle}>
                    About Room
                </Text>
                <Text style={styles.aboutText}>
                    {room?.description ||
                        "Enjoy a luxurious and comfortable stay with modern amenities and premium interiors. Perfect for family and business trips."}
                </Text>

                {/* ================= SELECT DATE ================= */}
                <Text style={styles.sectionTitle}>
                    Select Date
                </Text>
                <View style={styles.dateContainer}>

                    {/* CHECK IN CARD */}
                    <View style={styles.dateCard}>

                        <Text style={styles.dateLabel}>Check In</Text>

                        <View style={styles.dateRow}>
                            <Text style={styles.dateValue}>20 May 2026</Text>

                            <MaterialIcons
                                name="calendar-month"
                                size={20}
                                color={colors.primary}
                            />
                        </View>

                    </View>

                    {/* CHECK OUT CARD */}
                    <View style={styles.dateCard}>

                        <Text style={styles.dateLabel}>Check Out</Text>

                        <View style={styles.dateRow}>
                            <Text style={styles.dateValue}>22 May 2026</Text>

                            <MaterialIcons
                                name="calendar-month"
                                size={20}
                                color={colors.primary}
                            />
                        </View>

                    </View>

                </View>

            </ScrollView>
            <View style={styles.bottomContainer}>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.bookNowBtn}   onPress={() =>
        navigation.navigate("CreateBookingScreen", {
             bookingData: {
                room: room,
                guests: 2,
                checkIn: "20 May 2026",
                checkOut: "22 May 2026",
            },
        })
    }
                >
                    <Text style={styles.bookNowText}>
                        Continue to Book
                    </Text>
                </TouchableOpacity>

            </View>
        </View>

    );


}

export default RoomDetailsScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

    // ================= HEADER =================

    header: {
        paddingTop: 25,
        paddingBottom: 25,
        paddingHorizontal: 18,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 5,
    },

    iconRowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        marginTop: 20,
    },

    itemContainer: {
        alignItems: "center",
        width: "18%",
    },

    itemText: {
        marginTop: 8,
        color: "#777",
        fontSize: 12,
        fontFamily: "Poppins-SemiBold",
        textAlign: "center",
    },

    backBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },



    headerTitle: {
        flex: 1,
        textAlign: "center",
        color: "#FFF",
        fontSize: 20,
        fontFamily: "Poppins-SemiBold",
    },

    // ================= BODY =================

    scrollContainer: {
        padding: 18,
        paddingBottom: 100,
    },

    imageWrapper: {
        width: screenWidth,
        justifyContent: "center",
        alignItems: "center",
    },

    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },

    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#ccc",
        marginHorizontal: 4,
    },

    activeDot: {
        width: 18,
        backgroundColor: colors.primary,
    },

    roomPrice: {
        marginTop: 6,
        color: colors.primary,
        fontSize: 22,
        fontFamily: "Poppins-Bold",
    },


    infoContainer: {
        paddingHorizontal: 18,
        marginTop: 20,
    },

    roomImage: {
        width: screenWidth,
        height: 240,
        resizeMode: "cover",
    },


    roomName: {
        color: "#111",
        fontSize: 24,
        fontFamily: "Poppins-Bold",
    },

    nightText: {
        color: "#777",
        fontSize: 15,
        fontFamily: "Poppins-Regular",
    },

    guestText: {
        marginLeft: 10,
        color: "#333",
        fontSize: 15,
        fontFamily: "Poppins-Medium",
    },

    guestBox: {
        marginHorizontal: 18,
        marginTop: 18,
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
    },

    sectionTitle: {
        marginTop: 24,
        marginHorizontal: 18,
        marginBottom: 14,
        color: "#111",
        fontSize: 18,
        fontFamily: "Poppins-SemiBold",
    },

    amenitiesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 18,
    },


    amenityBox: {
        backgroundColor: "#FFF",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        marginRight: 10,
        marginBottom: 10,
        elevation: 2,
    },

    amenityText: {
        color: "#333",
        fontSize: 13,
        fontFamily: "Poppins-Medium",
    },

    aboutText: {
        marginHorizontal: 18,
        color: "#777",
        lineHeight: 24,
        fontSize: 14,
        fontFamily: "Poppins-Regular",
    },

    dateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 18,
    },

    dateBox: {
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        elevation: 2,
    },


    dateLabel: {
        color: "#888",
        fontSize: 13,
        textAlign: "left",
        fontFamily: "Poppins-Regular",
    },

    dateRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },


    dateValue: {
        marginTop: 8,
        color: "#888",
        fontSize: 13,
        fontFamily: "Poppins-Regular",
    },

    dateMainContainer: {
        width: "30%",
        alignItems: "center",
    },

    dateCard: {
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 16,
        alignItems: "flex-start",
        borderWidth: 1,
        borderColor: "#eee"
    },

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#FFF5E8",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },

    amenityCard: {
        width: 70,
        height: 70,
        backgroundColor: "#FFF",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eee",
    },

    guestCard: {
        width: 70,
        height: 70,
        backgroundColor: "#FFF",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eee"
    },

    guestIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },

    guestLabel: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 12,
        fontFamily: "Poppins-Regular",
    },

    guestValue: {
        marginTop: 10,
        color: "#777",
        fontSize: 13,
        textAlign: "center",
        fontFamily: "Poppins-SemiBold",
    },

    bottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFF",
        padding: 18,
    },

    bookNowBtn: {
        backgroundColor: colors.primary,
        width: "100%",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
    },

    bookNowText: {
        color: "#FFF",
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
    },

});
