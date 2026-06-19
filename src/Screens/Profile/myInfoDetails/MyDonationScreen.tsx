import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    FlatList,
} from "react-native";

import MaterialIcons from "@react-native-vector-icons/material-icons";

import { useNavigation } from "@react-navigation/native";
import { DevoteeInVoiceDetails } from "../../../Services/Donation/DonationService";
import CommonHeader from "../../../Component/Header/CommonHeader";
import { useTheme } from "../../../utility/AppTheam/ThemeContext";
import CustomeLoading from "../../../Component/Loading/CustomeLoading";
import { useDonationStore } from "../../../Stores/useDonationStore";

const MyDonationScreen = ({ route }) => {

    const navigation = useNavigation();
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const { userId } = route.params || "";
    const [refreshing, setRefreshing] = useState(false);
    const { MydonationList, loading, fetchMyDonationList } = useDonationStore();


    const { colors } = useTheme();
    const styles = createStyles(colors);

    useEffect(() => {
        fetchDonationData(1, false);
    }, []);

    const fetchDonationData = async (
        page = 1,
        isLoadMore = false,
    ) => {
        try {
            if (isLoadMore) {
                setIsLoadingMore(true);
            }

            const payload = {
                pageNumber: page,
                pageSize: 10,
                eUserId: userId,
            };

            const response = await fetchMyDonationList(
                payload,
                isLoadMore,
            );

            const newData = response?.result || [];

            setHasMoreData(newData.length === 10);

        } catch (error) {
            console.log(
                "Donation Error =>",
                error,
            );
        } finally {
            setIsLoadingMore(false);
            setRefreshing(false);
        }
    };

    const handelInvoice = async (url: any) => {
        try {

            const paymentId = url.split("/").pop();
            const respInvoice = await DevoteeInVoiceDetails(paymentId)
            // console.log("respInvoice",respInvoice)
            navigation.navigate("DevoteeReceipt", { InvoiceDetails: respInvoice?.result })

        } catch (error: any) {
            console.log(error)
        }
    }


    const onRefresh = async () => {
        setRefreshing(true);

        setPageNumber(1);
        setHasMoreData(true);

        await fetchDonationData(
            1,
            false,
        );
    };

    const loadMore = () => {
        if (
            loading ||
            isLoadingMore ||
            !hasMoreData
        ) {
            return;
        }

        const nextPage =
            pageNumber + 1;

        setPageNumber(nextPage);

        fetchDonationData(
            nextPage,
            true,
        );
    };
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
                        onPress={() => { handelInvoice(item?.uiBasePath) }}
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
            <CommonHeader title="My Donation" />

            {/* LIST */}

            <FlatList
                data={MydonationList}
                renderItem={renderDonationItem}
                keyExtractor={(item, index) =>
                    `${item?.id || index}`
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 40,
                    flexGrow: 1,
                }}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onEndReached={loadMore}
                onEndReachedThreshold={0.3}
                removeClippedSubviews
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                ListFooterComponent={
                    isLoadingMore ? (
                        <View
                            style={{
                                paddingVertical: 20,
                                alignItems: "center",
                            }}
                        >
                            <Text>
                                Loading More...
                            </Text>
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    !loading ? (
                        <View
                            style={styles.emptyContainer}
                        >
                            <MaterialIcons
                                name="volunteer-activism"
                                size={90}
                                color="#D0D5DD"
                            />

                            <Text
                                style={styles.emptyTitle}
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
                    ) : null
                }
            />

            <CustomeLoading isLoading={loading} />

        </View>
    );
};

export default MyDonationScreen;


const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },

        card: {
            backgroundColor: colors.card,
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
            color: colors.text,
        },

        receiptValue: {
            marginTop: 4,
            fontSize: 15,
            fontWeight: "700",
            color: colors.text,
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
            color: colors.text,
        },

        value: {
            fontSize: 14,
            color: colors.text,
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