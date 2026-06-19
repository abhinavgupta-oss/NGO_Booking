import React, { useEffect, useRef, useState } from "react";
import {
    Text,
    View,
    Image,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Dimensions,
} from "react-native";

import { useRoute, useNavigation } from "@react-navigation/native";
// import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import { colors } from "../../utility/AppTheam";
import { useBookingStore } from "../../Stores/useBookingStore";
import CommonHeader from "../../Component/Header/CommonHeader";
import CustomeLoading from "../../Component/Loading/CustomeLoading";
import { removeHtmlTags } from "../../Helper/HtmlTagHelper";

const screenWidth = Dimensions.get("window").width;

const RoomDetailsScreen = () => {

    const navigation = useNavigation<any>();
    const route = useRoute();

    const { roomAvailable, roomId } = route.params as any;

    console.log("Room Details:", roomAvailable);

    const flatListRef = useRef<FlatList>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const { roomDetails, loading, fetchRoomDetails, } = useBookingStore();

    useEffect(() => {
        RoomDetails();
    }, []);

    const RoomDetails = async () => {
        try {
            console.log("Fetching Room Details for ID:", roomId);
            const response = await fetchRoomDetails(roomId);
            console.log("RoomDetails Response:", roomDetails,response);
        } catch (error) {
            console.log("RoomDetails Error:", error);
        }
    }


    const room = roomDetails || {};

    const roomImages =
        room?.roomGalleries?.length > 0
            ? room.roomGalleries.map((item: any) => item.imageUrl)
            : [
                'https://res.cloudinary.com/orangeskill-dev/image/upload/v1778498247/NGO/ttg/uploads/albumimage/c010a75fff2c4ce8b879e92f8cf1bda1.jpg',
            ];

    const amenities =
        room?.amenities?.filter((item: any) => item.isAssigned) || [];

    return (

        <View style={styles.container}>

            <StatusBar
                backgroundColor={colors.primary}
                barStyle="light-content"
            />

            {/* ================= HEADER ================= */}
            <CommonHeader title="Room Details" />
            {/* ================= BODY ================= */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {/* IMAGE CAROUSEL */}
                <FlatList
                    ref={flatListRef}
                    data={roomImages}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: item }}
                                style={styles.roomImage}
                            />
                        </View>
                    )}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.round(
                            event.nativeEvent.contentOffset.x / screenWidth
                        );
                        setActiveIndex(index);
                    }}
                />

                {/* DOTS */}

                <View style={styles.dotsContainer}>
                    {roomImages.map((_: any, index: number) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                activeIndex === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                {/* ROOM INFO */}

                <View style={styles.infoContainer}>

                    <Text style={styles.roomName}>
                        {room?.roomTypeName}
                    </Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.roomPrice}>
                            ₹{room?.finalPrice}
                        </Text>

                        <Text style={styles.nightText}>
                            / Night
                        </Text>
                    </View>

                    {room?.discountPercentage > 0 && (
                        <>
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>
                                    {room?.discountPercentage}% OFF
                                </Text>
                            </View>

                            <Text style={styles.oldPrice}>
                                ₹{room?.totalPrice}
                            </Text>
                        </>
                    )}

                </View>

                {/* ROOM FEATURES */}
                <Text style={styles.sectionTitle}>
                    Amenities
                </Text>

                <View style={styles.iconRowContainer}>
                    {amenities.map((item: any, index: number) => (
                        <View style={styles.itemContainer}
                            key={index}>
                            <View style={styles.guestCard} >
                                <MaterialIcons
                                    name={item.icon}
                                    color="#8a8686"
                                    size={28}
                                />
                            </View>
                        </View>
                    ))}
                </View>

                {/* <MaterialIcons name="local-taxi" size={28}/> */}

                {/* ABOUT */}

                <Text style={styles.sectionTitle}>
                    About Room
                </Text>

                <Text style={styles.aboutText}>
                    {removeHtmlTags(room?.description) ||
                        "Enjoy a comfortable stay with modern amenities, spacious interiors, and excellent hospitality. Designed for relaxation and convenience, our rooms provide everything you need for a pleasant and memorable experience."}
                </Text>

                {/* DATE */}

                <Text style={styles.sectionTitle}>
                    Select Date
                </Text>

                <View style={styles.dateContainer}>

                    <View style={styles.dateCard}>
                        <Text style={styles.dateLabel}>
                            Check In
                        </Text>

                        <View style={styles.dateRow}>
                            <Text style={styles.dateValue}>
                                {roomAvailable?.checkIn}
                            </Text>
                            <MaterialIcons
                                name="calendar-month"
                                color="#8a8686"
                                size={20}
                            />
                        </View>
                    </View>

                    <View style={styles.dateCard}>
                        <Text style={styles.dateLabel}>
                            Check Out
                        </Text>

                        <View style={styles.dateRow}>
                            <Text style={styles.dateValue}>
                                {roomAvailable?.checkOut}
                            </Text>
                            <MaterialIcons
                                name="calendar-month"
                                color="#8a8686"
                                size={20}
                            />
                        </View>
                    </View>

                </View>

                <CustomeLoading isLoading={loading} />

            </ScrollView>

            {/* ================= BOTTOM BUTTON ================= */}

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.bookNowBtn}
                    onPress={() =>
                        navigation.navigate("CreateBookingScreen", {
                            bookingData: roomAvailable,
                            roomId: roomId
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

};

export default RoomDetailsScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

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

    scrollContainer: {
        paddingBottom: 120,
    },

    imageWrapper: {
        width: screenWidth,
    },

    roomImage: {
        width: screenWidth,
        height: 250,
        resizeMode: "cover",
    },

    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 12,
    },

    dot: {
        width: 7,
        height: 7,
        borderRadius: 5,
        backgroundColor: "#ccc",
        marginHorizontal: 4,
    },

    activeDot: {
        width: 18,
        backgroundColor: colors.primary,
    },

    infoContainer: {
        paddingHorizontal: 18,
        marginTop: 20,
    },

    roomName: {
        color: "#111",
        fontSize: 24,
        fontFamily: "Poppins-Bold",
    },

    priceRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginTop: 6,
    },

    roomPrice: {
        color: colors.primary,
        fontSize: 24,
        fontFamily: "Poppins-Bold",
    },

    nightText: {
        marginLeft: 6,
        marginBottom: 4,
        color: "#777",
        fontSize: 14,
        fontFamily: "Poppins-Regular",
    },

    oldPrice: {
        color: "#999",
        fontSize: 14,
        textDecorationLine: "line-through",
        marginTop: 4,
        fontFamily: "Poppins-Regular",
    },

    discountBadge: {
        marginTop: 10,
        backgroundColor: "#E8F8EE",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },

    discountText: {
        color: "#1B9C57",
        fontSize: 12,
        fontFamily: "Poppins-SemiBold",
    },

    iconRowContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingHorizontal: 10,
    },

    itemContainer: {
        alignItems: "center",
        width: "23%",
    },

    itemText: {
        marginTop: 8,
        color: "#777",
        fontSize: 11,
        textAlign: "center",
        fontFamily: "Poppins-SemiBold",
    },

    guestCard: {
        width: 68,
        height: 68,
        backgroundColor: "#FFF",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eee",
    },

    amenityCard: {
        width: 68,
        height: 68,
        backgroundColor: "#FFF",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eee",
    },

    sectionTitle: {
        marginTop: 28,
        marginHorizontal: 18,
        marginBottom: 14,
        color: "#111",
        fontSize: 18,
        fontFamily: "Poppins-SemiBold",
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

    dateCard: {
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 10,
        borderWidth: 1,
        borderColor: "#eee",
    },

    dateLabel: {
        color: "#888",
        fontSize: 13,
        fontFamily: "Poppins-Regular",
    },

    dateRow: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    dateValue: {
        color: "#222",
        fontSize: 13,
        fontFamily: "Poppins-SemiBold",
    },

    bottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFF",
        padding: 18,
        borderTopWidth: 1,
        borderTopColor: "#eee",
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