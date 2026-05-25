// src/screens/MyDonationScreen.tsx

import React, { useEffect, useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Image,
} from "react-native";

import MaterialIcons from "@react-native-vector-icons/material-icons";

import { useNavigation } from "@react-navigation/native";
import { DevoteemyDonation } from "../../../Services/Devotee/DevoteeServices";
import { Icons } from "../../../utility/utility";
import { DevoteeInVoiceDetails } from "../../../Services/Donation/DonationService";
import { colors } from "../../../utility/AppTheam";

const MyDonationScreen = ({ route }) => {

    const navigation = useNavigation();
    const [donationList, setDonationList] = useState([]);
    const { userId } = route.params || "";

    useEffect(() => {
        const fetchDonationData = async () => {
            try {
                const FormDonation = {
                    "eUserId": userId,
                }

                const respDonation = await DevoteemyDonation(FormDonation)
                setDonationList(respDonation?.result)
                console.log("respDonation", respDonation)

            } catch (error: any) {
                console.log("Donation Error", error);
            }
        };

        fetchDonationData();
    }, [userId]);

    const handelInvoice = async(url:any)=> {
    try {

        const paymentId = url.split("/").pop();
        const respInvoice = await DevoteeInVoiceDetails(paymentId)
        // console.log("respInvoice",respInvoice)
        navigation.navigate("DevoteeReceipt", { InvoiceDetails: respInvoice?.result })

    } catch (error: any) {
        console.log("Invoice Error", error);
    }
}


// renderDonationItem

const renderDonationItem = ({
    item,
}: any) => {

    const isSuccess =
        item?.paymentStatusName ===
        "Success";

    return (
        <View
            // activeOpacity={0.85}
            style={styles.card}
        >
            {/* TOP */}

            <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                    <Text
                        style={
                            styles.receiptNo
                        }
                    >
                        Receipt No
                    </Text>

                    <Text
                        style={
                            styles.receiptValue
                        }
                    >
                        {
                            item?.receiptNumber
                        }
                    </Text>
                </View>

                <View
                    style={
                        styles.amountBox
                    }
                >
                    <Text
                        style={
                            styles.amount
                        }
                    >
                        ₹{item?.amount}
                    </Text>
                </View>
            </View>

            {/* STATUS */}

            <View
                style={[
                    styles.statusBox,
                    {
                        backgroundColor:
                            isSuccess
                                ? "#E8F8EE"
                                : "#FFF1F1",
                    },
                ]}
            >
                <MaterialIcons
                    name={
                        isSuccess
                            ? "check-circle"
                            : "cancel"
                    }
                    size={18}
                    color={
                        isSuccess
                            ? "#2AA84A"
                            : "#E53935"
                    }
                />

                <Text
                    style={[
                        styles.statusText,
                        {
                            color:
                                isSuccess
                                    ? "#2AA84A"
                                    : "#E53935",
                        },
                    ]}
                >
                    {
                        item?.paymentStatusName
                    }
                </Text>
            </View>

            <View style={styles.divider} />

            {/* DETAILS */}

            <View style={styles.infoRow}>
                <Text style={styles.label}>
                    Seva
                </Text>

                <Text style={styles.value}>
                    {item?.sevaName}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>
                    Payment Date
                </Text>

                <Text style={styles.value}>
                    {
                        item?.paymentDate
                    }
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>
                    Payment Type
                </Text>

                <Text style={styles.value}>
                    {
                        item?.paymentTypeName
                    }
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>
                    Mobile
                </Text>

                <Text style={styles.value}>
                    {
                        item?.userMobile
                    }
                </Text>
            </View>

            {/* BUTTONS */}

            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={
                        styles.receiptBtn
                    }
                    onPress={() => {handelInvoice(item?.uiBasePath) }}
                >
                    <MaterialIcons
                        name="receipt-long"
                        size={18}
                        color="#FFF"  
                    />

                    <Text
                        style={
                            styles.receiptBtnText
                        }
                    >
                        View Receipt
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.shareBtn}
                >
                    <MaterialIcons
                        name="share"
                        size={18}
                        color="#FFF"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

return (
    <View style={styles.container}>
        <StatusBar
            backgroundColor="#F5F6FA"
            barStyle="dark-content"
        />

        {/* HEADER */}

        <View style={styles.headerRow}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <Image
                    source={Icons.LeftSolid}
                    style={styles.backIcon}
                />
            </TouchableOpacity>

            <Text style={styles.headerText}>
                Donation
            </Text>

            <View style={{ width: 45 }} />
        </View>

        {/* LIST */}

        <FlatList
            data={donationList}
            keyExtractor={(
                item,
                index,
            ) => index.toString()}
            renderItem={
                renderDonationItem
            }
            showsVerticalScrollIndicator={
                false
            }
            contentContainerStyle={{
                padding: 16,
                paddingBottom: 40,
                flexGrow: 1,
            }}
            ListEmptyComponent={
                <View
                    style={
                        styles.emptyContainer
                    }
                >
                    <MaterialIcons
                        name="volunteer-activism"
                        size={90}
                        color="#D0D5DD"
                    />

                    <Text
                        style={
                            styles.emptyTitle
                        }
                    >
                        No Donations Yet
                    </Text>

                    <Text
                        style={
                            styles.emptySubTitle
                        }
                    >
                        Your donation history
                        will appear here
                    </Text>
                </View>
            }
        />
    </View>
);
};

export default MyDonationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6FA",
    },


    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 15,
        backgroundColor: "#FFF",
        elevation: 2,
    },

    backButton: {
        width: 45,
        height: 45,
        borderRadius: 22,
        backgroundColor: "#FFF4EC",
        justifyContent: "center",
        alignItems: "center",
    },

    backIcon: {
        width: 20,
        height: 20,
        resizeMode: "contain",
    },

    headerText: {
        fontSize: 20,
        color: "#111",
        fontFamily: "Poppins-SemiBold",
    },

    card: {
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },

    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    receiptNo: {
        fontSize: 13,
        color: "#666",
    },

    receiptValue: {
        marginTop: 4,
        fontSize: 15,
        fontWeight: "700",
        color: "#111",
    },

    amountBox: {
        backgroundColor: "#FFF3E8",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },

    amount: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.primary,
    },

    divider: {
        height: 1,
        backgroundColor: "#EEE",
        marginVertical: 16,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    label: {
        fontSize: 14,
        color: "#666",
    },

    value: {
        fontSize: 14,
        color: "#111",
        fontWeight: "600",
    },

    viewBtn: {
        marginTop: 12,
        height: 48,
        borderRadius: 14,
        backgroundColor: colors.primary,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    viewBtnText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "700",
        marginLeft: 8,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 120,
    },

    emptyTitle: {
        marginTop: 20,
        fontSize: 22,
        fontWeight: "700",
        color: "#111",
    },

    emptySubTitle: {
        marginTop: 8,
        fontSize: 15,
        color: "#777",
        textAlign: "center",
        lineHeight: 22,
    },

    statusBox: {
        marginTop: 14,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 30,
    },

    statusText: {
        marginLeft: 6,
        fontSize: 13,
        fontWeight: "700",
    },

    actionRow: {
        flexDirection: "row",
        marginTop: 16,
    },

    receiptBtn: {
        flex: 1,
        height: 48,
        borderRadius: 14,
        backgroundColor: colors.primary,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    receiptBtnText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "700",
        marginLeft: 8,
    },

    shareBtn: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "#2AA84A",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#FFF",
    },

    modalHeader: {
        height: 90,
        backgroundColor: colors.primary,

        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",

        paddingHorizontal: 18,
        paddingBottom: 14,
    },

    modalTitle: {
        fontSize: 20,
        color: "#FFF",
        fontFamily: "Poppins-SemiBold",
    },

    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,

        backgroundColor:
            "rgba(255,255,255,0.25)",

        justifyContent: "center",
        alignItems: "center",
    },
});