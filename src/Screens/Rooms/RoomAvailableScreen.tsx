import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
    TextInput,
    Pressable,
    FlatList
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useNavigation } from "@react-navigation/native";
import { getRoomTypes } from "../../Services/Booking/BookingService";
import AppEnvironment from "../../utility/AppEnvironment";
import { useBookingStore } from "../../Stores/useBookingStore";
import CustomeLoading from "../../Component/Loading/CustomeLoading";
import CustomCalendar from "../../Component/formComponent/CustomCalendar";
import CommonHeader from "../../Component/Header/CommonHeader";
import { parseDDMMYYYY } from "../../Helper/HtmlTagHelper";
import { useTheme } from "../../utility/AppTheam/ThemeContext";



const RoomAvailableScreen = () => {

    const { roomList, loading, fetchRoomList, } = useBookingStore();

    const [roomTypes, setRoomTypes] = useState<any[]>([]);
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
    const [maxGuests, setMaxGuests] = useState(0);
    const [selectedRoomType, setSelectedRoomType] = useState<number | null>(null);
    const [checkInPicker, setCheckInPicker] = useState(false);
    const [checkOutPicker, setCheckOutPicker] = useState(false);
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const navigation = useNavigation();

    useEffect(() => {
        if (checkInDate && checkOutDate && maxGuests) {
            const getRooms = async () => {
                try {
                    const payload = {
                        ...(maxGuests > 0 && { maxGuests }),
                        ...(selectedRoomType && { roomTypeId: selectedRoomType }),
                        branchCode: AppEnvironment.BRANCH_CODE,
                        statusId: 1,
                    };

                    console.log("PAYLOAD => ", payload);
                    await fetchRoomList(payload);

                } catch (error) {
                    console.log(error);
                }
            };
            getRooms();
        }
    }, [checkInDate, checkOutDate, maxGuests, selectedRoomType, fetchRoomList]);

    useEffect(() => {
        const getAllRoomTypes = async () => {

            try {
                const result = await getRoomTypes();
                console.log(
                    "Room Types in Screen:",
                    result?.result
                )

                if (result?.result) {
                    setRoomTypes(result.result);
                }

            } catch (error) {

                console.log(error);
            }
        };
        getAllRoomTypes();
    }, []);


    const roomAvailable = {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: maxGuests,
    }

    console.log("roomTypes", roomTypes)

    const renderRoomItem = ({ item }: any) => (
        <View style={styles.roomCard}>
            <LinearGradient
                colors={[colors.Linearcard1, colors.Linearcard2]}
                style={styles.roomGradient}
            >
                <Image
                    source={{
                        uri:
                            item.imageUrl ||
                            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop",
                    }}
                    style={styles.roomImage}
                />

                <View style={styles.roomContent}>
                    <View style={styles.topRow}>
                        <Text
                            numberOfLines={1}
                            style={styles.roomTitle}
                        >
                            {item.roomTypeName}
                        </Text>

                        {item.discount > 0 && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>
                                    {item.discount}% OFF
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.facilityRow}>
                        <View style={styles.facilityItem}>
                            <MaterialIcons
                                name="person"
                                size={14}
                                color="#777"
                            />

                            <Text style={styles.facilityText}>
                                {item.maxGuests} Guests
                            </Text>
                        </View>

                        <View style={styles.facilityItem}>
                            <MaterialIcons
                                name="bed"
                                size={14}
                                color="#777"
                            />
                            <Text style={styles.facilityText}>
                                {item.numberOfBeds} Beds
                            </Text>
                        </View>
                    </View>

                    <View style={styles.amenitiesContainer}>
                        {item.amenities
                            ?.slice(0, 2)
                            .map((amenity: any, i: number) => (
                                <View
                                    key={i}
                                    style={styles.amenityChip}
                                >
                                    <MaterialIcons
                                        name={
                                            amenity.icon ||
                                            "check-circle"
                                        }
                                        size={12}
                                        color={colors.primary}
                                    />

                                    <Text
                                        numberOfLines={1}
                                        style={styles.amenityText}
                                    >
                                        {amenity.name}
                                    </Text>
                                </View>
                            ))}
                    </View>

                    <View style={styles.priceRow}>
                        <View style={styles.priceContainer}>
                            {item.discount > 0 && (
                                <Text style={styles.oldPrice}>
                                    ₹{item.totalPrice}
                                </Text>
                            )}

                            <Text style={styles.priceText}>
                                ₹{item.finalPrice}
                            </Text>

                            <Text style={styles.perNight}>
                                /Night
                            </Text>
                        </View>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.bookNowBtn}
                            onPress={() =>
                                navigation.navigate(
                                    "CreateBookingScreen",
                                    {
                                        bookingData: roomAvailable,
                                        roomId: item.id,
                                    },
                                )
                            }
                        >
                            <Text style={styles.bookNowText}>
                                Book Now
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.viewDetailsBtn}
                            onPress={() =>
                                navigation.navigate(
                                    "RoomDetailsScreen",
                                    {
                                        roomAvailable,
                                        roomId: item.id,
                                    },
                                )
                            }
                        >
                            <Text style={styles.viewDetailsText}>
                                View Details
                            </Text>

                            <MaterialIcons
                                name="arrow-forward-ios"
                                size={12}
                                color={colors.primary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );




    return (
        <View style={styles.container}>

            <StatusBar
                backgroundColor={colors.primary}
                barStyle="light-content"
            />

            {/* ================= HEADER ================= */}
            <CommonHeader title="Room Available" />
            {/* ================= BODY ================= */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >

                {/* ================= DATE CARD ================= */}

                <View style={styles.dateMainContainer}>

                    <Pressable style={styles.dateCard} onPress={() => {
                        setCheckInPicker(true);
                        setCheckOutPicker(false);
                    }}>

                        <Text style={styles.dateLabel}>
                            Check In
                        </Text>

                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >
                            <MaterialIcons
                                name="calendar-month"
                                color={colors.icon}
                                size={15}
                            />
                            <Text style={styles.dateValue}>
                                {checkInDate ? checkInDate : "Select Date"}
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable style={styles.dateCard} onPress={() => {
                        setCheckInPicker(false);
                        setCheckOutPicker(true);
                    }}>
                        <Text style={styles.dateLabel}>
                            Check Out
                        </Text>
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >
                            <MaterialIcons
                                name="calendar-month"
                                color={colors.icon}
                                size={15}
                            />
                            <Text style={styles.dateValue}>
                                {checkOutDate ? checkOutDate : "Select Date"}
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable style={styles.dateCard} >
                        <Text style={styles.dateLabel}>
                            Guests
                        </Text>
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }} >
                            <MaterialIcons
                                name="person-outline"
                                color={colors.icon}
                                size={18}
                            />
                            <TextInput
                                style={{
                                    flex: 1,
                                    marginLeft: 5,
                                    fontSize: 12,
                                    color: "#222",
                                    fontFamily: "Poppins-SemiBold",
                                    paddingVertical: 0,
                                }}
                                value={maxGuests}
                                placeholder="Guests"
                                keyboardType="number-pad"
                                placeholderTextColor="#999"
                                returnKeyType="search"
                                onChangeText={setMaxGuests}
                                onBlur={() => {
                                    if (
                                        checkInDate &&
                                        checkOutDate &&
                                        maxGuests > 0
                                    ) {
                                        getRooms();
                                    }
                                }}
                            />
                        </View>
                    </Pressable>


                </View>

                {/* ================= SEARCH ================= */}

                <View style={styles.searchContainer}>

                    <FlatList
                        horizontal
                        data={roomTypes}
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() =>
                                    setSelectedRoomType(item.id)
                                }
                                style={[
                                    styles.roomTypeItem,
                                    selectedRoomType === item.id &&
                                    styles.selectedRoomTypeItem,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.roomTypeText,
                                        selectedRoomType === item.id &&
                                        styles.selectedRoomTypeText,
                                    ]}
                                >
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />

                    {(checkInDate &&
                        checkOutDate &&
                        maxGuests > 0) && (
                            <TouchableOpacity onPress={() => {
                                setCheckInDate(null)
                                setCheckOutDate(null)
                                setMaxGuests(0)
                                setSelectedRoomType(null)

                            }}>
                                <MaterialIcons name="clear" size={20} />
                            </TouchableOpacity>
                        )}
                </View>

                {/* ================= ROOM LIST ================= */}


                {
                    checkInDate &&
                        checkOutDate &&
                        maxGuests ? (
                        <FlatList
                            data={roomList}
                            keyExtractor={(item, index) =>
                                item.id?.toString() ||
                                index.toString()
                            }
                            renderItem={renderRoomItem}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 30,
                                flexGrow:
                                    roomList.length === 0 ? 1 : undefined,
                            }}
                            ListEmptyComponent={() => (
                                <View style={styles.noDataContainer}>
                                    <MaterialIcons
                                        name="hotel"
                                        size={70}
                                        color="#D1D5DB"
                                    />

                                    <Text style={styles.noDataTitle}>
                                        No Rooms Found
                                    </Text>

                                    <Text style={styles.noDataSubtitle}>
                                        Try changing filters or search
                                        keyword
                                    </Text>
                                </View>
                            )}
                        />
                    ) : (
                        <View
                            style={{
                                alignItems: "center",
                                marginTop: 50,
                            }}
                        >
                            <Text
                                style={styles.noDataSubtitle}
                            >
                                Please select check-in,
                                check-out dates and number of
                                guests to see available rooms.
                            </Text>

                            <MaterialIcons
                                name="hotel"
                                size={70}
                                color="#D1D5DB"
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    )
                };
            </ScrollView >


            <CustomCalendar
                title="---- Check In ----"
                visible={checkInPicker}
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                selectedDate={checkInDate ? parseDDMMYYYY(checkInDate) : new Date()}
                onDateSelect={date => {
                    console.log("Selected Check-In Date:", date);
                    setCheckInDate(date);
                    setCheckInPicker(false);
                    setCheckOutPicker(true);
                }}
            />

            <CustomCalendar
                title="---- Check Out ----"
                visible={checkOutPicker}
                minDate={checkInDate ? parseDDMMYYYY(checkInDate) : new Date()}
                startDate={checkInDate ? parseDDMMYYYY(checkInDate) : new Date()}
                rangePicker={true}
                onRangeSelect={(startDate, endDate) => {
                    setCheckOutDate(endDate);
                    setCheckOutPicker(false);
                }}
            />

            <CustomeLoading isLoading={loading} />
        </View >
    );
};

export default RoomAvailableScreen;

const createStyles = (colors: any) =>
    StyleSheet.create({

        container: {
            flex: 1,
            backgroundColor:colors.background,
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
            backgroundColor: colors.card,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            elevation: 2,
        },

        dateLabel: {
            fontSize: 14,
            color: colors.text,
            fontFamily: "Poppins-Regular",
        },

        dateValue: {
            fontSize: 11,
            color: colors.text,
            fontFamily: "Poppins-SemiBold",
            textAlign: "center",
            marginTop: 5,
        },

        filterContainer: {
            backgroundColor: colors.card,
            padding: 18,
            borderRadius: 20,
            marginBottom: 20,
        },

        filterHeading: {
            fontSize: 22,
            color: colors.text,
            fontFamily: "Poppins-SemiBold",
        },

        filterTitle: {
            fontSize: 16,
            color: colors.text,
            fontFamily: "Poppins-SemiBold",
        },

        counterContainer: {
            flexDirection: "row",
            alignItems: "center",
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
            color: colors.text,
            fontSize: 22,
            fontFamily: "Poppins-SemiBold",
        },

        counterValue: {
            marginHorizontal: 20,
            fontSize: 18,
            color: colors.text,
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
            backgroundColor: colors.card,
            marginRight: 10,
            marginBottom: 10,
        },

        selectedRoomTypeChip: {
            backgroundColor: colors.primary,
        },

        roomTypeText: {
            color: colors.text,
            fontFamily: "Poppins-SemiBold",
        },

        selectedRoomTypeText: {
            color: colors.text,
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
            borderRadius: 16,
            padding: 8,
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
            color: colors.text,
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
            color: colors.text,
            fontFamily: "Poppins-Regular",
        },

        priceText: {
            fontSize: 16,
            color: colors.primary,
            fontFamily: "Poppins-SemiBold",
        },

        perNight: {
            fontSize: 11,
            color: "#777",
            marginLeft: 4,
            marginBottom: 2,
            fontFamily: "Poppins-Regular",
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

        topRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },

        statusBadge: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
        },

        statusText: {
            fontSize: 10,
            fontFamily: "Poppins-SemiBold",
        },

        roomNumber: {
            fontSize: 12,
            color: "#777",
            marginTop: 2,
            fontFamily: "Poppins-Regular",
        },

        amenitiesContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 6,
        },

        amenityChip: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FFF3E8",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 20,
            marginRight: 6,
            marginBottom: 6,
        },

        amenityText: {
            marginLeft: 4,
            fontSize: 10,
            color: "#444",
            fontFamily: "Poppins-Medium",
        },

        priceContainer: {
            flexDirection: "row",
            alignItems: "flex-end",
            flexWrap: "wrap",
        },

        priceRow: {
            marginTop: 0,
        },

        oldPrice: {
            color: "#999",
            textDecorationLine: "line-through",
            fontSize: 11,
            marginRight: 6,
            marginBottom: 1,
            fontFamily: "Poppins-Regular",
        },

        discountBadge: {
            backgroundColor: "#E8F8EE",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
        },

        discountText: {
            color: "#1B9C57",
            fontSize: 11,
            fontFamily: "Poppins-SemiBold",
        },

        bookNowText: {
            color: "#FFF",
            fontSize: 12,
            fontFamily: "Poppins-SemiBold",
        },

        noDataContainer: {
            marginTop: 80,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
        },

        noDataTitle: {
            marginTop: 16,
            fontSize: 20,
            color: "#222",
            fontFamily: "Poppins-SemiBold",
        },

        noDataSubtitle: {
            marginTop: 6,
            fontSize: 13,
            color: "#777",
            textAlign: "center",
            fontFamily: "Poppins-Regular",
        },

        resetSearchBtn: {
            marginTop: 20,
            backgroundColor: colors.primary,
            paddingHorizontal: 22,
            paddingVertical: 12,
            borderRadius: 12,
        },

        resetSearchText: {
            color: "#FFF",
            fontFamily: "Poppins-SemiBold",
        },

        roomTypeItem: {
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 18,
            backgroundColor: colors.card,
            marginRight: 10,
            borderWidth: 1,
            borderColor: '#E5E7EB',
        },

        selectedRoomTypeItem: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },

        // roomTypeText: {
        //     fontSize: 14,
        //     color: '#374151',
        //     fontFamily: 'Poppins-Medium',
        // },

        // selectedRoomTypeText: {
        //     color: '#FFF',
        // },

    });