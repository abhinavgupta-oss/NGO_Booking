import { FlatList, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../utility/AppTheam";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import {
    useNavigation
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useBookingStore } from "../../../Stores/useBookingStore";
import CommonHeader from "../../../Component/Header/CommonHeader";
import CustomeLoading from "../../../Component/Loading/CustomeLoading";

const MyBookingScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState("upcoming");
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { myBookingList, loading, fetchMyBookingList } = useBookingStore();

    useEffect(() => {
        setPageNumber(1);
        setHasMoreData(true);

        const fetchMyRoomData = async (
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
                    statusId: getStatusId(),
                };

                const response = await fetchMyBookingList(
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
        fetchMyRoomData(1, false);
    }, [activeTab, fetchMyBookingList]);

    const onRefresh = async () => {
        setRefreshing(true);
        setPageNumber(1);
        setHasMoreData(true);
        await fetchMyRoomData(
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

        fetchMyRoomData(
            nextPage,
            true,
        );
    };


    const renderDonationItem = ({ item }: any) => {
        const isBooked = item?.statusName === "Booked";

        return (
            <Pressable style={styles.card} onPress={() => navigation.navigate("BookingDetails", { bookingId: item?.bookingId })}>
                <View style={styles.content}>
                    {/* Room Type */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={styles.roomTitle}>
                                {item?.devoteeName} - {item?.mobileNumber}
                            </Text>
                            <Text>{item?.bookingNumber}</Text>
                        </View>

                        <View
                            style={[
                                styles.statusBadge,
                                {
                                    backgroundColor: isBooked
                                        ? "#E8F5E9"
                                        : "#FFF3E0",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    {
                                        color: isBooked
                                            ? "#2E7D32"
                                            : "#F57C00",
                                    },
                                ]}
                            >
                                {item?.statusName}
                            </Text>
                        </View>
                    </View>
                    {/* Check In / Check Out */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>

                        <View>
                            <Text style={styles.dateText}>
                                Booking
                            </Text>
                            <Text style={styles.dateText}>
                                {item?.bookingDate}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.dateText}>
                                checkIn
                            </Text>
                            <Text style={styles.dateText}>
                                {item?.checkInDate}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.dateText}>
                                check Out
                            </Text>
                            <Text style={styles.dateText}>
                                {item?.checkOutDate}
                            </Text>

                        </View>
                    </View>
                    {/* Devotee Name */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "40%", marginTop: 20 }}>
                        <View style={{ flexDirection: "row" }}>
                            <MaterialIcons name="room-preferences" size={20} />

                            <Text style={styles.infoText}>
                                {item?.roomNumber} {item?.roomTypeName}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <MaterialIcons name="people" size={20} />
                            <Text style={styles.infoText}>
                                {item?.totalGuests}
                            </Text>
                            <View>
                            </View>
                        </View>
                    </View>
                </View>
            </Pressable>

        );
    };

    return (
        <View style={styles.container}>

            <StatusBar
                backgroundColor={colors.primary}
                barStyle="light-content"
            />

            {/* HEADER */}
            <CommonHeader title="My Bookings" />

            {/* ================= HEADER ================= */}

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                        styles.tabBtn,
                        activeTab === "upcoming" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("upcoming")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "upcoming" &&
                            styles.activeTabText,
                        ]}
                    >
                        Upcoming
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                        styles.tabBtn,
                        activeTab === "completed" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("completed")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "completed" &&
                            styles.activeTabText,
                        ]}
                    >
                        Completed
                    </Text>
                </TouchableOpacity>
            </View>



            {/* LIST */}

            <FlatList
                data={myBookingList}
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
                                name="hotel"
                                size={90}
                                color="#D0D5DD"
                            />

                            <Text
                                style={styles.emptyTitle}
                            >
                                No Booking Yet
                            </Text>
                        </View>
                    ) : null
                }
            />

            <CustomeLoading isLoading={loading} />

        </View>
    )
}

export default MyBookingScreen;

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
    tabsContainer: {
        borderRadius: 14,
        padding: 4,
        elevation: 2,
        flexDirection: "row",
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginTop: 18,
        height: 58,
    },

    tabBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: colors.primary,
    },
    tabText: {
        color: "#777",
        fontSize: 14,
        fontFamily: "Poppins-SemiBold",
    },

    activeTabText: {
        color: "#FFF",
    },

    card: {
        backgroundColor: "#FFF",
        marginBottom: 16,
        borderRadius: 18,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    image: {
        width: 95,
        height: 95,
        borderRadius: 14,
        resizeMode: "cover",
    },
    content: {
        flex: 1,
        marginLeft: 4,
        justifyContent: "space-between"
    },
    bookingId: {
        marginTop: 3,
        color: "#888",
        fontSize: 13,
        fontFamily: "Poppins-Regular",
    },
    customerName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
        marginTop: 4,
    },

    infoText: {
        fontSize: 14,
        color: "#666",
        marginTop: 3,
    },

    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
    },

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },

    statusText: {
        fontSize: 12,
        fontWeight: "700",
    },

    price: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.primary,
    },

    roomTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#222",
    },

    dateText: {
        fontFamily: "Poppins-SemiBold",
        color: "#666",

    },

    bookingLabel: {
        fontSize: 13,
        color: "#888",
        marginTop: 4,
    },

    emptyContainer: {
        marginTop: 80,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },


})