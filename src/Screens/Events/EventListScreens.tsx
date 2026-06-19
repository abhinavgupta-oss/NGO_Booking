import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    StatusBar,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../../utility/AppTheam";
import { useEventStore } from "../../Stores/useEventStore";
import CustomeLoading from "../../Component/Loading/CustomeLoading";
import CommonHeader from "../../Component/Header/CommonHeader";

interface EventItem {
    id: number;
    title: string;
    bannerURL: string;
    startDate: string;
    endDate: string;
    startTimeHr: string;
    endTimeHr: string;
    venue: string;
    eventTypeName: string;
}

const EventListScreens = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();

    const { eventList, loading: eventLoading, fetchEventList } = useEventStore();


    // 1 = Upcoming | 2 = Ongoing | 3 = Past
    const [selectedType, setSelectedType] = useState<1 | 2 | 3>(
        route?.params?.selectedTab || 1
    );

    useEffect(() => {
        EventList(selectedType);
    }, [selectedType]);

    const EventList = async (typeId: number) => {
        try {

            const eventPayload = {
                eventFilterTypeId: typeId,
                pageNumber: 1,
                pageSize: 10,
                statusId: 2,
            }
            const respList = await fetchEventList(eventPayload);
            console.log("respList", respList);

        } catch (error:any) {
            console.log("Event List Error:", error);
        }
    };

    const renderItem = ({ item }: { item: EventItem }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cardWrapper}
                onPress={() =>
                    navigation.navigate("EventDetails", {
                            eventId: item.id,
                        })
                    }
            >
                <LinearGradient
                    colors={["#FFFFFF", "#FFF7ED"]}
                    style={styles.card}
                >
                    {/* EVENT IMAGE */}

                    <Image
                        source={{ uri: item?.bannerURL }}
                        style={styles.eventImage}
                        resizeMode="cover"
                    />

                    {/* EVENT DETAILS */}

                    <View style={styles.contentContainer}>
                        <Text
                            numberOfLines={1}
                            style={styles.title}
                        >
                            {item.title}
                        </Text>

                        <Text style={styles.eventType}>
                            {item?.eventTypeName}
                        </Text>

                        {/* START DATE */}

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="event"
                                size={16}
                                color="#ED7723"
                            />

                            <Text style={styles.infoText}>
                                {item?.startDate}

                                {item?.startTimeHr && (
                                    <> {" • "}
                                        {item?.startTimeHr}
                                    </>
                                )}


                            </Text>
                        </View>

                        {/* END DATE */}

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="schedule"
                                size={16}
                                color="#ED7723"
                            />

                            <Text style={styles.infoText}>
                                {item?.endDate} {item?.endTimeHr && (
                                    <> {" • "}
                                        {item?.endTimeHr}
                                    </>
                                )}
                            </Text>
                        </View>

                        {/* LOCATION */}

                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="location-on"
                                size={16}
                                color="#ED7723"
                            />

                            <Text
                                numberOfLines={2}
                                style={styles.locationText}
                            >
                                {item?.venue}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor="#FFFFFF"
                barStyle="dark-content"
            />

            {/* HEADER */}

             <CommonHeader title="Events" />

            {/* TOGGLE BUTTON */}

            {/* TOGGLE BUTTON */}

            <View style={styles.toggleContainer}>



                {/* ONGOING */}

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setSelectedType(2)}
                    style={styles.toggleFlex}
                >
                    <LinearGradient
                        colors={
                            selectedType === 2
                                ? ["#ED7723", "#F59E0B"]
                                : ["#FFFFFF", "#FFFFFF"]
                        }
                        style={[
                            styles.toggleButton,
                            selectedType !== 2 &&
                            styles.inactiveButton,
                        ]}
                    >
                        <Text
                            style={[
                                styles.toggleText,
                                {
                                    color:
                                        selectedType === 2
                                            ? "#FFF"
                                            : "#666",
                                },
                            ]}
                        >
                            Ongoing
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* UPCOMING */}

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setSelectedType(1)}
                    style={styles.toggleFlex}
                >
                    <LinearGradient
                        colors={
                            selectedType === 1
                                ? ["#ED7723", "#F59E0B"]
                                : ["#FFFFFF", "#FFFFFF"]
                        }
                        style={[
                            styles.toggleButton,
                            selectedType !== 1 &&
                            styles.inactiveButton,
                        ]}
                    >
                        <Text
                            style={[
                                styles.toggleText,
                                {
                                    color:
                                        selectedType === 1
                                            ? "#FFF"
                                            : "#666",
                                },
                            ]}
                        >
                            Upcoming
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* PAST */}

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setSelectedType(3)}
                    style={styles.toggleFlex}
                >
                    <LinearGradient
                        colors={
                            selectedType === 3
                                ? ["#ED7723", "#F59E0B"]
                                : ["#FFFFFF", "#FFFFFF"]
                        }
                        style={[
                            styles.toggleButton,
                            selectedType !== 3 &&
                            styles.inactiveButton,
                        ]}
                    >
                        <Text
                            style={[
                                styles.toggleText,
                                {
                                    color:
                                        selectedType === 3
                                            ? "#FFF"
                                            : "#666",
                                },
                            ]}
                        >
                            Past
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

            </View>

            {/* LOADER */}
            <FlatList
                data={eventList}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons
                            name="search"
                            size={70}
                            color="#CCC"
                        />

                        <Text style={styles.emptyText}>
                            No Events Found
                        </Text>
                    </View>
                }
            />

            <CustomeLoading isLoading={eventLoading} />
        </SafeAreaView>
    );
};

export default EventListScreens;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

    // ================= HEADER =================

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

    // ================= TOGGLE =================

    toggleContainer: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginTop: 18,
        marginBottom: 5,
        backgroundColor: "#FFF3E8",
        borderRadius: 16,
        padding: 5,
    },

    toggleButton: {
        paddingVertical: 12,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    inactiveButton: {
        borderWidth: 1,
        borderColor: "#F1F1F1",
    },

    toggleText: {
        fontSize: 14,
        fontFamily: "Poppins-SemiBold",
    },

    // ================= LIST =================

    listContainer: {
        padding: 16,
        paddingBottom: 100,
    },

    cardWrapper: {
        marginBottom: 18,
    },

    card: {
        flexDirection: "row",
        borderRadius: 22,
        padding: 14,
        elevation: 2,
        alignItems: "center",
    },

    toggleFlex: {
        flex: 1,
        marginHorizontal: 3,
    },

    // ================= IMAGE =================

    eventImage: {
        width: 110,
        height: 110,
        borderRadius: 18,
        backgroundColor: "#EEE",
    },

    // ================= CONTENT =================

    contentContainer: {
        flex: 1,
        marginLeft: 14,
    },

    title: {
        fontSize: 18,
        fontFamily: "Poppins-SemiBold",
        color: "#111",
    },

    eventType: {
        fontSize: 13,
        color: colors.primary,
        fontFamily: "Poppins-Medium",
        marginTop: 2,
        marginBottom: 12,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },

    infoText: {
        marginLeft: 8,
        fontSize: 13,
        color: "#555",
        flex: 1,
        fontFamily: "Poppins-Regular",
    },

    locationText: {
        marginLeft: 8,
        fontSize: 13,
        color: "#555",
        flex: 1,
        lineHeight: 18,
        fontFamily: "Poppins-Regular",
    },

    // ================= LOADER =================

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    // ================= EMPTY =================

    emptyContainer: {
        marginTop: 120,
        alignItems: "center",
    },

    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: "#777",
        fontFamily: "Poppins-Medium",
    },
});