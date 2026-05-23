import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
    TextInput,
    Modal
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utility/AppTheam";



const roomTypes = [
    "AC",
    "Non AC",
    "Family Room",
    "Dormitory",
];

const roomList = [
    {
        id: 1,
        title: "AC Room",
        price: "₹1200 / Night",
        image:
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Family Room",
        price: "₹2000 / Night",
        image:
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Non-AC Room",
        price: "₹2500 / Night",
        image:
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    },

];



const RoomAvailableScreen = () => {

    const [beds, setBeds] = useState(1);

    const [maxGuests, setMaxGuests] = useState(2);

    const [selectedRoomType, setSelectedRoomType] = useState<string[]>([]);

    const [showFilter, setShowFilter] = useState(false);
    const navigation = useNavigation();

    const handleRoomType = (type: string) => {

        if (selectedRoomType.includes(type)) {

            setSelectedRoomType(
                selectedRoomType.filter(
                    item => item !== type
                )
            );

        } else {

            setSelectedRoomType([
                ...selectedRoomType,
                type,
            ]);
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
                    Room Available
                </Text>

                <TouchableOpacity style={styles.filterTopBtn}>
                    <MaterialIcons
                        name="tune"
                        size={22}
                        color="#FFF"
                    />
                </TouchableOpacity>

            </LinearGradient>

            {/* ================= BODY ================= */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >

                {/* ================= DATE CARD ================= */}

                <View style={styles.dateMainContainer}>

                    <View style={styles.dateCard}>
                        <MaterialIcons
                            name="calendar-month"
                            color={colors.primary}
                            size={22}
                        />

                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.dateLabel}>
                                Check In
                            </Text>

                            <Text style={styles.dateValue}>
                                20 May 2024
                            </Text>
                        </View>
                    </View>

                    <View style={styles.dateCard}>
                        <MaterialIcons
                            name="calendar-month"
                            color={colors.primary}
                            size={22}
                        />

                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.dateLabel}>
                                Check Out
                            </Text>

                            <Text style={styles.dateValue}>
                                22 May 2024
                            </Text>
                        </View>
                    </View>

                    <View style={styles.dateCard}>
                        <MaterialIcons
                            name="person-outline"
                            color={colors.primary}
                            size={22}
                        />

                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.dateLabel}>
                                Guests
                            </Text>

                            <Text style={styles.dateValue}>
                                2 Guests
                            </Text>
                        </View>
                    </View>

                </View>

                {/* ================= SEARCH ================= */}

                <View style={styles.searchContainer}>

                    <View style={styles.searchBox}>
                        <MaterialIcons
                            name="search"
                            size={22}
                            color="#999"
                        />

                        <TextInput
                            placeholder="Search Room or Type..."
                            placeholderTextColor="#999"
                            style={styles.input}
                        />
                    </View>

                    <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
                        <MaterialIcons
                            name="tune"
                            size={20}
                            color={colors.primary}
                        />

                        <Text style={styles.filterText}>
                            Filter
                        </Text>
                    </TouchableOpacity>

                </View>

                {/* ================= ROOM LIST ================= */}

                {roomList.map((item) => (

                    <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.8}
                        style={styles.roomCard}
                    >

                        <LinearGradient
                            colors={["#FFFFFF", "#FFF7ED"]}
                            style={styles.roomGradient}
                        >

                            <Image
                                source={{ uri: item.image }}
                                style={styles.roomImage}
                            />

                            <View style={styles.roomContent}>

                                <Text style={styles.roomTitle}>
                                    {item.title}
                                </Text>

                                {/* FACILITIES */}

                                <View style={styles.facilityRow}>

                                    <View style={styles.facilityItem}>
                                        <MaterialIcons
                                            name="person"
                                            size={15}
                                            color="#777"
                                        />

                                        <Text style={styles.facilityText}>
                                            2 Guests
                                        </Text>
                                    </View>

                                    <View style={styles.facilityItem}>
                                        <MaterialIcons
                                            name="ac-unit"
                                            size={15}
                                            color="#777"
                                        />

                                        <Text style={styles.facilityText}>
                                            AC
                                        </Text>
                                    </View>

                                    <View style={styles.facilityItem}>
                                        <MaterialIcons
                                            name="wifi"
                                            size={15}
                                            color="#777"
                                        />

                                        <Text style={styles.facilityText}>
                                            WiFi
                                        </Text>
                                    </View>

                                    <View style={styles.facilityItem}>
                                        <MaterialIcons
                                            name="tv"
                                            size={15}
                                            color="#777"
                                        />

                                        <Text style={styles.facilityText}>
                                            TV
                                        </Text>
                                    </View>

                                </View>

                                <Text style={styles.priceText}>
                                    {item.price}
                                </Text>



                                <View style={styles.buttonRow}>

                                    <TouchableOpacity
                                        style={styles.bookNowBtn} onPress={() =>
                                            navigation.navigate("CreateBookingScreen")
                                        }
                                    >
                                        <Text style={styles.bookNowText}>
                                            Book Now
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.viewDetailsBtn} onPress={() =>
                                            navigation.navigate("RoomDetailsScreen", {
                                                room: item
                                            })
                                        }
                                    >
                                        <Text style={styles.viewDetailsText}>
                                            View Details
                                        </Text>

                                        <MaterialIcons
                                            name="arrow-forward-ios"
                                            size={14}
                                            color={colors.primary}
                                        />
                                    </TouchableOpacity>

                                </View>

                            </View>

                        </LinearGradient>

                    </TouchableOpacity>
                ))}

            </ScrollView>

            <Modal
                visible={showFilter}
                transparent
                animationType="slide"
                
            >
                <View style={styles.modalOverlay}>

                    <View style={styles.filterModal}>

                        {/* HEADER */}

                        <View style={styles.filterHeader}>

                            <Text style={styles.filterHeading}>
                                Filters
                            </Text>

                            <TouchableOpacity
                                onPress={() => setShowFilter(false)}
                            >
                                <MaterialIcons
                                    name="close"
                                    size={24}
                                    color="#111"
                                />
                            </TouchableOpacity>

                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >

                            {/* Beds */}

                            <Text style={styles.filterTitle}>
                                No. Of Beds
                            </Text>

                            <View style={styles.counterContainer}>

                                <TouchableOpacity
                                    style={styles.counterBtn}
                                    onPress={() =>
                                        beds > 1 && setBeds(beds - 1)
                                    }
                                >
                                    <Text style={styles.counterText}>
                                        -
                                    </Text>
                                </TouchableOpacity>

                                <Text style={styles.counterValue}>
                                    {beds}
                                </Text>

                                <TouchableOpacity
                                    style={styles.counterBtn}
                                    onPress={() =>
                                        setBeds(beds + 1)
                                    }
                                >
                                    <Text style={styles.counterText}>
                                        +
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            {/* Guests */}

                            <Text style={styles.filterTitle}>
                                Max Guests
                            </Text>

                            <View style={styles.counterContainer}>

                                <TouchableOpacity
                                    style={styles.counterBtn}
                                    onPress={() =>
                                        maxGuests > 1 &&
                                        setMaxGuests(maxGuests - 1)
                                    }
                                >
                                    <Text style={styles.counterText}>
                                        -
                                    </Text>
                                </TouchableOpacity>

                                <Text style={styles.counterValue}>
                                    {maxGuests}
                                </Text>

                                <TouchableOpacity
                                    style={styles.counterBtn}
                                    onPress={() =>
                                        setMaxGuests(maxGuests + 1)
                                    }
                                >
                                    <Text style={styles.counterText}>
                                        +
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            {/* Room Type */}

                            <Text style={styles.filterTitle}>
                                Room Type
                            </Text>

                            <View style={styles.roomTypeContainer}>

                                {roomTypes.map((item, index) => {

                                    const isSelected =
                                        selectedRoomType.includes(item);

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.roomTypeChip,
                                                isSelected &&
                                                styles.selectedRoomTypeChip,
                                            ]}
                                            onPress={() =>
                                                handleRoomType(item)
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.roomTypeText,
                                                    isSelected &&
                                                    styles.selectedRoomTypeText,
                                                ]}
                                            >
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                        </ScrollView>

                        {/* BUTTONS */}

                        <View style={styles.bottomBtnContainer}>

                            <TouchableOpacity
                                style={styles.resetBtn}
                                onPress={() => {
                                    setBeds(1);
                                    setMaxGuests(2);
                                    setSelectedRoomType([]);
                                }}
                            >
                                <Text style={styles.resetBtnText}>
                                    Reset
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.applyBtn}
                                onPress={() => setShowFilter(false)}
                            >
                                <Text style={styles.applyBtnText}>
                                    Apply
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>

                </View>
            </Modal>

        </View>
    );
};

export default RoomAvailableScreen;

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

    backBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },

    filterTopBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },

    headerTitle: {
        color: "#FFF",
        fontSize: 20,
        fontFamily: "Poppins-SemiBold",
    },

    // ================= BODY =================

    scrollContainer: {
        padding: 18,
        paddingBottom: 100,
    },

    // ================= DATE =================

    dateMainContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 18,
    },

    dateCard: {
        width: "31%",
        backgroundColor: "#FFF",
        borderRadius: 18,
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: "center",
        elevation: 2,
    },

    dateLabel: {
        fontSize: 11,
        color: "#777",
        fontFamily: "Poppins-Regular",
    },

    dateValue: {
        fontSize: 11,
        color: "#222",
        fontFamily: "Poppins-SemiBold",
        marginTop: 2,
    },

    filterContainer: {
        backgroundColor: "#FFF",
        padding: 18,
        borderRadius: 20,
        marginBottom: 20,
    },

    filterHeading: {
        fontSize: 22,
        color: "#111",
        fontFamily: "Poppins-SemiBold",
        marginBottom: 20,
    },

    filterTitle: {
        fontSize: 16,
        color: "#222",
        fontFamily: "Poppins-SemiBold",
        marginTop: 15,
    },

    counterContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
    },

    counterBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    counterText: {
        color: "#FFF",
        fontSize: 22,
        fontFamily: "Poppins-SemiBold",
    },

    counterValue: {
        marginHorizontal: 20,
        fontSize: 18,
        color: "#111",
        fontFamily: "Poppins-SemiBold",
    },

    roomTypeContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 15,
    },

    roomTypeChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 30,
        backgroundColor: "#F3F3F3",
        marginRight: 10,
        marginBottom: 10,
    },

    selectedRoomTypeChip: {
        backgroundColor: colors.primary,
    },

    roomTypeText: {
        color: "#444",
        fontFamily: "Poppins-SemiBold",
    },

    selectedRoomTypeText: {
        color: "#FFF",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },

    filterModal: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 20,
        maxHeight: "80%",
    },

    filterHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    bottomBtnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 25,
    },

    resetBtn: {
        flex: 1,
        backgroundColor: "#F1F1F1",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        marginRight: 10,
    },

    applyBtn: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
    },

    resetBtnText: {
        color: "#111",
        fontFamily: "Poppins-SemiBold",
    },

    applyBtnText: {
        color: "#FFF",
        fontFamily: "Poppins-SemiBold",
    },

    // ================= SEARCH =================

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    searchBox: {
        flex: 1,
        height: 52,
        backgroundColor: "#FFF",
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        elevation: 2,
    },

    input: {
        flex: 1,
        marginLeft: 10,
        color: "#111",
        fontFamily: "Poppins-Regular",
    },

    filterBtn: {
        marginLeft: 12,
        backgroundColor: "#FFF3E8",
        height: 52,
        paddingHorizontal: 18,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    filterText: {
        marginLeft: 6,
        color: colors.primary,
        fontFamily: "Poppins-SemiBold",
    },

    // ================= ROOM CARD =================

    roomCard: {
        marginBottom: 12,
    },

    roomGradient: {
        borderRadius: 18,
        padding: 10,
        flexDirection: "row",
        elevation: 2,
    },

    roomImage: {
        width: 85,
        height: 95,
        borderRadius: 14,
        backgroundColor: "#EEE",
    },

    roomContent: {
        flex: 1,
        marginLeft: 10,
    },

    roomTitle: {
        fontSize: 15,
        color: "#222",
        fontFamily: "Poppins-SemiBold",
    },

    facilityRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 4,
    },

    facilityItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 8,
        marginBottom: 4,
    },

    facilityText: {
        marginLeft: 3,
        fontSize: 11,
        color: "#666",
        fontFamily: "Poppins-Regular",
    },

    priceText: {
        marginTop: 4,
        fontSize: 16,
        color: colors.primary,
        fontFamily: "Poppins-SemiBold",
    },

    locationText: {
        marginTop: 2,
        color: "#777",
        fontSize: 13,
        fontFamily: "Poppins-Regular",
    },

    buttonRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },

    viewDetailsBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },

    viewDetailsText: {
        color: colors.primary,
        fontSize: 13,
        marginRight: 4,
        fontFamily: "Poppins-SemiBold",
    },

    bookNowBtn: {
        backgroundColor: colors.primary,
        alignSelf: "flex-start",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },

    bookNowText: {
        color: "#FFF",
        fontSize: 12,
        fontFamily: "Poppins-SemiBold",
    },

});