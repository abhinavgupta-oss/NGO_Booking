import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Pressable,
} from "react-native";

import CommonHeader from "../../../Component/Header/CommonHeader";
import { colors } from "../../../utility/AppTheam";
import CustomeLoading from "../../../Component/Loading/CustomeLoading";
import { myBalancePayment, mybookingInvoice, myBookingPayment } from "../../../Services/Booking/BookingService";
import { useBookingStore } from "../../../Stores/useBookingStore";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import TransactionModel from "./TransactionModel";
import WebViewModel from "../../../Component/ScreenComponent/WebViewModel";
const screenWidth = Dimensions.get("window").width;

const BookingDetails = ({ route }) => {
    const { bookingId } = route.params;

    const [PaymentHitory, setPaymentHistory] = useState([])
    const [InviceDetails, setInviceDetails] = useState([])
    const [PaymentUrl, setPaymentUrl] = useState("")

    const [showTransaction, setShowTransaction] = useState(false)
    const [invoiceVisible, setInvoiceVisible] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const { BookingmyDetails, loading, fetchMyBookingDetails, } = useBookingStore();

    useEffect(() => {
        const roomDetails = async () => {
            try {
                console.log("Fetching Room Details for ID:", bookingId);

                const response = await fetchMyBookingDetails(bookingId);

                console.log("RoomDetails Response:", response);

                const bookingIdValue =
                    response?.bookingId || response?.result?.bookingId;

                console.log("bookingId:", bookingIdValue);

                if (bookingIdValue) {
                    const paymentResp = await myBookingPayment({
                        bookingId: bookingIdValue,
                    });

                    setPaymentHistory(paymentResp);

                    console.log(
                        "Payment History Response:",
                        paymentResp
                    );
                }
            } catch (error) {
                console.log("RoomDetails Error:", error);
            }
        };

        if (bookingId) {
            roomDetails();
        }
    }, [bookingId,fetchMyBookingDetails]);


    const PayBalanceAmmount = async () => {
        try {
            const PayBalance = {
                "paymentModeId": 1,
                "bookingId": BookingmyDetails?.bookingId,
                "amountReceived": BookingmyDetails?.remainingAmount,
            }
            const resp = await myBalancePayment(PayBalance)
            console.log(resp)
            setShowPaymentModal(true)
            setPaymentUrl(resp?.paymentUrl)
        } catch (error: any) {
            console.log("RoomDetails Error:", error);
        } finally {

        }
    }

    const invoiceDetails = async (id: any) => {
        try {
            const resp = await mybookingInvoice(id)
            console.log("invoiceDetails", resp)
            setInviceDetails(resp?.result)
            setInvoiceVisible(true)
        } catch (error: any) {
            console.log("RoomDetails Error:", error);
        } finally {

        }
    }

    const room = BookingmyDetails || {};

    const amenities =
        room?.amenities?.filter((item: any) => item.isAssigned) || [];


    const renderCard = ({ item }: any) => {
        const balance =
            (item?.amount || 0) -
            (item?.amountReceived || 0);

        return (
            <View style={styles.paymentCard}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <Text style={styles.receiptNo}>
                        {item.receiptNumber}
                    </Text>

                    <View
                        style={[
                            styles.statusBadge,
                            {
                                backgroundColor:
                                    item.paymentStatus === "Success"
                                        ? "#DCFCE7"
                                        : "#FEE2E2",
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                {
                                    color:
                                        item.paymentStatus === "Success"
                                            ? "#15803D"
                                            : "#DC2626",
                                },
                            ]}
                        >
                            {item.paymentStatus}
                        </Text>
                    </View>
                </View>

                {/* Booking */}
                {/* <Text style={styles.bookingNo}>
                                        {item.bookingNumber}
                                    </Text> */}

                {/* Payment Type */}
                <View style={styles.infoRow}>
                    <Text style={styles.label}>
                        Payment Type
                    </Text>
                    <Text style={styles.value}>
                        {item.paymentType}
                    </Text>
                </View>

                {/* Date */}
                <View style={styles.infoRow}>
                    <Text style={styles.label}>
                        Payment Date
                    </Text>
                    <Text style={styles.value}>
                        {item.paymentDate}
                    </Text>
                </View>

                {/* Transaction */}
                {item.transactionId && (
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>
                            Transaction Id
                        </Text>
                        <Text style={styles.value}>
                            {item.transactionId}
                        </Text>
                    </View>
                )}

                {item.referenceId && (
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>
                            Reference Id
                        </Text>
                        <Text style={styles.value}>
                            {item.referenceId}
                        </Text>
                    </View>
                )}

                {/* Amounts */}
                <View style={styles.amountContainer}>
                    <View style={styles.amountBox}>
                        <Text style={styles.amountTitle}>
                            Amount
                        </Text>
                        <Text style={styles.amountValue}>
                            ₹{item.amount}
                        </Text>
                    </View>

                    <View style={styles.amountBox}>
                        <Text style={styles.amountTitle}>
                            Received
                        </Text>
                        <Text
                            style={[
                                styles.amountValue,
                                { color: "#16A34A" },
                            ]}
                        >
                            ₹{item.amountReceived}
                        </Text>
                    </View>
                    {balance && (
                        <View style={styles.amountBox}>
                            <Text style={styles.amountTitle}>
                                Balance
                            </Text>
                            <Text
                                style={[
                                    styles.amountValue,
                                    { color: "#DC2626" },
                                ]}
                            >
                                ₹{balance}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Comment */}
                {!!item.comment && (
                    <View style={styles.commentBox}>
                        <Text style={styles.commentLabel}>
                            Comment
                        </Text>

                        <Text style={styles.commentText}>
                            {item.comment}
                        </Text>
                    </View>
                )}
                <View style={styles.divider} />

                <Pressable style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => invoiceDetails(item?.paymentId)}>

                    <MaterialIcons
                        name="receipt-long"
                        size={28}
                        color={colors.primary}
                    />
                    <Text style={{ ...styles.commentLabel, fontSize: 20 }}>
                        View Invoice
                    </Text>
                </Pressable>
            </View>
        );
    }

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

                <View style={styles.infoCard}>

                    <Text style={styles.roomName}>
                        {room?.roomNumber} {room?.roomTypeName}
                    </Text>

                    <View style={styles.quickInfoRow}>
                        <View style={styles.quickChip}>
                            <MaterialIcons
                                name="people"
                                size={16}
                                color={colors.primary}
                            />
                            <Text style={styles.quickChipText}>
                                {room?.totalGuests || 0} Guests
                            </Text>
                        </View>

                        <View style={styles.quickChip}>
                            <MaterialIcons
                                name="receipt"
                                size={16}
                                color={colors.primary}
                            />
                            <Text style={styles.quickChipText}>
                                {room?.bookingNumber}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ROOM FEATURES */}
                <Text style={styles.sectionTitle}>
                    Amenities
                </Text>

                <View style={styles.iconRowContainer}>
                    {amenities.map((item: any, index: number) => (
                        <View style={styles.itemContainer}
                            key={index}>
                            <View style={styles.amenityPremiumCard}>
                                <MaterialIcons
                                    name={item.icon}
                                    color="#8a8686"
                                    size={28}
                                />
                                <Text style={styles.amenityText}>
                                    {item.name}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* SPECIAL REQUEST */}

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Special Request</Text>
                    <Text style={styles.cardValue}>
                        {room?.specialRequest || "No special request"}
                    </Text>
                </View>

                {/* DATE DETAILS */}
                <Text style={styles.sectionTitle}>Stay Details</Text>

                <View style={styles.dateContainer}>
                    <View style={styles.newDateCard}>
                        <MaterialIcons
                            name="login"
                            size={24}
                            color={colors.primary}
                        />
                        <Text style={styles.dateLabel}>Check In</Text>
                        <Text style={styles.dateValue}>
                            {room?.checkInDate}
                        </Text>
                    </View>

                    <View style={styles.newDateCard}>
                        <MaterialIcons
                            name="logout"
                            size={24}
                            color={colors.primary}
                        />
                        <Text style={styles.dateLabel}>Check Out</Text>
                        <Text style={styles.dateValue}>
                            {room?.checkOutDate}
                        </Text>
                    </View>
                </View>

                {/* BOOKING STATUS */}
                <View style={styles.statusCard}>
                    <MaterialIcons
                        name="verified"
                        size={26}
                        color="#22C55E"
                    />

                    <View>
                        <Text style={styles.statusLabel}>
                            Booking Status
                        </Text>

                        <Text style={styles.statusValue}>
                            {room?.statusName}
                        </Text>
                    </View>
                </View>

                {/* PAYMENT SUMMARY */}
                <View style={styles.paymentCard}>
                    <Text style={styles.paymentTitle}>
                        Pricing Summary
                    </Text>

                    <View style={styles.paymentRow}>
                        <Text>Room Price</Text>
                        <Text>₹{room?.roomPrice}</Text>
                    </View>

                    {room?.discountPercentage && (
                        <View style={styles.paymentRow}>
                            <Text>discountPercentage</Text>
                            <Text>-₹{room?.discountPercentage}</Text>
                        </View>
                    )}


                    {room?.flatDiscount && (
                        <View style={styles.paymentRow}>
                            <Text>flatDiscount</Text>
                            <Text>- ₹{room?.flatDiscount}</Text>
                        </View>
                    )}


                    {room?.totalPrice && (
                        <View style={styles.paymentRow}>
                            <Text>Total Price</Text>
                            <Text>₹{room?.totalPrice}</Text>
                        </View>
                    )}
                    {room?.serviceFee && (
                        <View style={styles.paymentRow}>
                            <Text>Service Fee</Text>
                            <Text>₹{room?.serviceFee}</Text>
                        </View>
                    )}
                    {room?.tokenPercentage && (
                        <View style={styles.paymentRow}>
                            <Text>Token %</Text>
                            <Text>{room?.tokenPercentage}%</Text>
                        </View>
                    )}

                    <View style={styles.divider} />


                    <View style={styles.paymentRow}>
                        <Text style={styles.totalLabel}>
                            Total Amount
                        </Text>

                        <Text style={styles.totalValue}>
                            ₹{room?.totalAmount}
                        </Text>
                    </View>
                </View>

                {/* PAYMENT SUMMARY */}
                <View style={styles.paymentCard}>
                    <Text style={styles.paymentTitle}>
                        Payment Summary
                    </Text>

                    {room?.amountReceived && (
                        <View style={styles.paymentRow}>
                            <Text>Paid Amount</Text>
                            <Text style={{ color: "#22C55E" }}>
                                ₹{room?.amountReceived}
                            </Text>
                        </View>
                    )}

                    {room?.remainingAmount && (
                        <View style={styles.paymentRow}>
                            <Text style={styles.totalLabel}>
                                Remaining
                            </Text>

                            <Text
                                style={[
                                    styles.totalValue,
                                    { color: "#EF4444" }
                                ]}
                            >
                                ₹{room?.remainingAmount}
                            </Text>
                        </View>
                    )}

                    {room?.paymentType && (
                        <View style={styles.paymentRow}>
                            <Text>Payment Type</Text>
                            <Text >
                                {room?.paymentType}
                            </Text>
                        </View>
                    )}
                    {room?.paymentStatus && (
                        <View style={styles.paymentRow}>
                            <Text>Payment Status</Text>
                            <Text >
                                {room?.paymentStatus}
                            </Text>
                        </View>
                    )}

                    <View style={styles.divider} />
                    <View>
                        {Number(room?.remainingAmount) > 0 && (
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onPress={PayBalanceAmmount}
                            >
                                <MaterialIcons
                                    name="payments"
                                    size={26}
                                    color="#16A34A"
                                />

                                <Text
                                    style={{
                                        ...styles.totalLabel,
                                        textAlign: "center",
                                        marginLeft: 8,
                                        color: "#16A34A",
                                    }}
                                >
                                    Pay Remaining ₹{room?.remainingAmount}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 10,
                            }}
                            onPress={() => setShowTransaction(!showTransaction)}
                        >
                            <MaterialIcons
                                name="file-copy"
                                size={26}
                                color={colors.primary}
                            />
                            <Text
                                style={{
                                    ...styles.totalLabel,
                                    textAlign: "center",
                                    marginLeft: 8,
                                }}
                            >
                                View Transaction
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* TRANSACTION  HISTORY */}
                {showTransaction && (
                    <FlatList
                        data={PaymentHitory || []}
                        keyExtractor={(item, index) =>
                            item.paymentId || index.toString()
                        }
                        scrollEnabled={false}
                        renderItem={renderCard}
                    />
                )}


                <CustomeLoading isLoading={loading} />

            </ScrollView>

            <TransactionModel
                visible={invoiceVisible}
                onClose={() => setInvoiceVisible(false)}
                booking={InviceDetails}
            />

            <WebViewModel
                visible={showPaymentModal}
                onClose={() =>
                    setShowPaymentModal(false)
                }
                Details={{
                    paymentUrl: PaymentUrl,
                    screen: "Dashboard"
                }}
            />

        </View>

    );

};

export default BookingDetails;

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

    infoCard: {
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 24,
        padding: 20,
        elevation: 10,
    },

    quickInfoRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 15,
    },

    quickChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F4F7FE",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },

    quickChipText: {
        marginLeft: 6,
        fontSize: 12,
        color: "#444",
        fontFamily: "Poppins-Medium",
    },

    card: {
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginTop: 18,
        padding: 18,
        borderRadius: 20,
        elevation: 4,
    },

    cardTitle: {
        fontSize: 16,
        color: "#111",
        fontFamily: "Poppins-SemiBold",
        marginBottom: 10,
    },

    cardValue: {
        fontSize: 14,
        color: "#666",
        lineHeight: 24,
    },

    newDateCard: {
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 18,
        alignItems: "center",
        elevation: 4,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    infoLabel: {
        color: "#777",
    },

    infoValue: {
        color: "#111",
        fontFamily: "Poppins-Medium",
    },

    statusCard: {
        backgroundColor: "#ECFDF5",
        marginHorizontal: 16,
        marginTop: 18,
        borderRadius: 18,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },

    statusLabel: {
        color: "#666",
        fontSize: 12,
    },

    statusValue: {
        color: "#15803D",
        fontSize: 16,
        fontFamily: "Poppins-Bold",
    },

    paymentCard: {
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginVertical: 9,
        borderRadius: 22,
        padding: 20,
        elevation: 5,
    },

    paymentTitle: {
        fontSize: 18,
        marginBottom: 18,
        fontFamily: "Poppins-Bold",
    },

    paymentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 14,
    },

    divider: {
        height: 1,
        backgroundColor: "#EEE",
        marginVertical: 10,
    },

    totalLabel: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
    },

    totalValue: {
        fontSize: 18,
        color: colors.primary,
        fontFamily: "Poppins-Bold",
    },

    amenityPremiumCard: {
        width: 60,
        height: 80,
        backgroundColor: "#FFF",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },

    amenityText: {
        fontSize: 10,
        marginTop: 8,
        textAlign: "center",
        color: "#666",
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    receiptNo: {
        flex: 1,
        fontSize: 14,
        fontFamily: "Poppins-Bold",
        color: "#111",
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    statusText: {
        fontSize: 12,
        fontFamily: "Poppins-SemiBold",
    },

    bookingNo: {
        marginTop: 8,
        color: colors.primary,
        fontFamily: "Poppins-Medium",
    },

    label: {
        width: "30%",
        color: "#777",
    },

    value: {
        textAlign: "right",
        width: "60%",
        color: "#111",
        fontFamily: "Poppins-Medium",
    },

    amountContainer: {
        flexDirection: "row",
        marginTop: 16,
    },

    amountBox: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 10,
        marginHorizontal: 4,
        alignItems: "center",
    },

    amountTitle: {
        fontSize: 11,
        color: "#666",
    },

    amountValue: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        color: colors.primary,
    },

    commentBox: {
        marginTop: 15,
        backgroundColor: "#FFF8E7",
        padding: 10,
        borderRadius: 10,
    },

    commentLabel: {
        fontFamily: "Poppins-SemiBold",
        color: colors.primary,
    },

    commentText: {
        marginTop: 4,
        color: "#444",
    },

});