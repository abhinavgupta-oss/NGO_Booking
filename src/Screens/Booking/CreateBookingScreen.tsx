import React, { useState, useEffect } from "react";
import { useProfileStore } from "../../Stores/useProfileStore";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    StatusBar,
} from "react-native";

import {
    useRoute,
    useNavigation
} from "@react-navigation/native";

import LinearGradient from "react-native-linear-gradient";

import MaterialIcons from "@react-native-vector-icons/material-icons";

import { colors } from "../../utility/AppTheam";


const CreateBookingScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const profile = useProfileStore(
        (state) => state.profile
    );
    const [guestDetails, setGuestDetails] = useState([
        {
            fullName: profile?.fullName || "",
            mobile:
                profile?.mobileNumber ||
                profile?.phoneNumber ||
                profile?.mobile ||
                "",
            email: profile?.email || "",
            document: null,
            isPrimary: true,
        }
    ]);
    // ================= RECEIVED DATA =================

    const bookingData = route?.params?.bookingData || {};

    const {
        room,
        checkIn,
        checkOut,
        guests,
    } = bookingData;

    // ================= PAYMENT =================

    const [paymentType, setPaymentType] = useState("partial");

    const roomPrice = parseFloat(
        String(room?.price || 1200).replace(/[^0-9.]/g, "")
    );

    const serviceFee = 150;
    const donation = 100;

    const totalAmount =
        Number(roomPrice) + serviceFee + donation;

    const partialAmount = 500;

    const remainingAmount =
        totalAmount - partialAmount;

    const handleGuestChange = (index, field, value) => {

        const updatedGuests = [...guestDetails];

        updatedGuests[index][field] = value;

        setGuestDetails(updatedGuests);
    };

    const addGuest = () => {

        if (guestDetails.length >= guests) {
            return;
        }

        setGuestDetails([
            ...guestDetails,
            {
                fullName: "",
                mobile: "",
                isPrimary: false,
            },
        ]);
    };

    const removeGuest = (index) => {

        const updatedGuests =
            guestDetails.filter(
                (_, i) => i !== index
            );

        setGuestDetails(updatedGuests);
    };

    const handleBookNow = () => {

        const bookingPayload = {
            room,
            guests,
            guestDetails,
            checkIn,
            checkOut,
            paymentType,
            payableAmount:
                paymentType === "partial"
                    ? partialAmount
                    : totalAmount,
        };

        console.log("BOOKING DATA", bookingPayload);

        navigation.navigate(
            "ConfirmedBookingScreen",
            {
                bookingData: bookingPayload
            }
        );
    };

    useEffect(() => {

        if (profile) {

            setGuestDetails([
                {
                    fullName:
                        profile?.fullName || "",

                    mobile:
                        profile?.mobileNumber ||
                        profile?.phoneNumber ||
                        profile?.mobile ||
                        "",

                    email:
                        profile?.email || "",

                    document: null,

                    isPrimary: true,
                }
            ]);
        }

    }, [profile]);

    console.log("PROFILE DATA", profile);

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
                    Complete Booking
                </Text>

                {/* Empty view for perfect center alignment */}
                <View style={{ width: 42 }} />

            </LinearGradient>

            {/* ================= BODY ================= */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 140
                }}
            >

                {/* ================= ROOM CARD ================= */}

                <View style={styles.roomCard}>

                    {/* TOP ROW */}
                    <View style={styles.roomTopRow}>

                        <Image
                            source={
                                room?.images?.[0]
                                    ? { uri: room.images[0] }
                                    : { uri: profile?.branchLogo }
                            }
                            style={styles.roomImage}
                        />

                        <View style={styles.roomContent}>

                            <Text style={styles.roomName}>
                                {room?.roomName || "Deluxe Room"}
                            </Text>

                            <Text style={styles.roomLocation}>
                                {room?.location || "Main Building"}
                            </Text>

                            <Text style={styles.roomPrice}>
                                {roomPrice}

                                <Text style={styles.night}>
                                    {" "}
                                </Text>
                            </Text>

                        </View>

                    </View>

                    {/* DATE ROW */}
                    <View style={styles.dateRow}>

                        <View style={styles.dateCard}>
                            <MaterialIcons
                                name="calendar-month"
                                size={20}
                                color={colors.primary}
                            />

                            <Text style={styles.dateLabel}>
                                Check In
                            </Text>

                            <Text style={styles.dateValue}>
                                {checkIn}
                            </Text>
                        </View>

                        <View style={styles.dateCard}>
                            <MaterialIcons
                                name="calendar-month"
                                size={20}
                                color={colors.primary}
                            />

                            <Text style={styles.dateLabel}>
                                Check Out
                            </Text>

                            <Text style={styles.dateValue}>
                                {checkOut}
                            </Text>
                        </View>

                        <View style={styles.dateCard}>
                            <MaterialIcons
                                name="groups"
                                size={20}
                                color={colors.primary}
                            />

                            <Text style={styles.dateLabel}>
                                Guests
                            </Text>

                            <Text style={styles.dateValue}>
                                {guests} Guests
                            </Text>
                        </View>

                    </View>

                </View>



                {/* ================= GUEST DETAILS ================= */}

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Guest Details
                    </Text>

                    {
                        guestDetails.map((guest, index) => (

                            <View
                                key={index}
                                style={{ marginBottom: 22 }}
                            >

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 10,
                                    }}
                                >

                                    <Text
                                        style={{
                                            fontFamily: "Poppins-SemiBold",
                                            color: "#444",
                                        }}
                                    >
                                        {guest?.isPrimary
                                            ? "Primary Guest"
                                            : `Guest ${index + 1}`
                                        }
                                    </Text>

                                    {
                                        !guest?.isPrimary && (
                                            <TouchableOpacity
                                                onPress={() => removeGuest(index)}
                                            >
                                                <MaterialIcons
                                                    name="delete-outline"
                                                    size={22}
                                                    color="red"
                                                />
                                            </TouchableOpacity>
                                        )
                                    }

                                </View>

                                {/* FULL NAME */}
                                <TextInput
                                    placeholder="Full Name"
                                    placeholderTextColor="#999"
                                    style={styles.input} editable={!guest.isPrimary}
                                    value={guest.fullName}
                                    onChangeText={(text) =>
                                        handleGuestChange(
                                            index,
                                            "fullName",
                                            text
                                        )
                                    }
                                />

                                {/* MOBILE */}
                                <TextInput
                                    placeholder="Mobile Number"
                                    placeholderTextColor="#999" editable={!guest.isPrimary}
                                    keyboardType="phone-pad"
                                    style={styles.input}
                                    value={guest.mobile}
                                    onChangeText={(text) =>
                                        handleGuestChange(
                                            index,
                                            "mobile",
                                            text
                                        )
                                    }
                                />

                                {/* PRIMARY GUEST ONLY */}
                                {
                                    guest?.isPrimary && (
                                        <>
                                            <TextInput
                                                placeholder="Email Address"
                                                placeholderTextColor="#999"
                                                keyboardType="email-address"
                                                style={styles.input}
                                                value={guest.email}
                                                onChangeText={(text) =>
                                                    handleGuestChange(
                                                        index,
                                                        "email",
                                                        text
                                                    )
                                                }
                                            />

                                            {/* DOCUMENT PICKER */}
                                            <TouchableOpacity
                                                style={styles.uploadBtn}
                                            >
                                                <MaterialIcons
                                                    name="upload-file"
                                                    size={20}
                                                    color={colors.primary}
                                                />

                                                <Text style={styles.uploadText}>
                                                    Upload ID Proof
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                    )
                                }

                            </View>
                        ))
                    }

                    {/* ================= ADD GUEST ================= */}

                    {
                        guestDetails.length < guests && (

                            <TouchableOpacity
                                style={styles.addGuestBtn}
                                onPress={addGuest}
                            >

                                <MaterialIcons
                                    name="add"
                                    size={18}
                                    color={colors.primary}
                                />

                                <Text style={styles.addGuestText}>
                                    Add Other Guest
                                </Text>

                            </TouchableOpacity>
                        )
                    }

                </View>

                {/* ================= ARRIVAL ================= */}

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Additional Information
                    </Text>

                    <TextInput
                        placeholder="Special Request (Optional)"
                        placeholderTextColor="#999"
                        multiline
                        style={[
                            styles.input,
                            { height: 90 }
                        ]}
                    />

                    <View style={styles.infoContainer}>

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="badge"
                                size={18}
                                color={colors.primary}
                            />

                            <Text style={styles.infoText}>
                                Valid ID proof required during check-in
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="login"
                                size={18}
                                color={colors.primary}
                            />

                            <Text style={styles.infoText}>
                                Check-in Time: 12:00 PM
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="logout"
                                size={18}
                                color={colors.primary}
                            />

                            <Text style={styles.infoText}>
                                Check-out Time: 11:00 AM
                            </Text>
                        </View>

                        {
                            paymentType === "partial" && (
                                <View style={styles.infoRow}>
                                    <MaterialIcons
                                        name="payments"
                                        size={18}
                                        color={colors.primary}
                                    />

                                    <Text style={styles.infoText}>
                                        Remaining payment payable at property
                                    </Text>
                                </View>
                            )
                        }

                    </View>

                </View>

                {/* ================= PAYMENT OPTIONS ================= */}

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Payment Options
                    </Text>

                    {/* ================= FULL PAYMENT ================= */}

                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[
                            styles.paymentCard,
                            paymentType === "full"
                            &&
                            styles.activeCard
                        ]}
                        onPress={() =>
                            setPaymentType("full")
                        }
                    >

                        <View style={styles.radioOuter}>
                            {
                                paymentType === "full"
                                &&
                                <View style={styles.radioInner} />
                            }
                        </View>

                        <View style={{ flex: 1 }}>

                            <Text style={styles.paymentTitle}>
                                Pay Full Amount
                            </Text>

                            <Text style={styles.paymentSubtitle}>
                                Instant booking confirmation
                            </Text>

                        </View>

                        <Text style={styles.paymentAmount}>
                            ₹{totalAmount}
                        </Text>

                    </TouchableOpacity>

                    {/* ================= PARTIAL PAYMENT ================= */}

                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[
                            styles.paymentCard,
                            paymentType === "partial"
                            &&
                            styles.activeCard
                        ]}
                        onPress={() =>
                            setPaymentType("partial")
                        }
                    >

                        <View style={styles.radioOuter}>
                            {
                                paymentType === "partial"
                                &&
                                <View style={styles.radioInner} />
                            }
                        </View>

                        <View style={{ flex: 1 }}>

                            <Text style={styles.paymentTitle}>
                                Reserve Now
                            </Text>

                            <Text style={styles.paymentSubtitle}>
                                Pay remaining at hotel check-in
                            </Text>

                            <Text style={styles.remainingText}>
                                Remaining ₹{remainingAmount} at hotel
                            </Text>

                        </View>

                        <Text style={styles.paymentAmount}>
                            ₹{partialAmount}
                        </Text>

                    </TouchableOpacity>

                </View>

                {/* ================= PRICE DETAILS ================= */}

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Price Details
                    </Text>

                    <View style={styles.priceRow}>

                        <Text style={styles.priceLabel}>
                            Room Charges
                        </Text>

                        <Text style={styles.priceValue}>
                            ₹{roomPrice}
                        </Text>

                    </View>

                    <View style={styles.priceRow}>

                        <Text style={styles.priceLabel}>
                            Service Fee
                        </Text>

                        <Text style={styles.priceValue}>
                            ₹{serviceFee}
                        </Text>

                    </View>

                    <View style={styles.priceRow}>

                        <Text style={styles.priceLabel}>
                            Donation
                        </Text>

                        <Text style={styles.priceValue}>
                            ₹{donation}
                        </Text>

                    </View>

                    <View style={styles.divider} />

                    <View style={styles.priceRow}>

                        <Text style={styles.totalLabel}>
                            Total Amount
                        </Text>

                        <Text style={styles.totalValue}>
                            ₹{totalAmount}
                        </Text>

                    </View>

                </View>

            </ScrollView>

            {/* ================= BOTTOM BUTTON ================= */}

            <View style={styles.bottomContainer}>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.bookNowBtn}
                    onPress={handleBookNow}
                >

                    <Text style={styles.bookNowText}>

                        {
                            paymentType === "partial"
                                ? `Pay ₹${partialAmount}`
                                : `Pay ₹${totalAmount}`
                        }

                    </Text>

                </TouchableOpacity>

            </View>

        </View>

    );
};

export default CreateBookingScreen;

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

    uploadBtn: {
        height: 52,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors.primary,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 14,
    },

    uploadText: {
        marginLeft: 8,
        color: colors.primary,
        fontFamily: "Poppins-SemiBold",
    },

    headerTitle: {
        color: "#FFF",
        fontSize: 18,
        flex: 1,
        textAlign: "center",
        fontFamily: "Poppins-SemiBold",
    },


    backBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },

    // ================= ROOM CARD =================

    roomCard: {
        backgroundColor: "#FFF",
        margin: 16,
        borderRadius: 18,
        padding: 14,
        elevation: 3,
    },

    roomTopRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    roomContent: {
        flex: 1,
        marginLeft: 12,
    },

    roomImage: {
        width: 110,
        height: 110,
        borderRadius: 14,
    },

    roomName: {
        fontSize: 17,
        color: "#111",
        fontFamily: "Poppins-Bold",
    },

    roomLocation: {
        fontSize: 13,
        color: "#777",
        marginTop: 2,
        fontFamily: "Poppins-Regular",
    },

    roomPrice: {
        fontSize: 20,
        color: "#FF7A00",
        marginTop: 8,
        fontFamily: "Poppins-Bold",
    },

    night: {
        fontSize: 13,
        color: "#777",
        fontFamily: "Poppins-Regular",
    },

    // ================= DATE =================

    dateRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 18,
    },

    dateBox: {
        alignItems: "center",
    },

    dateLabel: {
        fontSize: 11,
        color: "#777",
        marginTop: 6,
        fontFamily: "Poppins-Regular",
    },

    dateCard: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: "center",
        backgroundColor: "#FFF",
        marginHorizontal: 4,
    },

    dateValue: {
        fontSize: 12,
        color: "#111",
        marginTop: 4,
        textAlign: "center",
        fontFamily: "Poppins-SemiBold",
    },

    // ================= SECTION =================

    section: {
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 18,
        padding: 18,
    },

    sectionTitle: {
        fontSize: 17,
        color: "#111",
        marginBottom: 16,
        fontFamily: "Poppins-SemiBold",
    },

    // ================= INPUT =================

    input: {
        height: 54,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 14,
        color: "#111",
        marginBottom: 14,
        backgroundColor: "#FFF",
        fontFamily: "Poppins-Regular",
    },

    // ================= ADD GUEST =================

    addGuestBtn: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginTop: 4,
    },

    addGuestText: {
        color: colors.primary,
        marginLeft: 4,
        fontFamily: "Poppins-SemiBold",
    },

    // ================= PAYMENT =================

    paymentCard: {
        borderWidth: 1.5,
        borderColor: "#E6E6E6",
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },

    activeCard: {
        borderColor: colors.primary,
        backgroundColor: "#FFF7F9",
    },

    infoContainer: {
        marginTop: 8,
        backgroundColor: "#FFF8F2",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#FFE4CC",
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },

    infoText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 13,
        lineHeight: 20,
        color: "#555",
        fontFamily: "Poppins-Regular",
    },

    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },

    paymentTitle: {
        fontSize: 15,
        color: "#111",
        fontFamily: "Poppins-Bold",
    },

    paymentSubtitle: {
        fontSize: 13,
        color: "#777",
        marginTop: 4,
        fontFamily: "Poppins-Regular",
    },

    remainingText: {
        fontSize: 13,
        color: "#B74459",
        marginTop: 6,
        fontFamily: "Poppins-SemiBold",
    },

    paymentAmount: {
        fontSize: 20,
        color: colors.primary,
        fontFamily: "Poppins-Bold",
    },

    // ================= PRICE =================

    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 14,
    },

    priceLabel: {
        fontSize: 14,
        color: "#555",
        fontFamily: "Poppins-Regular",
    },

    priceValue: {
        fontSize: 14,
        color: "#111",
        fontFamily: "Poppins-SemiBold",
    },

    divider: {
        height: 1,
        backgroundColor: "#ECECEC",
        marginVertical: 10,
    },

    totalLabel: {
        fontSize: 17,
        color: "#111",
        fontFamily: "Poppins-Bold",
    },

    totalValue: {
        fontSize: 20,
        color: colors.primary,
        fontFamily: "Poppins-Bold",
    },

    // ================= BOTTOM =================

    bottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFF",
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#EEE",
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