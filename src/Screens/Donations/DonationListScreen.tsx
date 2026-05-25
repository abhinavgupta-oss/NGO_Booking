import React, { useEffect, useCallback } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utility/AppTheam";
import AppEnvironment from "../../utility/AppEnvironment";
import CommonHeader from "../../Component/Header/CommonHeader";
import CustomeLoading from "../../Component/Loading/CustomeLoading";
import { useDonationStore } from "../../Stores/useDonationStore";

interface EventItem {
    id: number;
    title: string;
    subTitle?: string;
    typeName?: string;
    defaultAmount?: number;
    bannerURL: string;
    startDate: string;
    endDate: string;
    startTimeHr: string;
    endTimeHr: string;
    venue: string;
    eventTypeName: string;
    statusName?: string;
}

const DonationListScreen = () => {
    const navigation: any = useNavigation();

    const {
        donationList,
        loading,
        fetchDonationList,
    } = useDonationStore();

    const fetchEventList = useCallback(async () => {
        try {
            const sevaDetails = {
                branchCode: AppEnvironment.BRANCH_CODE,
                statusId: 2,
            };

            const respList =
                await fetchDonationList(sevaDetails);

            console.log("respList", respList);
        } catch (error) {
            console.log(
                "Event List Error:",
                error,
            );
        }
    }, [fetchDonationList]);

    useEffect(() => {
        fetchEventList();
    }, [fetchEventList]);

    const renderItem = ({
        item,
    }: {
        item: EventItem;
    }) => {
        return (
            <View style={styles.cardWrapper}>
                <LinearGradient
                    colors={["#FFFFFF", "#FFF7ED"]}
                    style={styles.card}
                >
                    <Image
                        source={{
                            uri: item?.bannerURL,
                        }}
                        style={styles.eventImage}
                        resizeMode="cover"
                    />

                    <View
                        style={
                            styles.contentContainer
                        }
                    >
                        <Text
                            numberOfLines={1}
                            style={styles.title}
                        >
                            {item.title}
                        </Text>

                        <Text
                            style={{
                                ...styles.eventType,
                                color: colors.primary,
                            }}
                        >
                            {item.statusName}
                        </Text>

                        {item.endDate && (
                            <>
                                <Text
                                    style={
                                        styles.eventType
                                    }
                                >
                                    StartDate:{" "}
                                    {item.startDate}
                                </Text>

                                <Text
                                    style={
                                        styles.eventType
                                    }
                                >
                                    EndDate:{" "}
                                    {item.endDate}
                                </Text>
                            </>
                        )}

                        <TouchableOpacity
                            style={
                                styles.donateButton
                            }
                            onPress={() => {
                                navigation.navigate(
                                    "DonationDetails",
                                    {
                                        Details: item,
                                    },
                                );
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 15,
                                    fontWeight: "700",
                                }}
                            >
                                Donate Now
                            </Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor="#FFFFFF"
                barStyle="dark-content"
            />

            <CommonHeader title="Donations" />

            <FlatList
                data={donationList}
                keyExtractor={item =>
                    item.id.toString()
                }
                renderItem={renderItem}
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.listContainer
                }
                ListEmptyComponent={
                    <View
                        style={
                            styles.emptyContainer
                        }
                    >
                        <MaterialIcons
                            name="search"
                            size={70}
                            color="#CCC"
                        />

                        <Text
                            style={styles.emptyText}
                        >
                            No Events Found
                        </Text>
                    </View>
                }
            />

            <CustomeLoading
                isLoading={loading}
            />
        </SafeAreaView>
    );
};

export default DonationListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },

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

    eventImage: {
        width: 110,
        height: 110,
        borderRadius: 18,
        backgroundColor: "#EEE",
    },

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
        fontFamily: "Poppins-Medium",
    },

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

    donateButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
});