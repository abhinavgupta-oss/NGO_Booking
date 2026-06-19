import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { colors } from "../../../utility/AppTheam";
import CustomButton from "../../../Component/formComponent/CustomButton";

interface InvoiceModalProps {
    visible: boolean;
    onClose: () => void;
    booking: any;
}

const TransactionModel = ({
    visible,
    onClose,
    booking,
}: InvoiceModalProps) => {
    if (!booking) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <MaterialIcons
                                name="receipt-long"
                                size={28}
                                color={colors.primary}
                            />

                            <Text style={styles.title}>
                                Booking Invoice
                            </Text>
                        </View>

                        <Text style={styles.receiptNo}>
                            Receipt No: {booking?.receiptNumber}
                        </Text>

                        {/* Devotee */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Devotee Details
                            </Text>

                            <Text style={styles.value}>
                                {booking?.devoteeName}
                            </Text>

                            <Text style={styles.value}>
                                {booking?.mobileNumber}
                            </Text>

                            <Text style={styles.value}>
                                {booking?.email}
                            </Text>
                        </View>

                        {/* Booking */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Booking Details
                            </Text>

                            <InfoRow
                                label="Booking No"
                                value={booking?.bookingNumber}
                            />

                            <InfoRow
                                label="Booking Date"
                                value={booking?.bookingDate}
                            />

                            <InfoRow
                                label="Room"
                                value={`${booking?.roomNumber} (${booking?.roomTypeName})`}
                            />

                            <InfoRow
                                label="Check In"
                                value={booking?.checkInDate}
                            />

                            <InfoRow
                                label="Check Out"
                                value={booking?.checkOutDate}
                            />

                            <InfoRow
                                label="Guests"
                                value={booking?.totalGuests}
                            />
                        </View>

                        {/* Payment */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Payment Details
                            </Text>

                            <InfoRow
                                label="Payment Type"
                                value={booking?.paymentType}
                            />

                            <InfoRow
                                label="Status"
                                value={booking?.paymentStatus}
                            />

                            <InfoRow
                                label="Transaction"
                                value={
                                    booking?.transactionId || "-"
                                }
                            />

                            {!!booking?.referenceId && (
                                <InfoRow
                                    label="Reference Id"
                                    value={booking?.referenceId}
                                />
                            )}
                        </View>

                        {/* Amount Summary */}
                        <View style={styles.amountCard}>
                            <InfoRow
                                label="Total Amount"
                                value={`₹${booking?.totalAmount}`}
                            />

                            <InfoRow
                                label="Paid Amount"
                                value={`₹${booking?.amountReceived}`}
                            />

                            <InfoRow
                                label="Remaining"
                                value={`₹${booking?.remainingAmount}`}
                            />
                        </View>

                        <View style={styles.statusBox}>
                            <MaterialIcons
                                name="verified"
                                size={26}
                                color="#22C55E"
                            />
                            <Text style={styles.statusText}>
                                Booking Status : {booking?.statusName}
                            </Text>
                        </View>

                        <CustomButton
                            title="Close"
                            onPress={onClose}
                            buttonStyle={styles.closeBtn}
                        />

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

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

export default TransactionModel;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "center",
        padding: 16,
    },

    container: {
        backgroundColor: "#FFF",
        borderRadius: 24,
        maxHeight: "95%",
        padding: 20,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    title: {
        marginLeft: 10,
        fontSize: 22,
        color: "#111",
        fontFamily: "Poppins-Bold",
    },

    receiptNo: {
        textAlign: "center",
        color: "#666",
        marginTop: 6,
        marginBottom: 20,
    },

    section: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#EFEFEF",
        paddingBottom: 12,
    },

    sectionTitle: {
        fontSize: 16,
        marginBottom: 12,
        color: "#111",
        fontFamily: "Poppins-SemiBold",
    },

    value: {
        color: "#444",
        marginBottom: 4,
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

    amountCard: {
        backgroundColor: "#F8FAFC",
        padding: 16,
        borderRadius: 16,
    },

    statusBox: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15,
        backgroundColor: "#DCFCE7",
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
    },

    statusText: {
        color: "#15803D",
        fontFamily: "Poppins-Bold",
    },

    closeBtn: {
        marginTop: 20,
    },

    closeText: {
        color: "#FFF",
        fontSize: 16,
        fontFamily: "Poppins-Bold",
    },
});



