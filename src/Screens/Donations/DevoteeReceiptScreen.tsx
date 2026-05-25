import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    StatusBar,
} from "react-native";

import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utility/AppTheam";

const DevoteeReceiptScreen = ({ route }) => {
    const navigation = useNavigation()
    const { InvoiceDetails } = route.params;
    const receiptData = InvoiceDetails
    console.log("InvoiceDetails", InvoiceDetails)
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#FFF"
                barStyle="dark-content"
            />

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={{
                    paddingBottom: 40,
                }}
            >
                <View>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons
                            name="arrow-back-ios-new"
                            size={22}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                </View>
                {/* HEADER */}

                <View style={styles.header}>
                    <Image
                        source={{
                            uri: receiptData.logoUrl,
                        }}
                        style={styles.logo}
                    />

                    <View
                        style={{
                            flex: 1,
                            marginLeft: 12,
                        }}
                    >
                        <Text
                            style={
                                styles.orgName
                            }
                        >
                            {
                                receiptData.organizationName
                            }
                        </Text>

                        <Text
                            style={
                                styles.operatedBy
                            }
                        >
                            Operated By
                        </Text>

                        <Text
                            style={
                                styles.trustName
                            }
                        >
                            {
                                receiptData.operatedBy
                            }
                        </Text>
                    </View>
                </View>

                {/* RECEIPT CARD */}

                <View style={styles.card}>
                    <View
                        style={
                            styles.receiptHeader
                        }
                    >
                        <Text
                            style={
                                styles.receiptTitle
                            }
                        >
                            Donation Receipt
                        </Text>

                        <MaterialIcons
                            name="verified"
                            size={28}
                            color="#2DBE60"
                        />
                    </View>

                    {/* RECEIPT INFO */}

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Receipt No
                        </Text>

                        <Text
                            style={
                                styles.value
                            }
                        >
                            {
                                receiptData.receiptNumber
                            }
                        </Text>
                    </View>

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Donation Date
                        </Text>

                        <Text
                            style={
                                styles.value
                            }
                        >
                            {
                                receiptData.donationDate
                            }
                        </Text>
                    </View>

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Financial Year
                        </Text>

                        <Text
                            style={
                                styles.value
                            }
                        >
                            {
                                receiptData.financialYear
                            }
                        </Text>
                    </View>

                    <View
                        style={
                            styles.separator
                        }
                    />

                    {/* DONOR */}

                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Donor Details
                    </Text>

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Name
                        </Text>

                        <Text
                            style={
                                styles.value
                            }
                        >
                            {
                                receiptData.donorName
                            }
                        </Text>
                    </View>

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Mobile
                        </Text>

                        <Text
                            style={
                                styles.value
                            }
                        >
                            {
                                receiptData.mobileNumber
                            }
                        </Text>
                    </View>

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            PAN
                        </Text>

                        <Text
                            style={
                                styles.value
                            }
                        >
                            {receiptData.pan}
                        </Text>
                    </View>

                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Address
                        </Text>

                        <Text
                            style={
                                styles.address
                            }
                        >
                            {
                                receiptData.donorAddress
                            }
                        </Text>
                    </View>

                    <View
                        style={
                            styles.separator
                        }
                    />

                    {/* DONATION */}

                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Donation Details
                    </Text>

                    <View
                        style={
                            styles.amountBox
                        }
                    >
                        <Text
                            style={
                                styles.amountLabel
                            }
                        >
                            Donation Amount
                        </Text>

                        <Text
                            style={
                                styles.amount
                            }
                        >
                            ₹
                            {
                                receiptData.amount
                            }
                        </Text>

                        <Text
                            style={
                                styles.amountWords
                            }
                        >
                            {
                                receiptData.amountInWords
                            }
                        </Text>
                    </View>

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Purpose
                        </Text>

                        <Text
                            style={
                                styles.value
                            }
                        >
                            {
                                receiptData.purpose
                            }
                        </Text>
                    </View>

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Payment Type
                        </Text>

                        <Text
                            style={
                                styles.value
                            }
                        >
                            {
                                receiptData.paymentType
                            }
                        </Text>
                    </View>

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Bank Name
                        </Text>

                        <Text
                            style={
                                styles.value
                            }
                        >
                            {
                                receiptData.bankName
                            }
                        </Text>
                    </View>

                    <View
                        style={
                            styles.separator
                        }
                    />

                    {/* 80G */}

                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        80G Information
                    </Text>

                    <Text
                        style={
                            styles.taxText
                        }
                    >
                        {
                            receiptData.section80GNumber
                        }
                    </Text>

                    <Text
                        style={
                            styles.taxText
                        }
                    >
                        Valid:
                        {" "}
                        {
                            receiptData.section80GValidFrom
                        }
                        {" "}
                        to
                        {" "}
                        {
                            receiptData.section80GValidTo
                        }
                    </Text>
                </View>

                {/* BUTTONS */}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={
                            styles.downloadBtn
                        }
                    >
                        <MaterialIcons
                            name="download"
                            size={22}
                            color="#FFF"
                        />

                        <Text
                            style={
                                styles.btnText
                            }
                        >
                            Download
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.shareBtn
                        }
                    >
                        <MaterialIcons
                            name="share"
                            size={22}
                            color="#FFF"
                        />

                        <Text
                            style={
                                styles.btnText
                            }
                        >
                            Share
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default DevoteeReceiptScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F6F8",
    },

    backButton: {
        position: "absolute",
        top: 30,
        left: 16,

        width: 42,
        height: 42,
        borderRadius: 21,

        backgroundColor: colors.primary,

        justifyContent: "center",
        alignItems: "center",

        zIndex: 999,
        elevation: 8,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        padding: 16,
    },

    logo: {
        width: 70,
        height: 70,
        borderRadius: 12,
    },

    orgName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
    },

    operatedBy: {
        marginTop: 4,
        fontSize: 13,
        color: "#666",
    },

    trustName: {
        marginTop: 2,
        fontSize: 13,
        color: colors.primary,
        fontWeight: "600",
    },

    card: {
        backgroundColor: "#FFF",
        margin: 16,
        borderRadius: 18,
        padding: 18,
        elevation: 3,
    },

    receiptHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    receiptTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        marginBottom: 14,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    label: {
        fontSize: 14,
        color: "#666",
    },

    value: {
        fontSize: 14,
        color: "#111",
        fontWeight: "600",
        width: "55%",
        textAlign: "right",
    },

    separator: {
        height: 1,
        backgroundColor: "#EEE",
        marginVertical: 20,
    },

    address: {
        marginTop: 6,
        fontSize: 14,
        color: "#111",
        lineHeight: 22,
    },

    amountBox: {
        backgroundColor: "#FFF7EE",
        borderRadius: 14,
        padding: 18,
        alignItems: "center",
        marginBottom: 18,
    },

    amountLabel: {
        fontSize: 15,
        color: "#666",
    },

    amount: {
        fontSize: 38,
        fontWeight: "700",
        color: colors.primary,
        marginVertical: 6,
    },

    amountWords: {
        fontSize: 14,
        color: "#444",
    },

    taxText: {
        fontSize: 14,
        color: "#333",
        marginBottom: 8,
        lineHeight: 22,
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },

    downloadBtn: {
        width: "48%",
        height: 55,
        backgroundColor: colors.primary,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    shareBtn: {
        width: "48%",
        height: 55,
        backgroundColor: "#2AA84A",
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    btnText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
});