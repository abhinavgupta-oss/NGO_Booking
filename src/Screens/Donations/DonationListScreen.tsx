import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    StatusBar,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AppEnvironment from "../../utility/AppEnvironment";
import CommonHeader from "../../Component/Header/CommonHeader";
import CustomeLoading from "../../Component/Loading/CustomeLoading";
import { useDonationStore } from "../../Stores/useDonationStore";
import CustomButton from "../../Component/formComponent/CustomButton";
import { useTheme } from "../../utility/AppTheam/ThemeContext";
import { Images } from "../../utility/utility";

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
}

const DonationListScreen = () => {
    const { colors } = useTheme();
    const styles = createStyles(colors); 
    const navigation: any = useNavigation();
    const { donationList, loading, fetchDonationList } = useDonationStore();

    useEffect(() => {
        fetchEventList();
    }, [fetchDonationList]);

    const fetchEventList = async () => {
        try {
            const sevaDetails = { branchCode: AppEnvironment.BRANCH_CODE, statusId: 2 }

            const respList = await fetchDonationList(sevaDetails,false);
            console.log("respList", respList)
        } catch (error) {
            console.log("Event List Error:", error);
        }
    };

    const handelNavigation = (item: EventItem) => {
        return () => {
            navigation.navigate("DonationDetails", { Details: item })
        }
    };

    const renderItem = ({ item }: { item: EventItem }) => {
        return (
            <View
                style={styles.cardWrapper}
            >
                <LinearGradient
                    colors={[colors.Linearcard1, colors.Linearcard2]}
                    style={styles.card}
                >
                    {/* EVENT IMAGE */}

                    <Image
                        source={item?.bannerURL ?{ uri: item?.bannerURL }:Images.login}
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

                        <Text style={{ ...styles.eventType, color: colors.primary }}>
                            <Text style={{color:colors.text}}>{item.statusName}</Text>
                        </Text>
                        {item.endDate && (
                            <>
                                <Text style={styles.eventType}>
                                    StartDate: {item.startDate}
                                </Text>
                                <Text style={styles.eventType}>
                                    EndDate: {item.endDate}
                                </Text>
                            </>
                        )}
                        <CustomButton
                            title="Donate Now"
                            onPress={handelNavigation(item)}
                            buttonStyle={styles.donateButton}
                        />
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

            {/* HEADER */}
            <CommonHeader title="Donations" />

            {/* LOADER */}
            <FlatList
                data={donationList}
                keyExtractor={(item) => item.id.toString()}
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
            <CustomeLoading isLoading={loading} />
        </SafeAreaView>
    );
};

export default DonationListScreen;


const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
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

        // ================= IMAGE =================

        eventImage: {
            width: 110,
            height: 110,
            borderRadius: 18,
            backgroundColor: colors.card,
        },

        // ================= CONTENT =================

        contentContainer: {
            flex: 1,
            marginLeft: 14,
        },

        title: {
            fontSize: 18,
            fontFamily: "Poppins-SemiBold",
            color: colors.text,
        },

        eventType: {
            fontSize: 13,
            fontFamily: "Poppins-Medium",
            color:colors.subText
        },

        infoRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
        },

        infoText: {
            marginLeft: 8,
            fontSize: 13,
            color: colors.subText,
            flex: 1,
            fontFamily: "Poppins-Regular",
        },

        locationText: {
            marginLeft: 8,
            fontSize: 13,
            color: colors.subText,
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
            color: colors.subText,
            fontFamily: "Poppins-Medium",
        },

        donateButton: {
            // height: 46,
        },
    });
